import { SNAPSHOT_SCHEMA_VERSION, isPlainObject, readJsonStorage, removeStorage, writeJsonStorage } from '@/utils/storage';

export const SAVE_INDEX_KEY = 'drunagor:saves:index:v1';
export const SAVE_PREFIX = 'drunagor:save:';
export const MAX_SAVES = 10;

const saveKey = (id) => `${SAVE_PREFIX}${id}`;

export function listSaves() {
  const index = readJsonStorage(SAVE_INDEX_KEY, [], Array.isArray);
  return index
    .filter((entry) => isPlainObject(entry) && typeof entry.id === 'string')
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
}

function writeIndex(entries) {
  return writeJsonStorage(SAVE_INDEX_KEY, entries);
}

export function saveGame({ id, name, snapshot }) {
  const now = new Date().toISOString();
  const existing = listSaves();
  const saveId = id || (globalThis.crypto?.randomUUID?.() || `save-${Date.now()}`);

  if (!id && existing.length >= MAX_SAVES) {
    throw new Error(`Límite de ${MAX_SAVES} partidas guardadas alcanzado`);
  }

  const record = {
    id: saveId,
    name: (name || '').trim() || `Partida ${existing.length + 1}`,
    createdAt: existing.find((entry) => entry.id === saveId)?.createdAt || now,
    updatedAt: now,
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    snapshot,
  };

  if (!writeJsonStorage(saveKey(saveId), record)) {
    throw new Error('No hay espacio suficiente para guardar la partida');
  }

  const nextIndex = [
    ...existing.filter((entry) => entry.id !== saveId),
    { id: saveId, name: record.name, createdAt: record.createdAt, updatedAt: record.updatedAt },
  ];

  if (!writeIndex(nextIndex)) {
    removeStorage(saveKey(saveId));
    throw new Error('No se pudo actualizar el índice de partidas');
  }

  return record;
}

export function loadGame(id) {
  const record = readJsonStorage(saveKey(id), null, (value) => isPlainObject(value) && isPlainObject(value.snapshot));
  if (!record) throw new Error('La partida guardada no existe o está dañada');
  return record;
}

export function deleteGame(id) {
  removeStorage(saveKey(id));
  writeIndex(listSaves().filter((entry) => entry.id !== id));
}
