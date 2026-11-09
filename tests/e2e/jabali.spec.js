import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const boarEnemy = {
  enemy: {
    uuid: 'e2e-flickering-boar',
    id: 'flickering_boar',
    nombre: 'Flickering Boar',
    name: 'Flickering Boar',
    color: 'blanco',
    categoria: 'soldado',
    comportamiento: 'estandar',
    vida: 10,
    vidaMax: 10,
    movimiento: 3,
    ataque: 2,
    rune: 'naranja',
    runePosition: 'arriba',
    position: 1,
    tipo: 'enemigo',
    estadosAlterados: [],
    inmunidad: [],
    capacidades: [],
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
