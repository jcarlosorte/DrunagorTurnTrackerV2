// Seguidores de las cajas Despertar y Apocalipsis.
import elrosImg from '@/assets/followers/elros_seguidor.webp';
import vornImg from '@/assets/followers/vorn_seguidor.webp';
import minervaImg from '@/assets/followers/minerva_seguidor.webp';
import jaheenImg from '@/assets/followers/jaheen_seguidor.webp';
import mayaImg from '@/assets/followers/maya_seguidor.webp';
import lorelaiImg from '@/assets/followers/lorelai_seguidor.webp';
import khadijaImg from '@/assets/followers/khadija_seguidor.webp';
import daviggoImg from '@/assets/followers/daviggo_seguidor.webp';
import amsterdImg from '@/assets/followers/amsterd_seguidor.webp';
import randyImg from '@/assets/followers/randy_seguidor.webp';
import carmillaImg from '@/assets/followers/carmilla_seguidor.webp';
import robinImg from '@/assets/followers/robin_seguidor.webp';
import surcadoraCohortImg from '@/assets/cohort/surcadora_cohort.webp';
import condotierroCohortImg from '@/assets/cohort/condotierro_cohort.webp';
import christiyjefreyCohortImg from '@/assets/cohort/christiyjefrey_cohort.webp';
import carroneroCohortImg from '@/assets/cohort/carronero_cohort.webp';

