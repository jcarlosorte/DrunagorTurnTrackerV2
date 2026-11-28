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
  it('carga las 20 auras base y deja vacíos los catálogos pendientes', () => {
    expect(AURAS).toHaveLength(20);
    expect(CONSECUENCIAS).toEqual([]);
    expect(ESTADOS_HEROE).toEqual([]);
    expect(ALL_HERO_EFFECTS).toHaveLength(20);
    expect(HERO_EFFECT_GROUPS.find((group) => group.id === 'auras').items).toHaveLength(20);
    expect(HERO_EFFECT_GROUPS.find((group) => group.id === 'consecuencias').items).toEqual([]);
    expect(HERO_EFFECT_GROUPS.find((group) => group.id === 'estados').items).toEqual([]);
  });

  it('expone nombre y texto bilingües de las auras', () => {
    expect(getHeroEffect('conciencia_tranquila')).toBeTruthy();
    expect(getHeroEffectName('conciencia_tranquila', 'es')).toBe('Conciencia tranquila');
    expect(getHeroEffectName('conciencia_tranquila', 'en')).toBe('Clear Conscious');
    expect(getHeroEffectDescription('conciencia_tranquila', 'es')).toContain('Criatura');
    expect(getHeroEffectDescription('conciencia_tranquila', 'en')).toContain('creature');
  });

  it('gestiona sin errores las consultas de efectos inexistentes', () => {
    expect(getHeroEffect('no_existe')).toBeNull();
    expect(getHeroEffectName('no_existe')).toBe('no_existe');
    expect(getHeroEffectDescription('no_existe')).toBe('');
  });
});
