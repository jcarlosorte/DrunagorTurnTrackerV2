import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test('añade las cartas de runa e incursión de Despertar', async ({ page }) => {
  await seedStorage(page, {
    ...buildSeed(),
    mainBox: JSON.stringify('awakenings'),
    expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
  });
  await openTracker(page);

  await page.getByRole('button', { name: 'Runas', exact: true }).click();
  await page.getByRole('button', { name: 'Añadir (A)', exact: true }).click();
  let state = await page.evaluate(() => JSON.parse(localStorage.getItem('initRunesState') || '{}'));
  expect(state.placedRunes.filter((entry) => entry.rune.id.startsWith('runa_despertar_'))).toHaveLength(5);

  await page.getByRole('button', { name: 'Escenario', exact: true }).click();
  await page.getByRole('button', { name: 'Cosechador de Almas' }).click();
  await page.getByRole('button', { name: 'Añadir (A)', exact: true }).click();
  state = await page.evaluate(() => JSON.parse(localStorage.getItem('initRunesState') || '{}'));
  expect(state.placedRunes.filter((entry) => entry.rune.id.startsWith('incursion_despertar_'))).toHaveLength(3);
});
