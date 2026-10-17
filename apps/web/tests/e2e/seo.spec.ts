import { expect, test } from '@playwright/test';

test.describe('SEO dan kualitas', () => {
  test('halaman produk punya canonical dan OG image produk', async ({ page, request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const productUrl = sitemap.match(/<loc>[^<]*\/store\/[^<]+<\/loc>/)![0].replace(/<\/?loc>/g, '');
    await page.goto(new URL(productUrl).pathname);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', productUrl);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/products\/.+\.webp$/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
  });

  test('artikel berita memakai OG type article dan cover-nya', async ({ page, request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const article = sitemap.match(/<loc>[^<]*\/news\/[^<]+<\/loc>/)![0].replace(/<\/?loc>/g, '');
    await page.goto(new URL(article).pathname);

    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/_astro\/.+/);
  });

  test('sitemap.xml memuat halaman publik saja, tanpa /dev', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/xml/);
    const xml = await response.text();
    expect(xml).toContain('<loc>');
    expect(xml).toMatch(/<loc>[^<]*\/store\/[^<]+<\/loc>/);
    expect(xml).not.toContain('/dev');
  });

  test('robots.txt melarang /dev dan menunjuk sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const txt = await response.text();
    expect(txt).toContain('Disallow: /dev/');
    expect(txt).toContain('Sitemap: ');
  });

  test('halaman 404 bergaya brand dengan jalan kembali', async ({ page }) => {
    const response = await page.goto('/halaman-tidak-ada');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tersesat');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await page.getByRole('link', { name: 'Ke beranda' }).click();
    await expect(page).toHaveURL('/');
  });

  test('halaman uji aset tidak diindeks', async ({ page }) => {
    await page.goto('/dev/assets');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });
});
