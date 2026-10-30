import { FLUSH_EVENT, isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';
import { HEROES } from '@/data/heroes';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';

export const HERO_EXTRAS_KEY = 'heroExtras';
/** Sube cuando cambian los cubos oficiales de los héroes para refrescar los guardados. */
export const HERO_CUBES_VERSION = 2;
export const MAX_TRAUMA = 2;
export const MAX_MALDICION = 5;
export const MAX_CUBOS = 6;
/** Retardo del volcado a localStorage (agrupa pulsaciones rápidas de +/-). */
const WRITE_DELAY = 250;

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

/** Habilidades que añaden un cubo de acción por nivel elegido. */
export const SKILLS = [
  { key: 'melee', color: 'amarillo', label: { es: 'Cuerpo a cuerpo', en: 'Melee' } },
  { key: 'agility', color: 'verde', label: { es: 'Agilidad', en: 'Agility' } },
  { key: 'ranged', color: 'rojo', label: { es: 'A distancia', en: 'Ranged' } },
  { key: 'wisdom', color: 'azul', label: { es: 'Sabiduría', en: 'Wisdom' } },
];

export const DUNGEON_SKILL_COLORS = ['amarillo', 'rojo', 'verde', 'azul'];
export const MAX_SKILL_LEVEL = 2;
export const MAX_ALMACEN_ITEMS = 20;

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
    /** Segundos acumulados jugados con este héroe. */
    tiempoTotal: 0,
    auras: [],
    consecuencias: [],
    estados: [],
    /** Iconos de estado alterado (quemadura, veneno, escudo…) con contador. */
    estadosAlterados: [],
    /** Habilidades por categoría: 0-2 niveles. La de mazmorra elige color. */
    habilidades: {
      melee: 0,
      agility: 0,
      ranged: 0,
      wisdom: 0,
      dungeon: { nivel: 0, color: 'amarillo' },
    },
    /** Tres capacidades de clase con nombre libre y tres niveles. */
    capacidadesClase: [
      { nombre: '', niveles: [false, false, false] },
      { nombre: '', niveles: [false, false, false] },
      { nombre: '', niveles: [false, false, false] },
    ],
    /** Objetos guardados en el campamento. */
    almacen: [],
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

const clampSkillLevel = (value) => Math.max(0, Math.min(MAX_SKILL_LEVEL, Number(value) || 0));

function normalizeHabilidades(raw, base) {
  const source = isPlainObject(raw) ? raw : {};
  const dungeon = isPlainObject(source.dungeon) ? source.dungeon : {};
  return {
    melee: clampSkillLevel(source.melee),
    agility: clampSkillLevel(source.agility),
    ranged: clampSkillLevel(source.ranged),
    wisdom: clampSkillLevel(source.wisdom),
    dungeon: {
      nivel: clampSkillLevel(dungeon.nivel),
      color: DUNGEON_SKILL_COLORS.includes(dungeon.color) ? dungeon.color : base.dungeon.color,
    },
  };
}

function normalizeCapacidades(raw, base) {
  return base.map((fallback, index) => {
    const entry = Array.isArray(raw) ? raw[index] : null;
    const nombre = isPlainObject(entry) && typeof entry.nombre === 'string'
      ? entry.nombre.slice(0, 40)
      : '';
    const legacyNivel = isPlainObject(entry) ? Math.max(0, Math.min(2, Number(entry.nivel) || 0)) : 0;
    const niveles = Array.isArray(entry?.niveles)
      ? [0, 1, 2].map((level) => Boolean(entry.niveles[level]))
      : [legacyNivel >= 1, legacyNivel >= 2, false];
    // Los rombos 2 y 3 exigen el 1.
    if (!niveles[0]) return { nombre, niveles: [false, false, false] };
    return { nombre, niveles };
  });
}

function normalizeAlmacen(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => typeof item === 'string' && item.trim())
    .slice(0, MAX_ALMACEN_ITEMS)
    .map((item) => item.slice(0, 60));
}

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

// Caché por héroe: evita leer y normalizar localStorage en cada render de carta.
// Se invalida en cada escritura (y al importar o cargar una partida).
const cache = new Map();

/** Invalida la caché de extras (tras escribir, importar o cargar partida). */
export function invalidateHeroExtrasCache() {
  cache.clear();
}

// ------------------------------------------------------------------
// Escrituras diferidas: pulsar +/− repetidamente hacía un JSON.stringify
// y una escritura síncrona por clic. Se agrupan en un único volcado.
// ------------------------------------------------------------------
let pendingStore = null;
let writeTimer = null;

