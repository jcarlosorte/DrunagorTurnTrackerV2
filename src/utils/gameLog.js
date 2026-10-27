import { readJsonStorage, writeJsonStorage, removeStorage } from '@/utils/storage';

export const GAME_LOG_KEY = 'gameLog';
export const MAX_LOG_ENTRIES = 300;
/** Evento interno para que los paneles abiertos se refresquen al instante. */
export const GAME_LOG_EVENT = 'dsh:gamelog';

function notifyGameLogChanged() {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(GAME_LOG_EVENT));
}

export function readGameLog() {
  const log = readJsonStorage(GAME_LOG_KEY, [], Array.isArray);
  return log.filter((entry) => entry && typeof entry === 'object');
}

/**
 * Añade una entrada al historial de la partida.
 * `kind`: 'turn' | 'damage' | 'rune' | 'summon' | 'event'
 */
export function appendGameLog(kind, message, extra = {}) {
  if (!message) return;

  const log = readGameLog();
  log.push({
    at: new Date().toISOString(),
    kind,
    message: String(message),
    ...extra,
  });

  writeJsonStorage(GAME_LOG_KEY, log.slice(-MAX_LOG_ENTRIES));
  notifyGameLogChanged();
}

export function clearGameLog() {
  removeStorage(GAME_LOG_KEY);
  notifyGameLogChanged();
}

export function exportGameLogText() {
  return readGameLog()
    .map((entry) => `[${entry.at}] (${entry.kind}) ${entry.message}`)
    .join('\n');
}
