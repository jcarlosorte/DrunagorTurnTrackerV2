import { expect, test } from '@playwright/test';
import { buildEnemyState, buildHeroExtras, buildSeed, readStorage, seedStorage } from './helpers';

test.describe('Guardados', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      heroExtras: buildHeroExtras(),
      initEnemiesState: buildEnemyState(),
    });
  });

  test('el snapshot incluye versión, gestión de héroes y datos del héroe', async ({ page }) => {
    await page.goto('./saves', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Guardar partida/i }).first().click();

    // Espera a que el índice de partidas tenga la entrada recién creada.
    await expect.poll(async () => page.evaluate(
      () => JSON.parse(localStorage.getItem('drunagor:saves:index:v1') || '[]').length,
    )).toBeGreaterThan(0);

    const record = await page.evaluate(() => {
      const index = JSON.parse(localStorage.getItem('drunagor:saves:index:v1') || '[]');
      if (!index.length) return null;
      return JSON.parse(localStorage.getItem(`drunagor:save:${index[0].id}`) || '{}');
    });

    expect(record).not.toBeNull();
    expect(record.snapshot.schemaVersion).toBe(3);
    expect(record.snapshot.appVersion).toBeTruthy();
    expect(record.snapshot.configuration.heroManagement).toBe(true);
    expect(record.snapshot.track.heroExtras.vorn.impactoMod).toBe(3);
    expect(record.snapshot.track.heroExtras.vorn.estadosAlterados).toHaveLength(2);
  });

  test('cargar un guardado manipulado sanea los valores', async ({ page }) => {
    await page.goto('./saves', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Guardar partida/i }).first().click();
    await expect.poll(async () => page.evaluate(
      () => JSON.parse(localStorage.getItem('drunagor:saves:index:v1') || '[]').length,
    )).toBeGreaterThan(0);

    await page.evaluate(() => {
      const index = JSON.parse(localStorage.getItem('drunagor:saves:index:v1') || '[]');
      const key = `drunagor:save:${index[0].id}`;
      const record = JSON.parse(localStorage.getItem(key) || '{}');
      record.snapshot.track.heroExtras = {
        vorn: {
          vida: -5,
          vidaMax: 0,
          trauma: 99,
          maldicion: 99,
          impactoMod: 999,
          estadosAlterados: [{ id: 'NO_EXISTE', count: 3 }, { id: 'VENENO_I', count: 99 }],
          cubos: { amarillo: 99 },
          cubosMax: { amarillo: 2 },
        },
      };
      localStorage.setItem(key, JSON.stringify(record));
    });

    await page.getByRole('button', { name: /^Cargar/i }).first().click();
    // La carga recarga la página: se espera al valor saneado en vez de un tiempo fijo.
    await expect.poll(async () => {
      const extras = await readStorage(page, 'heroExtras', {});
      return extras?.vorn?.vidaMax ?? null;
    }, { timeout: 15_000 }).toBe(1);

    const extras = await readStorage(page, 'heroExtras', {});
    const vorn = extras.vorn;
    expect(vorn).toBeTruthy();
    expect(vorn.vidaMax).toBe(1);
    expect(vorn.vida).toBe(0);
    expect(vorn.trauma).toBe(2);
    expect(vorn.maldicion).toBe(5);
    expect(vorn.impactoMod).toBe(20);
    expect(vorn.estadosAlterados).toEqual([{ id: 'VENENO_I', count: 4 }]);
  });
});
