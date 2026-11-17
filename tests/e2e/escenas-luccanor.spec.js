import { expect, test } from '@playwright/test';
import { buildEnemyState, buildSeed, expandAllSceneGroups, openTracker, readStorage, seedStorage } from './helpers';

const luccanorSeed = () => buildSeed({
  mainBox: JSON.stringify('core'),
  expansions: JSON.stringify(['base', 'luccanor']),
});

async function activateScene(page, id) {
  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await expandAllSceneGroups(page);
  await page.getByTestId(`scene-${id}`).getByRole('button', { name: /Activar capítulo/ }).click();
}

test.describe('Escenas de La Ruina de Luccanor', () => {
  test('solo aparecen cuando la expansión está activa', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await expect(page.getByTestId('scene-luccanor_chapter1')).toHaveCount(0);
  });

  test('Capítulo 1 coloca Dama Marina y Expoliador', async ({ page }) => {
    await seedStorage(page, luccanorSeed());
    await openTracker(page);
    await activateScene(page, 'luccanor_chapter1');

    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`);
    }).toEqual(['gris:bisoño', 'blanco:bisoño']);
  });

  test('Capítulo 2 conserva las runas y limpia el resto', async ({ page }) => {
    await seedStorage(page, {
      ...luccanorSeed(),
      initEnemiesState: buildEnemyState(),
    });
    await openTracker(page);
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      state.usedTiles = ['rojo', 'azul', 'verde', 'naranja', 'gris'].flatMap((color, colorIndex) => (
        [0, 1, 2].map((index) => ({ uuid: `lucc-${colorIndex}-${index}`, runa: color }))
      ));
      state.runes = { rojo: 3, azul: 3, verde: 3, naranja: 3, gris: 3 };
      state.pilas = [{ id: 'old-pile', tiles: [], estado: 'activa', numPila: 1 }];
      localStorage.setItem('gameState', JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');
    await activateScene(page, 'luccanor_chapter2');

    await expect.poll(async () => {
      const game = await readStorage(page, 'gameState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        trackRunes: (game.usedTiles || []).length,
        oldPiles: (game.pilas || []).length,
        enemies: (enemies.placedEnemies || []).map((entry) => entry.enemy.id),
      };
    }).toEqual({
      trackRunes: 15,
      oldPiles: 0,
      enemies: ['shadow_cultist', expect.stringMatching(/abomination|skeleton|shadow_knight/)],
    });
  });

  test('Capítulo 2c pregunta por Ruido y añade al Comandante con PC 1', async ({ page }) => {
    await seedStorage(page, luccanorSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await expandAllSceneGroups(page);
    await page.getByTestId('scene-luccanor_chapter2c').getByRole('button', { name: /Activar capítulo/ }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Ruido' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Sí' }).click();

    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      const session = await readStorage(page, 'trackerSession', {});
      const commander = (enemies.placedEnemies || []).find((entry) => entry.enemy.id === 'luccanor_com');
      return {
        commander: Boolean(commander),
        life: commander?.enemy.vidaMax,
        hasShadowCultist: (enemies.placedEnemies || []).some((entry) => entry.enemy.id === 'shadow_cultist'),
        extraTurns: (session.extraTurnsQueue || []).length,
      };
    }).toEqual({ commander: true, life: 14, hasShadowCultist: true, extraTurns: 1 });
  });
});
