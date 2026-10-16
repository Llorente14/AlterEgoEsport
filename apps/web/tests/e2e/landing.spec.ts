import { expect, test } from '@playwright/test';

test.describe('kerangka landing', () => {
  test('section tampil berurutan: hero, showreel, manifesto, roster', async ({ page }) => {
    await page.goto('/');
    const ids = await page.locator('main > section').evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual(['hero', 'showreel', 'manifesto', 'roster']);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Alter');
  });

  test('showreel baru memuat video saat mendekati layar', async ({ page }) => {
    await page.goto('/');
    const video = page.locator('[data-showreel]');
    await expect(video.locator('source')).toHaveCount(0);

    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentSrc)).toMatch(/showreel-(480|720)\./);
  });
});
