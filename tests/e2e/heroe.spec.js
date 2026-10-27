import { expect, test } from '@playwright/test';
import { buildHeroExtras, buildSeed, openTracker, seedStorage } from './helpers';

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
