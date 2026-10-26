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
