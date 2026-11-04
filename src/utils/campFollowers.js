import { readJsonStorage, writeJsonStorage } from '@/utils/storage';

const CAMP_FOLLOWERS_KEY = 'campFollowers';

const isCampFollowers = (value) => (
  Array.isArray(value)
  && value.every((entry) => entry && typeof entry.id === 'string')
);

/** Seguidores guardados en el campamento, disponibles para próximas partidas. */
export function readCampFollowers() {
  return readJsonStorage(CAMP_FOLLOWERS_KEY, [], isCampFollowers) || [];
}

/** Guarda el seguidor en el campamento (sin duplicar por id). */
export function saveCampFollower(entry) {
  if (!entry?.id) return readCampFollowers();
  const list = readCampFollowers();
  if (list.some((item) => item.id === entry.id)) return list;

  const blueprint = {
    id: entry.id,
    role: entry.role,
    position: entry.position,
    stateId: entry.stateId,
    background: entry.background || null,
  };
  const next = [...list, blueprint];
  writeJsonStorage(CAMP_FOLLOWERS_KEY, next);
  return next;
}

/** Quita un seguidor del campamento. */
export function removeCampFollower(id) {
  const next = readCampFollowers().filter((entry) => entry.id !== id);
  writeJsonStorage(CAMP_FOLLOWERS_KEY, next);
  return next;
}
