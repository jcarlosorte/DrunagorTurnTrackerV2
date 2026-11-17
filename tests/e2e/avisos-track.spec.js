import { expect, test } from '@playwright/test';
import { buildEnemyState, buildSeed, openTracker, seedStorage } from './helpers';

test('Ocuridad Eterna solo aparece en el juego base', async ({ page }) => {
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('awakenings'),
    expansions: JSON.stringify(['base', 'dark_world', 'apocalypse_awakenings']),
  }));
  await openTracker(page);
  await page.getByRole('button', { name: 'Eventos', exact: true }).click();
  await expect(page.getByTestId('eternal-darkness-toggle')).toHaveCount(0);
});

test('las mecánicas del juego base no muestran avisos en Despertar', async ({ page }) => {
  const enemyState = JSON.parse(buildEnemyState());
  enemyState.huespedActivo = true;
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('awakenings'),
    expansions: JSON.stringify(['base', 'dark_world', 'apocalypse_awakenings']),
  }));
  await openTracker(page);
  await page.evaluate((state) => {
    localStorage.setItem('initEnemiesState', JSON.stringify(state));
    const game = JSON.parse(localStorage.getItem('gameState') || '{}');
    game.eternalDarknessActive = true;
    localStorage.setItem('gameState', JSON.stringify(game));
  }, enemyState);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.track-slot');

  await expect(page.getByRole('status').filter({ hasText: 'Ocuridad Eterna' })).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: 'Monstruo Huésped' })).toHaveCount(0);
});

test('los avisos activos se muestran apilados encima del track', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);

  await page.getByRole('button', { name: 'Runas', exact: true }).click();
  await page.getByRole('button', { name: 'Activa Invadidos' }).click();
  await page.getByRole('button', { name: 'Runas', exact: true }).click();

  const notice = page.getByRole('status').filter({ hasText: 'Invadidos' });
  await expect(notice).toBeVisible();
  const box = await notice.boundingBox();
  expect(box.y).toBeGreaterThan(60);
});
