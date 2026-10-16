import { expect, test } from '@playwright/test';

test.describe('Berita', () => {
  test('landing menampilkan 3 berita terbaru dan membuka artikel', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#news');
    const cards = section.locator('[data-news-card]');
    await expect(cards).toHaveCount(3);
    await expect(cards.first()).toContainText('PUBG Mobile Pro Laga');

    await cards.first().getByRole('link').click();
    await expect(page).toHaveURL(/\/news\/alter-ego-ares-juara-pmpl-indonesia-2026-fall$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Alter Ego Ares Juara');
    await expect(page.getByText('Final MVP', { exact: false }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Berita lainnya' })).toBeVisible();
  });

  test('halaman berita dengan filter kategori tanpa JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/news');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Berita');
    await expect(page.locator('[data-news-card]')).toHaveCount(3);

    await page.getByRole('navigation', { name: 'Kategori berita' }).getByRole('link', { name: /^Result/ }).click();
    await expect(page).toHaveURL(/\/news\/kategori\/result$/);
    await expect(page.locator('[data-news-card]')).toHaveCount(3);
    await context.close();
  });

  test('gambar cover dioptimasi', async ({ page }) => {
    await page.goto('/news');
    const src = await page.locator('[data-news-card] img').first().getAttribute('src');
    expect(src).toMatch(/\.webp/);
  });
});