export const FOLLOWERS = [
  {
    id: 'elros_asesino',
    name: 'Elros',
    nameEn: 'Elros',
    epithet: 'el Asesino',
    epithetEn: 'the Assassin',
    role: 'lider',
    expansionId: 'apocalypse_awakenings',
    attackType: 'cuerpo',
    capabilities: ['VENENO 2'],
    image: elrosImg,
    states: [
      { id: 'energico', name: 'Enérgico', nameEn: 'Energetic', ataque: 3, movimiento: 4, vida: 5 },
      { id: 'desanimado', name: 'Desanimado', nameEn: 'Discouraged', ataque: 1, movimiento: 3, vida: 5 },
    ],
  },
  {
    id: 'vorn_guerrero',
    name: 'Vorn',
    nameEn: 'Vorn',
    epithet: 'el Guerrero',
    epithetEn: 'the Warrior',
    role: 'defensor',
    expansionId: 'apocalypse_awakenings',
    attackType: 'cuerpo',
    capabilities: ['HENDEDURA 2'],
    image: vornImg,
    states: [
      { id: 'animado', name: 'Animado', nameEn: 'Animated', ataque: 3, movimiento: 4, vida: 5 },
      { id: 'sediento', name: 'Sediento', nameEn: 'Thirsty', ataque: 2, movimiento: 3, vida: 5 },
    ],
  },
  {
    id: 'minerva_renacida',
    name: 'Minerva',
    nameEn: 'Minerva',
    epithet: 'Maestra Renacida',
    epithetEn: 'Reborn Master',
    role: 'lider',
    expansionId: 'apocalypse_awakenings',
    attackType: 'cuerpo',
    capabilities: ['HENDEDURA 2'],
    image: minervaImg,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 5, movimiento: 5, vida: 7 },
    ],
  },
  {
    id: 'jaheen_clerigo',
    name: 'Jaheen',
    nameEn: 'Jaheen',
    epithet: 'el Clérigo',
    epithetEn: 'the Cleric',
    role: 'apoyo',
    expansionId: 'apocalypse_awakenings',
    attackType: 'cuerpo',
    capabilities: ['ALCANCE 1', 'ESCUDO 2'],
    image: jaheenImg,
    states: [
      { id: 'esperanzado', name: 'Esperanzado', nameEn: 'Hopeful', ataque: 3, movimiento: 4, vida: 6 },
      { id: 'desesperado', name: 'Desesperado', nameEn: 'Despairing', ataque: 2, movimiento: 3, vida: 4 },
    ],
  },
  {
    id: 'maya_montaraz',
    name: 'Maya',
    nameEn: 'Maya',
    epithet: 'la Montaraz',
    epithetEn: 'the Ranger',
    role: 'agresor',
    expansionId: 'apocalypse_awakenings',
    attackType: 'distancia',
    capabilities: ['ATAQUE DOBLE'],
    image: mayaImg,
    states: [
      { id: 'alerta', name: 'Alerta', nameEn: 'Alert', ataque: 3, movimiento: 5, vida: 5 },
      { id: 'tranquila', name: 'Tranquila', nameEn: 'Calm', ataque: 2, movimiento: 4, vida: 5 },
    ],
  },
  {
    id: 'lorelai_maga',
    name: 'Lorelai',
    nameEn: 'Lorelai',
    epithet: 'la Maga',
    epithetEn: 'the Mage',
    role: 'controlador',
    expansionId: 'apocalypse_awakenings',
    attackType: 'distancia',
    capabilities: ['LENTITUD'],
    image: lorelaiImg,
    states: [
      { id: 'tenaz', name: 'Tenaz', nameEn: 'Tenacious', ataque: 3, movimiento: 4, vida: 5 },
      { id: 'agotada', name: 'Agotada', nameEn: 'Exhausted', ataque: 2, movimiento: 4, vida: 5 },
    ],
  },
  {
    id: 'khadija',
    name: 'Surcadora Khadija',
    nameEn: 'Dunedancer Khadija',
    epithet: 'Amazona Prodigio',
    epithetEn: 'Amazon Prodigy',
    role: 'agresor',
    expansionId: 'apocalypse_adventures',
    attackType: 'cuerpo',
    capabilities: ['1 HÉROE ADYACENTE', 'INSPIRAR'],
    image: khadijaImg,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 4, movimiento: 5, vida: 6 },
    ],
  },
  {
    id: 'daviggo',
    name: 'Condotierro DaViggo',
    nameEn: 'Condottieri DaViggo',
    epithet: 'Capitán Noble',
    epithetEn: 'Noble Captain',
    role: 'defensor',
    expansionId: 'apocalypse_adventures',
    attackType: 'cuerpo',
    capabilities: ['1 HÉROE ADYACENTE', 'CONCENTRACIÓN 1'],
    image: daviggoImg,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 3, movimiento: 4, vida: 7 },
    ],
  },
  {
    id: 'amsterd',
    name: 'Amsterd DeHanse',
    nameEn: 'Amsterd DeHanse',
    epithet: 'Mercader Ladrón',
    epithetEn: 'Merchant Thief',
    role: 'controlador',
    expansionId: 'apocalypse_adventures',
    attackType: 'distancia',
    capabilities: ['RECOMPENSA'],
    image: amsterdImg,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 3, movimiento: 5, vida: 6 },
    ],
  },
  {
    id: 'randy',
    name: 'Randy Ribeiro',
    nameEn: 'Randy Ribeiro',
    epithet: 'Maestro de Espías de la Doctrina',
    epithetEn: 'Master of Spies of the Doctrine',
    role: 'defensor',
    expansionId: 'apocalypse_adventures',
    attackType: 'cuerpo',
    capabilities: ['RECOMPENSA'],
    image: randyImg,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 6, movimiento: 5, vida: 7 },
    ],
  },
  {
    id: 'carmilla',
    name: 'Carmilla Reinard',
    nameEn: 'Carmilla Reinard',
    epithet: 'Emprendedora',
    epithetEn: 'Entrepreneur',
    role: 'agresor',
    expansionId: 'apocalypse_adventures',
    attackType: 'distancia',
    capabilities: ['ATAQUE DOBLE'],
    image: carmillaImg,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 3, movimiento: 5, vida: 6 },
    ],
  },
  {
    id: 'robin',
    name: 'Robin Rising',
    nameEn: 'Robin Rising',
    epithet: 'Conde de Rionegro',
    epithetEn: 'Count of Rionegro',
    role: 'defensor',
    expansionId: 'apocalypse_adventures',
    attackType: 'cuerpo',
    capabilities: ['1 HÉROE ADYACENTE', 'CONCENTRACIÓN 1'],
    image: robinImg,
    states: [
      { id: 'herido', name: 'Herido', nameEn: 'Wounded', ataque: 3, movimiento: 5, vida: 6 },
      { id: 'sano', name: 'Sano', nameEn: 'Healthy', ataque: 4, movimiento: 5, vida: 7 },
    ],
  },
  {
    id: 'surcadora',
    name: 'Surcadora Avernal',
    nameEn: 'Hellscarian Dunedancer',
    epithet: 'Amazon del Desierto',
    epithetEn: 'Desert Amazon',
    role: 'controlador',
    expansionId: 'apocalypse_adventures',
    attackType: 'cuerpo',
    capabilities: ['HEMORRAGIA 2'],
    image: surcadoraCohortImg,
    cohort: true,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 2, movimiento: 5, vida: 5 },
    ],
  },
  {
    id: 'condotierro',
    name: 'Condotierro Umbraliano',
    nameEn: 'Umbralian Condottieri',
    epithet: 'Soldado',
    epithetEn: 'Soldier',
    role: 'lider',
    expansionId: 'apocalypse_adventures',
    attackType: 'cuerpo',
    capabilities: ['INTIMIDAR 1'],
    image: condotierroCohortImg,
    cohort: true,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 2, movimiento: 4, vida: 7 },
    ],
  },
  {
    id: 'christiyjefrey',
    name: 'Christi & Jeffrey',
    nameEn: 'Christi & Jeffrey',
    epithet: 'Combatientes',
    epithetEn: 'Fighters',
    role: 'controlador',
    expansionId: 'apocalypse_adventures',
    attackType: 'cuerpo',
    capabilities: ['PERSONAL', 'ESCUDO 2'],
    image: christiyjefreyCohortImg,
    cohort: true,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 3, movimiento: 4, vida: 7 },
    ],
  },
  {
    id: 'carronero',
    name: 'Carroñero',
    nameEn: 'Scavenger',
    epithet: 'Aliado Misterioso',
    epithetEn: 'Mysterious Ally',
    role: 'lider',
    expansionId: 'apocalypse_adventures',
    attackType: 'cuerpo',
    capabilities: ['PERSONAL', 'SIGILO'],
    image: carroneroCohortImg,
    cohort: true,
    states: [
      { id: 'normal', name: 'Normal', nameEn: 'Normal', ataque: 6, movimiento: 5, vida: 5 },
    ],
  },
];

