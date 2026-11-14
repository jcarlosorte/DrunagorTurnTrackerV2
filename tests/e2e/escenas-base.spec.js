import { expect, test } from '@playwright/test';
import { buildHeroExtras, buildSeed, openTracker, readStorage, seedStorage } from './helpers';

const baseSeed = () => buildSeed({
  mainBox: JSON.stringify('core'),
  expansions: JSON.stringify(['base']),
});

async function activateScene(page, id) {
  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await page.getByTestId(`scene-${id}`).getByRole('button', { name: /Activar capítulo/ }).click();
}

test.describe('Escenas del juego base', () => {
  test('el menú muestra solo las escenas del juego base', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await expect(page.getByTestId('scene-base_chapter1')).toBeVisible();
    await expect(page.getByTestId('scene-base_chapter2')).toBeVisible();
    await expect(page.getByTestId('scene-base_chapter2b')).toBeVisible();
    await expect(page.getByTestId('scene-chapter1')).toHaveCount(0);
  });

  test('Capítulo 1 coloca un arquero esqueleto para un héroe', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter1');

    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return (enemies.placedEnemies || []).map((entry) => ({
        id: entry.enemy.id,
        color: entry.enemy.color,
        category: entry.enemy.categoria,
      }));
    }).toEqual([{ id: 'skeleton_archer', color: 'blanco', category: 'bisoño' }]);
  });

  test('Capítulo 2 coloca Oscuridad de Caza y sus enemigos', async ({ page }) => {
    await seedStorage(page, baseSeed());
    await openTracker(page);
    await activateScene(page, 'base_chapter2');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        enemies: (enemies.placedEnemies || []).map((entry) => entry.enemy.id),
      };
    }).toEqual({
      cards: ['runa_base_oscuridad_caza'],
      enemies: ['skeleton_archer'],
    });
  });

  test('Capítulo 2b recupera al grupo, reinicia ronda y coloca al Rey Redivivo', async ({ page }) => {
    await seedStorage(page, {
      ...baseSeed(),
      heroExtras: buildHeroExtras({
        vida: 3,
        trauma: 0,
        cubos: { amarillo: 0, rojo: 0, verde: 0, azul: 0 },
        estadosAlterados: [
          { id: 'ESCUDO', count: 2 },
          { id: 'VENENO_I', count: 1 },
        ],
      }),
    });
    await openTracker(page);
    await page.getByTestId('next-turn').click();
    await page.waitForTimeout(300);
    await activateScene(page, 'base_chapter2b');
    for (const label of [/Trauma/i, /Maldición/i]) {
      const prompt = page.getByRole('dialog').filter({ hasText: label });
      await expect(prompt).toBeVisible();
      await prompt.locator('input').fill('0');
      await prompt.getByRole('button', { name: 'Aceptar' }).click();
    }

    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return (enemies.placedEnemies || []).map((entry) => entry.enemy.id);
    }).toContain('undead_king_boss_1');

    const extras = await readStorage(page, 'heroExtras', {});
    expect(extras.vorn.vida).toBe(12);
    expect(extras.vorn.cubos).toEqual(extras.vorn.cubosMax);
    expect(extras.vorn.estadosAlterados).toEqual([{ id: 'ESCUDO', count: 2 }]);
    const session = await readStorage(page, 'trackerSession', {});
    await expect.poll(async () => (await readStorage(page, 'trackerSession', {})).roundNumber).toBe(2);
    expect(session.turnIndex).toBe(0);
    const runes = await readStorage(page, 'initRunesState', {});
    expect((runes.placedRunes || []).map((entry) => entry.rune.id)).toEqual(['runa_base_oscuridad_caza']);
  });
});
