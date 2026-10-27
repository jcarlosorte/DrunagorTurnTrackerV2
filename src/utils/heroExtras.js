import { isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';
import { HEROES } from '@/data/heroes';

export const HERO_EXTRAS_KEY = 'heroExtras';
export const MAX_TRAUMA = 2;
export const MAX_MALDICION = 5;
export const MAX_CUBOS = 6;

const EQUIPMENT_SLOTS = ['arma', 'manoTorpe', 'armadura', 'amuleto', 'bolsa1', 'bolsa2'];
const CUBE_KEYS = ['amarillo', 'rojo', 'verde', 'azul'];

export const CUBE_META = [
  { key: 'amarillo', color: '#f5c400', label: { es: 'Amarillo · cuerpo a cuerpo', en: 'Yellow · melee' } },
  { key: 'rojo', color: '#cc1f1f', label: { es: 'Rojo · a distancia', en: 'Red · ranged' } },
  { key: 'verde', color: '#1f9d55', label: { es: 'Verde · agilidad', en: 'Green · agility' } },
  { key: 'azul', color: '#2563eb', label: { es: 'Azul · sabiduría/magia', en: 'Blue · wisdom/magic' } },
];

export const emptyHeroExtras = (heroId) => {
  const hero = HEROES.find((item) => item.id === heroId);
  const baseLife = hero?.baseLife ?? 10;
  return {
    vida: baseLife,
    vidaMax: baseLife,
    trauma: 0,
    maldicion: 0,
    movimientoExtra: 0,
    ataqueArma: 0,
    auras: [],
    consecuencias: [],
    estados: [],
    equipo: Object.fromEntries(EQUIPMENT_SLOTS.map((slot) => [slot, ''])),
    cubos: Object.fromEntries(CUBE_KEYS.map((key) => [key, 2])),
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
    cubos: { ...base.cubos, ...(isPlainObject(entry.cubos) ? entry.cubos : {}) },
    trauma: Number(entry.trauma) || 0,
    maldicion: Number(entry.maldicion) || 0,
    movimientoExtra: Number(entry.movimientoExtra) || 0,
    ataqueArma: Number(entry.ataqueArma) || 0,
    vida: Number.isFinite(entry.vida) ? entry.vida : base.vida,
    vidaMax: Number(entry.vidaMax) || base.vidaMax,
  };
}

export function setHeroExtras(heroId, extras) {
  const stored = readHeroExtras();
  stored[heroId] = { ...getHeroExtras(heroId), ...extras };
  writeJsonStorage(HERO_EXTRAS_KEY, stored);
  return stored[heroId];
}

export const patchHeroExtras = (heroId, patch) => setHeroExtras(heroId, patch);

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

/** Vida actual: puede superar el máximo (sobrecuración) y no baja de 0. */
export function changeHeroVida(heroId, delta) {
  const current = getHeroExtras(heroId);
  const next = Math.max(0, current.vida + delta);
  return patchHeroExtras(heroId, { vida: next });
}

/** Vida máxima: editable y puede superar la base del héroe. */
export function changeHeroVidaMax(heroId, delta) {
  const current = getHeroExtras(heroId);
  const next = Math.max(1, current.vidaMax + delta);
  return patchHeroExtras(heroId, { vidaMax: next });
}

export function changeHeroCubes(heroId, type, delta) {
  const current = getHeroExtras(heroId);
  const max = type === 'trauma' ? MAX_TRAUMA : MAX_MALDICION;
  const next = Math.max(0, Math.min((current[type] || 0) + delta, max));
  return patchHeroExtras(heroId, { [type]: next });
}

export function changeHeroActionCube(heroId, color, delta) {
  const current = getHeroExtras(heroId);
  const next = Math.max(0, Math.min((current.cubos?.[color] || 0) + delta, MAX_CUBOS));
  return patchHeroExtras(heroId, { cubos: { ...current.cubos, [color]: next } });
}

export function setHeroEquipment(heroId, slot, value) {
  const current = getHeroExtras(heroId);
  return patchHeroExtras(heroId, { equipo: { ...current.equipo, [slot]: value } });
}

export function setHeroStat(heroId, field, value) {
  const numeric = Number(value) || 0;
  return patchHeroExtras(heroId, { [field]: numeric });
}
