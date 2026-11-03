import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Color de clase del héroe', () => {
  test('la carta del track y la ficha usan el color de la clase', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    const card = page.locator('[data-hero-id="vorn"]');
    await expect(card.locator('[data-expansion-icon="base"]')).toBeVisible();
    await expect(card.locator('[data-hero-portrait]')).toHaveCSS('border-color', 'rgb(94, 31, 42)');
    await expect(card.locator('[data-hero-band]')).toHaveCSS('background-color', 'rgb(94, 31, 42)');

    await card.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveCSS('border-color', 'rgb(94, 31, 42)');
    await expect(dialog.getByText('Guerrero', { exact: true })).toHaveCSS('background-color', 'rgb(94, 31, 42)');
  });

  test('la vista de lista colorea el turno y muestra la imagen', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Lista' }).click();
    const row = page.locator('[data-slot-index="0"]');
    await expect(row).toContainText('Vorn');
    await expect(row.locator('[data-hero-portrait]')).toHaveCount(1);
    await expect(row.locator('[data-hero-portrait] img')).toHaveCount(2);
    await expect(row.locator('div').first()).toHaveCSS('border-color', 'rgb(94, 31, 42)');
  });
});
