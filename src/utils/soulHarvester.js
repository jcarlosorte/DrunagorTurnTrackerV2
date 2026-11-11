import { applyBossRuneEffect } from './bossRunes';

export const SOUL_HARVESTER_ID = 'soul_harvester_boss';

export function getSoulHarvesterTime(enemy) {
  return (enemy?.estadosAlterados || []).find((estado) => estado.id === 'TIEMPO')?.count || 0;
}

/** Fichas de Tiempo que concede un Disparo de Cañón. */
export function getCannonShotTimeTokens(heroCount) {
  if (heroCount <= 2) return { rune: 4, boss: 3 };
  if (heroCount === 3) return { rune: 3, boss: 2 };
  return { rune: 2, boss: 1 };
}

/**
 * Si la Ficha de Tiempo ha llegado a 0, antes de limpiar los estados se
 * calcula el daño por el total de fichas de estados (sin TIEMPO). Después se
 * aplica la runa gris, que restaura ARMADURA/inmunidades y limpia los estados.
 */
export function resolveSoulHarvesterTimeZero(enemy) {
  if (!enemy || enemy.id !== SOUL_HARVESTER_ID) return { enemy, triggered: false };
  if (getSoulHarvesterTime(enemy) > 0) return { enemy, triggered: false };

  const states = (enemy.estadosAlterados || [])
    .filter((estado) => estado.id !== 'TIEMPO' && (estado.count || 0) > 0)
    .map((estado) => ({ id: estado.id, count: estado.count || 0 }));
  const damage = states.reduce((total, estado) => total + estado.count, 0);
  const vidaAntes = enemy.vida || 0;
  const withGray = applyBossRuneEffect(enemy, 'gris');
  const updated = {
    ...withGray,
    vida: Math.max(0, vidaAntes - damage),
  };

  return {
    enemy: updated,
    triggered: true,
    damage,
    states,
    vidaAntes,
    vidaDespues: updated.vida,
  };
}
