import { describe, expect, it } from 'vitest';
import {
  BASE_GAP,
  CARD_HEIGHT,
  MAX_STACK_HEIGHT,
  boardSlotHeightFrom,
  cardDistance,
  compactSlotHeight,
  stackHeight,
} from '@/components/track/trackLayout';

describe('trackLayout', () => {
  it('la primera carta queda a BASE_GAP de la línea central', () => {
    expect(cardDistance(4, 0)).toBe(BASE_GAP);
  });

  it('las cartas se alejan progresivamente', () => {
    expect(cardDistance(4, 2)).toBeGreaterThan(cardDistance(4, 1));
  });

  it('una pila se mantiene en MAX_STACK_HEIGHT hasta 6 cartas', () => {
    for (const count of [1, 2, 3, 4, 6]) {
      expect(stackHeight(count)).toBeLessThanOrEqual(MAX_STACK_HEIGHT + 1);
    }
  });

  it('con muchas cartas el paso mínimo evita que la pila colapse', () => {
    for (const count of [10, 20]) {
      // Nunca por debajo de MIN_STEP (30 px) entre cartas.
      expect(stackHeight(count)).toBeLessThanOrEqual(BASE_GAP + (count - 1) * 30 + CARD_HEIGHT + 1);
    }
  });

  it('la altura del tablero acepta números de cartas, no alturas', () => {
    // Regresión: pasar stackHeight() a boardSlotHeightFrom duplicaba la altura.
    const unaCarta = boardSlotHeightFrom([1]);
    const dosCartas = boardSlotHeightFrom([2]);

    expect(unaCarta).toBe(448);
    expect(dosCartas).toBe(2 * stackHeight(2) + 16);
    expect(dosCartas).toBeLessThan(700);
  });

  it('la altura compacta se ajusta a la pila del slot', () => {
    expect(compactSlotHeight(0, 0)).toBe(360);
    expect(compactSlotHeight(4, 1)).toBeGreaterThanOrEqual(360);
    expect(compactSlotHeight(4, 1)).toBeLessThanOrEqual(2 * stackHeight(4) + 16 + 1);
  });

  it('CARD_HEIGHT y BASE_GAP son coherentes con la geometría', () => {
    expect(CARD_HEIGHT).toBeGreaterThan(BASE_GAP);
  });
});
