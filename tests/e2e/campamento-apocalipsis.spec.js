import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

async function openCamp(page) {
  await page.getByRole('button', { name: 'Menú de juego' }).click();
  await page.getByRole('menuitem', { name: 'Historia', exact: true }).click();
  return page.getByRole('dialog', { name: 'Seguimiento de Historia' });
}

test('el campamento de Apocalipsis muestra y guarda el registro de historia', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('apocalypse'),
    expansions: JSON.stringify(['base', 'apocalypse_adventures']),
  }));
  await openTracker(page);

  let camp = await openCamp(page);
  await expect(camp.getByTestId('camp-story-card').getByRole('img', { name: 'Apocalipsis' })).toBeVisible();
  await expect(camp.getByRole('heading', { name: 'Seguimiento de Historia' })).toBeVisible();
  await expect(camp.getByTestId('camp-story-card').getByRole('heading')).toHaveCount(0);
  await expect(camp.getByText('Estado del medidor de runas')).toBeVisible();
  await expect(camp.getByText('Seguidores Reclutados')).toBeVisible();
  await expect(camp.getByText('Sin seguidores guardados.')).toBeVisible();
  await expect(camp.getByTestId('camp-consequences')).toHaveCount(0);
  await expect(camp.getByTestId('camp-hero-effects').getByRole('heading', { name: 'Efectos del héroe' })).toBeVisible();
  await expect(camp.getByTestId('camp-hero-effects').getByText('Estados', { exact: true })).toBeVisible();
  await expect(camp.getByText('Ruta del Legado')).toBeVisible();
  await expect(camp.getByText('Orígenes y Rasgos del Héroe de Darem')).toBeVisible();
  await expect(camp.getByText('Repercusiones')).toBeVisible();
  await expect(camp.getByText('Objetos de campamento')).toBeVisible();

  const level1 = camp.getByTestId('camp-legacy-perseverancia-1');
  const level2 = camp.getByTestId('camp-legacy-perseverancia-2');
  await level2.click();
  await expect(level1).toHaveAttribute('aria-pressed', 'true');
  await expect(level2).toHaveAttribute('aria-pressed', 'true');

  const redeemer = camp.getByTestId('camp-daren-redeemer');
  await redeemer.click();
  await expect(redeemer).toHaveAttribute('aria-pressed', 'true');

  const firstAct = camp.getByTestId('camp-unfolding-first');
  const lineInput = firstAct.getByRole('textbox', { name: /Primer Acto: Escribe una línea/ });
  await lineInput.fill('El grupo escapó de la ciudad');
  await firstAct.getByRole('button', { name: /Primer Acto: Añadir línea/ }).click();
  await expect(firstAct.getByText('El grupo escapó de la ciudad')).toBeVisible();

  await camp.getByRole('button', { name: 'Cerrar', exact: true }).last().click();
  await page.reload({ waitUntil: 'networkidle' });
  await openTracker(page);
  camp = await openCamp(page);

  await expect(camp.getByTestId('camp-legacy-perseverancia-1')).toHaveAttribute('aria-pressed', 'true');
  await expect(camp.getByTestId('camp-legacy-perseverancia-2')).toHaveAttribute('aria-pressed', 'true');
  await expect(camp.getByTestId('camp-daren-redeemer')).toHaveAttribute('aria-pressed', 'true');
  await expect(camp.getByTestId('camp-unfolding-first').getByText('El grupo escapó de la ciudad')).toBeVisible();
});

test('los orígenes Héroe Popular y Caballero de Amira son excluyentes', async ({ page }) => {
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('apocalypse'),
    expansions: JSON.stringify(['base', 'apocalypse_adventures']),
  }));
  await openTracker(page);

  const camp = await openCamp(page);
  const folk = camp.getByTestId('camp-daren-folkHero');
  const knight = camp.getByTestId('camp-daren-knightOfAmira');
  const redeemer = camp.getByTestId('camp-daren-redeemer');

  await folk.click();
  await expect(folk).toHaveAttribute('aria-pressed', 'true');
  await expect(knight).toHaveAttribute('aria-pressed', 'false');

  await knight.click();
  await expect(folk).toHaveAttribute('aria-pressed', 'false');
  await expect(knight).toHaveAttribute('aria-pressed', 'true');

  await redeemer.click();
  await expect(knight).toHaveAttribute('aria-pressed', 'true');
  await expect(redeemer).toHaveAttribute('aria-pressed', 'true');

  await folk.click();
  await expect(folk).toHaveAttribute('aria-pressed', 'true');
  await expect(knight).toHaveAttribute('aria-pressed', 'false');
  await expect(redeemer).toHaveAttribute('aria-pressed', 'true');
});

test('el campamento respeta la jerarquía visual solicitada', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('apocalypse'),
    expansions: JSON.stringify(['base', 'apocalypse_adventures']),
  }));
  await openTracker(page);

  const camp = await openCamp(page);
  const box = async (locator) => locator.boundingBox();
  const story = await box(camp.getByTestId('camp-story-card'));
  const runes = await box(camp.getByTestId('camp-rune-card'));
  const followers = await box(camp.getByText('Seguidores Reclutados'));
  const effects = await box(camp.getByTestId('camp-hero-effects'));
  const legacy = await box(camp.getByTestId('camp-legacy'));
  const daren = await box(camp.getByTestId('camp-daren'));
  const repercussions = await box(camp.getByTestId('camp-repercussions'));
  const objects = await box(camp.getByTestId('camp-objects'));

  expect(story.x + story.width).toBeLessThan(runes.x);
  expect(followers.x).toBeGreaterThan(runes.x + runes.width);
  expect(effects.y).toBeGreaterThan(story.y);
  expect(legacy.y).toBeGreaterThan(effects.y);
  expect(daren.x).toBeGreaterThan(legacy.x);
  expect(repercussions.y).toBeGreaterThan(legacy.y);
  expect(objects.y).toBeGreaterThan(repercussions.y);

  const legacyTraits = await Promise.all(
    ['perseverancia', 'desastre', 'tragedia', 'heroismo']
      .map((trait) => box(camp.getByTestId(`camp-legacy-trait-${trait}`))),
  );
  const legacyColumns = new Set(legacyTraits.map((trait) => Math.round(trait.x)));
  const legacyRows = new Set(legacyTraits.map((trait) => Math.round(trait.y)));
  expect(legacyColumns.size).toBe(2);
  expect(legacyRows.size).toBe(2);

  await expect(camp.getByTestId('camp-consequences')).toHaveCount(0);

  const firstAct = await box(camp.getByTestId('camp-unfolding-first'));
  const fourthAct = await box(camp.getByTestId('camp-unfolding-fourth'));
  expect(firstAct.x).toBeLessThan(fourthAct.x);
});

test('en Despertar los seguidores ocupan el tercer bloque de la primera fila', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('awakenings'),
    expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
  }));
  await openTracker(page);

  const camp = await openCamp(page);
  const story = await camp.getByTestId('camp-story-card').boundingBox();
  const runes = await camp.getByTestId('camp-rune-card').boundingBox();
  const followers = await camp.getByText('Seguidores Reclutados').boundingBox();

  expect(followers.x).toBeGreaterThan(runes.x + runes.width);
  expect(story.x + story.width).toBeLessThan(runes.x);
});

test('las secciones nuevas no aparecen fuera de Apocalipsis', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);

  const camp = await openCamp(page);
  await expect(camp.getByText('Ruta del Legado')).toHaveCount(0);
  await expect(camp.getByText('Repercusiones')).toHaveCount(0);
});
