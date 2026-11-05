import { ENEMIES } from '@/data/enemies';

/** Id base de un comandante con sufijo de variante (_com, _scenario2, _special…). */
export const getEnemyFamilyId = (id) => String(id || '').replace(/_((com|scenario)(?:_?com)?\d*|special)$/i, '');

/**
 * Comandantes disponibles que estén en la lista de enemigos seleccionada.
 * Excluye las apariciones de escenario.
 */
export function getCommanderCandidates({ selectedEnemyIds = [] } = {}) {
  const selected = new Set(Array.isArray(selectedEnemyIds) ? selectedEnemyIds : []);

  return ENEMIES.filter((enemy) => (
    enemy.categoria === 'comandante'
    && enemy.color !== 'escenario'
    && !enemy.scenario
    && (selected.has(enemy.id) || selected.has(getEnemyFamilyId(enemy.id)))
  ));
}
