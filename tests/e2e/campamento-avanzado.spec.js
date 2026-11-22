import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

async function openCamp(page) {
  await page.getByRole('button', { name: 'Menú de juego' }).click();
  await page.getByRole('menuitem', { name: 'Campamento', exact: true }).click();
  return page.getByRole('dialog', { name: 'Campamento del grupo' });
}

test('el campamento guarda nombre del grupo, efectos manuales y estado de runas', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);

  let camp = await openCamp(page);
  await camp.getByLabel('Nombre del grupo').fill('Los Buscadores');
  await expect(camp.getByTestId('camp-rune-azul')).toBeVisible();

  const consequenceInput = camp.getByRole('textbox', { name: /Consecuencias: Escribir manualmente/ });
  await consequenceInput.fill('Marca de la campaña');
  await consequenceInput.locator('..').getByRole('button', { name: 'Añadir', exact: true }).click();
  await expect(camp.getByText('Marca de la campaña')).toBeVisible();

  const stateInput = camp.getByRole('textbox', { name: /Estados: Escribir manualmente/ });
  await stateInput.fill('Estado de prueba');
  await stateInput.locator('..').getByRole('button', { name: 'Añadir', exact: true }).click();
  await expect(camp.getByText('Estado de prueba')).toBeVisible();

  await expect(camp.getByText('Seguidores del campamento')).toHaveCount(0);

  await camp.getByRole('button', { name: 'Cerrar', exact: true }).last().click();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.track-slot');
  camp = await openCamp(page);
  await expect(camp.getByLabel('Nombre del grupo')).toHaveValue('Los Buscadores');
  await expect(camp.getByText('Marca de la campaña')).toBeVisible();
  await expect(camp.getByText('Estado de prueba')).toBeVisible();
});

test('el nombre del grupo se puede editar en la selección de héroes', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await page.goto('./tracker', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();

  const input = page.getByLabel('Nombre del grupo');
  await expect(input).toBeVisible();
  await input.fill('Los Buscadores');
  await expect(input).toHaveValue('Los Buscadores');
});

test('los seguidores solo aparecen en campañas que los usan', async ({ page }) => {
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('awakenings'),
    expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
  }));
  await openTracker(page);

  const camp = await openCamp(page);
  await expect(camp.getByText('Seguidores del campamento')).toBeVisible();
});
