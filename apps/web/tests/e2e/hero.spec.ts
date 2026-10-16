import { expect, test } from '@playwright/test';

const isModel = (url: string) => url.includes('/models/alterego-logo.glb');
const isThree = (url: string) => /three|scene/i.test(url.split('/').pop() ?? '') && url.endsWith('.js');

test.describe('hero 3D', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('desktop memuat logo 3D dan memasang kanvas', async ({ page, isMobile }) => {
    test.skip(isMobile, 'hanya desktop');
    const model = page.waitForRequest((r) => isModel(r.url()));
    await page.goto('/');
    await model;

    const hero = page.locator('#hero');
    await expect(hero).toHaveAttribute('data-hero-state', /ready|fallback/, { timeout: 20_000 });
    if ((await hero.getAttribute('data-hero-state')) === 'ready') {
      await expect(hero.locator('[data-hero-canvas] canvas')).toHaveCount(1);
    }
  });

  test('mobile tidak mengunduh three.js maupun model 3D', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'hanya mobile');
    const requests: string[] = [];
    page.on('request', (r) => requests.push(r.url()));
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(requests.filter(isModel)).toEqual([]);
    expect(requests.filter(isThree)).toEqual([]);
    await expect(page.locator('#hero')).toHaveAttribute('data-hero-state', 'static');
    await expect(page.locator('[data-hero-canvas] canvas')).toHaveCount(0);
  });

  test('reduced motion di desktop tetap memakai logo 2D', async ({ browser, isMobile }) => {
    test.skip(isMobile, 'hanya desktop');
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const requests: string[] = [];
    page.on('request', (r) => requests.push(r.url()));
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(requests.filter(isModel)).toEqual([]);
    await expect(page.locator('#hero')).toHaveAttribute('data-hero-state', 'static');
    await expect(page.getByRole('img', { name: 'Logo Alter Ego' })).toBeVisible();
    await context.close();
  });
});
