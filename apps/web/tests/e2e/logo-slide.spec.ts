import { expect, test, type Page } from '@playwright/test';

const NAV = 80;

/** Scroll so the pinned section is at `progress` (0–1) and wait for the logo to follow. */
async function scrollTo(page: Page, progress: number) {
  const y = await page.evaluate((p) => {
    const section = document.querySelector<HTMLElement>('[data-logo-slide]')!;
    const pin = section.querySelector<HTMLElement>('[data-logo-slide-pin]')!;
    const top = section.getBoundingClientRect().top + window.scrollY;
    return top - 80 + p * (section.offsetHeight - pin.offsetHeight);
  }, progress);
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' }), y);
  await expect
    .poll(async () => Number(await page.locator('[data-logo-slide]').getAttribute('data-progress')))
    .toBeCloseTo(progress, 2);
}

async function logoBox(page: Page) {
  const box = await page.locator('[data-logo-slide-logo]').boundingBox();
  if (!box) throw new Error('logo has no box');
  return box;
}

const DESKTOP_SIZES = [
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3440, height: 1440 },
];

test.describe('logo slide', () => {
  test.skip(({ isMobile }) => isMobile, 'ukuran layar diatur per tes');

  for (const size of DESKTOP_SIZES) {
    test(`logo masuk dari kanan, pas di tengah, keluar ke kiri — ${size.width}×${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto('/');

      await scrollTo(page, 0);
      expect((await logoBox(page)).x).toBeGreaterThanOrEqual(size.width);

      await scrollTo(page, 0.5);
      const mid = await logoBox(page);
      const visibleCenterY = NAV + (size.height - NAV) / 2;
      expect(Math.abs(mid.x + mid.width / 2 - size.width / 2)).toBeLessThanOrEqual(2);
      expect(Math.abs(mid.y + mid.height / 2 - visibleCenterY)).toBeLessThanOrEqual(2);
      expect(mid.y).toBeGreaterThanOrEqual(NAV);
      expect(mid.y + mid.height).toBeLessThanOrEqual(size.height);
      expect(mid.width).toBeLessThan(size.width * 0.5);

      await scrollTo(page, 1);
      const end = await logoBox(page);
      expect(end.x + end.width).toBeLessThanOrEqual(0);

      // The off-screen logo must never widen the page.
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(size.width);
    });
  }
});

test('logo slide pas di layar mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await scrollTo(page, 0.5);
  const mid = await logoBox(page);
  expect(Math.abs(mid.x + mid.width / 2 - 195)).toBeLessThanOrEqual(2);
  expect(mid.x).toBeGreaterThanOrEqual(0);
  expect(mid.x + mid.width).toBeLessThanOrEqual(390);
});

test('reduced motion: logo statis di tengah, tanpa pin', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('/');
  const section = page.locator('[data-logo-slide]');
  await section.scrollIntoViewIfNeeded();
  expect(await section.evaluate((el) => el.offsetHeight)).toBeLessThan(900);
  const box = await page.locator('[data-logo-slide-logo]').boundingBox();
  expect(Math.abs(box!.x + box!.width / 2 - 720)).toBeLessThanOrEqual(2);
  await context.close();
});
