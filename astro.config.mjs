import { defineConfig, sessionDrivers } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kartikk.tech',
  adapter: cloudflare({ imageService: 'compile' }),
  session: { driver: sessionDrivers.lruCache() },
  integrations: [react(), markdoc(), keystatic(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['virtual:keystatic-config'],
    },
  },
});
