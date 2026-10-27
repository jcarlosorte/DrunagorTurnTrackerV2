import { expect, test } from '@playwright/test';
import {
  buildEnemyState,
  buildSeed,
  consumeEnemyStates,
  openTracker,
  seedStorage,
} from './helpers';

test.describe('Estados alterados del enemigo', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      initEnemiesState: buildEnemyState({ estadosAlterados: [{ id: 'QUEMADURA_I', count: 2 }] }),
    });
  });

  test('el turno consume las fichas y hace daño', async ({ page }) => {
    await openTracker(page);
    // Quemadura 2 se agota en dos turnos del enemigo (1 ficha por turno).
    await consumeEnemyStates(page);

    const enemy = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      return state.placedEnemies?.[0]?.enemy ?? null;
    });

    expect(enemy?.estadosAlterados ?? []).toEqual([]);
    expect(enemy?.vida).toBeLessThan(12);
  });

  test('la paleta de estados sigue disponible tras consumirse', async ({ page }) => {
    await openTracker(page);
    await consumeEnemyStates(page);

    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('.track-slot button'))
        .find((element) => element.className.includes('enemy-text-wrapper'));
      button?.click();
    });
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    const plusButtons = page.locator('[role="dialog"] button[aria-label$="+1"]');
    expect(await plusButtons.count()).toBeGreaterThanOrEqual(10);
  });

  test('la paleta ocupa una fila y se reparte al ancho disponible', async ({ page }) => {
    await openTracker(page);
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('.track-slot button'))
        .find((element) => element.className.includes('enemy-text-wrapper'));
      button?.click();
    });
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    const wide = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const row = Array.from(dialog.querySelectorAll('div'))
        .find((el) => el.className.includes('justify-center') && el.querySelectorAll('button[aria-label$="+1"]').length > 0);
      const chips = Array.from(row.children).map((el) => el.getBoundingClientRect());
      return {
        rows: new Set(chips.map((r) => Math.round(r.top))).size,
        widthSpread: Math.max(...chips.map((r) => r.width)) - Math.min(...chips.map((r) => r.width)),
        filled: Math.abs(row.getBoundingClientRect().width - chips.reduce((acc, r) => acc + r.width, 0)) < 80,
      };
    });
    expect(wide.rows).toBe(1);
    expect(wide.widthSpread).toBeLessThan(2);
    expect(wide.filled).toBe(true);

    // En pantalla estrecha pasa a varias filas sin desbordar.
    await page.setViewportSize({ width: 360, height: 800 });
    await page.waitForTimeout(400);
    const narrow = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const row = Array.from(dialog.querySelectorAll('div'))
        .find((el) => el.className.includes('justify-center') && el.querySelectorAll('button[aria-label$="+1"]').length > 0);
      const chips = Array.from(row.children).map((el) => el.getBoundingClientRect());
      return {
        rows: new Set(chips.map((r) => Math.round(r.top))).size,
        overflow: row.scrollWidth - row.clientWidth,
      };
    });
    expect(narrow.rows).toBeGreaterThan(1);
    expect(narrow.overflow).toBeLessThanOrEqual(0);
  });
});
