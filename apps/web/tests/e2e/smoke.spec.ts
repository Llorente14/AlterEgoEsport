import { expect, test } from '@playwright/test';

test('beranda tampil dengan identitas brand', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Alter Ego/);
  await expect(page.getByRole('navigation', { name: 'Navigasi utama' })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();

  const pageBg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  expect(pageBg).toBe('rgb(0, 0, 0)');

  const headingFont = await page
    .getByRole('heading', { level: 1 })
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(headingFont).toContain('Anton');

  const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(bodyFont).toContain('Chakra Petch');
});
