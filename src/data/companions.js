/**
 * Compañeros y mascotas.
 *
 * Los datos vienen de la tabla de referencia del juego: nombre, alias, tipo,
 * subtipo, tipo de ataque, ataque, movimiento, vida y capacidades. El estado
 * de cada criatura (vida actual y estados alterados) vive en `trackerData`.
 */
import { createId } from '@/utils/id';
import { parseCompanionAbilityKeys } from '@/utils/companionAbilities';
import runicBackground from '@/assets/interactions/runic.avif';
import seedBackground from '@/assets/interactions/seed.avif';
import barricadeBackground from '@/assets/interactions/barricade.avif';
import beerFactoryBackground from '@/assets/interactions/beer-factory.avif';
import draconianAltarBackground from '@/assets/interactions/draconian-altar.avif';
import forgeBackground from '@/assets/interactions/forge.avif';
import floodBackground from '@/assets/interactions/flood.avif';
import shipBackground from '@/assets/interactions/ship.avif';
import knightBackground from '@/assets/interactions/knight.avif';
import portalBackground from '@/assets/interactions/portal.avif';

const INTERACTION_BACKGROUNDS = [
  runicBackground,
  seedBackground,
  barricadeBackground,
  beerFactoryBackground,
  draconianAltarBackground,
  forgeBackground,
  floodBackground,
  shipBackground,
  knightBackground,
  portalBackground,
];

const COMPANION_IMAGES = import.meta.glob('../assets/companions/*.webp', {
  eager: true,
  import: 'default',
});

export function getCompanionImage(id) {
  return COMPANION_IMAGES[`../assets/companions/${id}.webp`] || null;
}

