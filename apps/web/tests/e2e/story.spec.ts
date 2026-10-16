import { expect, test, type Page } from '@playwright/test';

const NAV = 80;

const DESKTOP_SIZES = [
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3440, height: 1440 },
];

/** Scroll so the pinned story is at `progress` (0–1) and wait until the page reports it. */
async function scrollTo(page: Page, progress: number) {
  const y = await page.evaluate((p) => {
    const section = document.querySelector<HTMLElement>('[data-story]')!;
    const pin = section.querySelector<HTMLElement>('[data-story-pin]')!;
    const top = section.getBoundingClientRect().top + window.scrollY;
    return top - 80 + p * (section.offsetHeight - pin.offsetHeight);
  }, progress);
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' }), y);
  await expect
    .poll(async () => Number(await page.locator('[data-story]').getAttribute('data-progress')))
    .toBeCloseTo(progress, 2);
}

async function box(page: Page, selector: string) {
  const b = await page.locator(selector).first().boundingBox();
  if (!b) throw new Error(`${selector} has no box`);
  return b;
}

const centerX = (b: { x: number; width: number }) => b.x + b.width / 2;
const centerY = (b: { y: number; height: number }) => b.y + b.height / 2;
const overlaps = (a: { x: number; width: number }, b: { x: number; width: number }) =>
  a.x < b.x + b.width && b.x < a.x + a.width;

