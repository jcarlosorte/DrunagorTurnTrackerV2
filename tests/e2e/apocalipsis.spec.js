import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test('Apocalipsis está activo y usa el nombre alternativo al invocar', async ({ page }) => {
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('apocalypse'),
    expansions: JSON.stringify(['base', 'apocalypse_adventures']),
  }));
  await openTracker(page);

  await page.getByRole('button', { name: 'Enemigos', exact: true }).first().click();
  await page.getByTestId('manual-enemies').getByRole('button', { name: 'MN (Negro)' }).click();

  const dialog = page.getByRole('dialog', { name: 'Seleccionar enemigo manualmente' });
  await dialog.getByRole('searchbox').fill('titán');
  await expect(dialog.getByText('Titán Onírico', { exact: true }).first()).toBeVisible();

  const behavior = dialog.getByRole('combobox', { name: 'Comportamiento' }).first();
  await expect(behavior).toContainText('Absorbejuicios');
  await behavior.selectOption('alternativo');
  await dialog.getByRole('button', { name: 'Añadir', exact: true }).first().click();

  await page.getByTestId('close-menu').click();
  await expect(page.locator('[data-enemy-card]').filter({ hasText: 'Absorbejuicios' })).toBeVisible();
  await expect(page.locator('[data-enemy-card]').filter({ hasText: 'Titán Onírico' })).toHaveCount(0);
});

test('Apocalipsis reutiliza Oscuridad de Caza, Nodos de Oscuridad e Incursión Atroz', async ({ page }) => {
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('apocalypse'),
    expansions: JSON.stringify(['base', 'apocalypse_adventures']),
  }));
  await openTracker(page);

  await page.getByRole('button', { name: 'Runas', exact: true }).click();
  const runes = page.locator('#track-menu-runes');
  await expect(runes.getByTestId('hunting-darkness-card')).toBeVisible();
  await expect(runes.getByTestId('despertar-rune-runa_despertar_influencia')).toHaveCount(0);

  await page.getByTestId('close-menu').click();
  await page.getByRole('button', { name: 'Nodos', exact: true }).click();
  const nodes = page.locator('#track-menu-nodes');
  await expect(nodes.getByText('Nodos de Oscuridad', { exact: true }).first()).toBeVisible();
  await expect(nodes.getByText('Fichas de Generación')).toHaveCount(0);

  await page.getByTestId('close-menu').click();
  await page.getByRole('button', { name: 'Escenario', exact: true }).click();
  const scenario = page.locator('#track-menu-scenario');
  await expect(scenario.getByTestId('despertar-incursion-incursion_despertar_atroz')).toBeVisible();
  await expect(scenario.getByTestId('despertar-incursion-incursion_despertar_incansable')).toHaveCount(0);
  await expect(scenario.getByTestId('despertar-incursion-incursion_despertar_naval')).toHaveCount(0);
});
