import { describe, expect, it } from 'vitest';
import { getHeroBaseCubes } from '@/data/heroCubes';

describe('cubos de Lorien y el Pack de Héroes', () => {
  it('usa los valores oficiales de cada héroe', () => {
    const expected = {
      mordred: [1, 2, 1, 1],
      diana: [2, 1, 1, 1],
      brigitte: [2, 1, 1, 1],
      azriel: [2, 1, 1, 1],
      drixx: [2, 1, 1, 1],
      gramosh: [1, 2, 1, 1],
      sahara: [2, 1, 1, 1],
      siff: [2, 1, 1, 1],
      lorien: [1, 2, 1, 1],
    };

    Object.entries(expected).forEach(([id, [amarillo, rojo, verde, azul]]) => {
      expect(getHeroBaseCubes({ id }), id).toEqual({ amarillo, rojo, verde, azul });
    });
  });
});
