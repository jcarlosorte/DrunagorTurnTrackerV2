import { describe, expect, it } from 'vitest';
import { CARTAS_OVERLORD } from '@/data/cartasEspeciales';

describe('cartas de Señor Supremo', () => {
  it('incluye las 10 cartas de las Hermanas Fatídicas', () => {
    const ids = CARTAS_OVERLORD.map((carta) => carta.id);
    for (let i = 11; i <= 20; i += 1) {
      expect(ids).toContain(`over_${i}`);
    }
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
