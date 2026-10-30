/**
 * Versión de reglas del juego (1.5 base / 2.0 Apocalipsis).
 *
 * La selección automática depende de las expansiones activas; el usuario puede
 * forzarla manualmente desde Configuración. La preferencia manual se guarda
 * aparte para no confundirla con las expansiones.
 */
export const RULES_VERSION_KEY = 'drunagor:rulesVersion';
export const RULES_VERSIONS = ['1.5', '2.0'];
export const AUTO = 'auto';

/** Expansiones que traen el reglamento 2.0. */
export const APOCALYPSE_EXPANSIONS = [
  'apocalypse_adventures',
  'apocalypse_heroes_1',
  'apocalypse_lorien',
  'apocalypse_awakenings',
  'apocalypse_sisters',
];

export const isApocalypseExpansion = (id) => APOCALYPSE_EXPANSIONS.includes(id);

export const detectRulesVersion = (selectedExpansions = []) => (
  selectedExpansions.some(isApocalypseExpansion) ? '2.0' : '1.5'
);

/** Devuelve la versión forzada a mano, o null si está en automático. */
export function readRulesOverride() {
  try {
    const value = localStorage.getItem(RULES_VERSION_KEY);
    return RULES_VERSIONS.includes(value) ? value : null;
  } catch {
    return null;
  }
}

/** Guarda la versión forzada; `null` vuelve al modo automático. */
export function writeRulesOverride(value) {
  try {
    if (value === null) localStorage.removeItem(RULES_VERSION_KEY);
    else localStorage.setItem(RULES_VERSION_KEY, value);
  } catch {
    // Sin almacenamiento: la selección sigue viva en memoria.
  }
}
