import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { profile } from '../src/data/profile.ts';

const geist = (await readFile(new URL('../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2', import.meta.url))).toString('base64');
const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <style>@font-face { font-family: 'Geist'; src: url(data:font/woff2;base64,${geist}) format('woff2'); font-weight: 100 900; }</style>
    </defs>
    <rect width="1200" height="630" fill="#FBFBFA"/>
    <text x="80" y="300" fill="#191918" font-family="Geist, Arial, sans-serif" font-size="84" font-weight="500" letter-spacing="-4">${profile.name}</text>
    <text x="84" y="365" fill="#74736F" font-family="Geist, Arial, sans-serif" font-size="30">${profile.tagline}</text>
    <text x="84" y="548" fill="#74736F" font-family="Geist, Arial, sans-serif" font-size="22">kartiklabhshetwar.com</text>
  </svg>`;

await writeFile(new URL('../public/og-profile.png', import.meta.url), await sharp(Buffer.from(svg)).png().toBuffer());
