import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const awakeningsSeed = () => buildSeed({
  mainBox: JSON.stringify('awakenings'),
  expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
});

test.describe('Escenas de Despertar', () => {
  test('Capítulo 1 coloca 4 runas de cada color y su enemigo', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter1').getByRole('button', { name: /Activar capítulo/ }).click();

    await expect.poll(async () => page.evaluate(() => {
      const runes = JSON.parse(localStorage.getItem('initRunesState') || '{}');
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemies = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      const log = JSON.parse(localStorage.getItem('gameLog') || '[]');
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        used: (game.usedTiles || []).length,
        enemies: (enemies.placedEnemies || []).length,
        summons: log.filter((entry) => entry.kind === 'summon').map((entry) => entry.badge?.label),
      };
    })).toEqual({
      cards: ['runa_despertar_influencia'],
      used: 20,
      enemies: 1,
      summons: ['G1'],
    });
  });

  test('Capítulo 2 coloca runas, nodos, incursión y enemigos en orden', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter2').getByRole('button', { name: /Activar capítulo/ }).click();

    await expect.poll(async () => page.evaluate(() => {
      const runes = JSON.parse(localStorage.getItem('initRunesState') || '{}');
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemies = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      const log = JSON.parse(localStorage.getItem('gameLog') || '[]');
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        used: (game.usedTiles || []).length,
        runeCounts: game.runes,
        nodes: (game.nodosOscuridad || []).filter((node) => node.estado === 'activa').length,
        monster: game.scenarioMonster?.id,
        erraden: game.erradenEvent?.active,
        enemies: (enemies.placedEnemies || []).length,
        summons: log.filter((entry) => entry.kind === 'summon').map((entry) => entry.badge?.label),
      };
    })).toEqual({
      cards: ['runa_despertar_influencia', 'incursion_despertar_atroz'],
      used: 10,
      runeCounts: { naranja: 2, verde: 2, azul: 2, rojo: 2, gris: 2 },
      nodes: 4,
      monster: 'nightmare',
      erraden: true,
      enemies: 2,
      summons: ['G1', 'B2'],
    });
  });

  test('Capítulo 3 añade Influencia Creciente con 3 fichas de tiempo y 1 Nodo activo', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter3').getByRole('button', { name: /Activar capítulo/ }).click();

    await expect.poll(async () => page.evaluate(() => {
      const runes = JSON.parse(localStorage.getItem('initRunesState') || '{}');
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemiesState = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      const log = JSON.parse(localStorage.getItem('gameLog') || '[]');
      const rune = (runes.placedRunes || []).find((entry) => entry.rune.id === 'runa_despertar_influencia');
      return {
        time: rune?.rune?.estadosAlterados?.find((state) => state.id === 'TIEMPO')?.count,
        used: (game.usedTiles || []).length,
        nodes: (game.nodosOscuridad || []).filter((node) => node.estado === 'activa').length,
        enemies: (enemiesState.placedEnemies || []).length,
        summons: log.filter((entry) => entry.kind === 'summon').map((entry) => entry.badge?.label),
      };
    })).toEqual({
      time: 3,
      used: 25,
      nodes: 1,
      enemies: 1,
      summons: ['N1'],
    });
  });

  test('Capítulo 4 añade runas al track y sus enemigos', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter4').getByRole('button', { name: /Activar capítulo/ }).click();
    const followerDialog = page.getByRole('dialog', { name: 'Seguidores de la escena' });
    await followerDialog.getByRole('button', { name: 'Añadir seguidores' }).click();

    await expect.poll(async () => page.evaluate(() => {
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemiesState = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      const log = JSON.parse(localStorage.getItem('gameLog') || '[]');
      const rings = Object.values(enemiesState.enemyColorMap || {});
      return {
        used: (game.usedTiles || []).length,
        enemies: (enemiesState.placedEnemies || []).length,
        summons: log.filter((entry) => entry.kind === 'summon').map((entry) => entry.badge?.label),
        uniqueRings: new Set(rings).size,
      };
    })).toEqual({
      used: 25,
      enemies: 3,
      summons: ['G1', 'G2', 'B3'],
      uniqueRings: 3,
    });
  });

  test('Capítulo 5 coloca el Jabalí sin historial y añade sus enemigos', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter5').getByRole('button', { name: /Activar capítulo/ }).click();

    await expect.poll(async () => page.evaluate(() => {
      const runes = JSON.parse(localStorage.getItem('initRunesState') || '{}');
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemiesState = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      const log = JSON.parse(localStorage.getItem('gameLog') || '[]');
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        used: (game.usedTiles || []).length,
        nodes: (game.nodosOscuridad || []).filter((node) => node.estado === 'activa').length,
        monster: game.scenarioMonster?.id,
        boar: (enemiesState.placedEnemies || []).filter((entry) => entry.enemy.id === 'flickering_boar').length,
        enemies: (enemiesState.placedEnemies || []).length,
        boarDeck: game.flickeringBoarDeck?.active,
        summons: log.filter((entry) => entry.kind === 'summon').map((entry) => entry.badge?.label),
      };
    })).toEqual({
      cards: ['runa_despertar_influencia', 'incursion_despertar_atroz'],
      used: 15,
      nodes: 3,
      monster: 'tide_hunter',
      boar: 1,
      enemies: 4,
      boarDeck: true,
      summons: ['B1', 'B2', 'G3'],
    });
  });

  test('Capítulo 6 coloca 5 runas de cada color y sus enemigos', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter6').getByRole('button', { name: /Activar capítulo/ }).click();

    await expect.poll(async () => page.evaluate(() => {
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemiesState = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      const log = JSON.parse(localStorage.getItem('gameLog') || '[]');
      return {
        cards: (JSON.parse(localStorage.getItem('initRunesState') || '{}').placedRunes || []).map((entry) => entry.rune.id),
        used: (game.usedTiles || []).length,
        enemies: (enemiesState.placedEnemies || []).length,
        summons: log.filter((entry) => entry.kind === 'summon').map((entry) => entry.badge?.label),
        cannons: (game.magicCannons || []).length,
      };
    })).toEqual({
      cards: ['runa_despertar_influencia'],
      used: 25,
      enemies: 2,
      summons: ['B1', 'G2'],
      cannons: 0,
    });
  });

  test('Capítulo 7 añade Asedio, generación, seguidores y enemigos', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter7').getByRole('button', { name: /Activar capítulo/ }).click();

    const picker = page.getByRole('dialog', { name: 'Elegir seguidores' });
    await expect(picker).toBeVisible();
    for (const name of ['Elros', 'Lorelai', 'Maya', 'Vorn']) {
      await picker.getByRole('button', { name: new RegExp(name) }).click();
    }
    await picker.getByRole('button', { name: 'Añadir seguidores' }).click();

    await expect.poll(async () => page.evaluate(() => {
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemiesState = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      const tracker = JSON.parse(localStorage.getItem('trackerData') || '{}');
      return {
        siege: game.siegeEvent?.active,
        generation: (game.generationPoints || []).length,
        enemies: (enemiesState.placedEnemies || []).length,
        followers: (tracker.followers || []).map((entry) => entry.id).sort(),
      };
    })).toEqual({
      siege: true,
      generation: 5,
      enemies: 3,
      followers: ['elros_asesino', 'lorelai_maga', 'maya_montaraz', 'vorn_guerrero'],
    });
  });

  test('Capítulo 8 coloca Influencia Creciente y enemigos campeones', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter8').getByRole('button', { name: /Activar capítulo/ }).click();

    await expect.poll(async () => page.evaluate(() => {
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemiesState = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      return {
        cards: (JSON.parse(localStorage.getItem('initRunesState') || '{}').placedRunes || []).map((entry) => entry.rune.id),
        used: (game.usedTiles || []).length,
        enemies: (enemiesState.placedEnemies || []).length,
      };
    })).toEqual({
      cards: ['runa_despertar_influencia'],
      used: 25,
      enemies: 1,
    });
  });

  test('Capítulo 8b prepara el enfrentamiento final', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter8b').getByRole('button', { name: /Activar capítulo/ }).click();

    await expect.poll(async () => page.evaluate(() => {
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemiesState = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      const runesState = JSON.parse(localStorage.getItem('initRunesState') || '{}');
      return {
        cards: (runesState.placedRunes || []).map((entry) => entry.rune.id).sort(),
        nodes: (game.nodosOscuridad || []).filter((nodo) => nodo.estado === 'activa').length,
        nodeTiles: (game.nodosOscuridad || []).reduce((total, nodo) => total + (nodo.tiles?.length || 0), 0),
        cannons: (game.magicCannons || []).filter((cannon) => cannon.loaded).map((cannon) => cannon.color).sort(),
        enemies: (enemiesState.placedEnemies || []).filter((entry) => entry.enemy.tipo !== 'especial').length,
      };
    })).toEqual({
      cards: ['incursion_despertar_atroz', 'runa_despertar_furia'],
      nodes: 2,
      nodeTiles: 10,
      cannons: ['naranja', 'verde'],
      enemies: 3,
    });
  });

  test('Capítulo 9 prepara La Resistencia', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter9').getByRole('button', { name: /Activar capítulo/ }).click();

    await expect.poll(async () => page.evaluate(() => {
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const enemiesState = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      const runesState = JSON.parse(localStorage.getItem('initRunesState') || '{}');
      return {
        cards: (runesState.placedRunes || []).map((entry) => entry.rune.id).sort(),
        generation: (game.generationPoints || []).map((point) => point.color).sort(),
        used: (game.usedTiles || []).length,
        enemies: (enemiesState.placedEnemies || []).filter((entry) => entry.enemy.tipo !== 'especial').length,
      };
    })).toEqual({
      cards: ['runa_despertar_oscuridad'],
      generation: ['gris', 'naranja', 'rojo', 'verde'],
      used: 30,
      enemies: 3,
    });
  });

  test('la vista simplificada solo compacta a los enemigos normales', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter9').getByRole('button', { name: /Activar capítulo/ }).click();
    const normalHeight = await page.locator('.track-slot').first().evaluate((element) => element.getBoundingClientRect().height);
    await page.getByTestId('simplified-toggle').click();

    await expect(page.locator('[data-simplified-enemy="true"]')).toHaveCount(2);
    const simplifiedHeight = await page.locator('.track-slot').first().evaluate((element) => element.getBoundingClientRect().height);
    expect(simplifiedHeight).toBeLessThan(normalHeight);
    await expect(page.getByText('Vorn', { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/la oscuridad se extiende/i).first()).toBeVisible();
    await expect(page.getByTestId('simplified-toggle')).toHaveAttribute('title', 'Vista normal');
  });
});
