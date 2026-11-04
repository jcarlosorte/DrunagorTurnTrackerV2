import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, readStorage, seedStorage } from './helpers';

const baseTracker = {
  heroes: ['vorn'],
  roles: { vorn: 'defensor' },
  enemies: ['skeleton_archer'],
  behaviors: ['estandar'],
  placedHeroes: [{ id: 'vorn', role: 'defensor', position: 0, image: '' }],
};

const companions = [
  { uid: 'c-drumm', id: 'drumm', heroId: 'vorn', order: 0, vida: 1, vidaMax: 1, estadosAlterados: [] },
  { uid: 'c-bronx', id: 'bronx', heroId: 'vorn', order: 1, vida: 1, vidaMax: 1, estadosAlterados: [] },
];

const necromancerTracker = {
  ...baseTracker,
  heroes: ['vorn', 'mordred'],
  roles: { ...baseTracker.roles, mordred: 'defensor' },
  placedHeroes: [
    ...baseTracker.placedHeroes,
    { id: 'mordred', role: 'defensor', position: 1, image: '' },
  ],
};

test.describe('Compañeros y mascotas', () => {
  test('se asignan desde el menú superior, aparecen en el track y guardan vida y estados', async ({ page }) => {
    await seedStorage(page, { ...buildSeed(), trackerData: JSON.stringify({ ...baseTracker, companions: [] }) });
    await openTracker(page);

    await page.getByRole('button', { name: 'Compañeros' }).click();
    const picker = page.getByRole('dialog', { name: 'Compañeros y mascotas' });
    await picker.getByRole('button', { name: /Drumm/ }).click();
    await picker.getByLabel('Héroe').selectOption('vorn');
    await picker.getByRole('button', { name: '+ Añadir' }).click();
    await picker.getByRole('button', { name: /Bronx/ }).click();
    await picker.getByRole('button', { name: '+ Añadir' }).click();
    const inPlay = picker.locator('section').filter({ hasText: 'En juego' });
    await expect(inPlay.getByText('Drumm')).toBeVisible();
    await expect(inPlay.getByText('Bronx')).toBeVisible();
    await picker.getByRole('button', { name: 'Cerrar' }).last().click();

    const drummCard = page.locator('[data-companion-id="drumm"]');
    await expect(drummCard).toBeVisible();
    await expect(drummCard).toContainText('1/1');
    await expect(drummCard.locator('[data-companion-name]')).toContainText('Drumm');
    const background = await drummCard.locator('[data-companion-avatar]').evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(background).toContain('url(');

    await drummCard.click();
    let dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('la cría de dragón');
    await expect(dialog.getByTestId('companion-life')).toHaveText('1 / 1');

    await dialog.getByRole('button', { name: '-1' }).click();
    await expect(dialog.getByTestId('companion-life')).toHaveText('0 / 1');
    await dialog.getByRole('button', { name: 'quemadura: +1' }).click();
    await dialog.getByRole('button', { name: 'Cerrar' }).last().click();

    await expect.poll(async () => {
      const data = await readStorage(page, 'trackerData', {});
      return data.companions?.length;
    }).toBe(2);

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.track-slot');
    await expect(page.locator('[data-companion-id="drumm"]')).toContainText('0/1');

    await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });
    dialog = page.getByRole('dialog');
    await expect(dialog.getByText(/Mascota · 0\/1 · 1 estados/)).toBeVisible();
  });

  test('cada criatura actúa una vez después de su héroe, en orden de aparición', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      trackerData: JSON.stringify({ ...baseTracker, companions }),
    });
    await openTracker(page);

    const current = page.locator('[data-role="current"]');
    await page.getByTestId('next-turn').click();
    await expect(current).toContainText('Vorn');

    await page.getByTestId('next-turn').click();
    await expect(current).toContainText('Drumm');
    await expect(current).toContainText('🐾');

    await page.getByTestId('next-turn').click();
    await expect(current).toContainText('Bronx');

    await expect.poll(async () => {
      const data = await readStorage(page, 'trackerData', {});
      return (data.companions || [])
        .find((entry) => entry.id === 'bronx')
        ?.estadosAlterados?.find((estado) => estado.id === 'ESCUDO')?.count;
    }).toBe(2);
  });

  test('una criatura asignada deja de estar disponible y vuelve al quitarla', async ({ page }) => {
    await seedStorage(page, { ...buildSeed(), trackerData: JSON.stringify({ ...baseTracker, companions: [] }) });
    await openTracker(page);

    await page.getByRole('button', { name: 'Compañeros' }).click();
    const picker = page.getByRole('dialog', { name: 'Compañeros y mascotas' });
    const catalogue = picker.locator('section').filter({ hasText: 'Disponibles' });
    await expect(catalogue.getByRole('button', { name: /Drumm/ })).toHaveCount(1);

    await picker.getByRole('button', { name: /Drumm/ }).click();
    await picker.getByLabel('Héroe').selectOption('vorn');
    await picker.getByRole('button', { name: '+ Añadir' }).click();

    await expect(catalogue.getByRole('button', { name: /Drumm/ })).toHaveCount(0);
    await expect(picker.getByRole('button', { name: /Drumm:/ })).toBeVisible();

    await picker.getByRole('button', { name: /Drumm:/ }).click();
    await expect(catalogue.getByRole('button', { name: /Drumm/ })).toHaveCount(1);
  });

  test('resetear restaura vida y estados de todas las criaturas', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      trackerData: JSON.stringify({
        ...baseTracker,
        companions: [
          { uid: 'c-drumm', id: 'drumm', heroId: 'vorn', order: 0, vida: 0, vidaMax: 1, estadosAlterados: [{ id: 'QUEMADURA', count: 1 }] },
          { uid: 'c-bronx', id: 'bronx', heroId: 'vorn', order: 1, vida: 0, vidaMax: 1, estadosAlterados: [] },
        ],
      }),
    });
    await openTracker(page);

    await page.getByRole('button', { name: 'Compañeros' }).click();
    const picker = page.getByRole('dialog', { name: 'Compañeros y mascotas' });
    await picker.getByRole('button', { name: /Resetear/ }).click();
    const confirm = page.getByRole('dialog', { name: 'Resetear compañeros' });
    await confirm.getByRole('button', { name: 'Resetear' }).click();

    await expect.poll(async () => {
      const data = await readStorage(page, 'trackerData', {});
      const drumm = (data.companions || []).find((entry) => entry.id === 'drumm');
      return [drumm?.vida, drumm?.estadosAlterados?.length];
    }).toEqual([1, 0]);
  });

  test('eliminar desde la vista ampliada quita la criatura de la partida', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      trackerData: JSON.stringify({
        ...baseTracker,
        companions: [
          { uid: 'c-drumm', id: 'drumm', heroId: 'vorn', order: 0, vida: 1, vidaMax: 1, estadosAlterados: [] },
        ],
      }),
    });
    await openTracker(page);

    await page.locator('[data-companion-id="drumm"]').waitFor({ state: 'visible' });
    await page.locator('[data-companion-id="drumm"]').click();
    const modal = page.getByRole('dialog', { name: 'Drumm' });
    await modal.waitFor({ state: 'visible' });
    await modal.getByRole('button', { name: 'Eliminar' }).click();
    const confirm = page.getByRole('dialog', { name: 'Eliminar compañero' });
    await confirm.getByRole('button', { name: 'Eliminar' }).click();

    await expect.poll(async () => {
      const data = await readStorage(page, 'trackerData', {});
      return data.companions?.length || 0;
    }).toBe(0);
    await expect(page.locator('[data-companion-id="drumm"]')).toHaveCount(0);
  });

  test('separa a los Héroes de Daren en su propio grupo', async ({ page }) => {
    await seedStorage(page, { ...buildSeed(), trackerData: JSON.stringify({ ...baseTracker, companions: [] }) });
    await openTracker(page);

    await page.getByRole('button', { name: 'Compañeros' }).click();
    const picker = page.getByRole('dialog', { name: 'Compañeros y mascotas' });

    await expect(picker.getByText('Mascotas (7)')).toBeVisible();
    await expect(picker.getByText('Compañeros (10)')).toBeVisible();
    await expect(picker.getByText('Héroes de Daren (6)')).toBeVisible();
    await expect(picker.getByRole('button', { name: /Lorelai/ })).toBeVisible();
    await expect(picker.getByRole('button', { name: /Capitán Conner/ })).toBeVisible();
  });

  test('Hakkon (Draugr) solo se asigna a un Nigromante activo y admite copias', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      expansions: JSON.stringify(['base', 'apocalypse_heroes_1']),
      trackerData: JSON.stringify({ ...necromancerTracker, companions: [] }),
    });
    await openTracker(page);

    await page.getByRole('button', { name: 'Compañeros' }).click();
    const picker = page.getByRole('dialog', { name: 'Compañeros y mascotas' });
    const catalogue = picker.locator('section').filter({ hasText: 'Disponibles' });

    await catalogue.getByRole('button', { name: /Hakkon/ }).click();
    await expect(picker.getByRole('option', { name: /Vorn/ })).toHaveCount(0);
    await expect(picker.getByRole('option', { name: /Mordred/ })).toHaveCount(1);
    await picker.getByLabel('Héroe').selectOption('mordred');
    await picker.getByRole('button', { name: '+ Añadir' }).click();

    await catalogue.getByRole('button', { name: /Hakkon/ }).click();
    await picker.getByLabel('Héroe').selectOption('mordred');
    await picker.getByRole('button', { name: '+ Añadir' }).click();

    await expect.poll(async () => {
      const data = await readStorage(page, 'trackerData', {});
      return (data.companions || []).filter((entry) => entry.id === 'hakkon').length;
    }).toBe(2);
  });
});
