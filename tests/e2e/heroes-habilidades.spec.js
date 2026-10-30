import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const trackerData = {
  heroes: ['sun', 'katarina'],
  roles: { sun: 'defensor', katarina: 'agresor' },
  enemies: ['skeleton_archer'],
  behaviors: ['estandar'],
  placedHeroes: [
    { id: 'sun', role: 'defensor', position: 0, image: '' },
    { id: 'katarina', role: 'agresor', position: 1, image: '' },
  ],
};

test.describe('Habilidades del héroe', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, { ...buildSeed(), trackerData: JSON.stringify(trackerData) });
    await openTracker(page);
  });

  test('cada nivel de habilidad añade un cubo y el nivel 2 exige el 1', async ({ page }) => {
    await page.locator('[role="button"][aria-label*="Sun"]').first().click({ force: true });
    const dialog = page.getByRole('dialog');
    const yellow = dialog.locator('[title="Amarillo · cuerpo a cuerpo"]');
    const maxOf = async () => Number((await yellow.locator('span.tabular-nums').innerText()).split('/')[1]);

    const before = await maxOf();
    await expect(dialog.getByRole('button', { name: 'Cuerpo a cuerpo · Nivel 2' })).toBeDisabled();

    await dialog.getByRole('button', { name: 'Cuerpo a cuerpo · Nivel 1' }).click();
    expect(await maxOf()).toBe(before + 1);
    await expect(dialog.getByRole('button', { name: 'Cuerpo a cuerpo · Nivel 2' })).toBeEnabled();

    await dialog.getByRole('button', { name: 'Cuerpo a cuerpo · Nivel 1' }).click();
    expect(await maxOf()).toBe(before);
  });

  test('capacidades de clase con nombre y almacén persistente', async ({ page }) => {
    await page.locator('[role="button"][aria-label*="Katarina"]').first().click({ force: true });
    const dialog = page.getByRole('dialog');

    await expect(dialog.getByRole('button', { name: 'Capacidad 1 · Nivel 2' })).toBeDisabled();
    await dialog.getByLabel('Nombre de la capacidad 1').fill('Golpe demoledor');
    await dialog.getByRole('button', { name: 'Capacidad 1 · Nivel 1' }).click();
    await expect(dialog.getByRole('button', { name: 'Capacidad 1 · Nivel 2' })).toBeEnabled();

    const storage = dialog.locator('section').filter({ hasText: 'Almacén' });
    await dialog.getByLabel('Objeto del campamento').fill('Poción');
    await storage.getByRole('button', { name: /Añadir/ }).click();
    await expect(storage.getByText('Poción')).toBeVisible();

    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('[role="button"][aria-label*="Katarina"]').first().click({ force: true });
    const reopened = page.getByRole('dialog');
    await expect(reopened.getByLabel('Nombre de la capacidad 1')).toHaveValue('Golpe demoledor');
    await expect(reopened.locator('section').filter({ hasText: 'Almacén' }).getByText('Poción')).toBeVisible();
  });
});
