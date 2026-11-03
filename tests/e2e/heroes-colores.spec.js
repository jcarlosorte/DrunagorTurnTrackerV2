import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Color de clase del héroe', () => {
  test('la carta del track y la ficha usan el color de la clase', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    const card = page.locator('[data-hero-id="vorn"]');
    await expect(card.locator('img')).toHaveCSS('border-color', 'rgb(94, 31, 42)');
    await expect(card.locator('[data-hero-band]')).toHaveCSS('background-color', 'rgb(94, 31, 42)');

    await card.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveCSS('border-color', 'rgb(94, 31, 42)');
    await expect(dialog.getByText('Guerrero', { exact: true })).toHaveCSS('background-color', 'rgb(94, 31, 42)');
  });
});
