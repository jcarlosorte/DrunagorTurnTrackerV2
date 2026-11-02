/** Resolución de entidades sobre el orden de iniciativa (TURN_ORDER). */
import { getCompanion } from '@/data/companions';

/**
 * Inserta a los compañeros y mascotas justo después de su héroe.
 *
 * El orden dentro de cada héroe es el de aparición (`order`), y cada criatura
 * ocupa un único paso: actúa una vez por vuelta.
 */
export function buildTurnOrder(baseOrder, companions = [], placedHeroes = []) {
  if (!Array.isArray(baseOrder)) return [];
  if (!Array.isArray(companions) || companions.length === 0) return baseOrder;

  const sorted = [...companions].sort((a, b) => (a.order || 0) - (b.order || 0));

  return baseOrder.flatMap((step) => {
    if (step.type !== 'hero') return [step];
    const hero = placedHeroes.find((entry) => entry.role === step.role && entry.position === step.index);
    if (!hero) return [step];

    const ofHero = sorted.filter((entry) => entry.heroId === hero.id);
    return [
      step,
      ...ofHero.map((entry) => ({
        type: 'companion',
        uid: entry.uid,
        id: entry.id,
        heroId: entry.heroId,
        name: getCompanion(entry.id)?.name || entry.id,
      })),
    ];
  });
}

/**
 * Índice del orden que corresponde a una entidad concreta.
 * @returns {number} índice o -1 si no está contemplada
 */
export function indexOfEntityInOrder(order, entity) {
  if (!Array.isArray(order) || !entity) return -1;
  return order.findIndex((step) => {
    if (step.type !== entity.type) return false;
    if (step.type === 'hero') return step.role === entity.role && step.index === entity.position;
    if (step.type === 'enemy') {
      return step.rune === entity.rune && step.index === entity.position && step.position === entity.runePosition;
    }
    if (step.type === 'rune') return step.index === entity.colorIndex && step.position === entity.posicion;
    if (step.type === 'companion') return step.uid === entity.uid;
    return false;
  });
}

/**
 * Primera entidad activa a partir de un índice (con vuelta al principio).
 * Recibe las listas ya colocadas en el tablero.
 */
export function findNextActiveEntity({ order, startIndex = 0, heroes = [], enemies = [], runes = [], companions = [] }) {
  if (!Array.isArray(order) || order.length === 0) return null;
  const start = ((startIndex % order.length) + order.length) % order.length;

  for (let i = 0; i < order.length; i += 1) {
    const step = order[(start + i) % order.length];

    if (step.type === 'hero') {
      const hero = heroes.find((entry) => entry.role === step.role && entry.position === step.index);
      if (hero) return { ...hero, type: 'hero' };
    } else if (step.type === 'enemy') {
      const group = enemies
        .filter((entry) => (
          entry.enemy.rune === step.rune
          && entry.enemy.position === step.index
          && entry.enemy.runePosition === step.position
        ))
        .map((entry) => entry.enemy);
      if (group.length > 0) return { ...group[0], type: 'enemy', group };
    } else if (step.type === 'rune') {
      const group = runes
        .filter((entry) => entry.rune.colorIndex === step.index && entry.rune.posicion === step.position)
        .map((entry) => entry.rune);
      if (group.length > 0) return { ...group[0], type: 'rune', group };
    } else if (step.type === 'companion') {
      const companion = companions.find((entry) => entry.uid === step.uid);
      if (companion) {
        return {
          ...companion,
          type: 'companion',
          name: getCompanion(companion.id)?.name || companion.id,
        };
      }
    }
  }

  return null;
}
