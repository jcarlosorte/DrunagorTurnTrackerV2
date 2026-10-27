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
];

const CONFIG_STORAGE_KEYS = ['expansions', 'trackerData'];
const TRACK_STORAGE_KEYS = ['gameState', 'initEnemiesState', 'initRunesState', 'trackerSession', 'gameLog', 'heroExtras'];

function readStorageData() {
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
    schemaVersion: 2,
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
  ['trackerData', 'gameState', 'initEnemiesState', 'initRunesState', 'trackerSession', 'heroExtras']
    .forEach((key) => {
      if (data[key] !== undefined && !isPlainObject(data[key])) throw new Error(`Estado no válido: ${key}`);
    });
  if (data.gameLog !== undefined && !Array.isArray(data.gameLog)) throw new Error('Historial no válido');
}

export function extractSnapshotData(snapshot, scope = 'full') {
  if (!isPlainObject(snapshot)) throw new Error('Formato de partida no compatible');

  let data;
  if (snapshot.schemaVersion === 1 && isPlainObject(snapshot.data)) {
    // Compatibilidad con las exportaciones anteriores.
    data = snapshot.data;
  } else if (snapshot.schemaVersion === 2 && isPlainObject(snapshot.configuration) && isPlainObject(snapshot.track)) {
    const selectedScope = scope === 'configuration' || scope === 'track' ? scope : 'full';
    data = selectedScope === 'configuration'
      ? snapshot.configuration
      : selectedScope === 'track'
        ? snapshot.track
        : { ...snapshot.configuration, ...snapshot.track };
  } else {
    throw new Error('Formato de partida no compatible');
  }

  validateStorageData(data);
  return data;
}

export function applyStorageData(data) {
  if (!isPlainObject(data)) throw new Error('Datos de partida no válidos');
  Object.entries(data).forEach(([key, value]) => {
    if (GAME_STORAGE_KEYS.includes(key)) writeJsonStorage(key, value);
  });
}

export function importStorageSnapshot(snapshot, scope = 'full', options = {}) {
  const data = extractSnapshotData(snapshot, scope);
  const sanitized = typeof options.validateConfiguration === 'function'
    ? (options.validateConfiguration(data) || data)
    : data;
  applyStorageData(sanitized);
  return sanitized;
}

export function clearGameSession() {
  if (!canUseStorage()) return;
  ['trackerData', 'gameState', 'initEnemiesState', 'initRunesState', 'trackerSession']
    .forEach((key) => removeStorage(key));
}

export function clearTrackState() {
  if (!canUseStorage()) return;
  TRACK_STORAGE_KEYS.forEach((key) => removeStorage(key));
}
