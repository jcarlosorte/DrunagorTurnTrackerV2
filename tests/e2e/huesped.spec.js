import { expect, test } from '@playwright/test';
import { buildEnemyState, buildSeed, openTracker, readStorage, seedStorage } from './helpers';

test('Monstruo Huésped roba una runa al derrotar un enemigo', async ({ page }) => {
  const enemyState = JSON.parse(buildEnemyState());
  await seedStorage(page, {
    ...buildSeed(),
    initEnemiesState: JSON.stringify(enemyState),
  });
  await openTracker(page);

  await page.getByRole('button', { name: 'Eventos', exact: true }).click();
  await page.getByRole('button', { name: 'Activar Monstruo Huésped' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Monstruo Huésped' })).toBeVisible();

  await page.getByRole('button', { name: 'Arquero Esqueleto', exact: true }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Eliminar' }).click();

  await expect.poll(async () => {
    const game = await readStorage(page, 'gameState', {});
    return {
      usedTiles: (game.usedTiles || []).length,
      runes: Object.values(game.runes || {}).reduce((total, count) => total + (Number(count) || 0), 0),
    };
  }).toEqual({ usedTiles: 1, runes: 1 });
});
