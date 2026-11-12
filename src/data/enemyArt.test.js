import { describe, expect, it } from 'vitest';
import { getEnemyArt } from '@/data/enemyArt';

describe('enemyArt', () => {
  it('usa el arte V2 cuando existe y conserva el original cuando no', () => {
    expect(getEnemyArt('abomination', 'original')).not.toBe('original');
    expect(getEnemyArt('enemigo_sin_arte_v2', 'original')).toBe('original');
  });
});
