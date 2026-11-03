import { expect, test } from '@playwright/test';
import { buildSeed, seedStorage } from './helpers';

const trackerData = {
  heroes: ['vorn', 'elros'],
  roles: { vorn: 'lider', elros: 'agresor' },
  enemies: [],
  behaviors: ['estandar'],
  placedHeroes: [
    { id: 'vorn', role: 'lider', position: 4, image: '' },
    { id: 'elros', role: 'agresor', position: 6, image: '' },
  ],
};

test.describe('Dice Tower Exclusive', () => {
  test('Lanza Dados solo aparece con la expansión y sustituye a Líder', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      expansions: JSON.stringify(['base', 'dicetower']),
      trackerData: JSON.stringify(trackerData),
    });
    await page.goto('./tracker', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Asignar roles|Asigna roles/ }).click();

    const vorn = page.locator('#role-vorn');
    const elros = page.locator('#role-elros');
    await expect(vorn).toHaveValue('lider');

    await elros.selectOption('lanza_dados');
    await expect(elros).toHaveValue('lanza_dados');
    await expect(vorn).toHaveValue('');

    await vorn.selectOption('lider');
    await expect(vorn).toHaveValue('lider');
    await expect(elros).toHaveValue('');
  });

  test('sin Dice Tower Exclusive no se ofrece Lanza Dados', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      expansions: JSON.stringify(['base']),
      trackerData: JSON.stringify(trackerData),
    });
    await page.goto('./tracker', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Asignar roles|Asigna roles/ }).click();

    const options = await page.locator('#role-vorn option').allTextContents();
    expect(options).not.toContain('Lanza Dados');
  });
});
