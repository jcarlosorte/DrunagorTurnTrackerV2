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

export function createStorageSnapshot() {
  const data = {};
  GAME_STORAGE_KEYS.forEach((key) => {
    const value = readJsonStorage(key, undefined);
    if (value !== undefined) data[key] = value;
  });

  return {
    app: 'drunagor-turn-tracker',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function importStorageSnapshot(snapshot) {
  if (!isPlainObject(snapshot) || snapshot.schemaVersion !== 1 || !isPlainObject(snapshot.data)) {
    throw new Error('Formato de partida no compatible');
  }

  const { data } = snapshot;
  if (data.lang !== undefined && typeof data.lang !== 'string') throw new Error('Idioma no válido');
  if (data.expansions !== undefined && !Array.isArray(data.expansions)) throw new Error('Expansiones no válidas');
  ['trackerData', 'gameState', 'initEnemiesState', 'initRunesState', 'trackerSession']
    .forEach((key) => {
      if (data[key] !== undefined && !isPlainObject(data[key])) throw new Error(`Estado no válido: ${key}`);
    });

  GAME_STORAGE_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      writeJsonStorage(key, data[key]);
    }
  });
}

export function clearGameSession() {
  if (!canUseStorage()) return;
  ['trackerData', 'gameState', 'initEnemiesState', 'initRunesState', 'trackerSession']
    .forEach((key) => removeStorage(key));
}
