import { describe, expect, it } from 'vitest';
import { buildTurnOrder, findNextActiveEntity, indexOfEntityInOrder } from '@/utils/turnOrder';

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

describe('compañeros y mascotas', () => {
  const companions = [
    { uid: 'c1', id: 'drumm', heroId: 'vorn', order: 1, vida: 1, vidaMax: 1 },
    { uid: 'c2', id: 'bronx', heroId: 'vorn', order: 0, vida: 1, vidaMax: 1 },
  ];

  it('inserta cada criatura tras su héroe en orden de aparición', () => {
    const order = buildTurnOrder(ORDER, companions, [hero]);

    expect(order.map((step) => step.type)).toEqual([
      'hero', 'companion', 'companion', 'enemy', 'hero', 'rune',
    ]);
    expect(order.slice(1, 3).map((step) => step.uid)).toEqual(['c2', 'c1']);
  });

  it('sin compañeros conserva el orden original', () => {
    expect(buildTurnOrder(ORDER, [], [hero])).toBe(ORDER);
  });

  it('los encuentra y los indexa por uid', () => {
    const order = buildTurnOrder(ORDER, companions, [hero]);
    const entity = findNextActiveEntity({ order, startIndex: 1, companions });

    expect(entity).toMatchObject({ uid: 'c2', type: 'companion', name: 'Bronx' });
    expect(indexOfEntityInOrder(order, { uid: 'c1', type: 'companion' })).toBe(2);
  });
});

describe('seguidores', () => {
  const follower = { uid: 'f1', id: 'elros_asesino', role: 'lider', position: 4 };

  it('ocupa el paso del rol cuando no hay héroe', () => {
    const order = buildTurnOrder(ORDER, [], [hero], [follower]);
    expect(order.map((step) => step.type)).toEqual(['hero', 'enemy', 'follower', 'rune']);
  });

  it('con héroe en el rol va después del héroe', () => {
    const liderHero = { id: 'vorn2', role: 'lider', position: 4 };
    const order = buildTurnOrder(ORDER, [], [hero, liderHero], [follower]);
    expect(order.map((step) => step.type)).toEqual(['hero', 'enemy', 'hero', 'follower', 'rune']);
  });

  it('lo encuentra y lo indexa', () => {
    const order = buildTurnOrder(ORDER, [], [hero], [follower]);
    const entity = findNextActiveEntity({ order, startIndex: 2, followers: [follower] });
    expect(entity).toMatchObject({ uid: 'f1', type: 'follower', name: 'Elros' });
    expect(indexOfEntityInOrder(order, { uid: 'f1', type: 'follower' })).toBe(2);
  });
});
