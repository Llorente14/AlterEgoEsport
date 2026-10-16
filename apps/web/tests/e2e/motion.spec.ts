import { expect, test } from '@playwright/test';

test.describe('gerak dengan motion aktif', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('section muncul saat di-scroll', async ({ page }) => {
    await page.goto('/');
    const roster = page.locator('#roster');
    await expect(roster).not.toHaveClass(/is-revealed/);
    await roster.scrollIntoViewIfNeeded();
    await expect(roster).toHaveClass(/is-revealed/);
    await expect.poll(() => roster.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  });

  test('lapisan ambient tipis ada di semua halaman, tertutup di hero', async ({ page }) => {
    await page.goto('/store');
    const ambient = page.locator('[data-ambient]');
    await expect(ambient).toBeAttached();
    expect(await ambient.locator('.ambient-tri').count()).toBe(40);
    expect(await ambient.evaluate((el) => getComputedStyle(el).opacity)).toBe('0.35');

    await page.goto('/');
    expect(await page.locator('#hero').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(0, 0, 0)');
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('tanpa ambient, marquee, dan reveal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-ambient]')).toBeHidden();

    const roster = page.locator('#roster');
    expect(await roster.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');

    const track = page.locator('.partner-track');
    if (await track.count()) {
      expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
    }
  });

  test('tanpa JavaScript konten tetap terlihat', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto('/');
    expect(await page.locator('#roster').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
    await context.close();
  });
});
