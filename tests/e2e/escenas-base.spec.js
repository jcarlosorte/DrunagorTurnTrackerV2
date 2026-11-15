import { expect, test } from '@playwright/test';
import { buildHeroExtras, buildSeed, openTracker, readStorage, seedStorage } from './helpers';

const baseSeed = () => buildSeed({
  mainBox: JSON.stringify('core'),
  expansions: JSON.stringify(['base']),
});

async function activateScene(page, id) {
  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await page.getByTestId(`scene-${id}`).getByRole('button', { name: /Activar capítulo/ }).click();
}

test.describe('Escenas del juego base', () => {
  test('el menú muestra solo las escenas del juego base', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await expect(page.getByTestId('scene-base_chapter1')).toBeVisible();
    await expect(page.getByTestId('scene-base_chapter2')).toBeVisible();
    await expect(page.getByTestId('scene-base_chapter2b')).toBeVisible();
    await expect(page.getByTestId('scene-chapter1')).toHaveCount(0);
  });

  test('Capítulo 1 coloca un arquero esqueleto para un héroe', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter1');

    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return (enemies.placedEnemies || []).map((entry) => ({
        id: entry.enemy.id,
        color: entry.enemy.color,
        category: entry.enemy.categoria,
      }));
    }).toEqual([{ id: 'skeleton_archer', color: 'blanco', category: 'bisoño' }]);
  });

  test('Capítulo 2 solo coloca Oscuridad de Caza', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter2');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        enemies: (enemies.placedEnemies || []).map((entry) => entry.enemy.id),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza'],
      enemies: [],
    });
  });

  test('pregunta a qué héroe asociar a Tharmagar cuando hay varios', async ({ page }) => {
    const seed = buildSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.heroes = ['vorn', 'elros'];
    tracker.roles = { vorn: 'defensor', elros: 'asesino' };
    tracker.placedHeroes = [
      { id: 'vorn', role: 'defensor', position: 0, image: '' },
      { id: 'elros', role: 'asesino', position: 1, image: '' },
    ];
    seed.trackerData = JSON.stringify(tracker);
    await seedStorage(page, seed);
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-base_chapter5').getByRole('button', { name: /Activar capítulo/ }).click();

    const dialog = page.getByRole('dialog', { name: 'Elegir héroe para el compañero' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Elros' }).click();

    await expect.poll(async () => {
      const saved = await readStorage(page, 'trackerData', {});
      return (saved.companions || []).find((entry) => entry.id === 'tharmagar_leal')?.heroId;
    }).toBe('elros');
  });

  test('Capítulo 7 añade Tharmagar, 3 runas por color y 3 pilas sin activar', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter7');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const game = await readStorage(page, 'gameState', {});
      const tracker = await readStorage(page, 'trackerData', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        companion: (tracker.companions || []).some((entry) => entry.id === 'tharmagar_leal'),
        trackRunes: (game.usedTiles || []).length,
        runes: game.runes,
        piles: (game.pilas || []).length,
        activePiles: (game.pilas || []).filter((pila) => pila.estado === 'activa').length,
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza'],
      companion: true,
      trackRunes: 15,
      runes: { rojo: 3, azul: 3, verde: 3, naranja: 3, gris: 3 },
      piles: 3,
      activePiles: 0,
    });
  });

  test('Capítulo 9 coloca runas, Puntos de Aparición, Defensa y enemigos', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter9');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const game = await readStorage(page, 'gameState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      const defense = (runes.placedRunes || []).find((entry) => entry.rune.id === 'defen1');
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        time: defense?.rune?.estadosAlterados?.find((estado) => estado.id === 'TIEMPO')?.count,
        trackRunes: (game.usedTiles || []).length,
        runes: game.runes,
        spawnPoints: (game.spawnPoints || []).length,
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza', 'defen1'],
      time: 3,
      trackRunes: 20,
      runes: { rojo: 4, azul: 4, verde: 4, naranja: 4, gris: 4 },
      spawnPoints: 5,
      enemies: ['blanco:soldado', 'negro:veterano'],
    });
  });

  test('Capítulo 8 sustituye a Tharmagar Leal por Resentido', async ({ page }) => {
    const seed = buildSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.companions = [{
      uid: 'tharmagar-leal-test',
      id: 'tharmagar_leal',
      heroId: 'vorn',
      order: 0,
      vida: 5,
      vidaMax: 5,
      estadosAlterados: [],
      capacidades: [],
    }];
    seed.trackerData = JSON.stringify(tracker);
    await seedStorage(page, seed);
    await openTracker(page);
    await activateScene(page, 'base_chapter8');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const game = await readStorage(page, 'gameState', {});
      const saved = await readStorage(page, 'trackerData', {});
      const enemiesState = await readStorage(page, 'initEnemiesState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        companions: (saved.companions || []).map((entry) => `${entry.id}:${entry.heroId}`),
        trackRunes: (game.usedTiles || []).length,
        enemies: (enemiesState.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza'],
      companions: ['tharmagar_resentido:vorn'],
      trackRunes: 15,
      enemies: ['negro:soldado', 'gris:veterano'],
    });
  });

  test('Capítulo 6 añade Tharmagar, Sorpresa Enterrada, Llaves y deja 3 runas por color', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter6');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const tracker = await readStorage(page, 'trackerData', {});
      const game = await readStorage(page, 'gameState', {});
      const bagColors = (game.availableTiles || []).reduce((acc, tile) => {
        acc[tile.runa] = (acc[tile.runa] || 0) + 1;
        return acc;
      }, {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        companion: (tracker.companions || []).some((entry) => entry.id === 'tharmagar_leal'),
        buriedDeck: game.sorpresaEvent?.deck?.length,
        runeKeys: (game.runeKeys || []).length,
        bag: bagColors,
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza'],
      companion: true,
      buriedDeck: 5,
      runeKeys: 4,
      bag: { rojo: 3, azul: 3, verde: 3, naranja: 3, gris: 3 },
    });
  });

  test('Capítulo 5 coloca Oscuridad de Caza, Tharmagar y enemigos', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter5');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      const tracker = await readStorage(page, 'trackerData', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
        companion: (tracker.companions || []).some((entry) => entry.id === 'tharmagar_leal'),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza'],
      enemies: ['gris:bisoño', 'negro:soldado'],
      companion: true,
    });
  });

  test('Capítulo 4 coloca incursión, cinco pilas y enemigos', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter4');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      const game = await readStorage(page, 'gameState', {});
      const tracker = await readStorage(page, 'trackerData', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
        piles: (game.pilas || []).length,
        activePiles: (game.pilas || []).filter((pila) => pila.estado === 'activa').length,
        scenario: game.scenarioMonster?.id,
        trackRunes: (game.usedTiles || []).length,
        runes: game.runes,
        companion: (tracker.companions || []).some((entry) => entry.id === 'tharmagar_leal'),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza', 'incru1'],
      enemies: ['negro:bisoño', 'gris:soldado'],
      piles: 5,
      activePiles: 1,
      scenario: 'dark_vampire',
      trackRunes: 25,
      runes: { rojo: 5, azul: 5, verde: 5, naranja: 5, gris: 5 },
      companion: true,
    });
  });

  test('Capítulo 3 coloca runa, incursión, Barricadas y enemigos', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter3');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      const game = await readStorage(page, 'gameState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
        barricades: (game.controlPoints || []).length,
        scenario: game.scenarioMonster?.id,
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza', 'incru1'],
      enemies: ['gris:bisoño', 'negro:bisoño'],
      barricades: 5,
      scenario: 'dark_vampire',
    });
    await expect(page.getByTestId('area-control-panels').getByText(/Barricadas Activas/i)).toBeVisible();
  });

  test('Capítulo 2b recupera al grupo, reinicia ronda y coloca al Rey Redivivo', async ({ page }) => {
    await seedStorage(page, {
      ...baseSeed(),
      heroExtras: buildHeroExtras({
        vida: 3,
        trauma: 0,
        cubos: { amarillo: 0, rojo: 0, verde: 0, azul: 0 },
        estadosAlterados: [
          { id: 'ESCUDO', count: 2 },
          { id: 'VENENO_I', count: 1 },
        ],
      }),
    });
    await openTracker(page);
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(300);
    await activateScene(page, 'base_chapter2b');
    for (const label of [/Trauma/i, /Maldición/i]) {
      const prompt = page.getByRole('dialog').filter({ hasText: label });
      await expect(prompt).toBeVisible();
      await prompt.locator('input').fill('0');
      await prompt.getByRole('button', { name: 'Aceptar' }).click();
    }

    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return (enemies.placedEnemies || []).map((entry) => entry.enemy.id);
    }).toContain('undead_king_boss_1');

    const extras = await readStorage(page, 'heroExtras', {});
    expect(extras.vorn.vida).toBe(12);
    expect(extras.vorn.cubos).toEqual(extras.vorn.cubosMax);
    expect(extras.vorn.estadosAlterados).toEqual([{ id: 'ESCUDO', count: 2 }]);
    const session = await readStorage(page, 'trackerSession', {});
    await expect.poll(async () => (await readStorage(page, 'trackerSession', {})).roundNumber).toBe(2);
    expect(session.turnIndex).toBe(0);
    const runes = await readStorage(page, 'initRunesState', {});
    expect((runes.placedRunes || []).map((entry) => entry.rune.id)).toEqual(['runa_base_oscuridad_caza']);
  });
});
