import { test, expect } from '@playwright/test';
import { buildHeroExtras, buildSeed, openTracker, seedStorage } from './helpers';

const withExtras = (overrides = {}) => {
  const seed = buildSeed();
  const trackerData = JSON.parse(seed.trackerData);
  return {
    ...seed,
    trackerData: JSON.stringify({
      ...trackerData,
      campRecord: { consecuencias: ['humillacion', 'inquebrantable'] },
    }),
    heroExtras: buildHeroExtras({
      trauma: 0,
      auras: ['corazon_bravo'],
      estados: [{
        id: 'manual_herido',
        manual: true,
        name: { es: 'Herido', en: 'Wounded' },
        count: 1,
      }],
      ...overrides,
    }),
  };
};

test.describe('Avisos flotantes de la carta de héroe', () => {
  test('muestra aura, consecuencias y estados con su número', async ({ page }) => {
    await seedStorage(page, withExtras());
    await openTracker(page);
    const card = page.locator('[data-hero-id="vorn"]');
    await expect(card.getByTestId('hero-status-badges')).toBeVisible();
    await expect(card.getByTestId('hero-status-aura')).toHaveAttribute('aria-label', 'Aura: 1');
    await expect(card.getByTestId('hero-status-consequences')).toHaveAttribute('aria-label', 'Consecuencias: 2');
    await expect(card.getByTestId('hero-status-states')).toHaveAttribute('aria-label', 'Estados: 1');
  });

  test('no muestra avisos si no hay nada que contar', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await expect(page.locator('[data-hero-id="vorn"]').getByTestId('hero-status-badges')).toHaveCount(0);
  });

  test('oculta aura y consecuencias fuera del juego base, pero mantiene estados', async ({ page }) => {
    const seed = withExtras();
    seed.mainBox = JSON.stringify('awakenings');
    seed.expansions = JSON.stringify(['base', 'apocalypse_awakenings']);
    await seedStorage(page, seed);
    await openTracker(page);
    const card = page.locator('[data-hero-id="vorn"]');
    await expect(card.getByTestId('hero-status-aura')).toHaveCount(0);
    await expect(card.getByTestId('hero-status-consequences')).toHaveCount(0);
    await expect(card.getByTestId('hero-status-states')).toHaveAttribute('aria-label', 'Estados: 1');
  });
});
