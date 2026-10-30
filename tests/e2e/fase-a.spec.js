import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Fase A · navegación y configuración', () => {
  test('la portada quita Partidas/Gestionar de la barra y muestra pie con enlaces', async ({ page }) => {
    await page.goto('./', { waitUntil: 'networkidle' });

    const header = page.locator('header').first();
    await expect(header.getByRole('button', { name: /Partidas/i })).toHaveCount(0);
    await expect(header.getByRole('link', { name: /Gestionar/i })).toHaveCount(0);

    await expect(page.getByRole('button', { name: /^Partidas/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Tutorial/ })).toBeVisible();

    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'GitHub de jcarlosorte' }))
      .toHaveAttribute('href', 'https://github.com/jcarlosorte');
    await expect(footer.getByRole('link', { name: 'Instagram de carl_el_mazmorrero' }))
      .toHaveAttribute('href', 'https://www.instagram.com/carl_el_mazmorrero/');
    await expect(footer.getByTestId('build-badge')).toBeVisible();
  });

  test('el tutorial abre desde la portada y muestra sus secciones', async ({ page }) => {
    await page.goto('./', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /^Tutorial/ }).click();

    await expect(page).toHaveURL(/\/tutorial\/?$/);
    await expect(page.getByRole('heading', { name: /El tablero/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Partidas y copias/ })).toBeVisible();
    await page.getByRole('button', { name: /Volver al inicio/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('configuración: reglas automáticas por Apocalipsis y forzado manual', async ({ page }) => {
    await page.goto('./config', { waitUntil: 'networkidle' });

    const rules = page.getByRole('radiogroup', { name: 'Versión de reglas' });
    await expect(rules.getByRole('radio', { name: /Reglas 1.5/ })).toHaveAttribute('aria-checked', 'true');
    await expect(rules.getByRole('radio', { name: /Reglas 2.0/ })).toHaveAttribute('aria-checked', 'false');

    // La expansión está deshabilitada en la UI (falta copia en español), así que
    // se siembra el estado que tendría el usuario al activarla.
    await page.evaluate(() => localStorage.setItem('expansions', JSON.stringify(['base', 'apocalypse_adventures'])));
    await page.reload({ waitUntil: 'networkidle' });
    await expect(rules.getByRole('radio', { name: /Reglas 2.0/ })).toHaveAttribute('aria-checked', 'true');

    await rules.getByRole('radio', { name: /Reglas 1.5/ }).click();
    await expect(page.getByRole('status')).toContainText('Apocalipsis');

    await page.getByRole('button', { name: /^Automático/ }).click();
    await expect(rules.getByRole('radio', { name: /Reglas 2.0/ })).toHaveAttribute('aria-checked', 'true');
  });

  test('configuración: el panel de Partidas se despliega sin botón aparte', async ({ page }) => {
    await page.goto('./config', { waitUntil: 'networkidle' });

    await page.locator('details summary').click();
    await expect(page.getByLabel('Nombre de la partida')).toBeVisible();
    await expect(page.getByRole('button', { name: /Ir a Partidas/ })).toHaveCount(0);
  });

  test('track: el menú de juego agrupa partidas, música, inicio y configuración', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    await page.getByRole('button', { name: 'Menú de juego' }).click();
    const menu = page.getByRole('menu', { name: 'Menú de juego' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Partidas' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Música' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Inicio' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Volver a configuración' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
  });
});
