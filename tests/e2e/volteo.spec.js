import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

const complejo = {
  uuid: 'e2e-complejo',
  id: 'rotten_flesh',
  color: 'gris',
  categoria: 'campeon',
  comportamiento: 'complejo',
  rune: 'naranja',
  position: 1,
  runePosition: 'arriba',
  vida: 24,
  vidaMax: 24,
  movimiento: 4,
  ataque: 6,
  tipo_ataque: 'cuerpo',
  capacidades: [],
  capacidadesOriginales: [],
  inmunidad: [],
  estadosAlterados: [],
  imagen: '',
  cara: 'A',
};

function seedConComplejo() {
  return {
    ...buildSeed(),
    initEnemiesState: JSON.stringify({
      placedEnemies: [{ enemy: complejo }],
      huespedActivo: false,
      acechoActivo: false,
      invadidosActivo: false,
      oscuridadActivo: false,
      asaltoActivo: false,
      usedColors: [],
      usedColorsBig: [],
      enemyColorMap: {},
    }),
  };
}

const leerEnemigo = (page) => page.evaluate(() => {
  const estado = JSON.parse(localStorage.getItem('initEnemiesState') || '{}');
  return estado.placedEnemies?.[0]?.enemy ?? null;
});

test.describe('Enemigos con dos caras', () => {
  test('la carta gira y vuelve a quedar recta', async ({ page }) => {
    await seedStorage(page, seedConComplejo());
    await openTracker(page);

    const carta = page.locator('[data-enemy-card="e2e-complejo"]');
    await expect(carta).toHaveCount(1);

    // Avanzar hasta el turno del enemigo y capturar la animación en curso.
    const animando = () => carta.evaluate((el) => el.className.includes('card-flip'));
    let visto = false;
    for (let intento = 0; intento < 6 && !visto; intento += 1) {
      await page.getByTestId('next-turn').click();
      const inicio = Date.now();
      while (Date.now() - inicio < 1200) {
        if (await animando()) {
          visto = true;
          break;
        }
        await page.waitForTimeout(80);
      }
    }
    expect(visto).toBe(true);

    const durante = await carta.evaluate((el) => ({
      animando: el.className.includes('card-flip'),
      animacion: getComputedStyle(el).animationName,
    }));
    expect(durante.animando).toBe(true);
    expect(durante.animacion).toBe('cardFlipY');

    // Al terminar no debe quedar ningún giro aplicado.
    await page.waitForTimeout(1200);
    const despues = await carta.evaluate((el) => ({
      animando: el.className.includes('card-flip'),
      transform: getComputedStyle(el).transform,
    }));
    expect(despues.animando).toBe(false);
    expect(despues.transform).toBe('none');
  });

  test('alterna A/B y conserva los valores de la cara A', async ({ page }) => {
    await seedStorage(page, seedConComplejo());
    await openTracker(page);

    const caras = [];
    for (let turno = 0; turno < 6; turno += 1) {
      await page.getByTestId('next-turn').click();
      await page.waitForTimeout(900);
      caras.push((await leerEnemigo(page))?.cara);
    }

    // Debe haber pasado por ambas caras más de una vez.
    const distintas = new Set(caras.filter(Boolean));
    expect(distintas.has('A')).toBe(true);
    expect(distintas.has('B')).toBe(true);

    const secuencia = caras.join('');
    expect(secuencia).toMatch(/A.*B.*A/s);

    const enemigo = await leerEnemigo(page);
    // Con evolución activa: 6 + 2 y 4 + 1; nunca los valores de otra variante.
    expect([6, 8]).toContain(enemigo.ataque);
    expect([4, 5]).toContain(enemigo.movimiento);
    expect(enemigo.vida).toBe(24);
  });
});
