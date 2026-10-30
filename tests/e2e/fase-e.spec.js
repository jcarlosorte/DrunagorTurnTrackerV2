import { expect, test } from '@playwright/test';
import { buildEnemyState, buildHeroExtras, buildSeed, openTracker, readStorage, seedStorage } from './helpers';

test.describe('Fase E · campamento y reinicio', () => {
  test('el campamento guarda objetos y persiste tras recargar', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Menú de juego' }).click();
    await page.getByRole('menuitem', { name: 'Campamento' }).click();

    const camp = page.getByRole('dialog', { name: 'Campamento del grupo' });
    await expect(camp).toBeVisible();
    await camp.getByLabel('Objeto del campamento').fill('Cuerda');
    await camp.getByRole('button', { name: '+ Añadir' }).click();
    await expect(camp.getByText('Cuerda')).toBeVisible();

    await expect.poll(async () => {
      const state = await readStorage(page, 'gameState', {});
      return state.campamento || [];
    }).toContain('Cuerda');

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');
    await page.getByRole('button', { name: 'Menú de juego' }).click();
    await page.getByRole('menuitem', { name: 'Campamento' }).click();
    await expect(page.getByRole('dialog', { name: 'Campamento del grupo' }).getByText('Cuerda')).toBeVisible();
  });

  test('reiniciar partida limpia turno, historial, enemigos, runas y héroes', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      initEnemiesState: buildEnemyState(),
      heroExtras: buildHeroExtras({ vida: 3 }),
    });
    await openTracker(page);

    // Avanza el turno para que el reinicio tenga algo que deshacer.
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'Menú de juego' }).click();
    await page.getByRole('menuitem', { name: 'Reiniciar partida' }).click();

    const dialog = page.getByRole('dialog', { name: 'Reiniciar partida' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('checkbox').nth(0).check();
    await dialog.getByRole('checkbox').nth(1).check();
    await dialog.getByRole('button', { name: 'Reiniciar partida' }).click();

    await expect.poll(async () => (await readStorage(page, 'gameLog', [])).length).toBe(0);
    await expect.poll(async () => (await readStorage(page, 'initEnemiesState', {})).placedEnemies?.length || 0).toBe(0);
    await expect.poll(async () => (await readStorage(page, 'gameState', {})).usedTiles?.length || 0).toBe(0);

    await expect.poll(async () => (await readStorage(page, 'heroExtras', {})).vorn?.vida).toBe(12);
    const extras = await readStorage(page, 'heroExtras', {});
    expect(extras.vorn.estadosAlterados).toEqual([]);
    expect(extras.vorn.cubos).toEqual(extras.vorn.cubosMax);
  });
});
