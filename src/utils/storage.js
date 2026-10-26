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

export function writeJsonStorage(key, value) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is best-effort; in-memory state remains usable.
  }
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
];

const CONFIG_STORAGE_KEYS = ['expansions', 'trackerData'];
const TRACK_STORAGE_KEYS = ['gameState', 'initEnemiesState', 'initRunesState', 'trackerSession'];

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
  ['trackerData', 'gameState', 'initEnemiesState', 'initRunesState', 'trackerSession']
    .forEach((key) => {
      if (data[key] !== undefined && !isPlainObject(data[key])) throw new Error(`Estado no válido: ${key}`);
    });
}

export function importStorageSnapshot(snapshot, scope = 'full') {
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
  Object.entries(data).forEach(([key, value]) => {
    if (GAME_STORAGE_KEYS.includes(key)) writeJsonStorage(key, value);
  });
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
