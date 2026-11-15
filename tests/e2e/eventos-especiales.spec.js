import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const awakeningsSeed = () => buildSeed({
  mainBox: JSON.stringify('awakenings'),
  expansions: JSON.stringify(['apocalypse_awakenings']),
});

test.describe('Sorpresa Enterrada', () => {
  test('Nieblas Sofocantes deja un aviso activo sobre el track', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Eventos', exact: true }).click();
    await page.getByRole('button', { name: /Añadir Sorpresa Enterrada/ }).click();
    await page.getByTestId('close-menu').click();
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      state.sorpresaEvent = { active: true, deck: ['sorpresa_3'], discarded: [] };
      localStorage.setItem('gameState', JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');

    await page.getByRole('button', { name: 'Robar carta' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Cerrar' }).last().click();

    const banner = page.getByRole('status').filter({ hasText: 'Nieblas Sofocantes' });
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('1 área');
  });

  test('Incursión de Monstruos invoca un MG soldado con un héroe', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Eventos', exact: true }).click();
    await page.getByRole('button', { name: /Añadir Sorpresa Enterrada/ }).click();
    await page.getByTestId('close-menu').click();
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      state.sorpresaEvent = { active: true, deck: ['sorpresa_4'], discarded: [] };
      localStorage.setItem('gameState', JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');

    await page.getByRole('button', { name: 'Robar carta' }).click();
    await expect(page.getByRole('dialog').getByText(/INVOCA A LOS SIGUIENTES MONSTRUOS/)).toBeVisible();
    await expect.poll(async () => page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      return (state.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`);
    })).toEqual(['gris:soldado']);
  });

  test('añade el evento base, roba una carta y la descarta', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Eventos', exact: true }).click();
    await page.getByRole('button', { name: /Añadir Sorpresa Enterrada/ }).click();
    await page.getByTestId('close-menu').click();

    const drawButton = page.getByRole('button', { name: 'Robar carta' });
    await expect(drawButton).toBeVisible();
    await drawButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/Nube Nociva|Monstruos Agitados|Nieblas Sofocantes|Incursión de Monstruos|Tesoro de Reyes/)).toBeVisible();
    await dialog.getByRole('button', { name: 'Cerrar' }).last().click();

    await expect.poll(async () => page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      return state.sorpresaEvent?.deck?.length;
    })).toBe(4);
  });
});

test.describe('Sorpresa de Eradren', () => {
  test('añade el evento, roba una carta y la descarta', async ({ page }) => {
    await seedStorage(page, awakeningsSeed());
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
    await seedStorage(page, awakeningsSeed());
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
