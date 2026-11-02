import { describe, expect, it } from 'vitest';
import { COMPANIONS, getCompanionsForExpansions } from '@/data/companions';

describe('getCompanionsForExpansions', () => {
  it('devuelve las 23 criaturas del juego base', () => {
    const base = getCompanionsForExpansions(['base']);
    expect(base).toHaveLength(23);
    expect(base.every((companion) => companion.expansionId === 'base')).toBe(true);
  });

  it('filtra por las expansiones activas', () => {
    expect(getCompanionsForExpansions([])).toEqual([]);
    expect(getCompanionsForExpansions(['luccanor'])).toEqual([]);
    expect(getCompanionsForExpansions(['base', 'luccanor'])).toHaveLength(23);
  });

  it('todas las criaturas declaran su expansión', () => {
    expect(COMPANIONS.every((companion) => typeof companion.expansionId === 'string' && companion.expansionId)).toBe(true);
  });
});
