import { expect, test } from '@playwright/test';
import { buildEnemyState, buildHeroExtras, buildSeed, expandAllSceneGroups, openTracker, readStorage, seedStorage } from './helpers';

const infernalSeed = () => buildSeed({
  mainBox: JSON.stringify('core'),
  expansions: JSON.stringify(['base', 'infernal_desert']),
});

async function activateScene(page, id) {
  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await expandAllSceneGroups(page);
  await page.getByTestId(`scene-${id}`).getByRole('button', { name: /Activar capítulo/ }).click();
}

test.describe('Escenas de Desierto Avernal', () => {
  test('solo aparecen si la expansión está activa', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await expect(page.getByTestId('scene-infernal_chapter1')).toHaveCount(0);
  });

  test('Capítulo 1 coloca Asalto de Wermunggdir y campeones', async ({ page }) => {
    await seedStorage(page, infernalSeed());
    await openTracker(page);
    await activateScene(page, 'infernal_chapter1');

    await expect.poll(async () => {
      const runes = await readStorage(page, 'initRunesState', {});
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        cards: (runes.placedRunes || []).map((entry) => entry.rune.id),
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.color}:${entry.enemy.categoria}`),
      };
    }).toEqual({
      cards: ['asalto1'],
      enemies: ['negro:campeon', 'gris:campeon'],
    });
  });

  test('Capítulo 3b limpia el tablero, recupera al grupo y añade a Wermunggdir', async ({ page }) => {
    const seed = infernalSeed();
    const tracker = JSON.parse(seed.trackerData);
    tracker.companions = [{
      uid: 'companion-werm',
      id: 'drumm',
      heroId: 'vorn',
      order: 0,
      vida: 0,
      vidaMax: 1,
      estadosAlterados: [{ id: 'VENENO_I', count: 2 }],
      capacidades: [],
    }];
    seed.trackerData = JSON.stringify(tracker);
    seed.initEnemiesState = buildEnemyState();
    seed.initRunesState = JSON.stringify({
      placedRunes: [{
        uuid: 'old-rune',
        rune: {
          uuid: 'old-rune',
          id: 'runa_base_oscuridad_caza',
          nombre: 'Oscuridad de Caza',
          cara: 'A',
          tipo: 'runa',
          accion: 'Roba',
          numRunas: 1,
          posicion: 'abajo',
        },
      }],
    });
    seed.heroExtras = buildHeroExtras({
      vida: 3,
      trauma: 2,
      estadosAlterados: [
        { id: 'ESCUDO', count: 2 },
        { id: 'VENENO_I', count: 1 },
      ],
      estados: [{ id: 'ESCUDO', count: 2 }, { id: 'VENENO_I', count: 1 }],
      cubos: { amarillo: 0, rojo: 0, verde: 0, azul: 0 },
    });
    await seedStorage(page, seed);
    await openTracker(page);
    await activateScene(page, 'infernal_chapter3b');

    for (const [label, value] of [['Cubos de trauma', '0'], ['Cubos de maldición', '0']]) {
      const prompt = page.getByRole('dialog').filter({ hasText: label });
      await expect(prompt).toBeVisible();
      await prompt.locator('input').fill(value);
      await prompt.getByRole('button', { name: 'Aceptar' }).click();
    }

    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      const runes = await readStorage(page, 'initRunesState', {});
      const extras = await readStorage(page, 'heroExtras', {});
      const saved = await readStorage(page, 'trackerData', {});
      const boss = (enemies.placedEnemies || []).find((entry) => entry.enemy.id === 'wermunggdir');
      return {
        bossLife: boss?.enemy.vida,
        oldEnemy: (enemies.placedEnemies || []).some((entry) => entry.enemy.uuid === 'e2e-enemy'),
        cards: (runes.placedRunes || []).length,
        heroLife: extras.vorn?.vida,
        heroStates: (extras.vorn?.estadosAlterados || []).map((estado) => estado.id),
        heroCubes: extras.vorn?.cubos,
        heroTrauma: extras.vorn?.trauma,
        companionLife: saved.companions?.[0]?.vida,
        companionStates: (saved.companions?.[0]?.estadosAlterados || []).length,
      };
    }).toEqual({
      bossLife: 30,
      oldEnemy: false,
      cards: 0,
      heroLife: 12,
      heroStates: ['ESCUDO'],
      heroCubes: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
      heroTrauma: 2,
      companionLife: 1,
      companionStates: 0,
    });
  });
});
