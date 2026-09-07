// Run after pnpm build, with a local server running:
// PLAYWRIGHT_CHANNEL=chrome node scripts/check-seo.mjs http://127.0.0.1:4321
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const origin = process.argv[2] ?? 'http://127.0.0.1:4321';
const sitemap = readFileSync(new URL('../dist/client/sitemap-0.xml', import.meta.url), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).href);
const routes = ['/', '/experience', '/projects', '/blog', '/newsletter'];
assert.equal(new Set(urls).size, urls.length, 'Sitemap contains duplicate URLs');
for (const route of [...routes, '/about', '/contact', '/privacy', '/terms']) {
  assert(urls.includes(`https://kartiklabhshetwar.com${route}`), `Missing sitemap page: ${route}`);
}
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL });
try {
  const page = await browser.newPage({ javaScriptEnabled: false });
  const titles = new Set();
  const descriptions = new Set();
  for (const url of urls) {
    const { pathname } = new URL(url);
    assert(!/^\/(?:work|404|api|keystatic)(?:\/|$)/.test(pathname));
    assert(pathname === '/' || !pathname.endsWith('/'), `Noncanonical sitemap URL: ${url}`);
    const response = await page.goto(new URL(pathname, origin).href);
    assert.equal(response.status(), 200, pathname);
    assert.equal(new URL(page.url()).pathname, pathname, `Sitemap URL redirects: ${url}`);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), url);
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), url);
    assert.equal(await page.locator('h1').count(), 1, pathname);
    assert.equal(await page.locator('h1').evaluate((heading) => getComputedStyle(heading).fontSize), '18px');
    assert(await page.locator('main h1, main h2, main h3, main h4').evaluateAll((headings) => headings.every((heading, index) => index === 0 || Number(heading.tagName[1]) <= Number(headings[index - 1].tagName[1]) + 1)), `Skipped heading level: ${pathname}`);
    if (pathname === '/privacy' || pathname === '/terms') {
      assert(await page.locator('.page-copy h2').count() >= 6, `Missing policy sections: ${pathname}`);
      assert((await page.locator('.page-copy').innerText()).length > 1000, `Missing policy text: ${pathname}`);
    }
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    assert(title && description && !titles.has(title) && !descriptions.has(description), `Missing or duplicate metadata: ${pathname}`);
    titles.add(title);
    descriptions.add(description);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert(graph.some((node) => node.url === url && node.isPartOf));
    assert.deepEqual(await page.getByRole('navigation', { name: 'Main navigation' }).locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href'))), routes);
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px: ${pathname}`);
      assert(await page.evaluate(() => {
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('nav[aria-label="Main navigation"] .nav-label'));
        return Math.abs(range.getBoundingClientRect().left - document.querySelector('h1').getBoundingClientRect().left) < 1;
      }), `Navigation misaligned at ${width}px: ${pathname}`);
      assert(await page.locator('.primary-nav a').evaluateAll((links) => links.every((link) => link.getBoundingClientRect().top === links[0].getBoundingClientRect().top && link.getBoundingClientRect().height >= 40)), `Navigation wraps or has small targets at ${width}px: ${pathname}`);
    }
  }
  for (const path of ['/experience', '/projects']) {
    const response = await page.request.get(new URL(path, origin).href, { headers: { Accept: 'text/markdown' } });
    assert.equal(response.status(), 200);
    assert.match(response.headers()['content-type'], /text\/markdown/);
    const body = await response.text();
    assert(body.startsWith(path === '/experience' ? '# Experience' : '# Projects'));
    assert(!body.includes(path === '/experience' ? '### BetterShot' : '## [Mem0]'));
  }
  const old = await page.request.get(new URL('/work', origin).href, { maxRedirects: 0 });
  assert.equal(old.status(), 301);
  assert.equal(new URL(old.headers().location, origin).pathname, '/experience');
  const missing = await page.goto(new URL('/missing-seo-check', origin).href);
  assert.equal(missing.status(), 404);
  assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
  assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
  for (const path of ['/robots.txt', '/llms.txt', '/llms-full.txt']) {
    const response = await page.request.get(new URL(path, origin).href, { headers: { Accept: 'text/plain' } });
    assert.equal(response.status(), 200, path);
  }
  const interactive = await browser.newPage();
  await interactive.goto(new URL('/work#projects', origin).href);
  await interactive.waitForURL('**/projects');
  const homeLink = interactive.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Home', exact: true });
  await homeLink.hover();
  assert.equal(await homeLink.locator('.nav-label').evaluate((label) => getComputedStyle(label).backgroundImage), 'none');
  await homeLink.focus();
  assert.equal(await homeLink.evaluate((link) => getComputedStyle(link).outlineStyle), 'solid');
  await interactive.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await homeLink.locator('.nav-label').evaluate((label) => getComputedStyle(label).transitionDuration), '0s');
  assert.equal(await interactive.locator('[data-theme-toggle]').count(), 1);
  await interactive.goto(new URL('/', origin).href);
  await interactive.evaluate(() => document.fonts.ready);
  assert(await interactive.evaluate(() => [...document.fonts].some((font) => font.family.includes('Geist') && font.status === 'loaded')), 'Geist font did not load');
  assert.match(await interactive.locator('h1').evaluate((heading) => getComputedStyle(heading).fontFamily), /Geist/);
  assert.equal(await interactive.locator('h1').evaluate((heading) => getComputedStyle(heading).fontWeight), '400');
  assert(!(await interactive.locator('main > p').textContent()).includes('Turbo ML'));
  assert.equal(await interactive.locator('footer a[href="/newsletter"]').count(), 0);
  assert.equal(await interactive.locator('footer').evaluate((footer) => getComputedStyle(footer).borderTopWidth), '0px');
  await interactive.getByRole('link', { name: 'Subscribe', exact: true }).click();
  await interactive.waitForURL('**/newsletter');
  await interactive.setViewportSize({ width: 320, height: 812 });
  assert.equal(await interactive.locator('form[data-newsletter]').evaluate((form) => getComputedStyle(form).flexDirection), 'column');
  assert.equal(await interactive.locator('#newsletter-email').evaluate((input) => getComputedStyle(input).fontSize), '16px');
  let signupStatus = 502;
  await interactive.route('**/api/subscribe', (route) => route.fulfill({
    status: signupStatus,
    json: signupStatus === 200 ? { ok: true } : { ok: false, error: 'Please try again.' },
  }));
  const email = interactive.getByRole('textbox', { name: 'Email address' });
  const submit = interactive.getByRole('button', { name: 'Subscribe', exact: true });
  await email.fill('reader@example.com');
  await submit.click();
  await interactive.getByRole('status').filter({ hasText: 'Please try again.' }).waitFor();
  assert.equal(await email.inputValue(), 'reader@example.com');
  signupStatus = 200;
  await submit.click();
  await interactive.getByRole('status').filter({ hasText: 'Check your inbox to confirm' }).waitFor();
  assert.equal(await email.inputValue(), '');
  await interactive.goto(new URL('/experience', origin).href);
  assert.equal(await interactive.locator('#experience p').count(), 0);
  assert.equal(await interactive.locator('astro-island[component-export="AutoTOCMinimap"]').count(), 0);
  console.log(`SEO checks passed: ${urls.length} sitemap pages, metadata, navigation, mobile layout, Markdown, redirects, crawler files, and 404s.`);
  console.log('Newsletter navigation and signup success/error states passed with mocked responses; no emails sent.');
} finally {
  await browser.close();
}
