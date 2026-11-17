import { describe, expect, it } from 'vitest';
import { ENEMIES, isEnemyLarge } from '@/data/enemies';

describe('tamaño de enemigos', () => {
  it('reconoce los enemigos grandes del catálogo', () => {
    expect(isEnemyLarge({ id: 'shadow_knight' })).toBe(true);
    expect(isEnemyLarge({ id: 'abomination' })).toBe(true);
    expect(isEnemyLarge({ id: 'skeleton_archer' })).toBe(false);
    expect(isEnemyLarge({ size: 'grande' })).toBe(true);
  });

  it('mantiene el tamaño grande en las variantes del catálogo', () => {
    const large = ENEMIES.filter((enemy) => enemy.size === 'grande');
    expect(large.length).toBeGreaterThan(0);
    expect(large.every((enemy) => isEnemyLarge(enemy))).toBe(true);
    expect(ENEMIES.filter((enemy) => enemy.id === 'skeleton_archer').every((enemy) => !isEnemyLarge(enemy))).toBe(true);
  });
});
