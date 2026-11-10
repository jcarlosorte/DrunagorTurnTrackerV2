import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test('el menú de Nodos permite añadir la Ficha de Generación azul', async ({ page }) => {
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('awakenings'),
    expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
  }));
  await openTracker(page);

  await page.getByRole('button', { name: 'Nodos', exact: true }).click();
  await page.getByRole('button', { name: '+ Azul', exact: true }).click();

  await expect.poll(async () => page.evaluate(() => {
    const game = JSON.parse(localStorage.getItem('gameState') || '{}');
    return (game.generationPoints || []).filter((point) => point.color === 'azul').length;
  })).toBe(1);
});
