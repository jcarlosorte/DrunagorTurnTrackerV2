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

test.describe('Compañeros y mascotas', () => {
  test('se asignan sin límite y guardan vida y estados', async ({ page }) => {
    await seedStorage(page, { ...buildSeed(), trackerData: JSON.stringify({ ...baseTracker, companions: [] }) });
    await openTracker(page);

    await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });
    let dialog = page.getByRole('dialog');
    const section = dialog.locator('section').filter({ hasText: 'Compañeros y mascotas' });
    await dialog.getByLabel('Elegir criatura').selectOption('drumm');
    await section.getByRole('button', { name: '+ Añadir' }).click();
    await dialog.getByLabel('Elegir criatura').selectOption('bronx');
    await section.getByRole('button', { name: '+ Añadir' }).click();

    await expect(section.getByRole('listitem').filter({ hasText: 'Drumm' })).toBeVisible();
    await expect(section.getByRole('listitem').filter({ hasText: 'Bronx' })).toBeVisible();

    await section.getByRole('button', { name: 'Abrir' }).first().click();
    dialog = page.getByRole('dialog');
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
    await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });
    const reopened = page.getByRole('dialog');
    await expect(reopened.getByText(/Mascota · 0\/1 · 1 estados/)).toBeVisible();
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
  });
});