export const COMPANIONS = [
  {
    id: 'drumm',
    name: 'Drumm',
    alias: 'la cría de dragón',
    type: 'mascota',
    subtype: 'Dragón',
    attackType: 'A distancia',
    attack: 1,
    movement: 4,
    life: 1,
    abilities: 'SALTO; QUEMADURA 1',
    expansionId: 'base',
  },
  {
    id: 'bronx',
    name: 'Bronx',
    alias: 'el oso',
    type: 'mascota',
    subtype: 'Oso',
    attackType: 'Cuerpo a cuerpo',
    attack: 2,
    movement: 3,
    life: 1,
    abilities: 'PERSONAL, ESCUDO_2',
    expansionId: 'base',
  },
  {
    id: 'dewey_guss',
    name: 'Dewey y Guss',
    alias: 'los perros',
    type: 'mascota',
    subtype: 'Perro',
    attackType: 'Cuerpo a cuerpo',
    attack: 2,
    movement: 5,
    life: 1,
    abilities: 'SALTO; ÚNICA; PROTEGER',
    expansionId: 'base',
  },
  {
    id: 'jokull',
    name: 'Jokull',
    alias: 'el espíritu de hielo',
    type: 'mascota',
    subtype: 'Elemental',
    attackType: 'Cuerpo a cuerpo',
    attack: 2,
    movement: 4,
    life: 1,
    abilities: 'SALTO; LENTITUD',
    expansionId: 'base',
  },
  {
    id: 'luma',
    name: 'Luma',
    alias: 'el lobo',
    type: 'mascota',
    subtype: 'Lobo',
    attackType: 'Cuerpo a cuerpo',
    attack: 1,
    movement: 4,
    life: 1,
    abilities: 'HEMORRAGIA 1',
    expansionId: 'base',
  },
  {
    id: 'monroe',
    name: 'Monroe',
    alias: 'el perro',
    type: 'mascota',
    subtype: 'Perro',
    attackType: 'Cuerpo a cuerpo',
    attack: 1,
    movement: 4,
    life: 1,
    abilities: 'SALTO; HOSTIGAR; PROTEGER',
    expansionId: 'base',
  },
  {
    id: 'jinx',
    name: 'Jinx',
    alias: 'el águila',
    type: 'mascota',
    subtype: 'Águila',
    attackType: 'Cuerpo a cuerpo',
    attack: 1,
    movement: 5,
    life: 1,
    abilities: 'SALTO; HOSTIGAR; INTIMIDAR 1',
    expansionId: 'base',
  },
  {
    id: 'capitan_conner',
    name: 'Capitán Conner',
    alias: 'Capitán amirano',
    type: 'companero',
    subtype: '-',
    attackType: 'Cuerpo a cuerpo',
    attack: 3,
    movement: 3,
    life: 6,
    abilities: 'DERRIBO',
    expansionId: 'base',
  },
  {
    id: 'conner_desarmado',
    name: 'Conner (desarmado)',
    alias: 'Capitán amirano',
    type: 'companero',
    subtype: '-',
    attackType: 'Cuerpo a cuerpo',
    attack: 2,
    movement: 4,
    life: 5,
    abilities: '-',
    expansionId: 'base',
  },
  {
    id: 'lorelai_companion',
    name: 'Lorelai',
    alias: 'Héroe de Daren',
    type: 'companero',
    subtype: '-',
    attackType: 'A distancia',
    attack: 3,
    movement: 5,
    life: 5,
    abilities: 'PERMUTA CON EL HÉROE OBJETIVO',
    expansionId: 'base',
  },
  {
    id: 'elros_companion',
    name: 'Elros',
    alias: 'Héroe de Daren',
    type: 'companero',
    subtype: '-',
    attackType: 'Cuerpo a cuerpo',
    attack: 3,
    movement: 5,
    life: 5,
    abilities: 'HEMORRAGIA 2',
    expansionId: 'base',
  },
  {
    id: 'jaheen_companion',
    name: 'Jaheen',
    alias: 'Héroe de Daren',
    type: 'companero',
    subtype: '-',
    attackType: 'Cuerpo a cuerpo',
    attack: 3,
    movement: 5,
    life: 5,
    abilities: 'UN HÉROE A CUALQUIER ALCANCE GANA SANAR 2',
    expansionId: 'base',
  },
  {
    id: 'janina',
    name: 'Janina',
    alias: 'Matriarca maga',
    type: 'companero',
    subtype: '-',
    attackType: 'A distancia',
    attack: 3,
    movement: 5,
    life: 5,
    abilities: 'QUEMADURA 2',
    expansionId: 'base',
  },
  {
    id: 'janina_desarmada',
    name: 'Janina (desarmada)',
    alias: 'Matriarca maga',
    type: 'companero',
    subtype: '-',
    attackType: 'Cuerpo a cuerpo',
    attack: 3,
    movement: 5,
    life: 4,
    abilities: '-',
    expansionId: 'base',
  },
  {
    id: 'maya_companion',
    name: 'Maya',
    alias: 'Héroe de Daren',
    type: 'companero',
    subtype: '-',
    attackType: 'A distancia',
    attack: 3,
    movement: 4,
    life: 5,
    abilities: 'ATAQUE DOBLE',
    expansionId: 'base',
  },
  {
    id: 'neil_mesick',
    name: 'Neil Mesick',
    alias: 'Capitán de barco',
    type: 'companero',
    subtype: '-',
    attackType: 'Cuerpo a cuerpo',
    attack: 3,
    movement: 4,
    life: 4,
    abilities: 'SAQUEO',
    expansionId: 'base',
  },
  {
    id: 'oliver_twist',
    name: 'Oliver Twist',
    alias: 'Niño intrépido',
    type: 'companero',
    subtype: '-',
    attackType: '-',
    attack: null,
    movement: null,
    life: 3,
    abilities: '-',
    expansionId: 'base',
  },
  {
    id: 'ronald_keinz',
    name: 'Ronald Keinz',
    alias: 'Montaraz atormentado',
    type: 'companero',
    subtype: '-',
    attackType: 'A distancia',
    attack: 3,
    movement: 5,
    life: 5,
    abilities: 'ANDANADA 2',
    expansionId: 'base',
  },
  {
    id: 'simon_kiblisch',
    name: 'Simon Kiblisch',
    alias: 'Ladrón de tumbas',
    type: 'companero',
    subtype: '-',
    attackType: 'Cuerpo a cuerpo',
    attack: 3,
    movement: 4,
    life: 5,
    abilities: 'SAQUEO',
    expansionId: 'base',
  },
  {
    id: 'tharmagar_leal',
    name: 'Tharmagar (leal)',
    alias: 'Maestro alquimista',
    type: 'companero',
    subtype: '-',
    attackType: 'A distancia',
    attack: 3,
    movement: 4,
    life: 5,
    abilities: 'TRUCO O TRATO',
    expansionId: 'base',
  },
  {
    id: 'tharmagar_resentido',
    name: 'Tharmagar (resentido)',
    alias: 'Maestro alquimista',
    type: 'companero',
    subtype: '-',
    attackType: 'A distancia',
    attack: 2,
    movement: 4,
    life: 5,
    abilities: 'PERSONAL, ESCUDO_2',
    expansionId: 'base',
  },
  {
    id: 'heroe_renacido',
    name: 'Un héroe renacido',
    alias: 'Héroe de Daren',
    type: 'companero',
    subtype: '-',
    attackType: 'Cuerpo a cuerpo',
    attack: 3,
    movement: 5,
    life: 5,
    abilities: 'UN HÉROE A CUALQUIER ALCANCE RECOBRA HASTA 2 CA',
    expansionId: 'base',
  },
  {
    id: 'vorn_companion',
    name: 'Vorn',
    alias: 'Héroe de Daren',
    type: 'companero',
    subtype: '-',
    attackType: 'Cuerpo a cuerpo',
    attack: 3,
    movement: 5,
    life: 5,
    abilities: 'PERSONAL, ESCUDO_2',
    expansionId: 'base',
  },
  {
    id: 'neva',
    name: 'Neva',
    alias: 'la pantera nubosa',
    type: 'mascota',
    subtype: 'Pantera',
    attackType: 'Cuerpo a cuerpo',
    attack: 2,
    movement: 3,
    life: 1,
    abilities: 'ÚNICA; CADA VEZ QUE NEVA INFLIJA UN GOLPE DE GRACIA: ALCANCE 1, PURIFICACIÓN 1',
    expansionId: 'apocalypse_heroes_1',
  },
  {
    id: 'hakkon',
    name: 'Hakkon',
    alias: 'Guerrero no muerto',
    type: 'mascota',
    subtype: 'Draugr',
    attackType: 'Cuerpo a cuerpo',
    attack: 2,
    movement: 4,
    life: 1,
    abilities: 'NO MUERTO; LOS DRAUGR NO RECIBEN DAÑO POR OSCURIDAD',
    expansionId: 'apocalypse_heroes_1',
  },
];

