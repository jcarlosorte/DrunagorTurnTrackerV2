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
    cara: 'A',
    specialBehavior: 'flickering_boar',
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

async function seedBoar(page) {
  await seedStorage(page, buildSeed());
  await openTracker(page);
  await page.evaluate((enemyState) => {
    localStorage.setItem('initEnemiesState', enemyState);
  }, JSON.stringify({ placedEnemies: [boarEnemy] }));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.track-slot');
}

test('la baraja del Jabalí se inicializa al colocarlo y no muestra panel', async ({ page }) => {
  await seedBoar(page);

  await expect.poll(async () => page.evaluate(() => {
    const game = JSON.parse(localStorage.getItem('gameState') || '{}');
    return {
      active: game.flickeringBoarDeck?.active,
      size: game.flickeringBoarDeck?.deck?.length,
    };
  })).toEqual({ active: true, size: 8 });
  await expect(page.getByTestId('flickering-boar-deck')).toHaveCount(0);
});

test('el Jabalí muestra su capacidad y se voltea en el tablero sin abrir la vista ampliada', async ({ page }) => {
  await seedBoar(page);

  const enemyCard = page.locator('[data-enemy-card="e2e-flickering-boar"]');
  await enemyCard.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('SI EL JABALÍ RECIBE DAÑO, DESAPARECE');
  await dialog.getByRole('button', { name: 'Cerrar' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await enemyCard.getByRole('button', { name: 'Voltear carta' }).click();
  await expect(enemyCard).toContainText('JABALÍ PARPADEANTE');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await enemyCard.click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await enemyCard.getByRole('button', { name: 'Voltear al monstruo' }).click();
  await expect(enemyCard.getByRole('button', { name: 'Voltear carta' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
