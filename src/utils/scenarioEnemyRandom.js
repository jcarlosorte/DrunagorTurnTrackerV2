/**
 * Los enemigos de escenario son versiones de monstruos normales y comparten
 * la misma ilustración. Al seleccionar uno, excluimos de las tiradas
 * aleatorias todas las versiones no-escenario que usan su misma imagen.
 */
export function getScenarioLinkedEnemyIds(scenarioMonster, enemies = []) {
  if (!scenarioMonster?.imagen) return new Set();
  return new Set(
    enemies
      .filter((enemy) => (
        enemy?.imagen === scenarioMonster.imagen &&
        enemy.scenario !== 'escenario'
      ))
      .map((enemy) => enemy.id)
  );
}

export function isEnemyAllowedInRandom(enemy, linkedIds = new Set()) {
  if (!enemy) return false;
  if (enemy.scenario === 'escenario') return false;
  return !linkedIds.has(enemy.id);
}

/** Imágenes vinculadas a Incursión Naval: Cazamareas y Executioner. */
export const NAVAL_ASSOCIATED_IMAGES = ['nagian_hunter', 'executioner'];

/** Versiones normales que no deben salir mientras Incursión Naval esté en juego. */
export function getNavalExcludedEnemyIds(enemies = []) {
  return new Set(
    enemies
      .filter((enemy) => (
        NAVAL_ASSOCIATED_IMAGES.includes(enemy.imagen) &&
        enemy.scenario !== 'escenario'
      ))
      .map((enemy) => enemy.id)
  );
}
