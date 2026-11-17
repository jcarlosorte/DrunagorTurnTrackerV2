import { expect, test } from '@playwright/test';
import { buildEnemyState, buildSeed, expandAllSceneGroups, openTracker, readStorage, seedStorage } from './helpers';

const darkWorldSeed = () => buildSeed({
  mainBox: JSON.stringify('core'),
  expansions: JSON.stringify(['base', 'dark_world']),
});

async function activateScene(page, id) {
  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await expandAllSceneGroups(page);
  await page.getByTestId(`scene-${id}`).getByRole('button', { name: /Activar capítulo/ }).click();
}

test.describe('Escenas de El Mundo Sombrío', () => {
  test('solo aparecen si la expansión está activa', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await expect(page.getByTestId('scene-darkworld_chapter1')).toHaveCount(0);
  });

  test('Capítulo 1 activa Ocuridad Eterna y añade +2 al ataque', async ({ page }) => {
    await seedStorage(page, darkWorldSeed());
    await openTracker(page);
    await activateScene(page, 'darkworld_chapter1');

    await expect(page.getByRole('status').filter({ hasText: 'Ocuridad Eterna' })).toBeVisible();
    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      const game = await readStorage(page, 'gameState', {});
      return {
        eternal: game.eternalDarknessActive,
        enemies: (enemies.placedEnemies || []).map((entry) => ({
          type: `${entry.enemy.color}:${entry.enemy.categoria}`,
          bonus: entry.enemy.ataqueOscuridad,
        })),
      };
    }).toEqual({
      eternal: true,
      enemies: [
        { type: 'gris:soldado', bonus: 2 },
        { type: 'blanco:soldado', bonus: 2 },
      ],
    });
  });

  test('el evento 1b reinicia como una escena normal', async ({ page }) => {
    await seedStorage(page, {
      ...darkWorldSeed(),
      initEnemiesState: buildEnemyState(),
    });
    await openTracker(page);
    await activateScene(page, 'darkworld_chapter1b');

    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`);
    }).toEqual(['gris:soldado', 'negro:veterano']);
  });

  test('Capítulo 2 activa Ocuridad Eterna y coloca sus enemigos', async ({ page }) => {
    await seedStorage(page, darkWorldSeed());
    await openTracker(page);
    await activateScene(page, 'darkworld_chapter2');

    await expect(page.getByRole('status').filter({ hasText: 'Ocuridad Eterna' })).toBeVisible();
    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`);
    }).toEqual(['gris:veterano']);
  });
});
