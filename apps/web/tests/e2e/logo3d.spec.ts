import { expect, test, type Page } from '@playwright/test';

// Runs in the `desktop-3d` project (WebGL on). Headless Chromium renders in software, so frames are slow:
// assertions poll instead of reading once, and the tests run one after another (three software renderers in
// parallel starve each other past the timeouts).
test.describe.configure({ mode: 'default' });

const story = '[data-story]';
const canvas = '[data-story-canvas] canvas';

/** Scroll so the pinned story is at `progress` (0–1) and wait until the stage has caught up. */
async function scrollTo(page: Page, progress: number) {
  const y = await page.evaluate((p) => {
    const section = document.querySelector<HTMLElement>('[data-story]')!;
    const pin = section.querySelector<HTMLElement>('[data-story-pin]')!;
    const top = section.getBoundingClientRect().top + window.scrollY;
    return top - 80 + p * (section.offsetHeight - pin.offsetHeight);
  }, progress);
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' }), y);
  await expect
    .poll(async () => Number(await page.locator(story).getAttribute('data-progress')))
    .toBeCloseTo(progress, 2);
  await expect(page.locator(story)).toHaveAttribute('data-settled', 'true');
}

const yaw = async (page: Page) => Number(await page.locator(canvas).getAttribute('data-yaw'));

/** Put the pointer at a horizontal fraction of the viewport, vertically centred. */
async function pointAt(page: Page, fx: number) {
  const { width, height } = page.viewportSize()!;
  await page.mouse.move(Math.round(width * fx), Math.round(height / 2), { steps: 4 });
}

test.describe('logo 3D (desktop)', () => {
  test('kanvas tampil, data-logo3d="ready", badge 2D menyingkir', async ({ page }) => {
    await page.goto('/');
    await scrollTo(page, 0.1);
    await expect(page.locator(story)).toHaveAttribute('data-logo3d', 'ready', { timeout: 20_000 });
    await expect(page.locator(canvas)).toHaveCount(1);
    await expect(page.locator(canvas)).toBeVisible();
    await expect(page.locator('[data-story-logo]')).toBeHidden();
    const size = await page.locator(canvas).boundingBox();
    expect(size!.width).toBeGreaterThan(0);
    expect(size!.height).toBeGreaterThan(0);
  });

  test('kursor mengubah arah pandang logo (data-yaw)', async ({ page }) => {
    await page.goto('/');
    await scrollTo(page, 0.1);
    await expect(page.locator(story)).toHaveAttribute('data-logo3d', 'ready', { timeout: 20_000 });

    await pointAt(page, 0.95);
    await expect.poll(() => yaw(page), { timeout: 10_000 }).toBeGreaterThan(10);
    await pointAt(page, 0.05);
    await expect.poll(() => yaw(page), { timeout: 10_000 }).toBeLessThan(-10);
  });

  test('ikut-kursor memudar saat flip', async ({ page }) => {
    await page.goto('/');
    await scrollTo(page, 0.1);
    await expect(page.locator(story)).toHaveAttribute('data-logo3d', 'ready', { timeout: 20_000 });
    await pointAt(page, 0.95);
    await expect.poll(() => yaw(page), { timeout: 10_000 }).toBeGreaterThan(10);

    // Middle of the A → B turntable and of the B → C somersault: the look is faded out.
    for (const mid of [0.3, 0.67]) {
      await scrollTo(page, mid);
      await pointAt(page, 0.95);
      await expect.poll(async () => Math.abs(await yaw(page)), { timeout: 10_000 }).toBeLessThan(1);
    }

    // At rest in scene B the logo looks at the cursor again.
    await scrollTo(page, 0.48);
    await pointAt(page, 0.95);
    await expect.poll(() => yaw(page), { timeout: 10_000 }).toBeGreaterThan(10);
  });

  test('model gagal dimuat: tetap logo 2D, tanpa kanvas', async ({ page }) => {
    await page.route('**/*.glb', (route) => route.abort());
    await page.goto('/');
    await scrollTo(page, 0.1);
    await expect(page.locator(story)).toHaveAttribute('data-logo3d', 'fallback', { timeout: 20_000 });
    await expect(page.locator(canvas)).toHaveCount(0);
    await expect(page.locator('[data-story-logo]')).toBeVisible();
  });
});

test('mobile tidak mengunduh three.js maupun model', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 915 });
  const heavy: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (/\.glb(\?|$)/.test(url) || /\/logo3d\.[^/]*\.js/.test(url)) heavy.push(url);
  });
  await page.goto('/');
  await page.locator(story).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 2000);
  await page.waitForLoadState('networkidle');
  expect(heavy).toEqual([]);
  await expect(page.locator(story)).not.toHaveAttribute('data-logo3d', /.*/);
});
