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

const makeEnemy = (uuid, id, overrides = {}) => ({
  enemy: {
    uuid,
    id,
    color: 'blanco',
    categoria: 'soldado',
    comportamiento: 'estandar',
    rune: 'naranja',
    position: 0,
    runePosition: 'arriba',
    vida: 15,
    vidaMax: 15,
    movimiento: 3,
    ataque: 2,
    tipo_ataque: 'cuerpo',
    capacidades: [],
    inmunidad: [],
    estadosAlterados: [],
    imagen: '',
    ...overrides,
  },
});

const enemiesState = {
  placedEnemies: [
    makeEnemy('e1', 'skeleton_archer'),
    makeEnemy('e2', 'skeleton_archer'),
    makeEnemy('e3', 'skeleton_archer'),
    makeEnemy('e4', 'skeleton_archer'),
    makeEnemy('e5', 'skeleton_archer', { runePosition: 'abajo' }),
    makeEnemy('e6', 'skeleton_archer', { runePosition: 'abajo' }),
  ],
  huespedActivo: false,
  acechoActivo: false,
  invadidosActivo: false,
  oscuridadActivo: false,
  asaltoActivo: false,
  usedColors: [],
  usedColorsBig: [],
  enemyColorMap: {},
};

async function seed(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ data, enemies }) => {
    window.localStorage.setItem('lang', JSON.stringify('es'));
    window.localStorage.setItem('expansions', JSON.stringify(['base']));
    window.localStorage.setItem('trackerData', JSON.stringify(data));
    window.localStorage.setItem('initEnemiesState', JSON.stringify(enemies));
    window.localStorage.setItem('gameLog', JSON.stringify([
      { at: '2026-10-27T00:10:00.000Z', kind: 'event', message: 'Nueva Ronda: 1' },
      { at: '2026-10-27T00:11:00.000Z', kind: 'event', message: 'Activa turno adicional: arquero' },
      { at: '2026-10-27T00:12:00.000Z', kind: 'event', message: 'Se invocan 3 enemigos' },
    ]));
    ['initRunesState', 'trackerSession', 'gameState'].forEach((key) => window.localStorage.removeItem(key));
  }, { data: trackerData, enemies: enemiesState });
  await page.goto(`${BASE}init`, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(2000);
}

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seed(desktop);
await desktop.screenshot({ path: 'shot-desktop.png' });

const metrics = await desktop.evaluate(() => {
  const slots = Array.from(document.querySelectorAll('.track-slot')).slice(0, 3);
  return slots.map((slot) => {
    const rect = slot.getBoundingClientRect();
    const imgs = Array.from(slot.querySelectorAll('img'));
    const first = imgs[0]?.getBoundingClientRect();
    const last = imgs[imgs.length - 1]?.getBoundingClientRect();
    return {
      slotH: Math.round(rect.height),
      topCardY: first ? Math.round(first.top - rect.top) : null,
      bottomCardY: last ? Math.round(last.bottom - rect.bottom) : null,
    };
  });
});
console.log('METRICS', JSON.stringify(metrics));

// Abrir historial
const historyBtn = desktop.locator('button[aria-label="Historial"]');
if (await historyBtn.count()) {
  await historyBtn.first().click();
  await desktop.waitForTimeout(600);
  await desktop.screenshot({ path: 'shot-history.png' });
}

await browser.close();
