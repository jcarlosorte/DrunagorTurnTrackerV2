import { describe, expect, it } from 'vitest';
import { CARTAS_OVERLORD, getOverlordDeck } from '@/data/cartasEspeciales';

describe('cartas de Señor Supremo', () => {
  it('incluye las 10 cartas de las Hermanas Fatídicas', () => {
    const ids = CARTAS_OVERLORD.map((carta) => carta.id);
    for (let i = 11; i <= 20; i += 1) {
      expect(ids).toContain(`over_${i}`);
    }
  });

  it('cada Señor Supremo usa su propia baraja', () => {
    expect(getOverlordDeck('fallen_sisters').map((carta) => carta.id))
      .toEqual(Array.from({ length: 10 }, (_, index) => `over_${index + 11}`));
    expect(getOverlordDeck('demon_lord').map((carta) => carta.id))
      .toEqual(Array.from({ length: 10 }, (_, index) => `over_${index + 1}`));
  });

  it('mantiene las runas y posiciones indicadas', () => {
    expect(CARTAS_OVERLORD.find((carta) => carta.id === 'over_11'))
      .toMatchObject({ rune: 'rojo', runePosition: 'arriba' });
    expect(CARTAS_OVERLORD.find((carta) => carta.id === 'over_15'))
      .toMatchObject({ rune: 'azul', runePosition: 'abajo' });
    expect(CARTAS_OVERLORD.find((carta) => carta.id === 'over_20'))
      .toMatchObject({ rune: 'naranja', runePosition: 'arriba' });
  });
});