/** Vuelca ya las escrituras pendientes (se llama al guardar o al salir). */
export function flushHeroExtras() {
  if (writeTimer !== null) {
    clearTimeout(writeTimer);
    writeTimer = null;
  }
  if (!pendingStore) return;
  writeJsonStorage(HERO_EXTRAS_KEY, pendingStore);
  pendingStore = null;
}

function scheduleHeroExtrasWrite(store) {
  pendingStore = store;
  if (writeTimer !== null) clearTimeout(writeTimer);
  writeTimer = setTimeout(flushHeroExtras, WRITE_DELAY);
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  // Otra pestaña puede haber cargado una partida: mantenemos la caché al día.
  window.addEventListener('storage', (event) => {
    if (!event.key || event.key === HERO_EXTRAS_KEY) invalidateHeroExtrasCache();
  });
  // Antes de leer para un guardado, y al ocultar/cerrar la pestaña.
  window.addEventListener(FLUSH_EVENT, flushHeroExtras);
  window.addEventListener('pagehide', flushHeroExtras);
  document?.addEventListener?.('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushHeroExtras();
  });
}

export function getHeroExtras(heroId) {
  const cached = cache.get(heroId);
  if (cached) return cached;

  const stored = pendingStore || readHeroExtras();
  const entry = stored[heroId];
  const base = emptyHeroExtras(heroId);

  if (!isPlainObject(entry)) {
    cache.set(heroId, base);
    return base;
  }

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

  const value = {
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
    habilidades: normalizeHabilidades(entry.habilidades, base.habilidades),
    capacidadesClase: normalizeCapacidades(entry.capacidadesClase, base.capacidadesClase),
    almacen: normalizeAlmacen(entry.almacen),
    trauma: Number(entry.trauma) || 0,
    maldicion: Number(entry.maldicion) || 0,
    impactoMod: Number(entry.impactoMod) || 0,
    tiempoTotal: Math.max(0, Number(entry.tiempoTotal) || 0),
    vida: Number.isFinite(entry.vida) ? entry.vida : base.vida,
    vidaMax: Number(entry.vidaMax) || base.vidaMax,
  };

  cache.set(heroId, value);
  return value;
}

