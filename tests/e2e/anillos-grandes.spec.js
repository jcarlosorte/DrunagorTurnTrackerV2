import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test('un enemigo grande conserva su tamaño y muestra la gestión de anillos grandes', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);

  await page.getByRole('button', { name: 'Enemigos', exact: true }).first().click();
  await page.getByTestId('manual-enemies').getByRole('button', { name: 'MN (Negro)' }).click();
  const dialog = page.getByRole('dialog', { name: 'Seleccionar enemigo manualmente' });
  await dialog.getByRole('searchbox').fill('caballero');
  await dialog.getByRole('combobox', { name: 'Comportamiento' }).first().selectOption('estandar');
  await dialog.getByRole('button', { name: 'Añadir', exact: true }).first().click();

  await expect.poll(async () => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
    return (state.placedEnemies || []).find((entry) => entry.enemy.id === 'shadow_knight')?.enemy.size;
  })).toBe('grande');

  await page.getByTestId('manual-enemies').getByRole('button', { name: 'MB (Blanco)' }).click();
  const smallDialog = page.getByRole('dialog', { name: 'Seleccionar enemigo manualmente' });
  await smallDialog.getByRole('searchbox').fill('skeleton');
  await smallDialog.getByRole('combobox', { name: 'Comportamiento' }).first().selectOption('estandar');
  await smallDialog.getByRole('button', { name: 'Añadir', exact: true }).first().click();

  await page.getByTestId('close-menu').click();
  await page.locator('[data-enemy-card]').filter({ hasText: /Caballero|Shadow/ }).first().click();

  const ringPanel = page.getByRole('region', { name: 'Anillo del enemigo' });
  await expect(ringPanel).toBeVisible();
  await expect(ringPanel).toContainText('Grande');
  await expect(ringPanel.getByRole('button', { name: /^Cambiar a/ })).toHaveCount(3);
  await expect(ringPanel.getByRole('button', { name: /Cambiar a Naranja/ })).toHaveCount(0);
  await expect(ringPanel.getByRole('button', { name: 'Intercambiar anillo' })).toBeDisabled();
});
