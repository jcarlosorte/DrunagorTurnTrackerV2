import { describe, expect, it } from 'vitest';
import { SCENES } from './scenes';

const chapter3 = SCENES.find((scene) => scene.id === 'base_chapter3');

function totalEnemiesForHeroes(count) {
  const total = { gris: 0, negro: 0, blanco: 0 };
  for (let heroes = 1; heroes <= count; heroes += 1) {
    (chapter3.enemiesByHeroes[heroes] || []).forEach((group) => {
      total[group.color] = (total[group.color] || 0) + (group.quantity || 1);
    });
  }
  return total;
}

describe('base_chapter3 enemies', () => {
  it('acumula una sola vez cada grupo al aumentar héroes', () => {
    expect(totalEnemiesForHeroes(1)).toEqual({ gris: 1, negro: 1, blanco: 0 });
    expect(totalEnemiesForHeroes(2)).toEqual({ gris: 2, negro: 1, blanco: 1 });
    expect(totalEnemiesForHeroes(3)).toEqual({ gris: 2, negro: 2, blanco: 2 });
    expect(totalEnemiesForHeroes(4)).toEqual({ gris: 3, negro: 2, blanco: 3 });
    expect(totalEnemiesForHeroes(5)).toEqual({ gris: 4, negro: 2, blanco: 4 });
  });
});
