import { ENEMIES } from '@/data/enemies';
import { getCampaignExpansionIds } from '@/data/boxes';

/** Id base de un comandante con sufijo de variante (_com, _scenario2, _special…). */
export const getEnemyFamilyId = (id) => String(id || '').replace(/_(com\d*|scenario\d*|special)$/i, '');

/**
 * Comandantes disponibles para la campaña activa que estén en la lista de
 * enemigos seleccionada. Excluye las apariciones de escenario.
 */
export function getCommanderCandidates({ mainBox = 'core', selectedEnemyIds = [] } = {}) {
  const selected = new Set(Array.isArray(selectedEnemyIds) ? selectedEnemyIds : []);
  const campaignExpansions = getCampaignExpansionIds(mainBox);

  return ENEMIES.filter((enemy) => (
    enemy.categoria === 'comandante'
    && enemy.color !== 'escenario'
    && !enemy.scenario
    && campaignExpansions.includes(enemy.expansionId)
    && (selected.has(enemy.id) || selected.has(getEnemyFamilyId(enemy.id)))
  ));
}
