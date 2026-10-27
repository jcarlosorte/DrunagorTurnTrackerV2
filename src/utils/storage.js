const canUseStorage = () => typeof window !== 'undefined' && 'localStorage' in window;

export function readJsonStorage(key, fallback, validate = () => true) {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;

    const value = JSON.parse(raw);
    if (!validate(value)) throw new Error(`Invalid localStorage value for ${key}`);
    return value;
  } catch {
    // A damaged value must not prevent the SPA from booting.
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Storage can be disabled or unavailable in privacy mode.
    }
    return fallback;
  }
}

let lastWriteAt = 0;
export const getLastWriteAt = () => lastWriteAt;

export function writeJsonStorage(key, value) {
  if (!canUseStorage()) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    lastWriteAt = Date.now();
    try {
      window.dispatchEvent(new CustomEvent('drunagor:storage-write', { detail: { key, at: lastWriteAt } }));
    } catch {
      // Events are optional; persistence already succeeded.
    }
    return true;
  } catch {
    // Persistence is best-effort; in-memory state remains usable.
    try {
      window.dispatchEvent(new CustomEvent('drunagor:storage-error', { detail: { key } }));
    } catch {
      // Ignore event dispatch failures.
    }
    return false;
  }
}

const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;
export const STORAGE_WARNING_RATIO = 0.8;

export function getStorageUsage() {
  if (!canUseStorage()) return { bytes: 0, limit: STORAGE_LIMIT_BYTES, ratio: 0 };

  let bytes = 0;
  GAME_STORAGE_KEYS.forEach((key) => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) bytes += raw.length + key.length;
    } catch {
      // Ignore unavailable storage.
    }
  });

  return {
    bytes,
    limit: STORAGE_LIMIT_BYTES,
    ratio: Math.min(bytes / STORAGE_LIMIT_BYTES, 1),
  };
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function removeStorage(key) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore unavailable storage.
  }
}

import { sanitizeHeroExtras } from '@/utils/heroSanitize';

export const isPlainObject = (value) => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
);

export const GAME_STORAGE_KEYS = [
  'lang',
  'expansions',
  'trackerData',
  'gameState',
  'initEnemiesState',
  'initRunesState',
  'trackerSession',
  'gameLog',
  'heroExtras',
  'heroManagement',
];

const CONFIG_STORAGE_KEYS = ['expansions', 'trackerData', 'heroManagement'];
const TRACK_STORAGE_KEYS = ['gameState', 'initEnemiesState', 'initRunesState', 'trackerSession', 'gameLog', 'heroExtras'];

/** Versión actual del formato de guardado. */
export const SNAPSHOT_SCHEMA_VERSION = 3;

/** Evento para forzar el volcado de escrituras diferidas antes de leer. */
export const FLUSH_EVENT = 'dsh:flush-storage';

/** Versión de la app incluida en los guardados. */
export const APP_VERSION = (() => {
  try {
    return import.meta?.env?.VITE_APP_VERSION || '1.0.0';
  } catch {
    return '1.0.0';
  }
})();

function readStorageData() {
  // Vacía cualquier escritura pendiente (p. ej. `heroExtras` con debounce).
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(FLUSH_EVENT));
  }
  const data = {};
  GAME_STORAGE_KEYS.forEach((key) => {
    const value = readJsonStorage(key, undefined);
    if (value !== undefined) data[key] = value;
  });
  return data;
}

function pickStorageKeys(data, keys) {
  return keys.reduce((result, key) => {
    if (data[key] !== undefined) result[key] = data[key];
    return result;
  }, {});
}

export function createStorageSnapshot(scope = 'full') {
  const data = readStorageData();
  const configuration = pickStorageKeys(data, CONFIG_STORAGE_KEYS);
  const track = pickStorageKeys(data, TRACK_STORAGE_KEYS);

  return {
    app: 'drunagor-turn-tracker',
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    scope,
    exportedAt: new Date().toISOString(),
    configuration,
    track,
  };
}

