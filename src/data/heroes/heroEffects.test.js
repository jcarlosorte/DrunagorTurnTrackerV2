import { describe, expect, it } from 'vitest';
import {
  ALL_HERO_EFFECTS,
  AURAS,
  CONSECUENCIAS,
  ESTADOS_HEROE,
  HERO_EFFECT_GROUPS,
  getHeroEffect,
  getHeroEffectDescription,
  getHeroEffectName,
} from '@/data/heroes/index';

describe('efectos de héroe', () => {
  it('mantiene los catálogos vacíos hasta recibir las listas nuevas', () => {
    expect(AURAS).toEqual([]);
    expect(CONSECUENCIAS).toEqual([]);
    expect(ESTADOS_HEROE).toEqual([]);
    expect(ALL_HERO_EFFECTS).toEqual([]);
    expect(HERO_EFFECT_GROUPS.every((group) => group.items.length === 0)).toBe(true);
  });

  it('gestiona sin errores las consultas de efectos eliminados', () => {
    expect(getHeroEffect('conciencia_tranquila')).toBeNull();
    expect(getHeroEffectName('conciencia_tranquila')).toBe('conciencia_tranquila');
    expect(getHeroEffectDescription('conciencia_tranquila')).toBe('');
  });
});
