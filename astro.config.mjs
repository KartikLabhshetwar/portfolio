import { defineConfig, sessionDrivers } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://kartiklabhshetwar.com';

// Blog posts render on demand (Accept negotiation, see src/middleware.ts), so the
// sitemap integration: which only sees prerendered pages and static route
// patterns: can't discover them. Feed them in from the content directory.
const blogPages = readdirSync('src/content/blog', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .filter((d) => !/^\s*draft:\s*true\s*$/m.test(readFileSync(`src/content/blog/${d.name}/index.mdoc`, 'utf8')))
  .map((d) => `${SITE}/blog/${d.name}/`);
const reactEntrypoints = [
  'react',
  'react-dom',
  'react-dom/server',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
];
// Deps Vite finds only at request time (content/markdoc render, rate limiting)
// rather than in its initial scan. Left alone, it re-optimizes mid-session and
// each SSR reload briefly nulls React → "Invalid hook call" floods on dev start.
// Pre-bundling them up front means one optimize pass, no reloads. Dev-only;
// build/prod are unaffected.
const ssrPrebundle = [
  'astro/zod',
  '@astrojs/markdoc/components',
  '@astrojs/markdoc/runtime',
  '@astrojs/markdoc/runtime-assets-config',
  '@upstash/redis',
];
function dedupeReactInWorkerd() {
  return {
    name: 'dedupe-react-in-workerd',
    configEnvironment(name) {
      if (name !== 'client') {
        return { optimizeDeps: { include: [...reactEntrypoints, ...ssrPrebundle] } };
      }
    },
  };
}

export default defineConfig({
  site: SITE,
  redirects: { '/projects': '/work#projects' },
  prefetch: { prefetchAll: true },
  adapter: cloudflare({ imageService: 'compile' }),
  session: { driver: sessionDrivers.lruCache() },
  integrations: [react(), markdoc(), keystatic(), sitemap({ customPages: blogPages })],
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
