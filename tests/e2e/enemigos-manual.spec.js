import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const MODAL = 'Seleccionar enemigo manualmente';

async function openManualSelector(page, label) {
  await page.getByRole('button', { name: 'Enemigos', exact: true }).first().click();
  await page.locator('#track-menu-enemies button', { hasText: label }).last().click();
  const dialog = page.getByRole('dialog', { name: MODAL });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe('Selector manual de enemigos', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
  });

  test('el menú agrupa aleatorios 2×2, manuales en dos filas y reset centrado', async ({ page }) => {
    await page.getByRole('button', { name: 'Enemigos', exact: true }).first().click();
    const panel = page.locator('#track-menu-enemies');

    const randomBoxes = await panel.locator('[data-testid="random-enemies"] button').evaluateAll((els) => els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y) };
    }));
    expect(randomBoxes).toHaveLength(4);
    expect(new Set(randomBoxes.map((box) => box.x)).size).toBe(2);
    expect(new Set(randomBoxes.map((box) => box.y)).size).toBe(2);

    const manualBoxes = await panel.locator('[data-testid="manual-enemies"] .grid > button').evaluateAll((els) => els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y) };
    }));
    expect(manualBoxes).toHaveLength(9);
    const rows = [...new Set(manualBoxes.map((box) => box.y))];
    expect(rows).toHaveLength(2);
    expect(manualBoxes.filter((box) => box.y === rows[0])).toHaveLength(5);

    const centered = await panel.evaluate((el) => {
      const button = el.querySelector('[data-testid="reset-enemies"]').getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      return Math.abs((button.x + button.width / 2) - (rect.x + rect.width / 2));
    });
    expect(centered).toBeLessThan(2);
  });

  test('el botón genérico abre el selector sin preselección', async ({ page }) => {
    await page.getByRole('button', { name: 'Enemigos', exact: true }).first().click();
    await page.getByRole('button', { name: 'Añadir enemigo manual' }).click();

    const dialog = page.getByRole('dialog', { name: 'Seleccionar enemigo manualmente' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('group', { name: 'Color' }).getByRole('button', { name: 'Todos', exact: true }))
      .toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.getByRole('group', { name: 'Categoría' }).getByRole('button', { name: 'Todas', exact: true }))
      .toHaveAttribute('aria-pressed', 'true');
  });

  test('abre filtrado por el color elegido y permite ampliar a todos', async ({ page }) => {
    const dialog = await openManualSelector(page, 'Jefe');
    const colors = dialog.getByRole('group', { name: 'Color' });

    await expect(colors.getByRole('button', { name: 'Jefe' })).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.getByText('El Rey Redivivo: Primer Encuentro')).toBeVisible();
    await expect(dialog.getByText('Arquero Esqueleto')).toHaveCount(0);

    await colors.getByRole('button', { name: 'Todos', exact: true }).click();
    await expect(colors.getByRole('button', { name: 'Todos', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.getByText('Arquero Esqueleto', { exact: true })).toBeVisible();
  });

  test('combina color, categoría y búsqueda con contador', async ({ page }) => {
    const dialog = await openManualSelector(page, 'Blanco');
    const colors = dialog.getByRole('group', { name: 'Color' });
    const categories = dialog.getByRole('group', { name: 'Categoría' });
    const counter = dialog.locator('[role="status"]');

    await expect(colors.getByRole('button', { name: 'Blanco' })).toHaveAttribute('aria-pressed', 'true');
    await expect(counter).toHaveText(/^\d+ de \d+$/);

    await colors.getByRole('button', { name: 'Todos', exact: true }).click();
    await categories.getByRole('button', { name: 'Campeón' }).click();
    await expect(categories.getByRole('button', { name: 'Campeón' })).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.getByText('Vampiro Oscuro')).toBeVisible();

    await dialog.getByRole('searchbox').fill('dark');
    await expect(dialog.getByText('Vampiro Oscuro')).toBeVisible();
    await expect(dialog.getByText('Arquero Esqueleto')).toHaveCount(0);
    await expect(counter).toHaveText(/^1 de \d+$/);

    await dialog.getByRole('searchbox').fill('zzz');
    await expect(dialog.getByText('Sin resultados con los filtros actuales.')).toBeVisible();
    await expect(counter).toHaveText(/^0 de \d+$/);
  });

  test('añade el enemigo filtrado y cierra el modal', async ({ page }) => {
    const dialog = await openManualSelector(page, 'Blanco');
    await dialog.getByRole('searchbox').fill('skeleton');
    await expect(dialog.getByText('Arquero Esqueleto')).toBeVisible();

    await dialog.getByRole('button', { name: /estándar/i }).first().click();
    await expect(page.getByRole('dialog', { name: MODAL })).toHaveCount(0);

    await expect.poll(async () => page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
      return (state.placedEnemies || []).some(
        (entry) => entry.enemy.id === 'skeleton_archer' && entry.enemy.comportamiento === 'estandar',
      );
    })).toBe(true);
  });
});
