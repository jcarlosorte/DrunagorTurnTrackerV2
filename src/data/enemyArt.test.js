import { describe, expect, it } from 'vitest';
import { getEnemyArt } from '@/data/enemyArt';

describe('enemyArt', () => {
  it('usa el arte V2 cuando existe y conserva el original cuando no', () => {
    expect(getEnemyArt('abomination', 'original')).not.toBe('original');
    expect(getEnemyArt('enemigo_sin_arte_v2', 'original')).toBe('original');
  });

  it('resuelve los alias de enemigos con nombres de archivo distintos', () => {
    [
      'skeleton_guard',
      'skeleton_archer_esbirro1',
      'violent_bully',
      'boatswain',
      'wakened_king_boss',
      'undead_king_boss',
      'dark_vampire',
      'hero_corrupted',
      'dark_vampire_com',
      'luccanor_com',
      'aralhezec',
      'wermunggdir',
      'scout_darkness',
      'commander_twins',
      'commander_thern',
    ].forEach((id) => {
      expect(getEnemyArt(id, 'original'), id).not.toBe('original');
    });
  });
});
