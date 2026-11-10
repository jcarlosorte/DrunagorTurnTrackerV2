/** Resolución de entidades sobre el orden de iniciativa (TURN_ORDER). */
import { getCompanion } from '@/data/companions';
import { getFollower } from '@/data/followers';
import { getFollowerSide, getRoleSide } from '@/data/roles';

/**
 * Inserta a los compañeros y mascotas justo después de su héroe y a los
 * seguidores en el paso de su rol, aunque no haya héroe en esa posición.
 *
 * El orden dentro de cada héroe es el de aparición (`order`), y cada criatura
 * y seguidor ocupa un único paso: actúa una vez por vuelta.
 */
export function buildTurnOrder(baseOrder, companions = [], placedHeroes = [], followers = []) {
  if (!Array.isArray(baseOrder)) return [];
  const hasCompanions = Array.isArray(companions) && companions.length > 0;
  const hasFollowers = Array.isArray(followers) && followers.length > 0;
  if (!hasCompanions && !hasFollowers) return baseOrder;

  const sorted = [...(companions || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return baseOrder.flatMap((step) => {
    if (step.type !== 'hero') return [step];
    const hero = placedHeroes.find((entry) => (
      entry.role === step.role
      && entry.position === step.index
      && (!step.position || step.position === getRoleSide(entry.role))
    ));
    const ofHero = hero ? sorted.filter((entry) => entry.heroId === hero.id) : [];
    const atStep = (followers || []).filter((entry) => (
      entry.role === step.role
      && entry.position === step.index
      && (!step.position || step.position === getFollowerSide(entry.role))
    ));
    const followerSteps = atStep.map((entry) => ({
      type: 'follower',
      uid: entry.uid,
      id: entry.id,
      role: entry.role,
      position: entry.position,
      name: getFollower(entry.id)?.name || entry.name || entry.id,
    }));

    // Sin héroe, el hueco del rol lo ocupa directamente el seguidor: así el
    // turno no se salta la casilla que antes estaba vacía.
    if (!hero) return atStep.length > 0 ? followerSteps : [step];

    return [
      step,
      ...ofHero.map((entry) => ({
        type: 'companion',
        uid: entry.uid,
        id: entry.id,
        heroId: entry.heroId,
        name: getCompanion(entry.id)?.name || entry.id,
      })),
      ...followerSteps,
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
    if (step.type === 'hero') {
      return step.role === entity.role
        && step.index === entity.position
        && (!step.position || step.position === getRoleSide(entity.role));
    }
    if (step.type === 'enemy') {
      return step.rune === entity.rune && step.index === entity.position && step.position === entity.runePosition;
    }
    if (step.type === 'rune') return step.index === entity.colorIndex && step.position === entity.posicion;
    if (step.type === 'event') return step.id === entity.id;
    if (step.type === 'companion') return step.uid === entity.uid;
    if (step.type === 'follower') return step.uid === entity.uid;
    return false;
  });
}

/**
 * Primera entidad activa a partir de un índice (con vuelta al principio).
 * Recibe las listas ya colocadas en el tablero.
 */
export function findNextActiveEntity({ order, startIndex = 0, heroes = [], enemies = [], runes = [], companions = [], followers = [], events = [] }) {
  if (!Array.isArray(order) || order.length === 0) return null;
  const start = ((startIndex % order.length) + order.length) % order.length;

  for (let i = 0; i < order.length; i += 1) {
    const step = order[(start + i) % order.length];

    if (step.type === 'hero') {
      const hero = heroes.find((entry) => (
        entry.role === step.role
        && entry.position === step.index
        && (!step.position || step.position === getRoleSide(entry.role))
      ));
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
    } else if (step.type === 'event') {
      if (events.includes(step.id)) return { type: 'event', id: step.id, name: step.id };
    } else if (step.type === 'companion') {
      const companion = companions.find((entry) => entry.uid === step.uid);
      if (companion) {
        return {
          ...companion,
          type: 'companion',
          name: getCompanion(companion.id)?.name || companion.id,
        };
      }
    } else if (step.type === 'follower') {
      const follower = followers.find((entry) => entry.uid === step.uid);
      if (follower) {
        return {
          ...follower,
          type: 'follower',
          name: getFollower(follower.id)?.name || follower.name || follower.id,
        };
      }
    }
  }

  return null;
}
