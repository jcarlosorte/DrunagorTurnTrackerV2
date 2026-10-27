import { describe, expect, it } from 'vitest';
import { esEnemigoDeEscenario, findEnemyVariant } from '@/utils/enemyVariant';

const CATALOG = [
  // Aparición de escenario: sin comportamiento y fuera de la lista configurable.
  { id: 'shadow_cultist_scenario', categoria: 'esbirro', color: 'escenario', scenario: 'escenario', cara: 'A' },
  // Variantes normales por comportamiento.
  { id: 'rotten_flesh', categoria: 'campeon', comportamiento: 'complejo', cara: 'A' },
  { id: 'rotten_flesh', categoria: 'campeon', comportamiento: 'complejo', cara: 'B' },
  { id: 'rotten_flesh', categoria: 'campeon', comportamiento: 'alternativo' },
  { id: 'skeleton_archer', categoria: 'soldado', comportamiento: 'estandar' },
  { id: 'dark_vampire_com', categoria: 'comandante', color: 'comandante' },
];

describe('findEnemyVariant', () => {
  it('encuentra una aparición de escenario sin comportamiento ni lista', () => {
    const found = findEnemyVariant(CATALOG, {
      id: 'shadow_cultist_scenario',
      categoria: 'esbirro',
      comportamiento: 'estandar',
      enemies: [],
    });
    expect(found?.id).toBe('shadow_cultist_scenario');
  });

  it('tolera comportamiento ausente en el catálogo', () => {
    const catalog = [{ id: 'sin_comportamiento', categoria: 'soldado' }];
    const found = findEnemyVariant(catalog, {
      id: 'sin_comportamiento',
      categoria: 'soldado',
      enemies: ['sin_comportamiento'],
    });
    expect(found).not.toBeNull();
  });

  it('nunca devuelve la cara B', () => {
    const found = findEnemyVariant(CATALOG, {
      id: 'rotten_flesh',
      categoria: 'campeon',
      comportamiento: 'complejo',
      enemies: ['rotten_flesh'],
    });
    expect(found.cara).toBe('A');
  });

  it('respeta el comportamiento pedido', () => {
    const found = findEnemyVariant(CATALOG, {
      id: 'rotten_flesh',
      categoria: 'campeon',
      comportamiento: 'alternativo',
      enemies: ['rotten_flesh'],
    });
    expect(found.comportamiento).toBe('alternativo');
  });

  it('exige estar en la lista configurada salvo para escenario', () => {
    expect(findEnemyVariant(CATALOG, { id: 'skeleton_archer', categoria: 'soldado', enemies: [] })).toBeNull();
    expect(findEnemyVariant(CATALOG, {
      id: 'skeleton_archer',
      categoria: 'soldado',
      enemies: ['skeleton_archer'],
    })).not.toBeNull();
  });

  it('los comandantes ignoran el comportamiento', () => {
    const found = findEnemyVariant(CATALOG, {
      id: 'dark_vampire_com',
      categoria: 'comandante',
      comportamiento: 'estandar',
      enemies: ['dark_vampire_com'],
    });
    expect(found?.id).toBe('dark_vampire_com');
  });

  it('devuelve null sin coincidencias o con datos inválidos', () => {
    expect(findEnemyVariant(CATALOG, { id: 'no_existe', categoria: 'soldado' })).toBeNull();
    expect(findEnemyVariant(null, { id: 'x', categoria: 'soldado' })).toBeNull();
    expect(findEnemyVariant(CATALOG, {})).toBeNull();
  });
});

describe('esEnemigoDeEscenario', () => {
  it('detecta escenario por marca, color o tipo', () => {
    expect(esEnemigoDeEscenario({ scenario: 'escenario' })).toBe(true);
    expect(esEnemigoDeEscenario({ color: 'escenario' })).toBe(true);
    expect(esEnemigoDeEscenario({ tipo: 'especial' })).toBe(true);
    expect(esEnemigoDeEscenario({ color: 'blanco' })).toBe(false);
    expect(esEnemigoDeEscenario(null)).toBe(false);
  });
});
