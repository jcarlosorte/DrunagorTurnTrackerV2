import { expect, test } from '@playwright/test';
import { buildEnemyState, buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Sesión del track', () => {
  test('trackerSession se mantiene compacto al avanzar turnos', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      initEnemiesState: buildEnemyState(),
    });
    await openTracker(page);

    for (let i = 0; i < 12; i += 1) {
      await page.getByTestId('next-turn').click();
      await page.waitForTimeout(40);
    }

    const size = await page.evaluate(() => (localStorage.getItem('trackerSession') || '').length);
    expect(size).toBeLessThan(100_000);
  });
});
