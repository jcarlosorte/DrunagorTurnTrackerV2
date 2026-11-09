import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const awakeningsSeed = () => buildSeed({
  mainBox: JSON.stringify('awakenings'),
  expansions: JSON.stringify(['apocalypse_awakenings']),
});

test.describe('Escenas', () => {
  test('Capítulo 4 activa todas las mecánicas de la escena', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.getByTestId('scene-chapter4').getByRole('button', { name: /Activar capítulo/ }).click();

    const followerDialog = page.getByRole('dialog', { name: 'Seguidores de la escena' });
    await expect(followerDialog).toBeVisible();
    await followerDialog.getByRole('button', { name: 'Añadir seguidores' }).click();
    await expect(page.getByText('Cañones Terroríficos')).toBeVisible();

    await expect.poll(async () => page.evaluate(() => {
      const runes = JSON.parse(localStorage.getItem('initRunesState') || '{}');
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      const tracker = JSON.parse(localStorage.getItem('trackerData') || '{}');
      return {
        runeIds: (runes.placedRunes || []).map((entry) => entry.rune.id),
        generation: (game.generationPoints || []).length,
        cannons: (game.magicCannons || []).map((cannon) => cannon.loaded),
        corrupt: game.corruptShipEvent?.active,
        swan: game.swanShipEvent?.active,
        followers: (tracker.followers || []).map((entry) => entry.id),
      };
    })).toEqual({
      runeIds: ['runa_despertar_naval', 'incursion_despertar_naval'],
      generation: 4,
      cannons: [false, false, false, false],
      corrupt: true,
      swan: true,
      followers: ['vorn_guerrero', 'elros_asesino'],
    });
  });

  test('Eventos y Escenas solo aparecen en Despertar', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await expect(page.getByRole('button', { name: 'Eventos', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Escenas', exact: true })).toHaveCount(0);
  });

  test('Visión Clara se retira al atravesar Gris Abajo aunque esté vacío', async ({ page }) => {
    await seedStorage(page, {
      ...awakeningsSeed(),
      gameState: JSON.stringify({ visionClaraActive: true }),
    });
    await openTracker(page);

    for (let i = 0; i < 10; i += 1) {
      await page.getByTestId('next-turn').click();
      await page.waitForTimeout(50);
    }

    await expect.poll(async () => page.evaluate(() => {
      const game = JSON.parse(localStorage.getItem('gameState') || '{}');
      return game.visionClaraActive;
    })).toBe(false);
  });
});
