import { expect, test } from '@playwright/test';
import { buildSeed, seedStorage } from './helpers';

test.describe('Orden de héroes', () => {
  test('la selección se puede ordenar por clase o por nombre', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await page.goto('./tracker', { waitUntil: 'networkidle' });

    const grid = page.locator('section[aria-labelledby="heroes-heading"] ul.grid');
    await expect(grid.locator('li')).toHaveCount(5);
    const names = async () => grid.getByRole('checkbox').evaluateAll((boxes) => boxes.map((box) => box.getAttribute('aria-label')));

    await page.getByLabel('Ordenar por').selectOption('class');
    expect(await names()).toEqual(['Maya', 'Elros', 'Jaheen', 'Vorn', 'Lorelai']);

    await page.getByLabel('Ordenar por').selectOption('name');
    expect(await names()).toEqual(['Elros', 'Jaheen', 'Lorelai', 'Maya', 'Vorn']);
  });
});
