import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const awakeningsSeed = () => buildSeed({
  mainBox: JSON.stringify('awakenings'),
  expansions: JSON.stringify(['apocalypse_awakenings']),
});

test.describe('Avisos de la app', () => {
  test('muestra el aviso al intentar crear un Nodo de Oscuridad sin runas', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Nodos', exact: true }).click();
    await page.getByRole('button', { name: /Añadir Nodo de Oscuridad/ }).click();

    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toContainText(/No hay runas/i);
  });
});
