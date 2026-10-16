import { expect, test } from '@playwright/test';

test.describe('hero', () => {
  test('video latar 30% di belakang judul, tanpa partikel atau WebGL', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (r) => requests.push(r.url()));
    await page.goto('/');

    const hero = page.locator('#hero');
    const video = hero.locator('[data-hero-video]');
    await expect(video).toHaveAttribute('muted', '');
    await expect(video).toHaveAttribute('aria-hidden', 'true');
    expect(await video.evaluate((el) => getComputedStyle(el).opacity)).toBe('0.3');
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentSrc)).toMatch(/showreel-(480|720)\./);

    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(hero.locator('canvas, [data-sakura]')).toHaveCount(0);
    expect(requests.filter((u) => u.includes('.glb'))).toEqual([]);
  });

  test('mobile memakai video 480p', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'hanya mobile');
    await page.goto('/');
    await expect
      .poll(() => page.locator('[data-hero-video]').evaluate((el: HTMLVideoElement) => el.currentSrc))
      .toMatch(/showreel-480\.mp4$/);
  });

  test('reduced motion menahan video di poster', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const paused = await page.locator('[data-hero-video]').evaluate((el: HTMLVideoElement) => el.paused);
    expect(paused).toBe(true);
    await context.close();
  });
});
