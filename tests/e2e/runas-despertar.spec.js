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

  // Las demás cartas de runa quedan bloqueadas mientras haya una en juego.
  await expect(page.locator('[data-testid="despertar-rune-runa_despertar_caza"]')
    .getByRole('button', { name: 'Añadir (A)' })).toBeDisabled();

  await page.getByRole('button', { name: 'Escenario', exact: true }).click();
  await page.getByRole('button', { name: 'Cosechador de Almas' }).click();
  const incursionCard = page.locator('[data-testid="despertar-incursion-incursion_despertar_incansable"]');
  await incursionCard.getByRole('button', { name: 'Añadir (A)' }).click();

  state = await page.evaluate(() => JSON.parse(localStorage.getItem('initRunesState') || '{}'));
  expect(state.placedRunes.filter((entry) => entry.rune.tipo === 'incursion')).toHaveLength(1);
});
