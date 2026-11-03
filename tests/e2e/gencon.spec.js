import { expect, test } from '@playwright/test';
import { buildSeed, seedStorage } from './helpers';

const trackerData = {
  heroes: ['vorn', 'elros'],
  roles: { vorn: 'apoyo', elros: 'agresor' },
  enemies: [],
  behaviors: ['estandar'],
  placedHeroes: [
    { id: 'vorn', role: 'apoyo', position: 2, image: '' },
    { id: 'elros', role: 'agresor', position: 6, image: '' },
  ],
};

test.describe('GenCon Exclusive', () => {
  test('Asistente solo aparece con la expansión y sustituye a Apoyo', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      expansions: JSON.stringify(['base', 'gencon']),
      trackerData: JSON.stringify(trackerData),
    });
    await page.goto('./tracker', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Asignar roles|Asigna roles/ }).click();

    const vorn = page.locator('#role-vorn');
    const elros = page.locator('#role-elros');
    await expect(vorn).toHaveValue('apoyo');

    await elros.selectOption('asistente');
    await expect(elros).toHaveValue('asistente');
    await expect(vorn).toHaveValue('');

    await vorn.selectOption('apoyo');
    await expect(vorn).toHaveValue('apoyo');
    await expect(elros).toHaveValue('');
  });

  test('sin GenCon Exclusive no se ofrece Asistente', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      expansions: JSON.stringify(['base']),
      trackerData: JSON.stringify(trackerData),
    });
    await page.goto('./tracker', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Asignar roles|Asigna roles/ }).click();

    const options = await page.locator('#role-vorn option').allTextContents();
    expect(options).not.toContain('Asistente');
  });
});
