import { expect, test } from '@playwright/test';

test('section Alter Merch menampilkan 8 produk unggulan dan link ke Store', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#store');
  await expect(section.locator('[data-product-card]')).toHaveCount(8);

  await section.getByRole('link', { name: /Lihat semua 85 produk/ }).click();
  await expect(page).toHaveURL(/\/store$/);
});
