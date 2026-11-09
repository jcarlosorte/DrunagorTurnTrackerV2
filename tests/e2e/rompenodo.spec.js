import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const tiles = ['naranja', 'verde', 'azul', 'rojo', 'gris'].map((runa, index) => ({
  uuid: `tile-${index}`,
  runa,
}));

test.describe('Rompenodo', () => {
  test('permite elegir el color de la runa retirada', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await page.evaluate((state) => {
      localStorage.setItem('gameState', state);
    }, JSON.stringify({
      pilasConcentrada: [{
        id: 'nodo-test',
        tiles,
        estado: 'activa',
        numPila: 1,
      }],
    }));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');

    await page.getByRole('button', { name: 'Nodos', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Rompenodo' })).toHaveCount(2);
    await page.getByRole('button', { name: 'Rompenodo' }).first().click();

    const dialog = page.getByRole('dialog', { name: /Rompenodo/ });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('5');

    await dialog.getByRole('button', { name: /Naranja/ }).click();
    await expect(dialog).toContainText('4');
  });
});
