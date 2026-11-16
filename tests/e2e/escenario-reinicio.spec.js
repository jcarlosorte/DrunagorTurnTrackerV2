import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, readStorage, seedStorage } from './helpers';

test('la zona de riesgo del escenario quita el monstruo y sus cartas', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);
  await page.getByRole('button', { name: 'Escenario', exact: true }).click();

  await page.getByRole('button', { name: 'Vástago de Vampiro Sombrío', exact: true }).click();
  await page.getByRole('button', { name: 'Añadir Carta de Escenario (Cara A)' }).click();
  await page.getByRole('button', { name: 'Añadir Carta de Escenario (Con marcador de tiempo)' }).click();

  await expect(page.getByTestId('scenario-reset')).toBeEnabled();
  await page.getByTestId('scenario-reset').click();
  const confirm = page.getByRole('dialog', { name: 'Reiniciar escenario' });
  await expect(confirm).toBeVisible();
  await confirm.getByRole('button', { name: 'Reiniciar', exact: true }).click();

  await expect.poll(async () => {
    const game = await readStorage(page, 'gameState', {});
    const runes = await readStorage(page, 'initRunesState', {});
    return {
      monster: game.scenarioMonster?.id || null,
      cards: (runes.placedRunes || []).filter((entry) => ['incursion', 'defensa'].includes(entry.rune?.tipo)).length,
    };
  }).toEqual({ monster: null, cards: 0 });
});
