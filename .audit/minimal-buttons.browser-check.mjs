import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && new URL(response.url()).origin === 'http://localhost:4330') errors.push(`${response.status()} ${response.url()}`); });
  for (const width of [1280, 390]) {
    console.log('Checking width', width);
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:4330/newsletter', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(document.querySelector('[data-theme-toggle]')?.onclick));
    const button = page.locator('[data-theme-toggle]');
    assert.equal(await button.count(), 1);
    assert.equal(await button.getAttribute('type'), 'button');
    const before = await button.getAttribute('aria-pressed');
    console.log('Clicking theme toggle');
    await button.click();
    await page.waitForFunction(previous => document.querySelector('[data-theme-toggle]').getAttribute('aria-pressed') !== previous, before);
    await page.waitForFunction(() => !document.documentElement.classList.contains('theme-transition'));
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    assert.equal(await button.getAttribute('aria-pressed'), String(theme === 'dark'));
    assert.equal(await button.getAttribute('aria-label'), theme === 'dark' ? 'Use light theme' : 'Use dark theme');
    const link = page.getByRole('link', { name: 'Subscribe on Substack', exact: true });
    assert.equal(await link.getAttribute('href'), 'https://kartiklabhshetwar.substack.com/');
    assert(await link.isVisible());
    for (const control of [button, link]) {
      const box = await control.boundingBox();
      assert(box.height >= 44);
      assert((await control.evaluate(el => getComputedStyle(el).backgroundImage)).includes('linear-gradient'));
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `.audit/minimal-buttons-${width}.png`, fullPage: true });
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), theme === 'dark');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await button.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(previous => localStorage.getItem('theme') !== previous, theme);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('theme-transition')), false);
    await page.getByRole('link', { name: 'Writing', exact: true }).click();
    await page.waitForURL('**/blog');
    await page.waitForFunction(() => Boolean(document.querySelector('[data-theme-toggle]')?.onclick));
    const blogBefore = await button.getAttribute('aria-pressed');
    console.log('Clicking theme toggle');
    await button.click();
    await page.waitForFunction(previous => document.querySelector('[data-theme-toggle]').getAttribute('aria-pressed') !== previous, blogBefore);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
  assert.deepEqual(errors, []);
  console.log('Passed desktop/mobile checks for theme click and keyboard activation, persistence, Astro navigation, reduced motion, shared gradient styling, 44px targets, newsletter URL, overflow, and browser errors.');
} finally {
  await browser.close();
}
