import { expect, test } from '@playwright/test';

test('showreel, logo, dan model 3D dapat dimuat', async ({ page, request }) => {
  await page.goto('/dev/assets');

  const video = page.getByTestId('showreel');
  await expect(video).toHaveAttribute('muted', '');
  await expect(video).toHaveAttribute('playsinline', '');

  // The browser must pick a playable source.
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentSrc))
    .toMatch(/\/video\/showreel-(480|720)\.(mp4|webm)$/);

  const logo = page.getByRole('img', { name: 'Logo Alter Ego' });
  await expect
    .poll(() => logo.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
    .toBe(true);

  const model = await request.get('/models/alterego-logo.glb');
  expect(model.ok()).toBe(true);
});
