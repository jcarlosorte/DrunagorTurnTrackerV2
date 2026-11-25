import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, readStorage, seedStorage } from './helpers';

const apocalypseSeed = () => ({
  ...buildSeed(),
  mainBox: JSON.stringify('apocalypse'),
  expansions: JSON.stringify(['apocalypse_adventures']),
});

test.describe('Seguidores de Apocalipsis', () => {
  test('muestra los seis seguidores, añade a Khadija y conserva su ficha', async ({ page }) => {
    await seedStorage(page, apocalypseSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Compañeros' }).click();
    const picker = page.getByRole('dialog', { name: 'Compañeros y mascotas' });
    const followers = picker.locator('section').filter({ hasText: 'Seguidores (6)' });

    await expect(followers).toBeVisible();
    for (const name of [
      'Surcadora Khadija',
      'Condotierro DaViggo',
      'Amsterd DeHanse',
      'Randy Ribeiro',
      'Carmilla Reinard',
      'Robin Rising',
    ]) {
      await expect(followers.getByText(name, { exact: true })).toBeVisible();
    }
    await expect(followers.getByText('Elros', { exact: true })).toHaveCount(0);

    await followers.getByRole('button', { name: /Surcadora Khadija/ }).click();
    await expect(followers.getByLabel('Perfil')).toHaveValue('normal');
    await followers.getByRole('button', { name: /Añadir al track/ }).click();

    await expect.poll(async () => {
      const data = await readStorage(page, 'trackerData', {});
      return data.followers?.find((entry) => entry.id === 'khadija');
    }).toMatchObject({ role: 'agresor', stateId: 'normal', vida: 6, vidaMax: 6 });

    await picker.getByRole('button', { name: 'Abrir' }).click();
    const modal = page.getByRole('dialog', { name: 'Surcadora Khadija' });
    await expect(modal).toContainText('Amazona Prodigio');
    await expect(modal).toContainText('1 HÉROE ADYACENTE');
    await expect(modal).toContainText('INSPIRAR');
    await modal.getByRole('button', { name: '1 HÉROE ADYACENTE: descripción' }).click();
    await expect(modal.getByText('La capacidad afecta a 1 héroe adyacente.')).toBeVisible();

    const statusPanel = modal.getByTestId('ally-status-panel');
    await expect(statusPanel.getByTestId('ally-status-VENENO_I')).toBeVisible();
    await expect(statusPanel.getByRole('button', { name: 'veneno: +1' })).toBeVisible();
    await expect(statusPanel).not.toContainText('veneno');
  });

  test('Robin Rising permite elegir entre Herido y Sano', async ({ page }) => {
    await seedStorage(page, apocalypseSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Compañeros' }).click();
    const picker = page.getByRole('dialog', { name: 'Compañeros y mascotas' });
    const followers = picker.locator('section').filter({ hasText: 'Seguidores (6)' });

    await followers.getByRole('button', { name: /Robin Rising/ }).click();
    const state = followers.getByLabel('Perfil');
    await expect(state.locator('option')).toHaveText(['Herido', 'Sano']);
    await state.selectOption('sano');
    await followers.getByRole('button', { name: /Añadir al track/ }).click();

    await expect.poll(async () => {
      const data = await readStorage(page, 'trackerData', {});
      return data.followers?.find((entry) => entry.id === 'robin');
    }).toMatchObject({ stateId: 'sano', vida: 7, vidaMax: 7 });
  });

  test('los Acompañantes no se guardan en el campamento y se eliminan al reiniciar', async ({ page }) => {
    await seedStorage(page, apocalypseSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Compañeros' }).click();
    const picker = page.getByRole('dialog', { name: 'Compañeros y mascotas' });
    const cohorts = picker.locator('section').filter({ hasText: 'Acompañantes (4)' });

    await expect(cohorts).toBeVisible();
    await expect(cohorts).toContainText('No se conservan entre aventuras.');
    await expect(picker).toContainText('Los seguidores se guardan; los acompañantes no.');
    for (const name of ['Surcadora Avernal', 'Condotierro Umbraliano', 'Christi & Jeffrey', 'Carroñero']) {
      await expect(cohorts.getByText(name, { exact: true })).toBeVisible();
    }

    await cohorts.getByRole('button', { name: /Surcadora Avernal/ }).click();
    await cohorts.getByRole('button', { name: /Añadir al track/ }).click();

    await expect.poll(async () => {
      const data = await readStorage(page, 'trackerData', {});
      return data.followers?.find((entry) => entry.id === 'surcadora');
    }).toMatchObject({ cohort: true, role: 'controlador', vida: 5, vidaMax: 5 });

    expect(await readStorage(page, 'campFollowers', [])).toEqual([]);

    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Menú de juego' }).click();
    await page.getByRole('menuitem', { name: 'Reiniciar partida' }).click();
    const dialog = page.getByRole('dialog', { name: 'Reiniciar partida' });
    await dialog.getByRole('button', { name: 'Reiniciar partida' }).click();

    await expect.poll(async () => {
      const data = await readStorage(page, 'trackerData', {});
      return data.followers?.some((entry) => entry.id === 'surcadora');
    }).toBe(false);
  });

  test('el grupo Cohort se traduce al inglés', async ({ page }) => {
    await seedStorage(page, { ...apocalypseSeed(), lang: JSON.stringify('en') });
    await openTracker(page);

    await page.getByRole('button', { name: 'Companions' }).click();
    const picker = page.getByRole('dialog', { name: 'Companions and pets' });
    const cohorts = picker.locator('section').filter({ hasText: /Cohort \(4\)/i });

    await expect(cohorts).toBeVisible();
    await expect(cohorts).toContainText('Cohort');
    await expect(cohorts).not.toContainText('Acompañantes');
    await expect(picker).not.toContainText('Cohort Companions');
  });
});
