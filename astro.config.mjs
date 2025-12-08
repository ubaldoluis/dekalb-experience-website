// @ts-check
import { defineConfig } from 'astro/config';
import splide from '@splidejs/astro-splide';

// https://astro.build/config
export default defineConfig({
  site: 'https://dekalb-experience.com',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: 'static',
  build: {
    assets: 'assets',
  },
  integrations: [splide()],
  vite: {
    optimizeDeps: {
      include: ['@splidejs/splide'],
    },
  },
});
