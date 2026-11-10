import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const awakeningsSeed = () => buildSeed({
  mainBox: JSON.stringify('awakenings'),
  expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
});

test('Asedio de Limiternia se coloca al final y roba sus cartas en orden', async ({ page }) => {
  await seedStorage(page, awakeningsSeed());
  await openTracker(page);

  await page.getByRole('button', { name: 'Eventos', exact: true }).click();
  await page.getByRole('button', { name: /Añadir Asedio de Limiternia/ }).click();

  await expect.poll(async () => page.evaluate(() => {
    const game = JSON.parse(localStorage.getItem('gameState') || '{}');
    return {
      active: game.siegeEvent?.active,
      size: game.siegeEvent?.deck?.length,
    };
  })).toEqual({ active: true, size: 10 });

  await expect(page.getByText('Asedio de Limiternia').last()).toBeVisible();
  await page.getByTestId('close-menu').click();

  for (let index = 0; index < 24; index += 1) {
    if (await page.getByRole('dialog').count() > 0) break;
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(450);
  }

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('ASEDIO DE INCURSIÓN DE MONSTRUOS');
  await dialog.getByRole('button', { name: /Resolver asedio/ }).click();

  await expect.poll(async () => page.evaluate(() => {
    const game = JSON.parse(localStorage.getItem('gameState') || '{}');
    return {
      size: game.siegeEvent?.deck?.length,
      current: game.siegeEvent?.current,
    };
  })).toEqual({ size: 9, current: 1 });
});
