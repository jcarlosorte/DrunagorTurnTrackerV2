import { describe, expect, it } from 'vitest';
import { findNextActiveEntity, indexOfEntityInOrder } from '@/utils/turnOrder';

const ORDER = [
  { type: 'hero', role: 'defensor', index: 0 },
  { type: 'enemy', rune: 'naranja', index: 1, position: 'arriba' },
  { type: 'hero', role: 'lider', index: 4 },
  { type: 'rune', index: 9, position: 'arriba' },
];

const hero = { id: 'vorn', role: 'defensor', position: 0 };

describe('indexOfEntityInOrder', () => {
  it('encuentra el índice de un héroe', () => {
    expect(indexOfEntityInOrder(ORDER, { ...hero, type: 'hero' })).toBe(0);
  });

  it('devuelve -1 si no encaja', () => {
    expect(indexOfEntityInOrder(ORDER, { type: 'hero', role: 'apoyo', position: 2 })).toBe(-1);
    expect(indexOfEntityInOrder(ORDER, null)).toBe(-1);
  });
});

describe('findNextActiveEntity', () => {
  it('devuelve la primera entidad activa', () => {
    const entity = findNextActiveEntity({ order: ORDER, startIndex: 0, heroes: [hero] });
    expect(entity).toMatchObject({ id: 'vorn', type: 'hero' });
  });

  it('salta posiciones vacías y da la vuelta', () => {
    const entity = findNextActiveEntity({
      order: ORDER,
      startIndex: 2,
      heroes: [hero],
    });
    expect(entity).toMatchObject({ id: 'vorn', type: 'hero' });
  });

  it('agrupa enemigos de la misma runa y posición', () => {
    const enemies = [
      { enemy: { uuid: 'a', rune: 'naranja', position: 1, runePosition: 'arriba' } },
      { enemy: { uuid: 'b', rune: 'naranja', position: 1, runePosition: 'arriba' } },
    ];
    const entity = findNextActiveEntity({ order: ORDER, startIndex: 1, enemies });
    expect(entity.type).toBe('enemy');
    expect(entity.group).toHaveLength(2);
  });

  it('devuelve null sin entidades activas', () => {
    expect(findNextActiveEntity({ order: ORDER, startIndex: 0 })).toBeNull();
    expect(findNextActiveEntity({ order: [], startIndex: 0 })).toBeNull();
  });
});
