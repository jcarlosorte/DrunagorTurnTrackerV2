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

const heroExtras = {
  sun: {
    vida: 7,
    vidaMax: 10,
    estados: [],
    estadosAlterados: [
      { id: 'CONCENTRACION', count: 2 },
      { id: 'KI', count: 3 },
    ],
    cubos: { amarillo: 0, rojo: 1, verde: 1, azul: 0 },
    cubosMax: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
    trauma: 1,
    maldicion: 2,
  },
  katarina: {
    vida: 10,
    vidaMax: 10,
    estadosAlterados: [{ id: 'FURIA', count: 2 }],
    cubos: { amarillo: 1, rojo: 1, verde: 1, azul: 1 },
    cubosMax: { amarillo: 1, rojo: 1, verde: 1, azul: 1 },
  },
};

test.describe('Recursos de héroe', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      trackerData: JSON.stringify(trackerData),
      heroExtras: JSON.stringify(heroExtras),
    });
  });

  test('Sun (monje) ve Concentración y Ki; Katarina (bárbara) ve Furia', async ({ page }) => {
    await openTracker(page);
    const dialog = page.getByRole('dialog');

    await page.locator('[role="button"][aria-label*="Sun"]').first().click({ force: true });
    await expect(dialog.getByRole('button', { name: 'CONCENTRACIÓN: +1' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'KI: +1' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'FURIA: +1' })).toHaveCount(0);
    await expect(dialog.getByRole('button', { name: 'FRUTO DE VIDA: +1' })).toHaveCount(0);

    await page.keyboard.press('Escape');
    await page.locator('[role="button"][aria-label*="Katarina"]').first().click({ force: true });
    await expect(dialog.getByRole('button', { name: 'FURIA: +1' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'KI: +1' })).toHaveCount(0);
    await expect(dialog.getByRole('button', { name: 'CONCENTRACIÓN: +1' })).toBeVisible();
  });

  test('los recursos activos se muestran sobre la carta', async ({ page }) => {
    await openTracker(page);
    const sunCard = page.locator('[role="button"][aria-label*="Sun"]').first();
    await expect(sunCard.locator('span[title] img')).toHaveCount(2);
  });

  test('reiniciar el héroe limpia estados y recobra cubos sin tocar la vida', async ({ page }) => {
    await openTracker(page);
    await page.locator('[role="button"][aria-label*="Sun"]').first().click({ force: true });

    await page.getByRole('dialog').getByRole('button', { name: 'Reiniciar héroe' }).click();
    const confirm = page.getByRole('dialog', { name: 'Reiniciar héroe' });
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: 'Reiniciar héroe' }).click();

    await expect.poll(async () => page.evaluate(() => {
      const stored = JSON.parse(localStorage.getItem('heroExtras') || '{}').sun;
      return stored?.estadosAlterados?.length ?? -1;
    }), { timeout: 5000 }).toBe(0);

    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('heroExtras') || '{}').sun);

    expect(stored.estadosAlterados).toEqual([]);
    expect(stored.estados).toEqual([]);
    expect(stored.trauma).toBe(0);
    expect(stored.maldicion).toBe(0);
    expect(stored.cubos).toEqual(stored.cubosMax);
    expect(stored.vida).toBe(7);
  });
});