export const COHORT_FOLLOWERS = FOLLOWERS.filter((follower) => follower.cohort);
export const STANDARD_FOLLOWERS = FOLLOWERS.filter((follower) => !follower.cohort);

export function getFollower(id) {
  return FOLLOWERS.find((follower) => follower.id === id) || null;
}

/** Los Acompañantes (Cohort) no se conservan entre aventuras. */
export function isCohortFollower(id) {
  return Boolean(getFollower(id)?.cohort);
}

export function getFollowerState(followerId, stateId) {
  const follower = getFollower(followerId);
  if (!follower) return null;
  return follower.states.find((state) => state.id === stateId) || follower.states[0];
}

/** Nombre localizado; los nombres propios se mantienen igual en ambos idiomas. */
export function getFollowerName(follower, language = 'es') {
  if (!follower) return '';
  return language === 'en' ? (follower.nameEn || follower.name) : follower.name;
}

/** Epíteto localizado. */
export function getFollowerEpithet(follower, language = 'es') {
  if (!follower) return '';
  return language === 'en' ? (follower.epithetEn || follower.epithet) : follower.epithet;
}

/** Nombre localizado de un estado del seguidor. */
export function getFollowerStateName(state, language = 'es') {
  if (!state) return '';
  return language === 'en' ? (state.nameEn || state.name) : state.name;
}

/**
 * Seguidores visibles según la caja principal activa. La vista previa de otras
 * cajas muestra también los de la otra campaña.
 */
export function getFollowersForCampaign({
  mainBox = 'core',
  previewOtherBoxes = false,
  showAllBoxes = false,
} = {}) {
  if (showAllBoxes) return FOLLOWERS;
  return FOLLOWERS.filter((follower) => {
    if (follower.expansionId === 'apocalypse_adventures') {
      return mainBox === 'apocalypse' || previewOtherBoxes;
    }
    if (follower.expansionId === 'apocalypse_awakenings') {
      return mainBox === 'awakenings' || previewOtherBoxes;
    }
    return true;
  });
}
