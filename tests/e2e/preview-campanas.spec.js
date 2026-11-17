import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test('ver contenido de otras cajas muestra las escenas y cartas de Despertar desde el juego base', async ({ page }) => {
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('core'),
    expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
  }));
  await openTracker(page);

  await page.getByRole('button', { name: 'Menú de juego' }).click();
  await page.getByRole('menuitem', { name: /Ver contenido de otras campañas/ }).click();

  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await expect(page.getByTestId('scene-group-awakenings')).toBeVisible();
  await page.getByRole('button', { name: 'Escenas', exact: true }).click();

  await page.getByRole('button', { name: 'Runas', exact: true }).click();
  const awakeningRune = page.locator('[data-testid^="despertar-rune-"]').first();
  await expect(awakeningRune).toBeVisible();
  await expect(awakeningRune).toHaveClass(/bg-slate-950/);
  await expect(awakeningRune.locator('svg').first()).toBeVisible();
  await page.getByRole('button', { name: 'Runas', exact: true }).click();

  await page.getByRole('button', { name: 'Menú de juego' }).click();
  await page.getByRole('menuitem', { name: /Ocultar contenido de otras campañas/ }).click();
  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await expect(page.getByTestId('scene-group-awakenings')).toHaveCount(0);
});
