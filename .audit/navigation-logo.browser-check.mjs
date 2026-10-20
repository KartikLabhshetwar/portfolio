import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import sharp from 'sharp';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const baseline of [true, false]) {
      await page.goto('http://localhost:4321/projects');
      await page.evaluate(baseline => {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
        if (baseline) {
          const style = document.createElement('style');
          style.textContent = '.page-dock svg {view-transition-name:none!important} ::view-transition-group(dock-selection) {z-index:auto!important}';
          document.head.append(style);
        }
        window.__captured = false;
        document.addEventListener('astro:before-swap', event => {
          if (baseline) {
            event.newDocument.querySelectorAll('.page-dock svg').forEach(svg => svg.style.setProperty('view-transition-name','none','important'));
          }
          event.viewTransition.ready.then(() => {
            document.getAnimations().forEach(a => { a.pause(); a.currentTime = 180; });
            window.__captured = true;
          });
        }, { once: true });
      }, baseline);
      await page.locator('.page-dock a[aria-label="Experience"]').click();
      await page.waitForFunction(() => window.__captured);
      const box = await page.locator('.page-dock a[aria-label="Experience"] svg').boundingBox();
      const screenshot = await page.screenshot({path:`.audit/navigation-logo-${baseline?'before':'after'}-${width}.png`});
      const {data,info} = await sharp(screenshot).extract({left:Math.round(box.x),top:Math.round(box.y),width:24,height:24}).removeAlpha().raw().toBuffer({resolveWithObject:true});
      let darkPixels=0;
      for(let i=0;i<data.length;i+=info.channels) if(data[i]<100 && data[i+1]<100 && data[i+2]<100) darkPixels++;
      console.log(`${baseline?'Before':'After'} ${width}px: ${darkPixels} visible icon pixels during transition`);
      if(!baseline) assert(darkPixels>50, 'Navigation icon remains visible during selection transition');
      await page.evaluate(()=>document.getAnimations().forEach(a=>a.finish()));
      assert.equal(await page.locator('.page-dock a[aria-current]').getAttribute('aria-label'), 'Experience');
    }
  }
} finally { await browser.close(); }
