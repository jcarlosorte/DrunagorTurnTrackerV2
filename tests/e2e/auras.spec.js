import { expect, test } from '@playwright/test';
import { buildHeroExtras, buildSeed, openTracker, seedStorage } from './helpers';

const twoHeroSeed = buildSeed({
  trackerData: JSON.stringify({
    heroes: ['vorn', 'maya'],
    roles: { vorn: 'defensor', maya: 'lider' },
    enemies: ['skeleton_archer'],
    behaviors: ['estandar'],
    placedHeroes: [
      { id: 'vorn', role: 'defensor', position: 0, image: '' },
      { id: 'maya', role: 'lider', position: 4, image: '' },
    ],
  }),
});

function twoHeroExtras({ vornAura = null, mayaAura = null } = {}) {
  const extras = JSON.parse(buildHeroExtras({ trauma: 0, auras: [] }));
  extras.vorn.auras = vornAura ? [vornAura] : [];
  extras.maya = {
    ...extras.vorn,
    auras: mayaAura ? [mayaAura] : [],
  };
  return JSON.stringify(extras);
}

test.describe('Auras de héroe', () => {
  test('elige una sola aura y la pierde al recibir Trauma', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      heroExtras: buildHeroExtras({ trauma: 0, auras: [] }),
    });
    await openTracker(page);
    await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog.getByTestId('hero-aura-section')).toBeVisible();
    await dialog.getByTestId('hero-aura-add').click();

    await expect(dialog.getByTestId('hero-aura-option-corazon_bravo')).toBeVisible();
    await expect(dialog.getByTestId('hero-aura-option-bendicion_de_gratitud')).toHaveCount(0);

    await dialog.getByTestId('hero-aura-option-corazon_bravo').click();
    await expect(dialog.getByTestId('hero-aura-current-corazon_bravo')).toBeVisible();

    await dialog.getByTestId('hero-aura-add').click();
    await dialog.getByTestId('hero-aura-option-sed_de_sangre').click();
    await expect(dialog.getByTestId('hero-aura-current-sed_de_sangre')).toBeVisible();
    await expect(dialog.getByTestId('hero-aura-current-corazon_bravo')).toHaveCount(0);

    await dialog.getByRole('button', { name: 'Trauma: +1' }).click();
    await expect(dialog.getByTestId('hero-aura-current-sed_de_sangre')).toHaveCount(0);

    await expect.poll(async () => page.evaluate(() => {
      const extras = JSON.parse(localStorage.getItem('heroExtras') || '{}');
      return extras.vorn?.auras;
    })).toEqual([]);
  });

  test('muestra el aura de grupo del líder en el turno de todos', async ({ page }) => {
    await seedStorage(page, {
      ...twoHeroSeed,
      heroExtras: twoHeroExtras({
        vornAura: 'corazon_bravo',
        mayaAura: 'bendicion_del_guardian',
      }),
    });
    await openTracker(page);
    await page.getByTestId('next-turn').click();

    const notices = page.getByTestId('aura-notice');
    await expect(notices).toHaveCount(2);
    await expect(page.locator('[data-aura-id="corazon_bravo"]')).toContainText('Vorn');
    await expect(page.locator('[data-aura-id="bendicion_del_guardian"]')).toContainText('Maya');
    await expect(page.locator('[data-aura-id="bendicion_del_guardian"]')).toContainText('Bendición del guardián');

    await page.getByTestId('next-turn').click();
    await expect(page.getByTestId('aura-notice')).toHaveCount(1);
    await expect(page.locator('[data-aura-id="bendicion_del_guardian"]')).toBeVisible();
    await expect(page.locator('[data-aura-id="corazon_bravo"]')).toHaveCount(0);
  });
});
