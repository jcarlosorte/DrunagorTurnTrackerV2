import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test('añade una carta de runa y una de incursión de Despertar', async ({ page }) => {
  await seedStorage(page, {
    ...buildSeed(),
    mainBox: JSON.stringify('awakenings'),
    expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
  });
  await openTracker(page);

  await page.getByRole('button', { name: 'Runas', exact: true }).click();
  const runeCard = page.locator('[data-testid="despertar-rune-runa_despertar_influencia"]');
  await runeCard.getByRole('button', { name: 'Añadir (A)' }).click();

  let state = await page.evaluate(() => JSON.parse(localStorage.getItem('initRunesState') || '{}'));
  expect(state.placedRunes.filter((entry) => entry.rune.tipo === 'runa')).toHaveLength(1);

  await page.getByTestId('close-menu').click();
  await page.getByRole('button', { name: /Influencia Creciente · Cara A/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Roba 1 runa.')).toBeVisible();
  await expect(dialog.getByText('Las runas robadas por esta carta no generan ninguna loseta de oscuridad.')).toBeVisible();
  await expect(dialog.getByText('Luego, voltea esta carta.')).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Aplicar efecto/ })).toBeVisible();
  await dialog.getByRole('button', { name: 'Cerrar' }).click();

  await page.getByRole('button', { name: 'Runas', exact: true }).click();
  // Las demás cartas de runa quedan bloqueadas mientras haya una en juego.
  await expect(page.locator('[data-testid="despertar-rune-runa_despertar_caza"]')
    .getByRole('button', { name: 'Añadir (A)' })).toBeDisabled();

  await page.getByRole('button', { name: 'Escenario', exact: true }).click();
  await page.getByRole('button', { name: 'Artillero Infame' }).click();
  const incursionCard = page.locator('[data-testid="despertar-incursion-incursion_despertar_incansable"]');
  await incursionCard.getByRole('button', { name: 'Añadir (A)' }).click();

  state = await page.evaluate(() => JSON.parse(localStorage.getItem('initRunesState') || '{}'));
  expect(state.placedRunes.filter((entry) => entry.rune.tipo === 'incursion')).toHaveLength(1);

  await page.getByRole('button', { name: 'Nodos', exact: true }).click();
  await expect(page.getByText('Fichas de Generación')).toBeVisible();
  await expect(page.getByText(/Pila/i).first()).toBeVisible();

  const orangeGeneration = page.getByRole('button', { name: /^\+ Naranja/ });
  await orangeGeneration.click();
  await expect(orangeGeneration).toBeDisabled();
  await expect.poll(async () => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('gameState') || '{}');
    return (state.generationPoints || []).filter((point) => point.color === 'naranja').length;
  })).toBe(1);

  const cannonRow = page.locator('[data-testid="magic-cannon-naranja"]');
  await cannonRow.getByRole('button', { name: 'Cargado', exact: true }).click();
  await expect.poll(async () => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('gameState') || '{}');
    return (state.magicCannons || []).filter((cannon) => cannon.color === 'naranja').length;
  })).toBe(1);
  await cannonRow.getByRole('button', { name: 'Cargado', exact: true }).click();
  await expect.poll(async () => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('gameState') || '{}');
    return (state.magicCannons || []).find((cannon) => cannon.color === 'naranja')?.loaded;
  })).toBe(false);
});
