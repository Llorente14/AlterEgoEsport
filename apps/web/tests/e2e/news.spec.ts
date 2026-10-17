import { expect, test } from '@playwright/test';

test.describe('Berita', () => {
  test('landing menampilkan 3 berita terbaru dan membuka artikel', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#news');
    const cards = section.locator('[data-news-card]');
    await expect(cards).toHaveCount(3);
    await expect(cards.first()).toContainText('ESL Challenger League Season 52');

    await cards.first().getByRole('link').click();
    await expect(page).toHaveURL(/\/news\/alter-ego-runner-up-esl-challenger-league-s52$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Runner-up ESL');
    await expect(page.getByRole('heading', { name: 'Berita lainnya' })).toBeVisible();
  });

  test('halaman berita tanpa JavaScript, filter hanya Semua selama satu kategori', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/news');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Berita');
    await expect(page.locator('[data-news-card]')).toHaveCount(6);

    // Only one category has articles, so the filter shows just "Semua".
    const chips = page.getByRole('navigation', { name: 'Kategori berita' }).getByRole('link');
    await expect(chips).toHaveCount(1);
    await expect(chips.first()).toContainText('Semua');
    await context.close();
  });

  test('gambar cover dioptimasi', async ({ page }) => {
    await page.goto('/news');
    const src = await page.locator('[data-news-card] img').first().getAttribute('src');
    expect(src).toMatch(/\.webp/);
  });
});
