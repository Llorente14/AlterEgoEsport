import { expect, test } from '@playwright/test';

test.describe('nav', () => {
  test('nav mendapat latar setelah scroll', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('[data-site-header]');
    await expect(header).not.toHaveAttribute('data-scrolled');
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute('data-scrolled', '');
  });
});

test.describe('menu mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'hanya di viewport mobile');

  test('buka, tutup dengan Esc, fokus kembali ke tombol', async ({ page }) => {
    await page.goto('/');
    const open = page.getByRole('button', { name: 'Buka menu' });
    const menu = page.getByRole('dialog', { name: 'Menu' });

    await expect(menu).toBeHidden();
    await open.click();
    await expect(menu).toBeVisible();
    await expect(open).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('button', { name: 'Tutup menu' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(open).toBeFocused();
  });

  test('menu menutup penuh layar walau nav sudah di-scroll', async ({ page }) => {
    await page.goto('/');
    await page.mouse.wheel(0, 600);
    await page.getByRole('button', { name: 'Buka menu' }).click();
    const box = await page.getByRole('dialog', { name: 'Menu' }).boundingBox();
    const viewport = page.viewportSize()!;
    expect(box!.height).toBeGreaterThanOrEqual(viewport.height - 1);
  });
});
