import { HEROES } from '@/data/heroes';

/**
 * Clases de héroe y su relación con los recursos exclusivos.
 *
 * `heroes.js` ya guarda la clase en `profession`; este módulo la normaliza
 * (Maga/Mago, Bárbara/Bárbaro, Paladina/Paladín…) para que el resto de la app
 * no tenga que comparar cadenas con género.
 */
export const HERO_CLASSES = {
  asesino: { es: 'Asesino', en: 'Assassin' },
  barbaro: { es: 'Bárbaro', en: 'Barbarian' },
  bardo: { es: 'Bardo', en: 'Bard' },
  clerigo: { es: 'Clérigo', en: 'Cleric' },
  druida: { es: 'Druida', en: 'Druid' },
  mago: { es: 'Mago', en: 'Mage' },
  monje: { es: 'Monje', en: 'Monk' },
  paladin: { es: 'Paladín', en: 'Paladin' },
  arquero: { es: 'Arquero', en: 'Archer' },
  caballero_sombrio: { es: 'Caballero Sombrío', en: 'Shadow Knight' },
  hechicero: { es: 'Hechicero', en: 'Warlock' },
  guerrero: { es: 'Guerrero', en: 'Warrior' },
  // Apocalipsis
  necromante: { es: 'Necromante', en: 'Necromancer' },
  chaman: { es: 'Chamán', en: 'Shaman' },
  mago_espadachin: { es: 'Mago Espadachín', en: 'Spellblade' },
  adalid: { es: 'Adalid', en: 'Champion' },
};

const PROFESSION_TO_CLASS = {
  Asesino: 'asesino',
  'Bárbara': 'barbaro',
  'Bárbaro': 'barbaro',
  Bardo: 'bardo',
  Clerigo: 'clerigo',
  'Clérigo': 'clerigo',
  Druida: 'druida',
  Maga: 'mago',
  Mago: 'mago',
  Monje: 'monje',
  Paladin: 'paladin',
  Paladina: 'paladin',
  Arquera: 'arquero',
  Arquero: 'arquero',
  Guerrero_Sombrio: 'caballero_sombrio',
  Hechicero: 'hechicero',
  Guerrero: 'guerrero',
  Necromante: 'necromante',
  Chamana: 'chaman',
  'Chamán': 'chaman',
  Maga_Espadachina: 'mago_espadachin',
  Mago_Espadachin: 'mago_espadachin',
  Adalid: 'adalid',
};

/** Clase normalizada a partir de la profesión guardada en `heroes.js`. */
export function normalizeHeroClass(profession) {
  return PROFESSION_TO_CLASS[profession] || null;
}

/** Clase normalizada del héroe (`asesino`, `barbaro`, …) o null si no existe. */
export function getHeroClassId(heroId) {
  const hero = HEROES.find((item) => item.id === heroId);
  return normalizeHeroClass(hero?.profession);
}

/** Clase con etiquetas bilingües, o null. */
export function getHeroClass(heroId) {
  const id = getHeroClassId(heroId);
  return id ? { id, ...HERO_CLASSES[id] } : null;
}