export const COMPANION_TYPES = {
  mascota: { es: 'Mascota', en: 'Pet' },
  companero: { es: 'Compañero', en: 'Companion' },
};

export function getCompanion(id) {
  return COMPANIONS.find((companion) => companion.id === id) || null;
}

export function getCompanionName(id) {
  return getCompanion(id)?.name || id;
}

const normalizeAlias = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

/** Grupo del menú: mascota, compañero o héroe de Daren. */
export function getCompanionGroup(companion) {
  if (!companion) return 'companero';
  if (companion.type === 'mascota') return 'mascota';
  return normalizeAlias(companion.alias).includes('heroe de daren') ? 'daren_hero' : 'companero';
}

/** Fondo de interacción asignado de forma estable por posición en el catálogo. */
export function getCompanionBackground(id) {
  const index = COMPANIONS.findIndex((companion) => companion.id === id);
  return INTERACTION_BACKGROUNDS[(index >= 0 ? index : 0) % INTERACTION_BACKGROUNDS.length];
}

/** Fondo aleatorio del catálogo de interacciones (para los seguidores). */
export function getRandomCompanionBackground() {
  return INTERACTION_BACKGROUNDS[Math.floor(Math.random() * INTERACTION_BACKGROUNDS.length)];
}

/** Fondo de interacción por índice estable (seguidores). */
export function getInteractionBackgroundAt(index = 0) {
  if (INTERACTION_BACKGROUNDS.length === 0) return null;
  const normalized = ((Number(index) || 0) % INTERACTION_BACKGROUNDS.length + INTERACTION_BACKGROUNDS.length)
    % INTERACTION_BACKGROUNDS.length;
  return INTERACTION_BACKGROUNDS[normalized];
}

/** Criaturas disponibles según las expansiones activas. */
export function getCompanionsForExpansions(expansionIds = []) {
  if (!Array.isArray(expansionIds) || expansionIds.length === 0) return [];
  const selected = new Set(expansionIds);
  return COMPANIONS.filter((companion) => selected.has(companion.expansionId));
}

/** Entrada de partida para una criatura asignada a un héroe. */
export function createCompanionEntry(companion, heroId, order) {
  return {
    uid: createId(),
    id: companion.id,
    heroId,
    order,
    vida: companion.life,
    vidaMax: companion.life,
    estadosAlterados: [],
    capacidades: parseCompanionAbilityKeys(companion.abilities),
  };
}
