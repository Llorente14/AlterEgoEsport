import { expect, test } from '@playwright/test';

test.describe('section Roster', () => {
  test('menampilkan roster MLBB lebih dulu dan berpindah game dengan keyboard', async ({ page }) => {
    await page.goto('/');
    const roster = page.locator('#roster');
    const tabs = roster.getByRole('tab');

    await expect(tabs).toHaveText(['Mobile Legends MPL', 'Mobile Legends MDL', 'Counter-Strike 2', 'PUBG Mobile']);
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await expect(roster.getByRole('tabpanel', { name: 'Mobile Legends MPL', exact: true })).toBeVisible();
    await expect(roster.getByRole('heading', { name: 'NINO' })).toBeVisible();

    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(roster.getByRole('tabpanel', { name: 'Mobile Legends MDL', exact: true })).toBeVisible();
    await expect(roster.getByRole('tabpanel', { name: 'Mobile Legends MPL', exact: true })).toBeHidden();
    await expect(roster.getByRole('heading', { name: 'GEBE' })).toBeVisible();
    await expect(page).toHaveURL(/#roster-mlbb-mdl$/);

    await page.keyboard.press('ArrowRight');
    await expect(roster.getByRole('tabpanel', { name: 'Counter-Strike 2' })).toBeVisible();
    await expect(page).toHaveURL(/#roster-cs2$/);

    await page.keyboard.press('End');
    await expect(roster.getByRole('tabpanel', { name: 'PUBG Mobile' })).toContainText('Alter Ego Ares');
  });

  test('foto pemain disajikan dari situs sendiri, placeholder bila kosong', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      if (/^image$/.test(request.resourceType()) && !request.url().startsWith('http://localhost')) {
        external.push(request.url());
      }
    });
    await page.goto('/#roster-mlbb-mdl');
    const panel = page.locator('#roster-mlbb-mdl');
    const gebe = panel.locator('article').filter({ hasText: 'GEBE' });
    const photo = gebe.getByRole('img', { name: 'Foto GEBE' });
    await expect(photo).toHaveAttribute('src', '/roster/mlbb/gebe-800.webp');
    await expect(photo).toHaveAttribute('srcset', /gebe-400\.webp 400w, .*gebe-800\.webp \d+w/);
    await expect
      .poll(() => photo.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
      .toBe(true);
    // Photos keep their colours: no grayscale filter, not even at rest.
    await expect(photo).toHaveCSS('filter', 'none');

    const radoo = panel.locator('article').filter({ hasText: 'RADOO' });
    await expect(radoo.locator('img[alt^="Foto"]')).toHaveCount(0);
    await expect(radoo.locator('[data-placeholder]')).toBeVisible();
    expect(external).toEqual([]);
  });

  test('membuka tab dari hash URL', async ({ page }) => {
    await page.goto('/#roster-pubgm');
    await expect(page.locator('#roster').getByRole('tab', { name: 'PUBG Mobile' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('tanpa JavaScript semua game tetap terbaca', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    const roster = page.locator('#roster');
    await expect(roster.getByRole('tablist')).toBeHidden();
    for (const game of ['Mobile Legends MPL', 'Mobile Legends MDL', 'Counter-Strike 2', 'PUBG Mobile']) {
      await expect(roster.getByRole('heading', { name: game })).toBeVisible();
    }
    await context.close();
  });
});
