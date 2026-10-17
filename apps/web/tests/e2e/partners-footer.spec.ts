import { expect, test } from '@playwright/test';

test.describe('Partners, Join, Footer', () => {
  test('menampilkan 7 partner', async ({ page, isMobile }) => {
    await page.goto('/');
    const section = page.locator('#partners');
    if (isMobile) {
      await expect(section.getByRole('list', { name: 'Partner' }).getByRole('listitem')).toHaveCount(7);
    } else {
      const marquee = section.locator('[data-partner-marquee]');
      await expect(marquee).toBeVisible();
      await expect(marquee.getByRole('img', { name: 'Interbat' })).toBeVisible();
      await expect(marquee.getByRole('img', { name: 'Good Day Coffee' }).first()).toBeVisible();
      // No gap before the loop restarts: the track covers the screen plus the one set it shifts by.
      await expect
        .poll(() =>
          marquee.evaluate((m) => {
            const track = m.querySelector<HTMLElement>('.partner-track')!;
            const shift = -parseFloat(track.style.getPropertyValue('--marquee-shift'));
            return shift > 0 && track.scrollWidth >= m.clientWidth + shift;
          }),
        )
        .toBe(true);
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

test.describe('Kembali ke atas', () => {
  test('meluncur pelan ke atas, tidak melompat', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    const start = await page.evaluate(() => window.scrollY);
    expect(start).toBeGreaterThan(1000);

    // Sample the scroll position every frame while the glide runs.
    await page.evaluate(() => {
      const samples: number[] = [];
      (window as unknown as { __samples: number[] }).__samples = samples;
      const tick = () => {
        samples.push(window.scrollY);
        if (samples.length < 400) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.getByRole('link', { name: 'Kembali ke atas' }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBe(0);

    const samples = await page.evaluate(() => (window as unknown as { __samples: number[] }).__samples);
    const between = samples.filter((y) => y > 0 && y < start);
    expect(between.length).toBeGreaterThan(5);
  });
});
