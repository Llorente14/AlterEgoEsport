import { expect, test } from '@playwright/test';

test.describe('section Roster', () => {
  test('menampilkan roster MLBB lebih dulu dan berpindah game dengan keyboard', async ({ page }) => {
    await page.goto('/');
    const roster = page.locator('#roster');
    const tabs = roster.getByRole('tab');

    await expect(tabs).toHaveText(['Mobile Legends', 'Counter-Strike 2', 'PUBG Mobile']);
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await expect(roster.getByRole('tabpanel', { name: 'Mobile Legends' })).toBeVisible();
    await expect(roster.getByRole('heading', { name: 'NINO' })).toBeVisible();

    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(roster.getByRole('tabpanel', { name: 'Counter-Strike 2' })).toBeVisible();
    await expect(roster.getByRole('tabpanel', { name: 'Mobile Legends' })).toBeHidden();
    await expect(page).toHaveURL(/#roster-cs2$/);

    await page.keyboard.press('End');
    await expect(roster.getByRole('tabpanel', { name: 'PUBG Mobile' })).toContainText('Alter Ego Ares');
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
    for (const game of ['Mobile Legends', 'Counter-Strike 2', 'PUBG Mobile']) {
      await expect(roster.getByRole('heading', { name: game })).toBeVisible();
    }
    await context.close();
  });
});
