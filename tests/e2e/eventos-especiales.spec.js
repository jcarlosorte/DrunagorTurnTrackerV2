import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Sorpresa de Eradren', () => {
  test('añade el evento, roba una carta y la descarta', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Eventos', exact: true }).click();
    await page.getByRole('button', { name: /Añadir Sorpresa de Eradren/ }).click();
    await page.getByTestId('close-menu').click();

    const drawButton = page.getByRole('button', { name: 'Robar carta' });
    await expect(drawButton).toBeVisible();
    await drawButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/ASALTO|SUPERVIVIENTE PERDIDO|GATITO/)).toBeVisible();
    await dialog.getByRole('button', { name: 'Cerrar' }).last().click();

    await expect.poll(async () => page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      return state.erradenEvent?.deck?.length;
    })).toBe(5);
  });

  test('las dos PS se añaden a la vez y aparecen juntas', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Eventos', exact: true }).click();
    await page.getByRole('button', { name: /Añadir PS del Navío Corrupto/ }).click();
    await page.getByRole('button', { name: /Añadir PS del Buque Cisne/ }).click();
    await page.getByTestId('close-menu').click();

    await expect(page.getByText('PS del Navío Corrupto').last()).toBeVisible();
    await expect(page.getByText('PS del Buque Cisne').last()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Robar', exact: true })).toHaveCount(2);
  });
});
