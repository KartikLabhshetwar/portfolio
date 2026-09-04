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
    <rect x="566" y="-84" width="706" height="560" rx="166" fill="#F8F8F7" stroke="#F5F5F3" stroke-width="2"/>
    <path d="M716 -84H1272V342H806C756.294 342 716 301.706 716 252V-84Z" fill="#1265FF"/>
    <text x="-18" y="674" fill="#E7E7E5" font-family="Geist, Arial, sans-serif" font-size="276" font-weight="430" letter-spacing="-13">${profile.name.split(' ')[0]}</text>
  </svg>`;

await writeFile(new URL('../public/og-card.png', import.meta.url), await sharp(Buffer.from(svg)).png().toBuffer());