test.describe('story (desktop, pinned)', () => {
  test.skip(({ isMobile }) => isMobile, 'ukuran layar diatur per tes');

  for (const size of DESKTOP_SIZES) {
    test(`tiga scene, logo pindah kanan → kiri → tengah di belakang kartu — ${size.width}×${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto('/');
      const { width, height } = size;
      const logo = '[data-story-logo]';

      // Scene A: headline left, logo right.
      await scrollTo(page, 0.1);
      const aLogo = await box(page, logo);
      const aHeadline = await box(page, '[data-story-headline] h2');
      expect(centerX(aLogo)).toBeGreaterThan(width / 2);
      expect(Math.abs(centerX(aLogo) - width * 0.75)).toBeLessThanOrEqual(2);
      expect(overlaps(aHeadline, aLogo)).toBe(false);
      expect(aLogo.y).toBeGreaterThanOrEqual(NAV);
      expect(aLogo.y + aLogo.height).toBeLessThanOrEqual(height);
      await expect(page.locator('[data-story-headline]')).toHaveCSS('opacity', '1');

      // Scene B: logo left, description right.
      await scrollTo(page, 0.48);
      const bLogo = await box(page, logo);
      const bText = await box(page, '[data-story-description] .story-text');
      expect(Math.abs(centerX(bLogo) - width * 0.25)).toBeLessThanOrEqual(2);
      expect(overlaps(bText, bLogo)).toBe(false);
      expect(bText.x).toBeGreaterThan(width / 2);
      expect(bLogo.y).toBeGreaterThanOrEqual(NAV);
      expect(bLogo.y + bLogo.height).toBeLessThanOrEqual(height);
      await expect(page.locator('[data-story-description]')).toHaveCSS('opacity', '1');
      await expect(page.locator('[data-story-headline]')).toHaveCSS('opacity', '0');

      // Scene C: FOUNDER title, five staggered cards, logo centred behind them.
      await scrollTo(page, 0.97);
      const cLogo = await box(page, logo);
      expect(Math.abs(centerX(cLogo) - width / 2)).toBeLessThanOrEqual(2);
      expect(cLogo.y).toBeGreaterThanOrEqual(NAV);
      expect(cLogo.y + cLogo.height).toBeLessThanOrEqual(height);
      await expect(page.locator('.story-founder-title')).toHaveCSS('opacity', '1');

      const cards = page.locator('[data-founder-card]');
      await expect(cards).toHaveCount(5);
      const boxes = await cards.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()));
      for (const b of boxes) {
        expect(b.x).toBeGreaterThanOrEqual(0);
        expect(b.x + b.width).toBeLessThanOrEqual(width);
        expect(b.y).toBeGreaterThanOrEqual(NAV);
        expect(b.y + b.height).toBeLessThanOrEqual(height + 1);
      }
      const ys = boxes.map((b) => b.y);
      expect(ys[2]).toBe(Math.max(...ys)); // centre card sits lowest
      expect(ys[4]).toBe(Math.min(...ys)); // last card sits highest
      expect(new Set(ys.map((y) => Math.round(y))).size).toBe(5); // all five at different heights

      // The logo is behind the cards: the card (not the logo) is what you hit at the logo's centre.
      const hit = await page.evaluate(
        ([x, y]) => {
          const el = document.elementFromPoint(x!, y!);
          return {
            insideCard: Boolean(el?.closest('[data-founder-card]')),
            isLogo: el?.hasAttribute('data-story-logo') ?? false,
          };
        },
        [centerX(cLogo), centerY(cLogo)],
      );
      expect(hit).toEqual({ insideCard: true, isLogo: false });

      // Nothing the story does may widen the page.
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    });
  }

  test('teks hanya satu scene pada satu waktu', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    for (const p of [0.05, 0.3, 0.48, 0.66, 0.9]) {
      await scrollTo(page, p);
      const opacities = await page.evaluate(() =>
        ['[data-story-headline]', '[data-story-description]', '.story-founder-title'].map(
          (s) => Number(getComputedStyle(document.querySelector(s)!).opacity),
        ),
      );
      expect(opacities.filter((o) => o > 0.15).length, `progress ${p}`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('story (mobile)', () => {
  test.skip(({ isMobile }) => !isMobile, 'hanya mobile');

  test('kartu founder menumpuk dan bisa di-swipe, tanpa overflow', async ({ page }) => {
    await page.goto('/');
    const stack = page.locator('[data-founder-cards]');
    await stack.scrollIntoViewIfNeeded();
    await expect(page.locator('[data-founder-card]')).toHaveCount(5);
    await expect(page.locator('[data-founder-count]')).toHaveText('1 / 5');

    const vw = page.viewportSize()!.width;
    const top = (await page.locator('[data-founder-card]').first().boundingBox())!;
    expect(top.x).toBeGreaterThanOrEqual(0);
    expect(top.x + top.width).toBeLessThanOrEqual(vw);

    // Swipe the top card left: it goes to the back and the next one is on top.
    const y = top.y + top.height / 2;
    await page.mouse.move(top.x + top.width * 0.7, y);
    await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(top.x + top.width * 0.7 - i * 30, y);
    await page.mouse.up();
    await expect(page.locator('[data-founder-count]')).toHaveText('2 / 5');
    await expect(page.locator('[data-founder-card]').first()).toHaveCSS('--pos', '4');

    // Keyboard: arrow keys move through the stack.
    await stack.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-founder-count]')).toHaveText('3 / 5');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('[data-founder-count]')).toHaveText('2 / 5');

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(vw);
  });

  test('logo ada di belakang tumpukan dan tiga scene tampil berurutan', async ({ page }) => {
    await page.goto('/');
    const ys = await page.evaluate(() =>
      ['[data-story-headline]', '[data-story-description]', '[data-story-founder]'].map(
        (s) => document.querySelector(s)!.getBoundingClientRect().top + scrollY,
      ),
    );
    expect(ys[0]!).toBeLessThan(ys[1]!);
    expect(ys[1]!).toBeLessThan(ys[2]!);

    const z = await page.evaluate(() => {
      const logo = document.querySelector('.story-c-logo')!;
      const stack = document.querySelector('[data-founder-viewport]')!;
      return [Number(getComputedStyle(logo).zIndex), Number(getComputedStyle(stack).zIndex)];
    });
    expect(z[0]!).toBeLessThan(z[1]!);
  });
});

test.describe('story (tanpa pin)', () => {
  test('reduced motion di desktop: tiga blok statis, kartu terlihat', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('/');
    const section = page.locator('[data-story]');
    await expect(section).not.toHaveAttribute('data-scene', /.+/);
    expect(await section.evaluate((el) => (el as HTMLElement).offsetHeight)).toBeLessThan(900 * 4);

    await page.locator('[data-founder-cards]').scrollIntoViewIfNeeded();
    const cards = page.locator('[data-founder-card]');
    await expect(cards).toHaveCount(5);
    for (const card of await cards.all()) await expect(card).toBeVisible();
    await context.close();
  });

  test('tanpa JavaScript: headline, deskripsi, dan lima kartu tetap terbaca', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Banyak\s*Wajah\s*Satu\s*Nama/ })).toBeVisible();
    await expect(page.getByText('Tiga topeng, satu identitas.')).toBeVisible();
    const ys = await page
      .locator('[data-founder-card]')
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
    expect(ys).toHaveLength(5);
    expect([...ys].sort((a, b) => a - b)).toEqual(ys); // a vertical list, in order
    await context.close();
  });
});
