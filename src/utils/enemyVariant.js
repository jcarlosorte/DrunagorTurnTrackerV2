/**
 * Selección de la variante de un enemigo en el catálogo.
 *
 * El catálogo repite `id` por categoría y comportamiento, y algunas entradas
 * (apariciones de escenario) no declaran `comportamiento` o no forman parte de
 * la lista configurable de enemigos. Esta función concentra esas reglas para
 * que la invocación manual, por carta o por mecánica use siempre el mismo
 * criterio.
 */

const normalizarComportamiento = (value) => value || 'estandar';

export function esEnemigoDeEscenario(entry) {
  if (!entry) return false;
  return Boolean(entry.scenario) || entry.color === 'escenario' || entry.tipo === 'especial';
}

/**
 * @param {Array} catalog lista completa de enemigos
 * @param {object} opciones
 * @param {string} opciones.id identificador del enemigo
 * @param {string} opciones.categoria categoría a colocar
 * @param {string} [opciones.comportamiento] comportamiento pedido
 * @param {string[]} [opciones.enemies] ids configurados en la partida
 * @returns {object|null} variante encontrada
 */
export function findEnemyVariant(catalog, { id, categoria, comportamiento, enemies = [] } = {}) {
  if (!Array.isArray(catalog) || !id) return null;

  const configurados = Array.isArray(enemies) ? enemies : [];

  return catalog.find((entry) => {
    if (!entry || entry.id !== id) return false;
    if (entry.categoria !== categoria) return false;
    // La cara B nunca se coloca: se llega a ella volteando la carta.
    if (entry.cara === 'B') return false;
    // Las apariciones de escenario no están en la lista configurable.
    if (!configurados.includes(entry.id) && !esEnemigoDeEscenario(entry)) return false;
    if (categoria === 'comandante' || categoria === 'jefe') return true;
    return normalizarComportamiento(entry.comportamiento) === normalizarComportamiento(comportamiento);
  }) || null;
}
