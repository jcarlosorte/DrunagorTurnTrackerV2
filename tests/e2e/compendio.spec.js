import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Compendio', () => {
  test('busca, filtra y consulta un término sin cambiar la URL', async ({ page }) => {
    await seedStorage(page, buildSeed({ lang: JSON.stringify('es') }));
    await openTracker(page);
    const url = page.url();

    await page.getByRole('button', { name: 'Compendio' }).click();
    await expect(page.getByTestId('compendium-panel')).toBeVisible();
    await expect(page.getByTestId('compendium-search')).toBeFocused();
    await expect(page.getByTestId('compendium-search')).toHaveAttribute('aria-expanded', 'true');
    expect(page.url()).toBe(url);

    await page.getByTestId('compendium-search').fill('aturdimiento');
    await expect(page.getByTestId('compendium-result-aturdimiento')).toBeVisible();
    await page.getByTestId('compendium-result-aturdimiento').click();
    await expect(page.getByTestId('compendium-detail')).toContainText('Aturdimiento');
    await expect(page.getByTestId('compendium-detail')).toContainText('Condiciones');
    await expect(page.getByTestId('compendium-detail').locator('img')).toBeVisible();

    await page.getByTestId('compendium-search').fill('escudo');
    await page.getByTestId('compendium-search').press('Enter');
    await expect(page.getByTestId('compendium-detail')).toContainText('Escudo');

    await page.getByRole('button', { name: 'Con icono' }).click();
    await expect(page.getByTestId('compendium-search')).toBeVisible();
    expect(page.url()).toBe(url);

    await page.getByTestId('compendium-search').fill('escudo');
    await page.getByTestId('compendium-search').press('Escape');
    await expect(page.getByTestId('compendium-search')).toHaveValue('');
    await expect(page.getByTestId('compendium-panel')).toBeVisible();

    await page.getByRole('button', { name: 'Cerrar compendio' }).click();
    await expect(page.getByTestId('compendium-panel')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Compendio' })).toBeFocused();
  });

  test('funciona en inglés', async ({ page }) => {
    await seedStorage(page, buildSeed({ lang: JSON.stringify('en') }));
    await openTracker(page);
    await page.getByRole('button', { name: 'Compendium' }).click();
    await page.getByTestId('compendium-search').fill('stun');

    await expect(page.getByTestId('compendium-result-aturdimiento')).toBeVisible();
    await page.getByTestId('compendium-result-aturdimiento').click();
    await expect(page.getByTestId('compendium-detail')).toContainText('Stun');
    await expect(page.getByTestId('compendium-detail')).toContainText('Conditions');
  });
});
