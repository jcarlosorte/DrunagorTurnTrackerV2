import { expect, test } from '@playwright/test';
import { buildEnemyState, buildHeroExtras, buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Vista ampliada del héroe', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, { ...buildSeed(), heroExtras: buildHeroExtras() });
  });

  test('la cabecera muestra vida, estadísticas e iconos de estado', async ({ page }) => {
    await openTracker(page);
    await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const header = dialog.locator('header');
    await expect(header).toContainText('7/12');
    await expect(header).toContainText('Imp.');
    expect(await header.locator('span[title] img').count()).toBeGreaterThanOrEqual(2);
  });

  test('mantiene el foco dentro del diálogo y lo cierra con Escape', async ({ page }) => {
    await openTracker(page);
    await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    for (let i = 0; i < 6; i += 1) await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return Boolean(dialog?.contains(document.activeElement));
    });
    expect(inside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  });

  test('el dado de trampa aplica dos fichas al estado ausente', async ({ page }) => {
    // Math.random fijo: la tirada cae siempre en una cara con estado (lentitud 2).
    await page.addInitScript(() => {
      Math.random = () => 0.5;
    });

    await openTracker(page);
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(400);

    await page.getByTestId('dice-toggle').click();
    await page.getByRole('button', { name: 'Trampa', exact: true }).click();
    await page.getByRole('button', { name: /Tirar dado de trampa/i }).click();

    const applyButton = page.getByRole('button', { name: /Aplicar al turno actual/i });
    await expect(applyButton).toBeVisible();
    await applyButton.click();

    await expect.poll(async () => {
      const extras = await page.evaluate(() => JSON.parse(localStorage.getItem('heroExtras') || '{}'));
      return (extras.vorn?.estadosAlterados || []).some((estado) => estado.count === 2);
    }, { timeout: 10_000 }).toBe(true);
  });
});

test.describe('Cronómetro de turno', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      heroExtras: buildHeroExtras(),
      initEnemiesState: buildEnemyState(),
    });
  });
  test('el cronómetro acumula el tiempo del héroe y lo registra', async ({ page }) => {
    await openTracker(page);

    // Dos turnos con una pausa para que el cronómetro avance.
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(2400);
    const timer = await page.getByTestId('turn-timer').innerText();
    expect(timer).toMatch(/\d{2}:\d{2}/);

    await page.getByTestId('next-turn').click();

    // La escritura de `heroExtras` va agrupada (250 ms): se espera al valor.
    await expect.poll(async () => page.evaluate(() => {
      const extras = JSON.parse(localStorage.getItem('heroExtras') || '{}');
      return Object.values(extras).reduce((acc, hero) => acc + (hero.tiempoTotal || 0), 0);
    }), { timeout: 10_000 }).toBeGreaterThan(0);

    const log = await page.evaluate(() => JSON.parse(localStorage.getItem('gameLog') || '[]'));
    expect(log.some((entry) => String(entry.message).startsWith('⏱'))).toBe(true);

    // El modal muestra el total al final.
    await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });
    await expect(page.getByTestId('hero-total-time')).toBeVisible();
    await expect(page.getByTestId('hero-total-time')).toHaveText(/\d{2}:\d{2}/);
  });

});
