import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const boarEnemy = {
  enemy: {
    uuid: 'e2e-flickering-boar',
    id: 'flickering_boar',
    nombre: 'Flickering Boar',
    name: 'Flickering Boar',
    color: 'escenario',
    categoria: 'escenario',
    comportamiento: 'especial',
    cara: 'A',
    vida: 15,
    vidaMax: 15,
    movimiento: 3,
    ataque: 0,
    rune: 'naranja',
    runePosition: 'abajo',
    position: 1,
    tipo: 'enemigo',
    estadosAlterados: [],
    inmunidad: ['GRANDE'],
    tipo_ataque: '',
    capacidades: ['SI EL JABALÍ RECIBE DAÑO, DESAPARECE'],
    capacidadesOriginales: ['SI EL JABALÍ RECIBE DAÑO, DESAPARECE'],
    imagen: '',
  },
};

test('la baraja del Jabalí Parpadeante se inicializa y recarga al agotarse', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);
  await page.evaluate((enemyState) => {
    localStorage.setItem('initEnemiesState', enemyState);
  }, JSON.stringify({ placedEnemies: [boarEnemy] }));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.track-slot');

  const deckBar = page.getByTestId('flickering-boar-deck');
  await expect(deckBar).toBeVisible();
  await expect(deckBar).toContainText('Mazo: 8/8');

  for (let index = 0; index < 8; index += 1) {
    await deckBar.getByRole('button', { name: /Robar/ }).click();
  }
  await expect(deckBar).toContainText('Descartadas: 8');
  await expect(deckBar.getByRole('button', { name: /Recargar y robar/ })).toBeVisible();

  await deckBar.getByRole('button', { name: /Recargar y robar/ }).click();
  await expect(deckBar).toContainText('Mazo: 7/8');
  await expect.poll(async () => page.evaluate(() => {
    const game = JSON.parse(localStorage.getItem('gameState') || '{}');
    return game.flickeringBoarDeck?.cycles;
  })).toBe(1);
});

test('el Jabalí muestra su capacidad y permite voltear entre monstruo y carta', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);
  await page.evaluate((enemyState) => {
    localStorage.setItem('initEnemiesState', enemyState);
  }, JSON.stringify({ placedEnemies: [boarEnemy] }));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.track-slot');

  await page.getByRole('button', { name: /Flickering Boar|Jabalí Parpadeante/ }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('SI EL JABALÍ RECIBE DAÑO, DESAPARECE');
  await dialog.getByRole('button', { name: /Voltear carta/ }).click();
  await expect(page.getByRole('dialog')).toContainText('JABALÍ PARPADEANTE');
  await expect(page.getByRole('dialog')).toContainText('Primero, Manifiesta 1 Runa.');
  await page.getByRole('dialog').getByRole('button', { name: /Voltear al monstruo/ }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: /Voltear carta/ })).toBeVisible();
});
