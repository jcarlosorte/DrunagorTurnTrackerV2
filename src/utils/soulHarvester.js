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

const STATE_TRANSLATION_KEYS = {
  ATURDIMIENTO_I: 'aturdimiento',
  HEMORRAGIA_I: 'hemorragia',
  QUEMADURA_I: 'quemadura',
  VENENO_I: 'veneno',
  DERRIBO_I: 'derribo',
  LENTITUD_I: 'lentitud',
  MARCA_DE_MONTARAZ: 'marca',
  FRAGIL: 'fragil',
  RESTRICCION: 'restriccion',
  POLIMORFISMO: 'polimorfismo',
};

const STATE_FALLBACK_LABELS = {
  ATURDIMIENTO_I: 'Aturdimiento',
  HEMORRAGIA_I: 'Hemorragia',
  QUEMADURA_I: 'Quemadura',
  VENENO_I: 'Veneno',
  DERRIBO_I: 'Derribo',
  LENTITUD_I: 'Lentitud',
  MARCA_DE_MONTARAZ: 'Marca de Montaraz',
  FRAGIL: 'Frágil',
  RESTRICCION: 'Restricción',
  POLIMORFISMO: 'Polimorfismo',
};

/** Nombre visible de un estado alterado, sin confundirlo con su inmunidad. */
export function formatEstadoAlterado(id, labels = {}) {
  return labels[STATE_TRANSLATION_KEYS[id]] || STATE_FALLBACK_LABELS[id] || id;
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
