import { isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';

export const HERO_EXTRAS_KEY = 'heroExtras';

const EMPTY = { auras: [], consecuencias: [], estados: [] };

export function readHeroExtras() {
  const stored = readJsonStorage(HERO_EXTRAS_KEY, {}, isPlainObject);
  return stored;
}

export function getHeroExtras(heroId) {
  const stored = readHeroExtras();
  const entry = stored[heroId];
  if (!isPlainObject(entry)) return { ...EMPTY };
  return {
    auras: Array.isArray(entry.auras) ? entry.auras : [],
    consecuencias: Array.isArray(entry.consecuencias) ? entry.consecuencias : [],
    estados: Array.isArray(entry.estados) ? entry.estados.map((item) => (
      isPlainObject(item) ? { id: item.id, count: Number(item.count) || 1 } : { id: item, count: 1 }
    )) : [],
  };
}

export function setHeroExtras(heroId, extras) {
  const stored = readHeroExtras();
  stored[heroId] = {
    auras: extras.auras || [],
    consecuencias: extras.consecuencias || [],
    estados: extras.estados || [],
  };
  writeJsonStorage(HERO_EXTRAS_KEY, stored);
  return stored[heroId];
}

export function toggleHeroExtra(heroId, group, id) {
  const current = getHeroExtras(heroId);
  const list = current[group] || [];
  const exists = list.some((item) => (typeof item === 'string' ? item === id : item.id === id));
  const next = exists
    ? list.filter((item) => (typeof item === 'string' ? item !== id : item.id !== id))
    : [...list, id];
  return setHeroExtras(heroId, { ...current, [group]: next });
}

export function stepHeroEstado(heroId, estadoId, delta) {
  const current = getHeroExtras(heroId);
  const list = [...current.estados];
  const index = list.findIndex((item) => item.id === estadoId);

  if (index === -1) {
    if (delta > 0) list.push({ id: estadoId, count: 1 });
  } else {
    const nextCount = list[index].count + delta;
    if (nextCount <= 0) list.splice(index, 1);
    else list[index] = { ...list[index], count: nextCount };
  }

  return setHeroExtras(heroId, { ...current, estados: list });
}
