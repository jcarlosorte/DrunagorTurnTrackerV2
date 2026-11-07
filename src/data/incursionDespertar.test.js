import { describe, expect, it } from 'vitest';
import { INCURSION_DESPERTAR } from '@/data/incursionDespertar';

describe('incursiones de Despertar', () => {
  it('contiene las 3 cartas con sus dos caras', () => {
    const ids = [...new Set(INCURSION_DESPERTAR.map((card) => card.id))];
    expect(ids).toHaveLength(3);
    expect(INCURSION_DESPERTAR).toHaveLength(6);
    INCURSION_DESPERTAR.forEach((card) => {
      expect(card.tipo).toBe('incursion');
      expect(card.posicion).toBe('arriba');
      expect(card.expansionId).toBe('apocalypse_awakenings');
      expect(card.incursion?.counts?.A).toHaveLength(3);
    });
    expect(
      INCURSION_DESPERTAR.some((card) => card.incursion?.requiresNoMonsters),
    ).toBe(true);
    expect(
      INCURSION_DESPERTAR.some((card) => card.incursion?.fixedMonsterId === 'tide_hunter'),
    ).toBe(true);
  });
});
