import { expect, test } from '@playwright/test';
import { buildHeroExtras, buildSeed, openTracker, readStorage, seedStorage } from './helpers';

test('la cuarta Semilla del Caos explota en un héroe', async ({ page }) => {
  await seedStorage(page, {
    ...buildSeed(),
    expansions: JSON.stringify(['base', 'apocalypse_heroes_1']),
    heroExtras: buildHeroExtras({
      vida: 10,
      vidaMax: 10,
      estadosAlterados: [{ id: 'SEMILLA_DEL_CAOS', count: 3 }],
    }),
  });
  await openTracker(page);

  await page.locator('[data-hero-id="vorn"]').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: /semilla del caos: \+1/i }).click();

  await expect.poll(async () => {
    const data = await readStorage(page, 'heroExtras', {});
    return data.vorn?.vida;
  }).toBe(6);

  await expect.poll(async () => {
    const data = await readStorage(page, 'heroExtras', {});
    return (data.vorn?.estadosAlterados || []).some((estado) => estado.id === 'SEMILLA_DEL_CAOS');
  }).toBe(false);
});
