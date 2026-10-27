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

  test('el turno activo se marca con un haz vertical y un anillo en la etiqueta', async ({ page }) => {
    await openTracker(page);
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(400);

    const slot = page.locator('.track-slot--active').first();
    await expect(slot).toHaveCount(1);

    const metrics = await slot.evaluate((element) => {
      const before = getComputedStyle(element, '::before');
      const label = element.querySelector('.track-slot__label > div');
      return {
        slotHeight: element.getBoundingClientRect().height,
        beamWidth: Number.parseFloat(before.width),
        beamHeight: Number.parseFloat(before.height),
        labelShadow: label ? getComputedStyle(label).boxShadow : '',
      };
    });

    // Haz estrecho y contenido en el slot; el anillo marca la etiqueta.
    expect(metrics.beamWidth).toBeLessThan(10);
    expect(metrics.beamHeight).toBeGreaterThan(0);
    expect(metrics.beamHeight).toBeLessThanOrEqual(metrics.slotHeight);
    expect(metrics.labelShadow).toContain('52, 211, 153');
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
