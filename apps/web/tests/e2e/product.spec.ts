import { expect, test } from '@playwright/test';

const SLUG = 'alter-ego-esports-homura-26-27-official-jersey-home';

test.describe('halaman produk', () => {
  test('dibuka dari Store dan menampilkan harga serta tombol beli', async ({ page, isMobile }) => {
    await page.goto('/store');
    await page.locator('[data-product-link]').first().click();

    await expect(page).toHaveURL(new RegExp(`/store/${SLUG}$`));
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Homura 26/27');
    await expect(page.locator('[data-product-price]')).toHaveText(/Rp\s?585\.000/);

    const buy = isMobile
      ? page.locator('[data-buy-bar]').getByRole('link', { name: /^Beli Sekarang:/ })
      : page.locator('#beli').getByRole('link', { name: /^Beli Sekarang:/ });
    await expect(buy).toBeVisible();
    await expect(buy).toHaveAttribute('href', 'https://shopee.co.id/alterego_merch');
  });

  test('galeri berpindah foto lewat thumbnail', async ({ page }) => {
    await page.goto(`/store/${SLUG}`);
    const thumbs = page.getByRole('button', { name: /^Lihat foto/ });
    expect(await thumbs.count()).toBeGreaterThan(1);

    await thumbs.nth(1).click();
    await expect(thumbs.nth(1)).toHaveAttribute('aria-current', 'true');
    await expect(thumbs.first()).toHaveAttribute('aria-current', 'false');
    const track = page.locator('[data-gallery-track]');
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });

  test('deskripsi tampil sebagai accordion dengan size chart', async ({ page }) => {
    await page.goto(`/store/${SLUG}`);
    const sections = page.locator('details:has(summary)').filter({ hasText: /Deskripsi|Detail|Size Chart/ });
    await expect(page.getByText('Deskripsi', { exact: true })).toBeVisible();
    await page.getByText('Size Chart', { exact: true }).click();
    await expect(page.getByText('XS / 48 / 56')).toBeVisible();
    expect(await sections.count()).toBeGreaterThan(1);
  });

  test('bar beli menempel di bawah layar mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'hanya mobile');
    await page.goto(`/store/${SLUG}`);
    const bar = page.locator('[data-buy-bar]');
    await page.mouse.wheel(0, 2000);
    const box = await bar.boundingBox();
    expect(box!.y + box!.height).toBeCloseTo(page.viewportSize()!.height, 0);
  });
});
