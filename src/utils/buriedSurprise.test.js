import { describe, expect, it } from 'vitest';
import { getBuriedSurpriseSummons } from './buriedSurprise';

describe('getBuriedSurpriseSummons', () => {
  it('usa un MG soldado con 1 o 2 jugadores', () => {
    expect(getBuriedSurpriseSummons(1)).toHaveLength(1);
    expect(getBuriedSurpriseSummons(2)).toHaveLength(1);
  });

  it('añade un MB soldado con 3 o 4 jugadores', () => {
    expect(getBuriedSurpriseSummons(3).map((group) => group.color)).toEqual(['gris', 'blanco']);
    expect(getBuriedSurpriseSummons(4).map((group) => group.color)).toEqual(['gris', 'blanco']);
  });

  it('añade otro MG soldado con 5 jugadores', () => {
    expect(getBuriedSurpriseSummons(5).map((group) => group.color)).toEqual(['gris', 'blanco', 'gris']);
  });
});