function validateStorageData(data) {
  if (!isPlainObject(data)) throw new Error('Datos de partida no válidos');
  if (data.lang !== undefined && typeof data.lang !== 'string') throw new Error('Idioma no válido');
  if (data.expansions !== undefined && !Array.isArray(data.expansions)) throw new Error('Expansiones no válidas');
  if (data.heroManagement !== undefined && typeof data.heroManagement !== 'boolean') {
    throw new Error('Ajuste de gestión de héroes no válido');
  }
  ['trackerData', 'gameState', 'initEnemiesState', 'initRunesState', 'trackerSession', 'heroExtras']
    .forEach((key) => {
      if (data[key] !== undefined && !isPlainObject(data[key])) throw new Error(`Estado no válido: ${key}`);
    });
  if (data.gameLog !== undefined && !Array.isArray(data.gameLog)) throw new Error('Historial no válido');
}

/**
 * Migra guardados antiguos al formato actual.
 *
 * v1 → datos planos · v2 → configuration/track · v3 → + gestión de héroes.
 * Nunca lanza: si falta `heroExtras` lo deja vacío para que la app aplique
 * los valores base de cada héroe.
 */
export function migrateSnapshot(snapshot) {
  if (!isPlainObject(snapshot)) throw new Error('Formato de partida no compatible');

  const version = Number(snapshot.schemaVersion) || 1;
  if (version === 1) {
    return { schemaVersion: SNAPSHOT_SCHEMA_VERSION, data: { ...(snapshot.data || {}) } };
  }

  const configuration = isPlainObject(snapshot.configuration) ? snapshot.configuration : {};
  const track = isPlainObject(snapshot.track) ? snapshot.track : {};

  return {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    configuration: version >= 3 ? configuration : { ...configuration },
    track: {
      ...track,
      // Solo se normaliza si el guardado incluye datos de héroe.
      ...(track.heroExtras !== undefined
        ? { heroExtras: sanitizeHeroExtras(track.heroExtras) }
        : {}),
    },
  };
}

export function extractSnapshotData(snapshot, scope = 'full') {
  if (!isPlainObject(snapshot)) throw new Error('Formato de partida no compatible');
  if (![1, 2, 3].includes(Number(snapshot.schemaVersion))) {
    throw new Error('Formato de partida no compatible');
  }

  const migrated = migrateSnapshot(snapshot);
  let data;

  if (migrated.data) {
    data = migrated.data;
  } else {
    if (!isPlainObject(migrated.configuration) || !isPlainObject(migrated.track)) {
      throw new Error('Formato de partida no compatible');
    }
    const selectedScope = scope === 'configuration' || scope === 'track' ? scope : 'full';
    data = selectedScope === 'configuration'
      ? migrated.configuration
      : selectedScope === 'track'
        ? migrated.track
        : { ...migrated.configuration, ...migrated.track };
  }

  // Los datos de héroe siempre se normalizan antes de tocar el almacenamiento.
  if (data.heroExtras !== undefined) {
    data = { ...data, heroExtras: sanitizeHeroExtras(data.heroExtras) };
  }

  validateStorageData(data);
  return data;
}

/**
 * Escribe un snapshot en el almacenamiento.
 *
 * Al cargar una partida completa se limpian antes las claves de track para no
 * arrastrar restos de la partida anterior (héroes, historial o enemigos).
 */
export function applyStorageData(data, { scope = 'full' } = {}) {
  if (!isPlainObject(data)) throw new Error('Datos de partida no válidos');
  if (scope === 'full' || scope === 'track') clearTrackState();
  Object.entries(data).forEach(([key, value]) => {
    if (GAME_STORAGE_KEYS.includes(key)) writeJsonStorage(key, value);
  });
}

export function importStorageSnapshot(snapshot, scope = 'full', options = {}) {
  const data = extractSnapshotData(snapshot, scope);
  const sanitized = typeof options.validateConfiguration === 'function'
    ? (options.validateConfiguration(data) || data)
    : data;
  applyStorageData(sanitized, { scope });
  return sanitized;
}

export function clearGameSession() {
  if (!canUseStorage()) return;
  ['trackerData', ...TRACK_STORAGE_KEYS].forEach((key) => removeStorage(key));
}

export function clearTrackState() {
  if (!canUseStorage()) return;
  TRACK_STORAGE_KEYS.forEach((key) => removeStorage(key));
}
