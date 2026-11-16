/** Ataques que Aral'hezec ejecuta después de sus cartas de agarre/pisotón. */
export const ARAL_ALL_ATTACK_CARD_IDS = ['boss_16', 'boss_17', 'boss_18', 'boss_20'];

export function isAralAllAttacksCard(cardId) {
  return ARAL_ALL_ATTACK_CARD_IDS.includes(cardId);
}

/** Valores calculados de los tres ataques para un valor de X (runas de la carta). */
export function getAralAllAttackValues(x) {
  const runeValue = Math.max(0, Number(x) || 0);
  return {
    dragonBreath: 2 + 2 * runeValue,
    wingStrike: 2 + runeValue,
    tailSwipe: runeValue,
  };
}
