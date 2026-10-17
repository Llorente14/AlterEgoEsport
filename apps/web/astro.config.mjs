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
  // Canonical origin for sitemap, robots and share links. Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every
  // build (the *.vercel.app domain); SITE_URL overrides it, e.g. when a custom domain is added later.
  site:
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4321'),
  integrations: [devPagesOnlyLocally],
  vite: {
    plugins: [tailwindcss()],
    // three.js is only reached through a dynamic import (the desktop 3D logo). Pre-bundle it at dev start so a
    // stale or late dependency scan cannot 404 it and drop the page to the 2D fallback.
    optimizeDeps: {
      include: [
        'three',
        'three/addons/loaders/GLTFLoader.js',
        'three/addons/libs/meshopt_decoder.module.js',
        'three/addons/environments/RoomEnvironment.js',
      ],
    },
    resolve: {
      alias: {
        '@data': fileURLToPath(new URL('../../data', import.meta.url)),
      },
    },
  },
});
