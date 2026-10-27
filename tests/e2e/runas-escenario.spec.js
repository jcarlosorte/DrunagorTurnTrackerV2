import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Menús de runas y escenario', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
  });

  test('runas: cabecera con contadores y zona de riesgo separada', async ({ page }) => {
    await page.getByRole('button', { name: 'Runas', exact: true }).first().click();
    const panel = page.locator('#track-menu-runes');
    await expect(panel).toBeVisible();

    await expect(panel.getByRole('heading', { name: 'Runas', level: 2 })).toBeVisible();
    await expect(panel.getByText(/^Runas \d+$/)).toBeVisible();
    await expect(panel.getByText(/^Fichas \d+\/\d+$/)).toBeVisible();
    await expect(panel.getByRole('heading', { name: 'Zona de riesgo' })).toBeVisible();

    // Las pilas y nodos ya no viven en Runas.
    await expect(panel.getByRole('heading', { name: 'Nodos y áreas' })).toHaveCount(0);
    await expect(panel.getByRole('button', { name: 'Añadir Pila de Runas' })).toHaveCount(0);
  });

  test('runas: eliminar una ficha pide confirmación y respeta cancelar', async ({ page }) => {
    await page.getByRole('button', { name: 'Runas', exact: true }).first().click();
    const panel = page.locator('#track-menu-runes');

    // Añade una ficha naranja al medidor.
    await panel.getByRole('button', { name: 'Naranja', exact: true }).first().click();
    await expect(panel.getByText(/Extraídas:\s*1/)).toBeVisible();

    const risk = panel.locator('section[aria-labelledby="runas-riesgo"]');
    const medidor = risk.getByRole('group', { name: 'Eliminar Runa del Medidor' });
    await medidor.getByRole('button', { name: 'Naranja', exact: true }).click();

    const dialog = page.getByRole('dialog', { name: 'Eliminar ficha del medidor' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/ficha Naranja/i)).toBeVisible();

    await dialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(panel.getByText(/Extraídas:\s*1/)).toBeVisible();

    await risk.getByRole('group', { name: 'Eliminar Runa del Medidor' }).getByRole('button', { name: 'Naranja', exact: true }).click();
    await page.getByRole('dialog', { name: 'Eliminar ficha del medidor' })
      .getByRole('button', { name: 'Eliminar Runa del Medidor' })
      .click();

    await expect(page.getByRole('dialog', { name: 'Eliminar ficha del medidor' })).toHaveCount(0);
    await expect(panel.getByText(/Extraídas:\s*0/)).toBeVisible();
  });

  test('escenario: secciones con contadores y monstruo seleccionable', async ({ page }) => {
    await page.getByRole('button', { name: 'Escenario', exact: true }).first().click();
    const panel = page.locator('#track-menu-scenario');
    await expect(panel).toBeVisible();

    await expect(panel.getByRole('heading', { name: 'Monstruo de Escenario' })).toBeVisible();
    await expect(panel.getByRole('heading', { name: 'Cartas de escenario' })).toBeVisible();
    await expect(panel.getByRole('heading', { name: 'Nodos y áreas' })).toBeVisible();
    await expect(panel.getByText(/^Monstruo 0\/\d+$/)).toBeVisible();

    const incursion = panel.getByRole('button', { name: 'Añadir Carta de Escenario (Cara A)' });
    await expect(incursion).toBeDisabled();

    const monster = panel.getByRole('button', { name: 'Vástago de Vampiro Sombrío' });
    await monster.click();
    await expect(monster).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.getByText(/^Monstruo 1\/\d+$/)).toBeVisible();
    await expect(incursion).toBeEnabled();

    // Colocar la incursión actualiza el contador de cartas.
    await incursion.click();
    await expect(panel.getByText(/^Cartas 1\/2$/)).toBeVisible();

    // Los nodos viven aquí: añadir una pila actualiza el contador.
    const nodesBefore = Number((await panel.getByText(/^Nodos \d+$/).innerText()).split(' ')[1]);
    await panel.getByRole('button', { name: 'Añadir Pila de Runas' }).click();
    await expect(panel.getByText(new RegExp(`^Nodos ${nodesBefore + 1}$`))).toBeVisible();
  });
});
