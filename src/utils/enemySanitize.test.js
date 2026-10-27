import { describe, expect, it } from 'vitest';
import { compactEnemy, compactPlacedEnemies } from '@/utils/enemySanitize';

const completo = {
  enemy: {
    uuid: 'u1',
    id: 'shadow_cultist_scenario',
    vida: 6,
    ataque: 1,
    position: 9,
    estadosAlterados: [{ id: 'VENENO_I', count: 0 }, { id: 'QUEMADURA_I', count: 2 }],
    // Campo pesado heredado de otra mecánica: no debe persistirse.
    grupoEnorme: new Array(1000).fill('x'),
  },
};

describe('compactEnemy', () => {
  it('conserva solo los campos conocidos', () => {
    const resultado = compactEnemy(completo);
    expect(resultado.enemy.id).toBe('shadow_cultist_scenario');
    expect(resultado.enemy.vida).toBe(6);
    expect(resultado.enemy.grupoEnorme).toBeUndefined();
  });

  it('descarta estados a cero', () => {
    const resultado = compactEnemy(completo);
    expect(resultado.enemy.estadosAlterados).toEqual([{ id: 'QUEMADURA_I', count: 2 }]);
  });

  it('tolera entradas inválidas', () => {
    expect(compactEnemy(null)).toBeNull();
    expect(compactEnemy('texto')).toBeNull();
  });
});

describe('compactPlacedEnemies', () => {
  it('elimina duplicados por uuid', () => {
    const lista = [completo, { ...completo }, { enemy: { ...completo.enemy, uuid: 'u2' } }];
    expect(compactPlacedEnemies(lista)).toHaveLength(2);
  });

  it('respeta el límite de seguridad', () => {
    const lista = Array.from({ length: 200 }, (_, i) => ({ enemy: { uuid: `u${i}`, id: 'x' } }));
    expect(compactPlacedEnemies(lista, 120)).toHaveLength(120);
  });

  it('devuelve lista vacía con datos inválidos', () => {
    expect(compactPlacedEnemies(null)).toEqual([]);
    expect(compactPlacedEnemies([{ enemy: {} }])).toEqual([]);
  });
});
