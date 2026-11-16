import { describe, expect, it } from 'vitest';
import { getAralAllAttackValues, isAralAllAttacksCard } from './aralAttacks';

describe('ataques de Aral’hezec', () => {
  it('calcula los tres ataques con X = 5', () => {
    expect(getAralAllAttackValues(5)).toEqual({
      dragonBreath: 12,
      wingStrike: 7,
      tailSwipe: 5,
    });
  });

  it('calcula los ataques con X = 0', () => {
    expect(getAralAllAttackValues(0)).toEqual({
      dragonBreath: 2,
      wingStrike: 2,
      tailSwipe: 0,
    });
  });

  it('reconoce las cartas que ejecutan todos los ataques', () => {
    expect(isAralAllAttacksCard('boss_16')).toBe(true);
    expect(isAralAllAttacksCard('boss_20')).toBe(true);
    expect(isAralAllAttacksCard('boss_19')).toBe(false);
  });
});
