import { expect, test } from '@playwright/test';

test.describe('kerangka landing', () => {
  test('section tampil berurutan sesuai sitemap', async ({ page }) => {
    await page.goto('/');
    const ids = await page.locator('main > section').evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual(['hero', 'identity', 'manifesto', 'roster', 'store', 'achievements', 'news', 'partners', 'join']);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Alter');
  });
});
