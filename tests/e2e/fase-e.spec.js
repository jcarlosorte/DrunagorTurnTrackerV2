import { expect, test } from '@playwright/test';
import { buildEnemyState, buildHeroExtras, buildSeed, openTracker, readStorage, seedStorage } from './helpers';

test.describe('Fase E · campamento y reinicio', () => {
  test('el campamento guarda objetos y persiste tras recargar', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Menú de juego' }).click();
    await page.getByRole('menuitem', { name: 'Campamento', exact: true }).click();

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
    await page.getByRole('menuitem', { name: 'Campamento', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Campamento del grupo' }).getByText('Cuerda')).toBeVisible();
  });

  test('la Fase de Campamento limpia el track, cura al grupo y guarda la partida', async ({ page }) => {
    const seed = buildSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.companions = [
      { uid: 'pet-camp', heroId: 'vorn', type: 'mascota', vida: 1, vidaMax: 5, estadosAlterados: [{ id: 'VENENO_I', count: 2 }] },
      { uid: 'ally-camp', heroId: 'vorn', type: 'compañero', vida: 2, vidaMax: 6, estadosAlterados: [{ id: 'VENENO_I', count: 1 }] },
    ];
    seed.trackerData = JSON.stringify(tracker);
    await seedStorage(page, {
      ...seed,
      initEnemiesState: buildEnemyState(),
      heroExtras: buildHeroExtras({ vida: 3, trauma: 2, maldicion: 1, cubos: { amarillo: 0, rojo: 0, verde: 0, azul: 0 } }),
    });
    await openTracker(page);
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'Menú de juego' }).click();
    await page.getByRole('menuitem', { name: 'Fase de Campamento' }).click();
    const dialog = page.getByRole('dialog', { name: 'Fase de Campamento' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Iniciar Fase de Campamento' }).click();

    await page.waitForURL('**/tracker');
    await expect.poll(async () => (await readStorage(page, 'initEnemiesState', {})).placedEnemies?.length || 0).toBe(0);
    await expect.poll(async () => (await readStorage(page, 'gameState', {})).usedTiles?.length || 0).toBe(0);
    await expect.poll(async () => (await readStorage(page, 'heroExtras', {})).vorn?.vida).toBe(12);
    const extras = await readStorage(page, 'heroExtras', {});
    expect(extras.vorn.estadosAlterados).toEqual([]);
    expect(extras.vorn.trauma).toBe(0);
    expect(extras.vorn.maldicion).toBe(0);
    expect(extras.vorn.cubos).toEqual(extras.vorn.cubosMax);
    const savedTracker = await readStorage(page, 'trackerData', {});
    expect(savedTracker.companions.map((entry) => entry.uid)).toEqual(['ally-camp']);
    expect(savedTracker.companions[0].vida).toBe(6);
    expect(savedTracker.companions[0].estadosAlterados).toEqual([]);
    const session = await readStorage(page, 'trackerSession', {});
    expect(session.turnIndex).toBe(0);
    expect(session.roundNumber).toBe(1);
    await expect.poll(async () => (await readStorage(page, 'drunagor:saves:index:v1', [])).length).toBeGreaterThan(0);
  });

  test('la Aventura Secuencial conserva recursos, recoloca runas y guarda', async ({ page }) => {
    const seed = buildSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.companions = [
      { uid: 'pet-seq', heroId: 'vorn', type: 'mascota', vida: 1, vidaMax: 5 },
      { uid: 'ally-seq', heroId: 'vorn', type: 'compañero', vida: 2, vidaMax: 6, estadosAlterados: [{ id: 'VENENO_I', count: 1 }] },
    ];
    seed.trackerData = JSON.stringify(tracker);
    await seedStorage(page, {
      ...seed,
      initEnemiesState: buildEnemyState(),
      heroExtras: buildHeroExtras({
        vida: 3,
        cubos: { amarillo: 0, rojo: 0, verde: 0, azul: 0 },
        estadosAlterados: [
          { id: 'ESCUDO', count: 2 },
          { id: 'VENENO_I', count: 1 },
        ],
      }),
    });
    await openTracker(page);
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('gameState') || '{}');
      state.usedTiles = [
        { uuid: 'seq-r1', runa: 'rojo' },
        { uuid: 'seq-r2', runa: 'rojo' },
        { uuid: 'seq-a1', runa: 'azul' },
      ];
      state.runes = { rojo: 2, azul: 1, verde: 0, naranja: 0, gris: 0 };
      localStorage.setItem('gameState', JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'Menú de juego' }).click();
    await page.getByRole('menuitem', { name: 'Aventura Secuencial' }).click();
    await page.getByRole('dialog', { name: 'Aventura Secuencial' })
      .getByRole('button', { name: 'Iniciar Aventura Secuencial' }).click();
    await page.getByRole('button', { name: 'Misma distribución' }).click();

    await page.waitForURL('**/tracker');
    const extras = await readStorage(page, 'heroExtras', {});
    expect(extras.vorn.vida).toBe(12);
    expect(extras.vorn.cubos).toEqual(extras.vorn.cubosMax);
    expect(extras.vorn.estadosAlterados).toEqual([{ id: 'ESCUDO', count: 2 }]);
    const savedTracker = await readStorage(page, 'trackerData', {});
    expect(savedTracker.companions.map((entry) => entry.uid)).toEqual(['ally-seq']);
    const gameState = await readStorage(page, 'gameState', {});
    expect(gameState.runes).toEqual({ rojo: 2, azul: 1, verde: 0, naranja: 0, gris: 0 });
    expect(gameState.usedTiles.map((tile) => tile.runa)).toEqual(['rojo', 'rojo', 'azul']);
    const session = await readStorage(page, 'trackerSession', {});
    expect(session.turnIndex).toBe(0);
    expect(session.roundNumber).toBe(1);
    await expect.poll(async () => (await readStorage(page, 'drunagor:saves:index:v1', [])).length).toBeGreaterThan(0);
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

    const session = await readStorage(page, 'trackerSession', {});
    expect(session.turnIndex).toBe(0);
    expect(session.roundNumber).toBe(1);
    await expect(page.getByTestId('undo-turn')).toBeDisabled();
    await expect(page.getByText('Ronda 1', { exact: false }).first()).toBeVisible();

    await expect.poll(async () => (await readStorage(page, 'heroExtras', {})).vorn?.vida).toBe(12);
    const extras = await readStorage(page, 'heroExtras', {});
    expect(extras.vorn.estadosAlterados).toEqual([]);
    expect(extras.vorn.cubos).toEqual(extras.vorn.cubosMax);
  });
});
