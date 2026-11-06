import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const MODAL = 'Seleccionar enemigo manualmente';

test('el PC permite elegir una baraja manual de comandante', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);

  await page.getByRole('button', { name: 'Enemigos', exact: true }).first().click();
  await page.locator('#track-menu-enemies button', { hasText: 'Comandante' }).last().click();

  const dialog = page.getByRole('dialog', { name: MODAL });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /Añadir · Comandante/ }).first().click();

  const pc = page.getByRole('dialog', { name: 'PC' });
  await expect(pc).toBeVisible();
  await expect(pc.getByRole('radio', { name: /Estandar/ })).toHaveAttribute('aria-checked', 'true');

  await pc.getByRole('radio', { name: 'Manual' }).click();
  await expect(pc.locator('select')).toHaveCount(10);

  await pc.getByRole('button', { name: 'Confirmar' }).click();
  await expect(pc).not.toBeVisible();
});
