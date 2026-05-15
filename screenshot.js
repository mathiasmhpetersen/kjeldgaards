/* Screenshot script for Kjeldgaards advertorial — Playwright.
 * Captures 7 sections × 2 viewports (375 mobile, 1440 desktop) into ./screenshots/.
 *
 * Run:  node screenshot.js
 * Requires the local server to be running on http://localhost:8765
 */
const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

const URL = process.env.URL || 'http://localhost:8765/index.html';
const OUT = path.resolve(__dirname, 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const SECTIONS = [
  { name: '1-hero',          selector: 'main > section:nth-of-type(1), figure.hero-figure' },
  { name: '2-anekdote',      selector: 'main > section:nth-of-type(2), main > section:nth-of-type(3)' },
  { name: '3-biology',       selector: 'main > section:nth-of-type(4), figure.inline-figure:nth-of-type(1), main > section:nth-of-type(5), figure.inline-figure:nth-of-type(2)' },
  { name: '4-fejl',          selector: 'main > section:nth-of-type(6)' },
  { name: '5-email-capture', selector: '#guide' },
  { name: '6-social-proof',  selector: 'main > section:nth-of-type(9), main > section:nth-of-type(10)' },
  { name: '7-footer',        selector: 'footer.site-footer' }
];

const VIEWPORTS = [
  { tag: 'mobile-375',  width: 375,  height: 800, deviceScaleFactor: 2, isMobile: true },
  { tag: 'desktop-1440', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false }
];

async function captureSection(page, sel, outFile, vp) {
  // For grouped sections (comma-list selectors), compute a bounding box in page
  // coordinates, then resize the viewport to fit the section height and
  // screenshot fullPage with a clip in absolute page coords.
  const selectors = sel.split(',').map(s => s.trim());
  const box = await page.evaluate((sels) => {
    let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity, found = false;
    for (const s of sels) {
      const nodes = document.querySelectorAll(s);
      nodes.forEach(n => {
        const r = n.getBoundingClientRect();
        const sy = window.scrollY;
        const sx = window.scrollX;
        top = Math.min(top, r.top + sy);
        bottom = Math.max(bottom, r.bottom + sy);
        left = Math.min(left, r.left + sx);
        right = Math.max(right, r.right + sx);
        found = true;
      });
    }
    if (!found) return null;
    const pad = 16;
    return {
      x: Math.max(0, Math.floor(left) - pad),
      y: Math.max(0, Math.floor(top) - pad),
      width: Math.ceil(right - left) + pad * 2,
      height: Math.ceil(bottom - top) + pad * 2
    };
  }, selectors);

  if (!box) throw new Error('No nodes matched: ' + sel);

  // Scroll to top of section so lazy/fade-in figures activate
  await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 40)), box.y);
  await page.waitForTimeout(500);

  // Use fullPage screenshot with absolute-coordinate clip — Playwright supports
  // clips that go beyond viewport when fullPage rendering is implied.
  await page.screenshot({
    path: outFile,
    fullPage: true,
    clip: {
      x: box.x,
      y: box.y,
      width: Math.min(box.width, vp.width),
      height: box.height
    }
  });
}

(async () => {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      userAgent: vp.isMobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : undefined
    });
    const page = await context.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    // Give fonts a moment
    await page.waitForTimeout(800);

    for (const sec of SECTIONS) {
      const outFile = path.join(OUT, `${sec.name}_${vp.tag}.png`);
      try {
        await captureSection(page, sec.selector, outFile, vp);
        console.log('captured', outFile);
      } catch (e) {
        console.error('FAILED', sec.name, vp.tag, e.message);
      }
    }

    // Also one full-page screenshot per viewport
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    const fullPath = path.join(OUT, `_full_${vp.tag}.png`);
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log('captured', fullPath);

    await context.close();
  }

  await browser.close();
  console.log('done');
})().catch(err => { console.error(err); process.exit(1); });
