import { describe, expect, it } from 'vitest';
import { healSurvivors } from '@/utils/hiloDeVida';

const monster = (uuid, vida, vidaMax, tipo = 'enemigo') => ({
  enemy: { uuid, vida, vidaMax, tipo },
});

describe('Hilo de Vida', () => {
  it('cura a los monstruos restantes sin superar su máximo', () => {
    const entries = [
      monster('a', 5, 10),
      monster('b', 9, 10),
      monster('removed', 4, 10),
      monster('card', 3, 10, 'especial'),
    ];
    const result = healSurvivors(entries, 'removed', 3);

    expect(result[0].enemy.vida).toBe(8);
    expect(result[1].enemy.vida).toBe(10);
    expect(result[2].enemy.vida).toBe(4);
    expect(result[3].enemy.vida).toBe(3);
  });

  it('no hace nada sin curación', () => {
    const entries = [monster('a', 5, 10)];
    expect(healSurvivors(entries, 'removed', 0)).toBe(entries);
  });
});
