import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Tablero de iniciativa', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, buildSeed());
  });

  test('pinta las 11 posiciones con su etiqueta', async ({ page }) => {
    await openTracker(page);

    await expect(page.locator('.track-slot')).toHaveCount(11);
    await expect(page.locator('.track-slot__label')).toHaveCount(11);
  });

  test('el turno activo se marca con una banda y no desborda el slot', async ({ page }) => {
    await openTracker(page);
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(400);

    const slot = page.locator('.track-slot--active').first();
    await expect(slot).toHaveCount(1);

    const metrics = await slot.evaluate((element) => {
      const before = getComputedStyle(element, '::before');
      return {
        slotHeight: element.getBoundingClientRect().height,
        bandHeight: Number.parseFloat(before.height),
      };
    });

    expect(metrics.bandHeight).toBeLessThan(metrics.slotHeight);
    expect(metrics.bandHeight).toBeLessThanOrEqual(160);
  });

  test('la vista de lista usa una altura compacta', async ({ page }) => {
    await openTracker(page);
    await page.getByRole('button', { name: 'Lista' }).first().click();
    await page.locator('ul button[aria-expanded]').first().click();
    await page.waitForTimeout(300);

    const height = await page.locator('ul .track-slot').first().evaluate((element) => element.getBoundingClientRect().height);
    expect(height).toBeLessThanOrEqual(500);
  });
});
