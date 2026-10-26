import { chromium } from 'playwright';

const BASE = 'http://localhost:4173/DrunagorTurnTrackerV2/';

const trackerData = {
  heroes: ['jaheen', 'handuriel', 'duncan', 'sskar', 'lord-of-wrath'],
  roles: {
    jaheen: 'defensor',
    handuriel: 'apoyo',
    duncan: 'lider',
    sskar: 'agresor',
    'lord-of-wrath': 'controlador',
  },
  enemies: [],
  behaviors: ['estandar', 'alternativo', 'complejo'],
};

async function seed(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate((data) => {
    window.localStorage.setItem('lang', JSON.stringify('es'));
    window.localStorage.setItem('expansions', JSON.stringify(['base']));
    window.localStorage.setItem('trackerData', JSON.stringify(data));
    ['initEnemiesState', 'initRunesState', 'trackerSession', 'gameState', 'gameLog'].forEach((key) => {
      window.localStorage.removeItem(key);
    });
  }, trackerData);
  await page.goto(`${BASE}init`, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(2000);
}

const browser = await chromium.launch();

// Escritorio
const desktop = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seed(desktop);
await desktop.screenshot({ path: 'shot-desktop.png' });
const desktopReport = await desktop.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('.track-slot img'))
    .filter((img) => img.alt && img.alt.length > 2)
    .slice(0, 6)
    .map((img) => {
      const r = img.getBoundingClientRect();
      return { alt: img.alt, w: Math.round(r.width), h: Math.round(r.height) };
    });
  const grid = document.querySelector('.grid');
  return { imgs, gridWidth: grid ? Math.round(grid.getBoundingClientRect().width) : null };
});
console.log('DESKTOP', JSON.stringify(desktopReport));

// Móvil
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await seed(mobile);
await mobile.screenshot({ path: 'shot-mobile.png' });
const mobileReport = await mobile.evaluate(() => ({
  buttons: Array.from(document.querySelectorAll('button[aria-pressed]')).map((b) => b.textContent.trim()),
  listRows: document.querySelectorAll('[id^="turn-slot-"]').length,
}));
console.log('MOBILE', JSON.stringify(mobileReport));

await browser.close();
