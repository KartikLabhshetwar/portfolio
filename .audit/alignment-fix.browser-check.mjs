import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/newsletter', '/blog', '/blog/organic-growth-playbook', '/']) {
      const response = await page.goto('http://localhost:4321' + path);
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const rect = selector => document.querySelector(selector).getBoundingClientRect();
        const h = rect('h1'), b = rect('[data-theme-toggle]'), d = rect('.page-header > p'), f = rect('main > footer');
        return {
          centers: Math.abs(h.y + h.height / 2 - b.y - b.height / 2),
          edges: Math.max(Math.abs(h.x - d.x), Math.abs(h.x - f.x)),
          overlaps: h.right > b.left,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      assert.ok(layout.centers < 1 && layout.edges < 1 && !layout.overlaps && !layout.overflow, JSON.stringify({ width, path, ...layout }));
      if (path === '/newsletter') {
        await page.getByRole('link', { name: 'Subscribe on Substack' }).isVisible().then(assert.ok);
        await page.getByRole('link', { name: 'Privacy details' }).isVisible().then(assert.ok);
      }
      if (width !== 320 && ['/newsletter', '/blog'].includes(path)) await page.screenshot({ path: `.audit/alignment-fix-${path.slice(1)}-${width}.png`, fullPage: true });
      console.log(`${width}px ${path}: aligned, no overlap or overflow`);
    }
  }
} finally {
  await browser.close();
}
