/** Compactación de enemigos antes de persistirlos. */

/** Campos que necesita el tablero; el resto se reconstruye del catálogo. */
const CAMPOS = [
  'uuid',
  'id',
  'nombre',
  'name',
  'rune',
  'runePosition',
  'position',
  'categoria',
  'comportamiento',
  'vida',
  'vidaMax',
  'movimiento',
  'ataque',
  'tipo_ataque',
  'color',
  'imagen',
  'inmunidad',
  'capacidades',
  'capacidadesOriginales',
  'ringColor',
  'cara',
  'estadosAlterados',
  'respaldoA',
  'sourceEnemyUUID',
  'tipo',
  'highlight',
  'size',
  'scenario',
  'pc',
];

/** Copia solo los campos conocidos de un enemigo colocado. */
export function compactEnemy(entry) {
  const enemy = entry?.enemy || entry;
  if (!enemy || typeof enemy !== 'object') return null;

  const compacto = {};
  for (const key of CAMPOS) {
    const value = enemy[key];
    if (value === undefined) continue;
    // Estados a cero: se regeneran al cargar y ocupan lo suyo por enemigo.
    if (key === 'estadosAlterados' && Array.isArray(value)) {
      const activos = value.filter((estado) => (estado?.count || 0) > 0);
      if (activos.length > 0) compacto[key] = activos;
      continue;
    }
    compacto[key] = value;
  }

  return entry?.enemy ? { ...entry, enemy: compacto } : compacto;
}

/**
 * Compacta y deduplica la lista colocada.
 * @param {Array} list
 * @param {number} limit tope de seguridad
 */
export function compactPlacedEnemies(list, limit = 150) {
  if (!Array.isArray(list)) return [];

  const vistos = new Set();
  const salida = [];

  for (const entry of list) {
    const enemy = entry?.enemy || entry;
    const uuid = enemy?.uuid;
    if (!uuid || vistos.has(uuid)) continue;
    vistos.add(uuid);
    const compacto = compactEnemy(entry);
    if (compacto) salida.push(compacto);
    if (salida.length >= limit) break;
  }

  return salida;
}
