import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';

export const SCHEMA_VERSION = 3;
export const MAX_TRAUMA_CUBES = 2;
export const MAX_CURSE_CUBES = 5;
export const MAX_ACTION_CUBES = 10;
export const CUBE_COLORS = ['amarillo', 'rojo', 'verde', 'azul'];

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const clamp = (value, min, max, fallback = 0) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, Math.round(numeric)));
};

const statusConfig = (id) => ESTADOS_ALTERADOS.find((item) => item.id === id);

/**
 * Normaliza las fichas de estado alterado de un héroe:
 * descarta ids desconocidos, limita cada estado a su `max` y elimina los vacíos.
 */
function sanitizeEstadosAlterados(raw) {
  if (!Array.isArray(raw)) return [];
  const byId = new Map();

  raw.forEach((entry) => {
    const id = typeof entry === 'string' ? entry : entry?.id;
    if (typeof id !== 'string') return;
    const config = statusConfig(id);
    if (!config) return;

    const max = config.max || 4;
    const count = clamp(isPlainObject(entry) ? entry.count : 1, 0, max, 1);
    if (count <= 0) return;

    byId.set(id, Math.min(max, (byId.get(id) || 0) + count));
  });

  return [...byId.entries()].map(([id, count]) => ({ id, count }));
}

/**
 * Normaliza un héroe guardado o importado.
 *
 * Evita estados imposibles tras importar un JSON manipulado o antiguo:
 * vida entre 0 y el máximo, vidaMax acotada, cubos dentro de su máximo y
 * equipo/mods con la forma esperada.
 */
export function sanitizeHeroEntry(raw) {
  if (!isPlainObject(raw)) return null;

  const vidaMax = clamp(raw.vidaMax, 1, 99, 10);
  const vida = clamp(raw.vida, 0, vidaMax, vidaMax);

  const cubosMax = {};
  const cubos = {};
  CUBE_COLORS.forEach((color) => {
    cubosMax[color] = clamp(raw.cubosMax?.[color], 0, MAX_ACTION_CUBES, 0);
    cubos[color] = clamp(raw.cubos?.[color], 0, cubosMax[color], cubosMax[color]);
  });

  const equipo = {};
  ['arma', 'manoTorpe', 'armadura', 'amuleto', 'bolsa1', 'bolsa2'].forEach((slot) => {
    const value = raw.equipo?.[slot];
    equipo[slot] = typeof value === 'string' ? value.slice(0, 40) : '';
  });

  const equipoMods = {};
  ['arma', 'amuleto'].forEach((slot) => {
    const entry = raw.equipoMods?.[slot];
    const stat = slot === 'arma'
      ? 'ataque'
      : (['movimiento', 'ataque', 'vida'].includes(entry?.stat) ? entry.stat : 'movimiento');
    equipoMods[slot] = { value: clamp(entry?.value, -20, 20, 0), stat };
  });

  return {
    vida,
    vidaMax,
    trauma: clamp(raw.trauma, 0, MAX_TRAUMA_CUBES, 0),
    maldicion: clamp(raw.maldicion, 0, MAX_CURSE_CUBES, 0),
    impactoMod: clamp(raw.impactoMod, -20, 20, 0),
    tiempoTotal: clamp(raw.tiempoTotal, 0, 60 * 60 * 24, 0),
    auras: Array.isArray(raw.auras) ? raw.auras.filter((id) => typeof id === 'string') : [],
    consecuencias: Array.isArray(raw.consecuencias)
      ? raw.consecuencias.filter((id) => typeof id === 'string')
      : [],
    estados: Array.isArray(raw.estados)
      ? raw.estados
        .filter((entry) => typeof entry?.id === 'string')
        .map((entry) => ({ id: entry.id, count: clamp(entry.count, 1, 20, 1) }))
      : [],
    estadosAlterados: sanitizeEstadosAlterados(raw.estadosAlterados),
    equipo,
    equipoMods,
    cubos,
    cubosMax,
  };
}

/** Normaliza el mapa completo `{ heroId: extras }`. */
export function sanitizeHeroExtras(raw) {
  if (!isPlainObject(raw)) return {};
  const result = {};
  Object.entries(raw).forEach(([heroId, entry]) => {
    const sanitized = sanitizeHeroEntry(entry);
    if (sanitized) result[heroId] = sanitized;
  });
  return result;
}
