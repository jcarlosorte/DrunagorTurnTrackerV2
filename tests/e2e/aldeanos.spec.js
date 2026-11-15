import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Aldeanos en apuros', () => {
  test('gestiona firmeza, rescates y fin de aventura', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      state.aldeanos = [
        { uuid: 'ald-1', cardId: 'aldeano_2', color: 'azul', vida: 4, vidaMax: 4 },
        { uuid: 'ald-2', cardId: 'aldeano_3', color: 'naranja', vida: 4, vidaMax: 4 },
        { uuid: 'ald-3', cardId: 'aldeano_5', color: 'rojo', vida: 4, vidaMax: 4 },
      ];
      state.aldeanosRescatados = 0;
      localStorage.setItem('gameState', JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');

    const panel = page.getByTestId('villagers-panel');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Aldeanos rescatados 0/3');

    await panel.getByRole('button', { name: /-1/ }).first().click();
    await expect.poll(async () => page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      return state.aldeanos?.[0]?.vida;
    })).toBe(3);

    while (await panel.getByRole('button', { name: /Rescatar/ }).count() > 0) {
      await panel.getByRole('button', { name: /Rescatar/ }).first().click();
    }

    await expect(panel.getByRole('alert')).toContainText('Fin de la aventura: Un nuevo amanecer');
    await expect(panel).toContainText('Aldeanos rescatados 3/3');
  });
});
