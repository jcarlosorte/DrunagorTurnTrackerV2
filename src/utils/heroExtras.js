import { isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';
import { HEROES } from '@/data/heroes';

export const HERO_EXTRAS_KEY = 'heroExtras';
export const MAX_CUBES = 10;

const EQUIPMENT_SLOTS = ['arma', 'manoTorpe', 'armadura', 'amuleto', 'bolsa1', 'bolsa2'];

export const emptyHeroExtras = (heroId) => {
  const hero = HEROES.find((item) => item.id === heroId);
  return {
    vida: hero?.baseLife ?? 10,
    vidaMax: hero?.baseLife ?? 10,
    trauma: 0,
    maldicion: 0,
    auras: [],
    consecuencias: [],
    estados: [],
    equipo: Object.fromEntries(EQUIPMENT_SLOTS.map((slot) => [slot, ''])),
  };
};

const normalizeEstado = (item) => (
  isPlainObject(item) ? { id: item.id, count: Number(item.count) || 1 } : { id: item, count: 1 }
);

export function readHeroExtras() {
  return readJsonStorage(HERO_EXTRAS_KEY, {}, isPlainObject);
}

export function getHeroExtras(heroId) {
  const stored = readHeroExtras();
  const entry = stored[heroId];
  const base = emptyHeroExtras(heroId);
  if (!isPlainObject(entry)) return base;

  return {
    ...base,
    ...entry,
    auras: Array.isArray(entry.auras) ? entry.auras : [],
    consecuencias: Array.isArray(entry.consecuencias) ? entry.consecuencias : [],
    estados: Array.isArray(entry.estados) ? entry.estados.map(normalizeEstado) : [],
    equipo: { ...base.equipo, ...(isPlainObject(entry.equipo) ? entry.equipo : {}) },
    trauma: Number(entry.trauma) || 0,
    maldicion: Number(entry.maldicion) || 0,
    vida: Number.isFinite(entry.vida) ? entry.vida : base.vida,
    vidaMax: Number(entry.vidaMax) ? entry.vidaMax : base.vidaMax,
  };
}

export function setHeroExtras(heroId, extras) {
  const stored = readHeroExtras();
  stored[heroId] = { ...getHeroExtras(heroId), ...extras };
  writeJsonStorage(HERO_EXTRAS_KEY, stored);
  return stored[heroId];
}

export function patchHeroExtras(heroId, patch) {
  return setHeroExtras(heroId, patch);
}

export function toggleHeroExtra(heroId, group, id) {
  const current = getHeroExtras(heroId);
  const list = current[group] || [];
  const exists = list.some((item) => (typeof item === 'string' ? item === id : item.id === id));
  const next = exists
    ? list.filter((item) => (typeof item === 'string' ? item !== id : item.id !== id))
    : [...list, id];
  return patchHeroExtras(heroId, { [group]: next });
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

  return patchHeroExtras(heroId, { estados: list });
}

export function changeHeroVida(heroId, delta) {
  const current = getHeroExtras(heroId);
  const max = current.vidaMax || 10;
  const next = Math.max(0, Math.min(current.vida + delta, max));
  return patchHeroExtras(heroId, { vida: next });
}

export function changeHeroCubes(heroId, type, delta) {
  const current = getHeroExtras(heroId);
  const next = Math.max(0, Math.min((current[type] || 0) + delta, MAX_CUBES));
  return patchHeroExtras(heroId, { [type]: next });
}

export function setHeroEquipment(heroId, slot, value) {
  const current = getHeroExtras(heroId);
  return patchHeroExtras(heroId, { equipo: { ...current.equipo, [slot]: value } });
}
