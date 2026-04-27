import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

// Take screenshot
await page.screenshot({ path: 'qa-screenshot.png', fullPage: false });
console.log('Screenshot saved to qa-screenshot.png');

// Get all card buttons and their bounding rects
const cards = await page.$$('button');
const cardData = [];
for (const card of cards) {
  const h3 = await card.$('h3');
  if (!h3) continue;
  const title = await h3.textContent();
  const box = await card.boundingBox();
  const imgs = await card.$$('img');
  const imgSizes = [];
  for (const img of imgs) {
    const ib = await img.boundingBox();
    if (ib) imgSizes.push({ w: Math.round(ib.width), h: Math.round(ib.height) });
  }
  cardData.push({ title: title?.trim(), x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height), imgs: imgSizes });
}

// Group by row (y position)
const rows = {};
for (const c of cardData) {
  const row = Math.round(c.y / 10) * 10;
  if (!rows[row]) rows[row] = [];
  rows[row].push(c);
}

console.log('\n=== Card Layout Analysis ===');
for (const [rowY, rowCards] of Object.entries(rows)) {
  const heights = rowCards.map(c => c.h);
  const allSame = heights.every(h => h === heights[0]);
  console.log(`\nRow y≈${rowY} (${rowCards.length} cards, ${allSame ? '✅ SAME height' : '❌ MIXED height'}):`);
  for (const c of rowCards) {
    const imgInfo = c.imgs.length ? ` imgs=[${c.imgs.map(i => `${i.w}×${i.h}`).join(', ')}]` : ' no-imgs';
    console.log(`  "${c.title}" | ${c.w}×${c.h}px${imgInfo}`);
  }
}

await browser.close();
