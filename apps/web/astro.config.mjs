// @ts-check
import { fileURLToPath } from 'node:url';
import { rm } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * Internal pages (/dev/*) are for checking assets. They are left out of the production build;
 * the e2e suite sets INCLUDE_DEV_PAGES=1 to build them.
 * @type {import('astro').AstroIntegration}
 */
const devPagesOnlyLocally = {
  name: 'alterego-dev-pages',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      if (process.env.INCLUDE_DEV_PAGES === '1') return;
      await rm(fileURLToPath(new URL('dev/', dir)), { recursive: true, force: true });
      logger.info('dev pages left out of the production build');
    },
  },
};

export default defineConfig({
  site: 'https://alterego.example', // TODO: ganti dengan domain produksi
  integrations: [devPagesOnlyLocally],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@data': fileURLToPath(new URL('../../data', import.meta.url)),
      },
    },
  },
});
