import { defineConfig, sessionDrivers } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
const reactEntrypoints = [
  'react',
  'react-dom',
  'react-dom/server',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
];
function dedupeReactInWorkerd() {
  return {
    name: 'dedupe-react-in-workerd',
    configEnvironment(name) {
      if (name !== 'client') {
        return { optimizeDeps: { include: reactEntrypoints } };
      }
    },
  };
}

export default defineConfig({
  site: 'https://kartiklabhshetwar.com',
  adapter: cloudflare({ imageService: 'compile' }),
  session: { driver: sessionDrivers.lruCache() },
  integrations: [react(), markdoc(), keystatic(), sitemap()],
  vite: {
    plugins: [tailwindcss(), dedupeReactInWorkerd()],
    resolve: {
      dedupe: reactEntrypoints,
    },
    optimizeDeps: {
      exclude: ['virtual:keystatic-config'],
    },
  },
});
