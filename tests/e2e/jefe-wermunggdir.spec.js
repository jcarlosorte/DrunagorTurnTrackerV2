import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, readStorage, seedStorage } from './helpers';

test('Wermunggdir gana vida con los cubos de trauma y maldición', async ({ page }) => {
  await seedStorage(page, buildSeed({
    expansions: JSON.stringify(['base', 'infernal_desert']),
  }));
  await openTracker(page);

  await page.getByRole('button', { name: 'Enemigos', exact: true }).first().click();
  await page.locator('#track-menu-enemies button', { hasText: 'Jefe' }).last().click();
  const dialog = page.getByRole('dialog', { name: 'Seleccionar enemigo manualmente' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('searchbox').fill('Wermunggdir');
  await dialog.getByRole('button', { name: 'Añadir · Jefe' }).first().click();

  for (const [label, value] of [['Cubos de trauma', '2'], ['Cubos de maldición', '3']]) {
    const prompt = page.getByRole('dialog').filter({ hasText: label });
    await expect(prompt).toBeVisible();
    await prompt.locator('input').fill(value);
    await prompt.getByRole('button', { name: 'Aceptar' }).click();
  }

  await expect.poll(async () => {
    const enemies = await readStorage(page, 'initEnemiesState', {});
    const boss = (enemies.placedEnemies || []).find((entry) => entry.enemy.id === 'wermunggdir');
    return {
      vida: boss?.enemy.vida,
      vidaMax: boss?.enemy.vidaMax,
      inmunidades: boss?.enemy.inmunidad,
    };
  }).toEqual({
    vida: 56,
    vidaMax: 56,
    inmunidades: ['GRANDE', 'HEMORRAGIA_I', 'SIGILO_I', 'PIEL_GRUESA'],
  });
});
