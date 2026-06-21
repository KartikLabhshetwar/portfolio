import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kartikk.tech',
  vite: { plugins: [tailwindcss()] },
});
