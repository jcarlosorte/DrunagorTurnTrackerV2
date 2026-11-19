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
