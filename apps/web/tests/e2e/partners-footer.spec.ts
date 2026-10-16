import { expect, test } from '@playwright/test';

test.describe('Partners, Join, Footer', () => {
  test('menampilkan 6 partner', async ({ page, isMobile }) => {
    await page.goto('/');
    const section = page.locator('#partners');
    if (isMobile) {
      await expect(section.getByRole('list', { name: 'Partner' }).getByRole('listitem')).toHaveCount(6);
    } else {
      const marquee = section.locator('[data-partner-marquee]');
      await expect(marquee).toBeVisible();
      await expect(marquee.getByRole('img', { name: 'Interbat' })).toBeVisible();
      await expect(marquee.getByText('Good Day Coffee').first()).toBeVisible();
    }
  });

  test('Join berisi dua grup sosial media', async ({ page }) => {
    await page.goto('/');
    const join = page.locator('#join');
    await expect(join.getByRole('heading', { name: 'Alter Ego Esports' })).toBeVisible();
    await expect(join.getByRole('link', { name: /TikTok/ })).toHaveAttribute('href', 'https://www.tiktok.com/@alterego.esports');
    await expect(join.getByRole('link', { name: /@altermerch\.id/ })).toHaveAttribute(
      'href',
      'https://www.instagram.com/altermerch.id/',
    );
  });

  test('footer berisi toko per negara, WhatsApp, dan offline store', async ({ page }) => {
    await page.goto('/store');
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: 'Shopee Thailand' })).toHaveAttribute('href', 'https://shopee.co.th/alteregomerchfy.th');
    await expect(footer.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/6289652442519');
    await expect(footer.getByRole('link', { name: /Milestones Coffee/ })).toHaveAttribute('href', /google\.com\/maps/);
    for (const link of await footer.locator('a[target="_blank"]').all()) {
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
});
