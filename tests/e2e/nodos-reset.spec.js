import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const awakeningsSeed = () => buildSeed({
  mainBox: JSON.stringify('awakenings'),
  expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
});

test('el menú Nodos reinicia todas sus mecánicas', async ({ page }) => {
  await seedStorage(page, awakeningsSeed());
  await openTracker(page);

  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await page.getByTestId('scene-chapter2').getByRole('button', { name: /Activar capítulo/ }).click();
  await page.getByRole('button', { name: 'Nodos', exact: true }).click();

  await page.getByRole('button', { name: /Resetear mecánicas/ }).first().click();
  const confirm = page.getByRole('dialog');
  await expect(confirm).toBeVisible();
  await confirm.getByRole('button', { name: 'Resetear', exact: true }).click();

  await expect.poll(async () => page.evaluate(() => {
    const game = JSON.parse(localStorage.getItem('gameState') || '{}');
    return {
      nodes: (game.nodosOscuridad || []).length,
      piles: (game.pilasConcentrada || []).length,
      generation: (game.generationPoints || []).length,
      cannons: (game.magicCannons || []).length,
    };
  })).toEqual({ nodes: 0, piles: 0, generation: 0, cannons: 0 });
});
