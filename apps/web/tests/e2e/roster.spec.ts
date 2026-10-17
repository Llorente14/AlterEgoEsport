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

  test('foto pemain tampil bila ada, placeholder bila kosong', async ({ page }) => {
    await page.goto('/#roster-mlbb-mdl');
    const panel = page.locator('#roster-mlbb-mdl');
    const gebe = panel.locator('article').filter({ hasText: 'GEBE' });
    await expect(gebe.getByRole('img', { name: 'Foto GEBE' })).toHaveAttribute('src', /^https:\/\/.+\.png$/);
    const radoo = panel.locator('article').filter({ hasText: 'RADOO' });
    await expect(radoo.locator('img[alt^="Foto"]')).toHaveCount(0);
    await expect(radoo.locator('[data-placeholder]')).toBeVisible();
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
