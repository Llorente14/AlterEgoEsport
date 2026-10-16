import { expect, test } from '@playwright/test';

test('section Achievements menampilkan angka dan maksimal 6 pencapaian terbaru', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#achievements');

  const stats = section.locator('dl > div');
  await expect(stats).toHaveCount(4);
  await expect(stats.filter({ hasText: 'Total hadiah' }).locator('dd')).toHaveText(/^\$\d/);
  await expect(stats.filter({ hasText: 'Gelar juara' }).locator('dd')).toHaveText(/^\d+$/);

  const items = section.getByRole('list', { name: 'Pencapaian terbaru' }).getByRole('listitem');
  await expect(items).toHaveCount(6);
  await expect(items.first()).toContainText('PUBG Mobile Pro Laga');
});
