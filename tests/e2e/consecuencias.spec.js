import { expect, test } from '@playwright/test';
import { buildHeroExtras, buildSeed, openTracker, seedStorage } from './helpers';

const TWO_HEROES = buildSeed({
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

const ALL_IDS = [
  'humillacion', 'inquebrantable', 'maldicion_del_guardian', 'sembrando_vientos',
  'inflexible', 'acto_repulsivo', 'trabajo_de_mensajero', 'rompemaldiciones',
  'peticion_de_un_enamorado', 'cuentacuentos', 'heroe_corrupto', 'relevo',
  'romperreliquias', 'amantes_reunidos', 'duo_dinamico',
];

async function openCamp(page) {
  await page.getByRole('button', { name: 'Menú de juego' }).click();
  await page.getByRole('menuitem', { name: 'Historia', exact: true }).click();
  return page.getByRole('dialog', { name: 'Seguimiento de Historia' });
}

async function addConsequence(camp, id) {
  const panel = camp.getByTestId('camp-consequences');
  await panel.getByTestId('camp-consequences-add').click();
  await panel.getByTestId(`camp-consequences-option-${id}`).click();
}

test('las consecuencias se comparten entre todos los héroes y el Seguimiento', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await seedStorage(page, TWO_HEROES);
  await openTracker(page);

  let camp = await openCamp(page);
  await addConsequence(camp, 'humillacion');
  await addConsequence(camp, 'inquebrantable');
  const panel = camp.getByTestId('camp-consequences');
  await expect(panel.getByTestId('camp-consequences-item-humillacion')).toBeVisible();
  await expect(panel.getByTestId('camp-consequences-item-inquebrantable')).toBeVisible();
  await camp.getByRole('button', { name: 'Cerrar', exact: true }).last().click();

  await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });
  const vornDialog = page.locator('[role="dialog"]');
  const vornOutcomes = vornDialog.getByTestId('hero-consequences');
  await expect(vornOutcomes.getByTestId('hero-consequences-item-humillacion')).toBeVisible();
  await expect(vornOutcomes.getByTestId('hero-consequences-item-inquebrantable')).toBeVisible();
  await vornOutcomes.getByRole('button', { name: /Humillación: Quitar/ }).click();
  await expect(vornOutcomes.getByTestId('hero-consequences-item-humillacion')).toHaveCount(0);
  await page.keyboard.press('Escape');

  await page.locator('[role="button"][aria-label*="Maya"]').first().click({ force: true });
  const mayaDialog = page.locator('[role="dialog"]');
  const mayaOutcomes = mayaDialog.getByTestId('hero-consequences');
  await expect(mayaOutcomes.getByTestId('hero-consequences-item-humillacion')).toHaveCount(0);
  await expect(mayaOutcomes.getByTestId('hero-consequences-item-inquebrantable')).toBeVisible();
  await page.keyboard.press('Escape');

  camp = await openCamp(page);
  await expect(camp.getByTestId('camp-consequences-item-humillacion')).toHaveCount(0);
  await expect(camp.getByTestId('camp-consequences-item-inquebrantable')).toBeVisible();
});

test('muestra las consecuencias compartidas en inglés', async ({ page }) => {
  await seedStorage(page, buildSeed({ lang: JSON.stringify('en') }));
  await openTracker(page);

  await page.getByRole('button', { name: 'Game menu' }).click();
  await page.getByRole('menuitem', { name: 'History', exact: true }).click();
  const camp = page.getByRole('dialog', { name: 'Story Record' });
  const panel = camp.getByTestId('camp-consequences');
  await expect(panel.getByText('Outcomes', { exact: true })).toBeVisible();
  await expect(panel.getByText('Shared', { exact: true })).toBeVisible();
  await panel.getByTestId('camp-consequences-add').click();
  await panel.getByTestId('camp-consequences-option-humillacion').click();
  await expect(panel.getByTestId('camp-consequences-item-humillacion')).toContainText('Humbled');
  await camp.getByRole('button', { name: 'Close', exact: true }).last().click();

  await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });
  const hero = page.locator('[role="dialog"]');
  const heroPanel = hero.getByTestId('hero-consequences');
  await expect(heroPanel.getByText('Outcomes', { exact: true })).toBeVisible();
  await expect(heroPanel.getByTestId('hero-consequences-item-humillacion')).toContainText('Humbled');
});

for (const campaign of ['awakenings', 'apocalypse']) {
  test(`no muestra auras ni consecuencias base en ${campaign}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await seedStorage(page, buildSeed({
      mainBox: JSON.stringify(campaign),
      expansions: JSON.stringify(['base', 'apocalypse_awakenings', 'apocalypse_adventures']),
      heroExtras: buildHeroExtras({ trauma: 0, auras: ['corazon_bravo'] }),
    }));
    await openTracker(page);

    await page.getByTestId('next-turn').click();
    await expect(page.getByTestId('aura-notice')).toHaveCount(0);

    await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });
    const hero = page.locator('[role="dialog"]');
    await expect(hero.getByTestId('hero-aura-section')).toHaveCount(0);
    await expect(hero.getByTestId('hero-consequences')).toHaveCount(0);
    await page.keyboard.press('Escape');

    const camp = await openCamp(page);
    await expect(camp.getByTestId('camp-consequences')).toHaveCount(0);
    await expect(camp.getByTestId('camp-hero-effects').getByRole('heading', { name: 'Efectos del héroe' })).toBeVisible();
    await expect(camp.getByTestId('camp-hero-effects').getByText('Estados', { exact: true })).toBeVisible();
  });
}

test('permite anotar las 15 consecuencias base y las conserva al recargar', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);

  let camp = await openCamp(page);
  for (const id of ALL_IDS) await addConsequence(camp, id);

  const panel = camp.getByTestId('camp-consequences');
  await expect(panel.locator('[data-testid^="camp-consequences-item-"]')).toHaveCount(ALL_IDS.length);
  await expect(panel.getByTestId('camp-consequences-item-heroe_corrupto')).toContainText('Especial');
  await camp.getByRole('button', { name: 'Cerrar', exact: true }).last().click();

  await page.reload({ waitUntil: 'networkidle' });
  await openTracker(page);
  camp = await openCamp(page);
  await expect(camp.getByTestId('camp-consequences')
    .locator('[data-testid^="camp-consequences-item-"]')).toHaveCount(ALL_IDS.length);
});
