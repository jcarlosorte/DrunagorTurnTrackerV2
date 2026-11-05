import { describe, expect, it } from 'vitest';
import {
  ALL_HERO_EFFECTS,
  AURAS,
  CONSECUENCIAS,
  ESTADOS_HEROE,
  HERO_EFFECT_CAMPAIGNS,
} from '@/data/heroes/index';

describe('efectos de héroe por campaña', () => {
  it('los efectos actuales pertenecen a Core', () => {
    expect(AURAS.every((item) => item.campaign === 'core')).toBe(true);
    expect(CONSECUENCIAS.every((item) => item.campaign === 'core')).toBe(true);
    expect(ESTADOS_HEROE.every((item) => item.campaign === 'core')).toBe(true);
  });

  it('todos usan una campaña conocida', () => {
    expect(ALL_HERO_EFFECTS.length).toBeGreaterThan(0);
    expect(ALL_HERO_EFFECTS.every((item) => HERO_EFFECT_CAMPAIGNS.includes(item.campaign))).toBe(true);
  });
});
