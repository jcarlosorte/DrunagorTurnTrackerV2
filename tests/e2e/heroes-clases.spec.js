import { expect, test } from '@playwright/test';
import { buildSeed, seedStorage } from './helpers';

test.describe('Selección de héroes por clase', () => {
  test('agrupa con título, icono y color de clase', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await page.goto('./tracker', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Selecciona tus héroes' }).click();

    const section = page.locator('section[aria-labelledby="heroes-heading"]');
    await expect(section.locator('h3')).toHaveCount(12);
    const headings = await section.locator('h3').allTextContents();
    expect(headings).toEqual(expect.arrayContaining(['Arquero', 'Asesino', 'Clérigo', 'Guerrero', 'Mago']));

    const archerGroup = section.locator('section').filter({ hasText: 'Arquero' });
    await expect(archerGroup.locator('header img')).toBeVisible();
    await expect(archerGroup.locator('header')).toHaveCSS('background-color', 'rgb(31, 74, 107)');
  });
});
