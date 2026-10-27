import { isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';
import { HEROES } from '@/data/heroes';

export const HERO_EXTRAS_KEY = 'heroExtras';
/** Sube cuando cambian los cubos oficiales de los héroes para refrescar los guardados. */
export const HERO_CUBES_VERSION = 2;
export const MAX_TRAUMA = 2;
export const MAX_MALDICION = 5;
export const MAX_CUBOS = 6;

const EQUIPMENT_SLOTS = ['arma', 'manoTorpe', 'armadura', 'amuleto', 'bolsa1', 'bolsa2'];
const CUBE_KEYS = ['amarillo', 'rojo', 'verde', 'azul'];
/** Ranuras de equipo que llevan modificador de estadística asociado. */
const MOD_SLOTS = ['arma', 'amuleto'];
export const MOD_STATS = ['movimiento', 'ataque', 'vida'];
/** Estadística que modifica cada ranura por defecto. */
const DEFAULT_MOD_STAT = { arma: 'ataque', amuleto: 'movimiento' };

export const CUBE_META = [
  { key: 'trauma', color: '#7c3aed', max: MAX_TRAUMA, label: { es: 'Trauma', en: 'Trauma' } },
  { key: 'maldicion', color: '#111827', max: MAX_MALDICION, label: { es: 'Maldición', en: 'Curse' } },
  { key: 'amarillo', color: '#f5c400', max: MAX_CUBOS, label: { es: 'Amarillo · cuerpo a cuerpo', en: 'Yellow · melee' } },
  { key: 'rojo', color: '#cc1f1f', max: MAX_CUBOS, label: { es: 'Rojo · a distancia', en: 'Red · ranged' } },
  { key: 'verde', color: '#1f9d55', max: MAX_CUBOS, label: { es: 'Verde · agilidad', en: 'Green · agility' } },
  { key: 'azul', color: '#2563eb', max: MAX_CUBOS, label: { es: 'Azul · sabiduría/magia', en: 'Blue · wisdom/magic' } },
];

export const emptyHeroExtras = (heroId) => {
  const hero = HEROES.find((item) => item.id === heroId);
  const baseLife = hero?.baseLife ?? 10;
  // Cubos base del héroe: 5 (1 de cada color + 1 del color de su clase).
  const baseCubos = hero?.cubos || { amarillo: 1, rojo: 1, verde: 1, azul: 2 };
  return {
    vida: baseLife,
    vidaMax: baseLife,
    trauma: 0,
    maldicion: 0,
    /** Modificador al impactar (se suma al dado de ataque). */
    impactoMod: 0,
    auras: [],
    consecuencias: [],
    estados: [],
    /** Iconos de estado alterado (quemadura, veneno, escudo…) con contador. */
    estadosAlterados: [],
    equipo: Object.fromEntries(EQUIPMENT_SLOTS.map((slot) => [slot, ''])),
    equipoMods: Object.fromEntries(
      MOD_SLOTS.map((slot) => [slot, { value: 0, stat: DEFAULT_MOD_STAT[slot] }]),
    ),
    // Cubos disponibles y su máximo (el máximo puede alterarse como la vida).
    cubos: Object.fromEntries(CUBE_KEYS.map((key) => [key, baseCubos[key] ?? 1])),
    cubosMax: Object.fromEntries(CUBE_KEYS.map((key) => [key, baseCubos[key] ?? 1])),
  };
};

const normalizeEstado = (item) => (
  isPlainObject(item) ? { id: item.id, count: Number(item.count) || 1 } : { id: item, count: 1 }
);

const normalizeMods = (raw, base) => {
  const result = { ...base };
  if (!isPlainObject(raw)) return result;
  MOD_SLOTS.forEach((slot) => {
    const entry = raw[slot];
    if (!isPlainObject(entry) && !Number.isFinite(entry)) return;
    const value = Number(isPlainObject(entry) ? entry.value : entry) || 0;
    const stat = isPlainObject(entry) && MOD_STATS.includes(entry.stat)
      ? entry.stat
      : base[slot].stat;
    result[slot] = { value, stat };
  });
  return result;
};

export function readHeroExtras() {
  return readJsonStorage(HERO_EXTRAS_KEY, {}, isPlainObject);
}

export function getHeroExtras(heroId) {
  const stored = readHeroExtras();
  const entry = stored[heroId];
  const base = emptyHeroExtras(heroId);
  if (!isPlainObject(entry)) return base;

  const equipoMods = normalizeMods(entry.equipoMods, base.equipoMods);
  // Si cambian los cubos oficiales de un héroe, se refrescan los guardados.
  const cubosVigentes = Number(entry.cubosVersion) === HERO_CUBES_VERSION;
  const cubos = cubosVigentes
    ? { ...base.cubos, ...(isPlainObject(entry.cubos) ? entry.cubos : {}) }
    : { ...base.cubos };
  const cubosMax = cubosVigentes
    ? { ...base.cubosMax, ...(isPlainObject(entry.cubosMax) ? entry.cubosMax : {}) }
    : { ...base.cubosMax };
  // El valor nunca puede superar el máximo vigente.
  CUBE_KEYS.forEach((key) => {
    const max = Math.max(0, Number(cubosMax[key]) || 0);
    cubosMax[key] = max;
    cubos[key] = Math.max(0, Math.min(Number(cubos[key]) || 0, max));
  });

  return {
    ...base,
    ...entry,
    auras: Array.isArray(entry.auras) ? entry.auras : [],
    consecuencias: Array.isArray(entry.consecuencias) ? entry.consecuencias : [],
    estados: Array.isArray(entry.estados) ? entry.estados.map(normalizeEstado) : [],
    estadosAlterados: Array.isArray(entry.estadosAlterados)
      ? entry.estadosAlterados.map(normalizeEstado)
      : [],
    equipo: { ...base.equipo, ...(isPlainObject(entry.equipo) ? entry.equipo : {}) },
    equipoMods,
    cubos,
    cubosMax,
    trauma: Number(entry.trauma) || 0,
    maldicion: Number(entry.maldicion) || 0,
    impactoMod: Number(entry.impactoMod) || 0,
    vida: Number.isFinite(entry.vida) ? entry.vida : base.vida,
    vidaMax: Number(entry.vidaMax) || base.vidaMax,
  };
}

export function setHeroExtras(heroId, extras) {
  const stored = readHeroExtras();
  stored[heroId] = {
    ...getHeroExtras(heroId),
    ...extras,
    cubosVersion: HERO_CUBES_VERSION,
  };
  writeJsonStorage(HERO_EXTRAS_KEY, stored);
  return stored[heroId];
}

export const patchHeroExtras = (heroId, patch) => setHeroExtras(heroId, patch);

/** Suma de modificadores de equipo que afectan a una estadística. */
export function getEquipmentBonus(extras, stat) {
  return MOD_SLOTS.reduce((total, slot) => {
    const mod = extras.equipoMods?.[slot];
    if (!mod || mod.stat !== stat) return total;
    return total + (Number(mod.value) || 0);
  }, 0);
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

/** Iconos de estado alterado (quemadura, veneno, escudo…): contador +/−. */
export function stepHeroEstadoAlterado(heroId, estadoId, delta) {
  const current = getHeroExtras(heroId);
  const list = [...(current.estadosAlterados || [])];
  const index = list.findIndex((item) => item.id === estadoId);

  if (index === -1) {
    if (delta > 0) list.push({ id: estadoId, count: 1 });
  } else {
    const nextCount = list[index].count + delta;
    if (nextCount <= 0) list.splice(index, 1);
    else list[index] = { ...list[index], count: nextCount };
  }

  return patchHeroExtras(heroId, { estadosAlterados: list });
}

/** Vida actual: curar nunca supera el máximo; el daño no baja de 0. */
export function changeHeroVida(heroId, delta) {
  const current = getHeroExtras(heroId);
  const next = Math.max(0, Math.min(current.vida + delta, current.vidaMax));
  return patchHeroExtras(heroId, { vida: next });
}

/** Vida máxima: editable y puede superar la base del héroe. */
export function changeHeroVidaMax(heroId, delta) {
  const current = getHeroExtras(heroId);
  const next = Math.max(1, current.vidaMax + delta);
  const vida = Math.min(current.vida, next);
  return patchHeroExtras(heroId, { vidaMax: next, vida });
}

export function changeHeroCubes(heroId, type, delta) {
  const current = getHeroExtras(heroId);
  const max = type === 'trauma' ? MAX_TRAUMA : MAX_MALDICION;
  const next = Math.max(0, Math.min((current[type] || 0) + delta, max));
  return patchHeroExtras(heroId, { [type]: next });
}

export function changeHeroActionCube(heroId, color, delta) {
  const current = getHeroExtras(heroId);
  const max = current.cubosMax?.[color] ?? MAX_CUBOS;
  const next = Math.max(0, Math.min((current.cubos?.[color] || 0) + delta, max));
  return patchHeroExtras(heroId, { cubos: { ...current.cubos, [color]: next } });
}

/** Máximo de un color: puede subir o bajar; el valor se recorta al nuevo tope. */
export function changeHeroActionCubeMax(heroId, color, delta) {
  const current = getHeroExtras(heroId);
  const max = Math.max(0, Math.min((current.cubosMax?.[color] ?? 0) + delta, 10));
  const value = Math.min(current.cubos?.[color] || 0, max);
  return patchHeroExtras(heroId, {
    cubosMax: { ...current.cubosMax, [color]: max },
    cubos: { ...current.cubos, [color]: value },
  });
}

/** Recobrar: todos los cubos de acción vuelven a su máximo. */
export function recobrarCubos(heroId) {
  const current = getHeroExtras(heroId);
  const cubos = Object.fromEntries(
    CUBE_KEYS.map((key) => [key, current.cubosMax?.[key] ?? 0]),
  );
  return patchHeroExtras(heroId, { cubos });
}

export function setHeroEquipment(heroId, slot, value) {
  const current = getHeroExtras(heroId);
  return patchHeroExtras(heroId, { equipo: { ...current.equipo, [slot]: value } });
}

export function setEquipmentMod(heroId, slot, patch) {
  const current = getHeroExtras(heroId);
  const mod = current.equipoMods?.[slot] || { value: 0, stat: DEFAULT_MOD_STAT[slot] };
  // El arma solo puede modificar el ataque; el amuleto permite elegir estadística.
  const stat = slot === 'arma' ? 'ataque' : (patch.stat || mod.stat);
  return patchHeroExtras(heroId, {
    equipoMods: { ...current.equipoMods, [slot]: { ...mod, ...patch, stat } },
  });
}
