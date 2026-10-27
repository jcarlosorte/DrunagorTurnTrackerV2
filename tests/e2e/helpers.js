/** Utilidades compartidas por las pruebas E2E. */

export const HERO_ID = 'vorn';

export function buildSeed(overrides = {}) {
  return {
    lang: JSON.stringify('es'),
    expansions: JSON.stringify(['base']),
    heroManagement: JSON.stringify(true),
    trackerData: JSON.stringify({
      heroes: [HERO_ID],
      roles: { [HERO_ID]: 'defensor' },
      enemies: ['skeleton_archer'],
      behaviors: ['estandar'],
      placedHeroes: [{ id: HERO_ID, role: 'defensor', position: 0, image: '' }],
    }),
    ...overrides,
  };
}

export function buildEnemyState({ estadosAlterados = [], vida = 12 } = {}) {
  return JSON.stringify({
    placedEnemies: [{
      enemy: {
        uuid: 'e2e-enemy',
        id: 'skeleton_archer',
        color: 'blanco',
        categoria: 'soldado',
        comportamiento: 'estandar',
        rune: 'naranja',
        position: 1,
        runePosition: 'arriba',
        vida,
        vidaMax: 12,
        movimiento: 3,
        ataque: 2,
        tipo_ataque: 'cuerpo',
        capacidades: [],
        capacidadesOriginales: [],
        inmunidad: [],
        estadosAlterados,
        imagen: '',
      },
    }],
    huespedActivo: false,
    acechoActivo: false,
    invadidosActivo: false,
    oscuridadActivo: false,
    asaltoActivo: false,
    usedColors: [],
    usedColorsBig: [],
    enemyColorMap: {},
  });
}

export function buildHeroExtras(overrides = {}) {
  return JSON.stringify({
    [HERO_ID]: {
      vida: 7,
      vidaMax: 12,
      trauma: 1,
      maldicion: 0,
      impactoMod: 3,
      auras: [],
      consecuencias: [],
      estados: [],
      estadosAlterados: [
        { id: 'VENENO_I', count: 2 },
        { id: 'QUEMADURA_I', count: 1 },
      ],
      equipo: { arma: 'Espada', manoTorpe: '', armadura: '', amuleto: '', bolsa1: '', bolsa2: '' },
      equipoMods: { arma: { value: 2, stat: 'ataque' }, amuleto: { value: 0, stat: 'movimiento' } },
      cubos: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
      cubosMax: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
      cubosVersion: 2,
      ...overrides,
    },
  });
}

/** Siembra localStorage antes de que arranque la app. */
export async function seedStorage(page, entries) {
  await page.addInitScript((data) => {
    try {
      if (localStorage.getItem('__e2e_seeded')) return;
      Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value));
      ['initRunesState', 'trackerSession', 'gameState', 'gameLog'].forEach((key) => localStorage.removeItem(key));
      localStorage.setItem('__e2e_seeded', '1');
    } catch {
      // contexto sin almacenamiento
    }
  }, entries);
}

/** Abre el tablero y espera a que se pinte. */
export async function openTracker(page) {
  await page.goto('./init', { waitUntil: 'networkidle' });
  await page.waitForSelector('.track-slot');
}

export async function readStorage(page, key, fallback = null) {
  return page.evaluate(({ storageKey, defaultValue }) => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaultValue;
    try { return JSON.parse(raw); } catch { return defaultValue; }
  }, { storageKey: key, defaultValue: fallback });
}

export async function pressNextTurn(page, times = 1) {
  const button = page.getByTestId('next-turn');
  for (let i = 0; i < times; i += 1) {
    await button.click();
    await page.waitForTimeout(300);
  }
}

/**
 * Avanza turnos hasta que el enemigo de prueba se quede sin estados alterados.
 * Devuelve cuántos turnos fueron necesarios.
 */
export async function consumeEnemyStates(page, maxTurns = 34) {
  const readEnemy = () => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
    return state.placedEnemies?.[0]?.enemy ?? null;
  });

  const button = page.getByTestId('next-turn');
  for (let turn = 1; turn <= maxTurns; turn += 1) {
    const enemy = await readEnemy();
    if (!enemy || (enemy.estadosAlterados || []).length === 0) return turn - 1;
    await button.click();
    await page.waitForTimeout(260);
  }
  return maxTurns;
}
