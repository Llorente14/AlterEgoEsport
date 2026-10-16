import { expect, test } from '@playwright/test';

test.describe('Store', () => {
  test('menampilkan 85 produk dengan tombol Beli Sekarang ke Shopee', async ({ page }) => {
    await page.goto('/store');
    const cards = page.locator('[data-product-card]');
    await expect(cards).toHaveCount(85);

    const buy = cards.first().getByRole('link', { name: /^Beli Sekarang:/ });
    await expect(buy).toHaveAttribute('href', 'https://shopee.co.id/alterego_merch');
    await expect(buy).toHaveAttribute('target', '_blank');
    await expect(buy).toHaveAttribute('rel', /noopener/);
    await expect(cards.first().getByRole('link', { name: /^Beli di Tokopedia:/ })).toHaveAttribute(
      'href',
      'https://www.tokopedia.com/alteregomerch',
    );
  });

  test('filter kategori mengubah grid dan URL tanpa JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/store');

    const nav = page.getByRole('navigation', { name: 'Kategori produk' });
    await nav.getByRole('link', { name: /^Jersey/ }).click();

    await expect(page).toHaveURL(/\/store\/kategori\/jersey$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jersey');
    await expect(nav.getByRole('link', { name: /^Jersey/ })).toHaveAttribute('aria-current', 'page');

    const count = await page.locator('[data-product-card]').count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(85);
    await expect(page.locator('[data-product-count]')).toHaveText(`${count} produk`);
    for (const name of await page.locator('[data-product-link]').allTextContents()) {
      expect(name.toLowerCase()).toContain('jersey');
    }
    await context.close();
  });

  test('daftar Shopee per negara dan WhatsApp bisa dibuka', async ({ page }) => {
    await page.goto('/store');
    const details = page.locator('[data-marketplace-links]');
    await details.getByText('Belanja dari luar Indonesia?').click();
    await expect(details.getByRole('link', { name: /Shopee Malaysia/ })).toHaveAttribute(
      'href',
      'https://shopee.com.my/alteregomerch7q.my',
    );
    await expect(details.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/6289652442519');
  });
});
