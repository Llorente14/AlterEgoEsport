import { defineConfig, devices } from '@playwright/test';

// Not 4321, so tests never reuse a running `astro dev` server.
const PORT = 4322;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    // Headless Chromium renders WebGL in software, which would make the 3D logo starve every other test.
    // These projects run without WebGL (--disable-3d-apis), so they also exercise the 2D fallback.
    {
      name: 'desktop',
      testIgnore: /logo3d/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        launchOptions: { args: ['--disable-3d-apis'] },
      },
    },
    {
      name: 'mobile',
      testIgnore: /logo3d/,
      use: { ...devices['Pixel 7'], launchOptions: { args: ['--disable-3d-apis'] } },
    },
    // The 3D logo (tests/e2e/logo3d.spec.ts, not written yet) runs with WebGL on.
    { name: 'desktop-3d', testMatch: /logo3d/, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `npm run build && npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
