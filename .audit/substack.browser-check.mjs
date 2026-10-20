import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = 'http://localhost:4321';
const substack = 'https://kartiklabhshetwar.substack.com/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  const signupRequests = [];
  page.on('request', request => {
    if (request.url().includes('/api/subscribe')) signupRequests.push(request.url());
  });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/newsletter', '/blog/organic-growth-playbook']) {
      const response = await page.goto(base + path);
      assert.equal(response.status(), 200);
      const link = page.getByRole('link', { name: 'Subscribe on Substack', exact: true });
      assert.equal(await link.count(), 1);
      assert.equal(await link.getAttribute('href'), substack);
      assert(await link.isVisible());
      assert.equal(await page.locator('form[data-newsletter], input[type=email]').count(), 0);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: `.audit/substack-${path === '/newsletter' ? 'newsletter' : 'article'}-${width}.png`, fullPage: true });
    }
  }
  for (const path of ['/newsletter', '/contact', '/privacy', '/terms', '/llms.txt', '/llms-full.txt']) {
    const response = await page.request.get(base + path, { headers: { Accept: 'text/markdown' } });
    assert.equal(response.status(), 200);
    const body = await response.text();
    assert(!body.includes('api/subscribe'), path);
    assert(!body.includes('through Kit'), path);
    if (path !== '/llms-full.txt') assert(body.includes('Substack'), path);
  }
  const removed = await page.request.post(base + '/api/subscribe', { data: { email: 'test@example.com' } });
  assert.equal(removed.status(), 404);
  assert.equal(signupRequests.length, 0);
  console.log('Newsletter and article CTAs pass at desktop/mobile widths. Markdown points to Substack. Removed signup API returns 404.');
} finally {
  await browser.close();
}
