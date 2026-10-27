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
});
