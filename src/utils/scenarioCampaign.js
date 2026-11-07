import { ENEMIES } from '@/data/enemies';
import { getScenarioExpansionIds } from '@/data/boxes';

/** Las cartas de escenario base (Oscuridad de Caza, Incursión, Defensa) son de Core. */
export function canUseBaseScenarioCards(boxId) {
  return boxId === 'core';
}

/** Monstruos de escenario que pertenecen a la campaña activa. */
export function getScenarioMonstersForCampaign(boxId) {
  const expansionIds = new Set(getScenarioExpansionIds(boxId));
  return ENEMIES.filter((enemy) => (
    enemy.scenario === 'escenario' && expansionIds.has(enemy.expansionId)
  ));
}
