import { expect, test } from '@playwright/test';
import { buildEnemyState, buildHeroExtras, buildSeed, expandAllSceneGroups, openTracker, readStorage, seedStorage } from './helpers';

const baseSeed = () => buildSeed({
  mainBox: JSON.stringify('core'),
  expansions: JSON.stringify(['base']),
});

async function activateScene(page, id) {
  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await expandAllSceneGroups(page);
  await page.getByTestId(`scene-${id}`).getByRole('button', { name: /Activar capítulo/ }).click();
}

test.describe('Escenas del juego base', () => {
  test('el menú muestra solo las escenas del juego base', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await expandAllSceneGroups(page);
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
    await expandAllSceneGroups(page);
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

  test('Capítulo 12 conserva runas y añade la incursión de la Aparición Plañidera', async ({ page }) => {
    const seed = buildSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.companions = [{ uid: 'leal-12', id: 'tharmagar_leal', heroId: 'vorn', order: 0, vida: 5, vidaMax: 5, estadosAlterados: [], capacidades: [] }];
    seed.trackerData = JSON.stringify(tracker);
    await seedStorage(page, seed);
    await openTracker(page);
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      state.usedTiles = ['rojo', 'azul', 'verde', 'naranja', 'gris'].flatMap((color, colorIndex) => (
        [0, 1, 2].map((index) => ({ uuid: `c12-${colorIndex}-${index}`, runa: color }))
      ));
      state.runes = { rojo: 3, azul: 3, verde: 3, naranja: 3, gris: 3 };
      localStorage.setItem('gameState', JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');
    await activateScene(page, 'base_chapter12');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const saved = await readStorage(page, 'trackerData', {});
      const game = await readStorage(page, 'gameState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        companions: (saved.companions || []).length,
        trackRunes: (game.usedTiles || []).length,
        scenario: game.scenarioMonster?.id,
        enemies: (enemies.placedEnemies || []).map((entry) => entry.enemy.id),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza', 'incru1'],
      companions: 0,
      trackRunes: 15,
      scenario: 'shadow_cultist_scenario',
      enemies: ['dark_vampire_scenario', 'executioner_scenario1'],
    });
  });

  test('Capítulo 13 conserva runas y añade un Nodo de Niebla activo', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      state.usedTiles = ['rojo', 'azul', 'verde', 'naranja', 'gris'].flatMap((color, colorIndex) => (
        [0, 1, 2].map((index) => ({ uuid: `c13-${colorIndex}-${index}`, runa: color }))
      ));
      state.runes = { rojo: 3, azul: 3, verde: 3, naranja: 3, gris: 3 };
      localStorage.setItem('gameState', JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');
    await activateScene(page, 'base_chapter13');

    await expect.poll(async () => {
      const game = await readStorage(page, 'gameState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        trackRunes: (game.usedTiles || []).length,
        fogActive: (game.pilasConcentrada || []).some((pila) => pila.estado === 'activa'),
        enemies: (enemies.placedEnemies || []).map((entry) => entry.enemy.id),
      };
    }).toEqual({
      trackRunes: 15,
      fogActive: true,
      enemies: ['executioner_scenario1', 'shadow_knight_scenario'],
    });
  });

  test('una escena que pide Tharmagar Leal elimina al Resentido', async ({ page }) => {
    const seed = buildSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.companions = [{
      uid: 'tharmagar-resentido-test',
      id: 'tharmagar_resentido',
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
    await activateScene(page, 'base_chapter14');

    await expect.poll(async () => {
      const saved = await readStorage(page, 'trackerData', {});
      return (saved.companions || []).map((entry) => `${entry.id}:${entry.heroId}`);
    }).toEqual(['tharmagar_leal:vorn']);
  });

  test('una escena sin Tharmagar ni Janina los elimina sin quitar otros compañeros', async ({ page }) => {
    const seed = buildSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.companions = [
      { uid: 'leal-x', id: 'tharmagar_leal', heroId: 'vorn', order: 0, vida: 5, vidaMax: 5, estadosAlterados: [], capacidades: [] },
      { uid: 'janina-x', id: 'janina_desarmada', heroId: 'vorn', order: 1, vida: 5, vidaMax: 5, estadosAlterados: [], capacidades: [] },
      { uid: 'drumm-x', id: 'drumm', heroId: 'vorn', order: 2, vida: 1, vidaMax: 1, estadosAlterados: [], capacidades: [] },
    ];
    seed.trackerData = JSON.stringify(tracker);
    await seedStorage(page, seed);
    await openTracker(page);
    await activateScene(page, 'base_chapter1');

    await expect.poll(async () => {
      const saved = await readStorage(page, 'trackerData', {});
      return (saved.companions || []).map((entry) => entry.id);
    }).toEqual(['drumm']);
  });

  test('agrupa también las escenas de Despertar en su propio contenedor', async ({ page }) => {
    await seedStorage(page, buildSeed({
      mainBox: JSON.stringify('awakenings'),
      expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
    }));
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();

    const awakeningsGroup = page.getByTestId('scene-group-awakenings');
    await expect(awakeningsGroup).toBeVisible();
    await expect(page.getByTestId('scene-chapter1')).toHaveCount(0);
    await awakeningsGroup.getByRole('button').first().click();
    await expect(page.getByTestId('scene-chapter1')).toBeVisible();
  });

  test('agrupa las escenas por juego y expansión', async ({ page }) => {
    await seedStorage(page, buildSeed({
      expansions: JSON.stringify(['base', 'luccanor', 'dark_world']),
    }));
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();

    const baseGroup = page.getByTestId('scene-group-base');
    const luccanorGroup = page.getByTestId('scene-group-luccanor');
    const darkWorldGroup = page.getByTestId('scene-group-dark_world');
    await expect(baseGroup).toBeVisible();
    await expect(luccanorGroup).toBeVisible();
    await expect(darkWorldGroup).toBeVisible();

    await baseGroup.getByRole('button').first().click();
    await expect(page.getByTestId('scene-base_chapter1')).toBeVisible();
    await baseGroup.getByRole('button').first().click();
    await expect(page.getByTestId('scene-base_chapter1')).toHaveCount(0);
  });

  test('Capítulo 14 añade Tharmagar y sus enemigos', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter14');

    await expect.poll(async () => {
      const game = await readStorage(page, 'gameState', {});
      const saved = await readStorage(page, 'trackerData', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        trackRunes: (game.usedTiles || []).length,
        companion: (saved.companions || []).some((entry) => entry.id === 'tharmagar_leal'),
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
      };
    }).toEqual({
      trackRunes: 15,
      companion: true,
      enemies: ['negro:veterano', 'blanco:campeon'],
    });
  });

  test('Capítulo 15 añade Tharmagar, Janina, incursión, pilas y enemigos', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter15');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const game = await readStorage(page, 'gameState', {});
      const saved = await readStorage(page, 'trackerData', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        companions: (saved.companions || []).map((entry) => entry.id).sort(),
        trackRunes: (game.usedTiles || []).length,
        piles: (game.pilas || []).length,
        activePiles: (game.pilas || []).filter((pila) => pila.estado === 'activa').length,
        scenario: game.scenarioMonster?.id,
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza', 'incru1'],
      companions: ['janina', 'tharmagar_leal'],
      trackRunes: 10,
      piles: 4,
      activePiles: 0,
      scenario: 'dark_vampire',
      enemies: ['escenario:escenario', 'negro:veterano'],
    });
  });

  test('Capítulo 17 coloca incursión, tres pilas y enemigos campeones', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter17');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const game = await readStorage(page, 'gameState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        piles: (game.pilas || []).length,
        activePiles: (game.pilas || []).filter((pila) => pila.estado === 'activa').length,
        scenario: game.scenarioMonster?.id,
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza', 'incru1'],
      piles: 3,
      activePiles: 1,
      scenario: 'dark_vampire',
      enemies: ['blanco:campeon', 'gris:campeon'],
    });
  });

  test('Capítulo 18 coloca runas, pilas y el Encuentro Final', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter18');
    for (const label of [/Trauma/i, /Maldición/i]) {
      const prompt = page.getByRole('dialog').filter({ hasText: label });
      await expect(prompt).toBeVisible();
      await prompt.locator('input').fill('0');
      await prompt.getByRole('button', { name: 'Aceptar' }).click();
    }

    await expect.poll(async () => {
      const game = await readStorage(page, 'gameState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        trackRunes: (game.usedTiles || []).length,
        piles: (game.pilas || []).length,
        activePiles: (game.pilas || []).filter((pila) => pila.estado === 'activa').length,
        boss: (enemies.placedEnemies || []).some((entry) => entry.enemy.id === 'undead_king_boss_2'),
      };
    }).toEqual({
      trackRunes: 10,
      piles: 4,
      activePiles: 0,
      boss: true,
    });
  });

  test('Capítulo 16 coloca la Oscuridad de Caza especial cara B', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter16');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const game = await readStorage(page, 'gameState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => `${entry.rune.id}:${entry.rune.cara}`),
        trackRunes: (game.usedTiles || []).length,
      };
    }).toEqual({
      cards: ['runa2:B'],
      trackRunes: 10,
    });
  });

  test('Capítulo 11 conserva runas, limpia estados y añade Acecho y apariciones', async ({ page }) => {
    const seed = buildSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.companions = [{ uid: 'leal-11', id: 'tharmagar_leal', heroId: 'vorn', order: 0, vida: 5, vidaMax: 5, estadosAlterados: [], capacidades: [] }];
    seed.trackerData = JSON.stringify(tracker);
    await seedStorage(page, {
      ...seed,
      initEnemiesState: buildEnemyState(),
      heroExtras: buildHeroExtras({
        vida: 7,
        trauma: 2,
        maldicion: 1,
        estadosAlterados: [{ id: 'ESCUDO', count: 2 }, { id: 'VENENO_I', count: 1 }],
      }),
    });
    await openTracker(page);
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      state.usedTiles = ['rojo', 'azul', 'verde', 'naranja', 'gris'].flatMap((color, colorIndex) => (
        [0, 1, 2].map((index) => ({ uuid: `prev-${colorIndex}-${index}`, runa: color }))
      ));
      state.runes = { rojo: 3, azul: 3, verde: 3, naranja: 3, gris: 3 };
      localStorage.setItem('gameState', JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');
    await activateScene(page, 'base_chapter11');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const game = await readStorage(page, 'gameState', {});
      const saved = await readStorage(page, 'trackerData', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        companions: (saved.companions || []).length,
        trackRunes: (game.usedTiles || []).length,
        fogActive: (game.pilasConcentrada || []).some((pila) => pila.estado === 'activa'),
        enemyIds: (enemies.placedEnemies || []).map((entry) => entry.enemy.id),
        acecho: enemies.acechoActivo,
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza'],
      companions: 0,
      trackRunes: 15,
      fogActive: true,
      enemyIds: ['undead_king_boss_Acecho_1', 'dark_vampire_scenario'],
      acecho: true,
    });

    const extras = await readStorage(page, 'heroExtras', {});
    await expect.poll(async () => (await readStorage(page, 'heroExtras', {})).vorn.estadosAlterados)
      .toEqual([{ id: 'ESCUDO', count: 2 }]);
    expect(extras.vorn.trauma).toBe(2);
    expect(extras.vorn.maldicion).toBe(1);
  });

  test('Capítulo 10 elimina los compañeros y coloca 3 runas por color', async ({ page }) => {
    const seed = buildSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.companions = [
      { uid: 'leal-10', id: 'tharmagar_leal', heroId: 'vorn', order: 0, vida: 5, vidaMax: 5, estadosAlterados: [], capacidades: [] },
      { uid: 'pets-10', id: 'drumm', heroId: 'vorn', order: 1, vida: 1, vidaMax: 1, estadosAlterados: [], capacidades: [] },
    ];
    seed.trackerData = JSON.stringify(tracker);
    await seedStorage(page, seed);
    await openTracker(page);
    await activateScene(page, 'base_chapter10');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const game = await readStorage(page, 'gameState', {});
      const saved = await readStorage(page, 'trackerData', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        companions: (saved.companions || []).length,
        trackRunes: (game.usedTiles || []).length,
        runes: game.runes,
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza'],
      companions: 0,
      trackRunes: 15,
      runes: { rojo: 3, azul: 3, verde: 3, naranja: 3, gris: 3 },
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
        available: (game.availableTiles || []).length,
        runes: game.runes,
        spawnPoints: (game.spawnPoints || []).length,
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza', 'defen1'],
      time: 2,
      trackRunes: 20,
      available: 11,
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

  test('Capítulo 4 coloca incursión, una runa por color y cuatro pilas', async ({ page }) => {
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
      piles: 4,
      activePiles: 1,
      scenario: 'dark_vampire',
      trackRunes: 5,
      runes: { rojo: 1, azul: 1, verde: 1, naranja: 1, gris: 1 },
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
