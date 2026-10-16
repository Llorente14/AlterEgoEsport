import { expect, test } from '@playwright/test';

test.describe('gerak dengan motion aktif', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('mobile: kelopak CSS di hero (maks 12) dan section muncul saat di-scroll', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'hanya mobile');
    await page.goto('/');

    const heroPetals = page.locator('#hero [data-sakura] svg');
    expect(await heroPetals.count()).toBeLessThanOrEqual(12);
    await expect(heroPetals.first()).toBeVisible();
    const animation = await heroPetals.first().evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe('sakura-drift');

    const roster = page.locator('#roster');
    await expect(roster).not.toHaveClass(/is-revealed/);
    await roster.scrollIntoViewIfNeeded();
    await expect(roster).toHaveClass(/is-revealed/);
    await expect.poll(() => roster.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  });

  test('lapisan ambient ada di semua halaman', async ({ page }) => {
    await page.goto('/store');
    await expect(page.locator('[data-ambient]')).toBeAttached();
    expect(await page.locator('[data-ambient] .ambient-tri').count()).toBe(40);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('tanpa kelopak, ambient, marquee, dan reveal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero [data-sakura]')).toBeHidden();
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
