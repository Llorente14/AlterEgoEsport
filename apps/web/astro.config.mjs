// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://alterego.example', // TODO: ganti dengan domain produksi
  vite: {
    plugins: [tailwindcss()],
  },
});
