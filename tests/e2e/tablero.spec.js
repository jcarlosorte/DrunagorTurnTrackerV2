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

  test('el turno activo se marca sobre su carta', async ({ page }) => {
    await openTracker(page);
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(400);

    const slot = page.locator('.track-slot--active').first();
    await expect(slot).toHaveCount(1);

    // Sin halo: solo la flecha y el atributo que identifica la carta en turno.
    const metrics = await slot.evaluate((element) => {
      const before = getComputedStyle(element, '::before');
      return {
        hasBeam: before.content !== 'none' && before.content !== '',
        card: Boolean(element.querySelector('[data-current-turn]')),
      };
    });

    expect(metrics.hasBeam).toBe(false);
    expect(metrics.card).toBe(true);
  });

  test('la vista de lista usa una altura compacta', async ({ page }) => {
    await openTracker(page);
    await page.getByRole('button', { name: 'Lista' }).first().click();
    await page.locator('ul button[aria-expanded]').first().click();
    await page.waitForTimeout(300);

    const height = await page.locator('ul .track-slot').first().evaluate((element) => element.getBoundingClientRect().height);
    expect(height).toBeLessThanOrEqual(500);
  });

  test('el carrusel muestra anterior, actual y siguiente', async ({ page }) => {
    await openTracker(page);
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(400);
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(500);

    const carousel = page.locator('section[aria-label="Turnos"]');
    await expect(carousel).toBeVisible();
    await expect(carousel.locator('[data-role="current"]')).toHaveCount(1);
    await expect(carousel.locator('[data-role="next"]')).toHaveCount(1);

    const currentText = await carousel.locator('[data-role="current"]').innerText();
    expect(currentText.toLowerCase()).toContain('turno actual');
  });

  test('la densidad compacta reduce la altura y se recuerda', async ({ page }) => {
    await openTracker(page);
    const slot = page.locator('.track-slot').first();
    const before = await slot.evaluate((element) => element.getBoundingClientRect().height);

    await page.getByTestId('density-toggle').click();
    await page.waitForTimeout(400);
    const after = await slot.evaluate((element) => element.getBoundingClientRect().height);

    expect(after).toBeLessThan(before);
    await expect(page.getByTestId('density-toggle')).toHaveAttribute('aria-pressed', 'true');
    const stored = await page.evaluate(() => localStorage.getItem('trackDensity'));
    expect(stored).toContain('compact');
  });
});
