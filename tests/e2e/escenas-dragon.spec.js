import { expect, test } from '@playwright/test';
import { buildEnemyState, buildHeroExtras, buildSeed, openTracker, readStorage, seedStorage } from './helpers';

const undeadSeed = () => buildSeed({
  mainBox: JSON.stringify('core'),
  expansions: JSON.stringify(['base', 'undead_dragon']),
});

async function activateScene(page, id) {
  await page.getByRole('button', { name: 'Escenas', exact: true }).click();
  await page.getByTestId(`scene-${id}`).getByRole('button', { name: /Activar capítulo/ }).click();
}

test.describe('Escenas de El Ascenso del Dragón No Muerto', () => {
  test('solo aparecen si la expansión está activa', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await expect(page.getByTestId('scene-undead_chapter1')).toHaveCount(0);
  });

  test('Capítulo 1 activa Monstruo Huésped y coloca Granjeros Corruptos', async ({ page }) => {
    await seedStorage(page, undeadSeed());
    await openTracker(page);
    await activateScene(page, 'undead_chapter1');

    await expect(page.getByRole('status').filter({ hasText: 'Monstruo Huésped' })).toBeVisible();
    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      return {
        host: enemies.huespedActivo,
        enemies: (enemies.placedEnemies || []).map((entry) => `${entry.enemy.id}:${entry.enemy.categoria}`),
      };
    }).toEqual({
      host: true,
      enemies: ['corrupted_farmer:campeon', 'corrupted_farmer:campeon'],
    });
  });

  test('Capítulo 3b limpia el tablero, desactiva Huésped y añade a Aral’hezec', async ({ page }) => {
    const seed = undeadSeed();
    seed.initEnemiesState = buildEnemyState();
    seed.heroExtras = buildHeroExtras({
      vida: 3,
      estadosAlterados: [{ id: 'ESCUDO', count: 1 }, { id: 'VENENO_I', count: 2 }],
      estados: [{ id: 'ESCUDO', count: 1 }, { id: 'VENENO_I', count: 2 }],
      cubos: { amarillo: 0, rojo: 0, verde: 0, azul: 0 },
    });
    await seedStorage(page, seed);
    await openTracker(page);
    await activateScene(page, 'undead_chapter3b');

    for (const [label, value] of [['Cubos de trauma', '0'], ['Cubos de maldición', '0']]) {
      const prompt = page.getByRole('dialog').filter({ hasText: label });
      await expect(prompt).toBeVisible();
      await prompt.locator('input').fill(value);
      await prompt.getByRole('button', { name: 'Aceptar' }).click();
    }

    await expect.poll(async () => {
      const enemies = await readStorage(page, 'initEnemiesState', {});
      const extras = await readStorage(page, 'heroExtras', {});
      const boss = (enemies.placedEnemies || []).find((entry) => entry.enemy.id === 'aralhezec');
      return {
        bossLife: boss?.enemy.vida,
        host: enemies.huespedActivo,
        oldEnemy: (enemies.placedEnemies || []).some((entry) => entry.enemy.uuid === 'e2e-enemy'),
        heroLife: extras.vorn?.vida,
        heroStates: (extras.vorn?.estadosAlterados || []).map((estado) => estado.id),
      };
    }).toEqual({
      bossLife: 25,
      host: false,
      oldEnemy: false,
      heroLife: 12,
      heroStates: ['ESCUDO'],
    });
  });
});