export function setHeroExtras(heroId, extras) {
  const stored = pendingStore || readHeroExtras();
  const actualizado = {
    ...getHeroExtras(heroId),
    ...extras,
    cubosVersion: HERO_CUBES_VERSION,
  };
  stored[heroId] = actualizado;
  // La caché se actualiza al momento; el volcado a disco va agrupado.
  cache.set(heroId, actualizado);
  scheduleHeroExtrasWrite(stored);
  return actualizado;
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
  // Límite de fichas por estado, igual que en los enemigos.
  const maxFichas = ESTADOS_ALTERADOS.find((item) => item.id === estadoId)?.max || 4;

  if (index === -1) {
    // Si aún no tiene el estado, se añade con la cantidad completa indicada
    // (p. ej. el dado de trampa aplica veneno 2 de golpe).
    if (delta > 0) list.push({ id: estadoId, count: Math.min(delta, maxFichas) });
  } else {
    const nextCount = Math.min(list[index].count + delta, maxFichas);
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

/**
 * Reinicio de ficha: vida al máximo, sin estados ni estados alterados y cubos
 * recobrados. No toca habilidades, capacidades, almacén ni equipo.
 */
export function resetHero(heroId) {
  const current = getHeroExtras(heroId);
  const cubos = Object.fromEntries(
    CUBE_KEYS.map((key) => [key, current.cubosMax?.[key] ?? 0]),
  );
  return patchHeroExtras(heroId, {
    vida: current.vidaMax,
    estados: [],
    estadosAlterados: [],
    cubos,
    trauma: 0,
    maldicion: 0,
  });
}

/** Reinicio de partida: mismo comportamiento que `resetHero`. */
export function resetHeroForNewGame(heroId) {
  return resetHero(heroId);
}

/**
 * Cambia el nivel (0-2) de una habilidad y ajusta los cubos de acción: cada
 * nivel elegido añade un cubo del color de la categoría (o del elegido en la
 * habilidad de mazmorra).
 */
export function setHeroSkill(heroId, key, level) {
  const current = getHeroExtras(heroId);
  const known = key === 'dungeon' || SKILLS.some((skill) => skill.key === key);
  if (!known) return current;

  const habilidades = {
    ...current.habilidades,
    dungeon: { ...current.habilidades.dungeon },
  };
  const nextLevel = Math.max(0, Math.min(MAX_SKILL_LEVEL, Number(level) || 0));
  const color = key === 'dungeon' ? habilidades.dungeon.color : SKILLS.find((skill) => skill.key === key).color;
  const prevLevel = key === 'dungeon' ? habilidades.dungeon.nivel : habilidades[key];
  const delta = nextLevel - prevLevel;
  if (delta === 0) return current;

  if (key === 'dungeon') habilidades.dungeon.nivel = nextLevel;
  else habilidades[key] = nextLevel;

  const cubosMax = { ...current.cubosMax };
  const cubos = { ...current.cubos };
  cubosMax[color] = Math.max(0, (cubosMax[color] || 0) + delta);
  cubos[color] = Math.max(0, Math.min((cubos[color] || 0) + delta, cubosMax[color]));

  return patchHeroExtras(heroId, { habilidades, cubosMax, cubos });
}

/** Cambia el color de la habilidad de mazmorra y mueve sus cubos si ya había niveles. */
export function setDungeonSkillColor(heroId, color) {
  const current = getHeroExtras(heroId);
  if (!DUNGEON_SKILL_COLORS.includes(color)) return current;

  const dungeon = current.habilidades.dungeon;
  if (dungeon.color === color) return current;

  const cubosMax = { ...current.cubosMax };
  const cubos = { ...current.cubos };
  if (dungeon.nivel > 0) {
    cubosMax[dungeon.color] = Math.max(0, (cubosMax[dungeon.color] || 0) - dungeon.nivel);
    cubos[dungeon.color] = Math.min(cubos[dungeon.color] || 0, cubosMax[dungeon.color]);
    cubosMax[color] = (cubosMax[color] || 0) + dungeon.nivel;
    cubos[color] = Math.min((cubos[color] || 0) + dungeon.nivel, cubosMax[color]);
  }

  return patchHeroExtras(heroId, {
    habilidades: { ...current.habilidades, dungeon: { ...dungeon, color } },
    cubosMax,
    cubos,
  });
}

export function setCapacidadNombre(heroId, index, nombre) {
  const current = getHeroExtras(heroId);
  if (index < 0 || index > 2) return current;
  const capacidadesClase = current.capacidadesClase.map((capacidad, i) => (
    i === index ? { ...capacidad, nombre: String(nombre || '').slice(0, 40) } : capacidad
  ));
  return patchHeroExtras(heroId, { capacidadesClase });
}

/** Alterna un rombo (1-3) de una capacidad; el 2 y el 3 exigen el 1. */
export function toggleCapacidadNivel(heroId, index, level) {
  const current = getHeroExtras(heroId);
  const target = Number(level) - 1;
  if (index < 0 || index > 2 || target < 0 || target > 2) return current;
  const capacidadesClase = current.capacidadesClase.map((capacidad, i) => {
    if (i !== index) return capacidad;
    const niveles = [...capacidad.niveles];
    if (target > 0 && !niveles[0]) return capacidad;
    niveles[target] = !niveles[target];
    if (!niveles[0]) return { ...capacidad, niveles: [false, false, false] };
    return { ...capacidad, niveles };
  });
  return patchHeroExtras(heroId, { capacidadesClase });
}

export function addAlmacenItem(heroId, text) {
  const value = String(text || '').trim().slice(0, 60);
  if (!value) return getHeroExtras(heroId);
  const current = getHeroExtras(heroId);
  if (current.almacen.length >= MAX_ALMACEN_ITEMS) return current;
  return patchHeroExtras(heroId, { almacen: [...current.almacen, value] });
}

export function removeAlmacenItem(heroId, index) {
  const current = getHeroExtras(heroId);
  return patchHeroExtras(heroId, {
    almacen: current.almacen.filter((_, i) => i !== index),
  });
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

/**
 * Cambia un valor numérico simple del héroe (p. ej. `impactoMod`).
 * Se acota para que un valor absurdo no rompa la ficha.
 */
/** Suma segundos jugados al total del héroe y devuelve el nuevo total. */
export function addHeroTurnTime(heroId, seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return getHeroExtras(heroId).tiempoTotal || 0;
  const current = getHeroExtras(heroId);
  const total = Math.max(0, Math.round((current.tiempoTotal || 0) + seconds));
  patchHeroExtras(heroId, { tiempoTotal: total });
  return total;
}
export function setHeroStat(heroId, field, value) {
  const permitidos = ['impactoMod', 'movimientoExtra', 'ataqueArma'];
  if (!permitidos.includes(field)) return getHeroExtras(heroId);
  const numeric = Number(value) || 0;
  const acotado = Math.max(-20, Math.min(20, Math.round(numeric)));
  return patchHeroExtras(heroId, { [field]: acotado });
}
