// Filtros y facetas del selector manual de enemigos.
// Lógica pura: no conoce traducciones ni React; el llamador aporta las etiquetas.

export const MANUAL_COLOR_ORDER = [
  'blanco',
  'gris',
  'negro',
  'comandante',
  'jefe',
  'esbirro',
  'overlord',
  'hero',
  'escenario',
];

export const MANUAL_CATEGORY_ORDER = [
  'campeon',
  'veterano',
  'soldado',
  'bisoño',
  'esbirro',
  'comandante',
  'jefe',
  'overlord',
  'hero',
  'escenario',
];

/** Normaliza para buscar sin depender de mayúsculas ni acentos. */
export function normalizeManualQuery(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function orderFacets(present, canonical) {
  const known = canonical.filter((value) => present.has(value));
  const extra = [...present].filter((value) => !canonical.includes(value)).sort();
  return [...known, ...extra];
}

/**
 * Colores y categorías realmente presentes en la lista, en orden canónico
 * (los valores no previstos se añaden al final, alfabéticamente).
 */
export function collectManualFacets(enemies) {
  const colors = new Set();
  const categories = new Set();

  (Array.isArray(enemies) ? enemies : []).forEach((enemy) => {
    if (enemy?.color) colors.add(enemy.color);
    if (enemy?.categoria) categories.add(enemy.categoria);
  });

  return {
    colors: orderFacets(colors, MANUAL_COLOR_ORDER),
    categories: orderFacets(categories, MANUAL_CATEGORY_ORDER),
  };
}

/**
 * Aplica color, categoría y búsqueda (nombre traducido o id).
 * `getLabel` permite buscar por el nombre que ve el usuario.
 */
export function filterManualEnemies(
  enemies,
  { color = 'all', category = 'all', query = '', getLabel = (enemy) => enemy?.nombre } = {},
) {
  const q = normalizeManualQuery(query).trim();

  return (Array.isArray(enemies) ? enemies : []).filter((enemy) => {
    if (!enemy) return false;
    if (color !== 'all' && enemy.color !== color) return false;
    if (category !== 'all' && enemy.categoria !== category) return false;
    if (!q) return true;

    return normalizeManualQuery(getLabel(enemy)).includes(q)
      || normalizeManualQuery(enemy.id).includes(q);
  });
}
