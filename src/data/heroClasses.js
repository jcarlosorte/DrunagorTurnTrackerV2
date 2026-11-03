import { HEROES } from '@/data/heroes';

/**
 * Clases de héroe y su relación con los recursos exclusivos.
 *
 * `heroes.js` ya guarda la clase en `profession`; este módulo la normaliza
 * (Maga/Mago, Bárbara/Bárbaro, Paladina/Paladín…) para que el resto de la app
 * no tenga que comparar cadenas con género.
 */

const CLASS_ICONS = import.meta.glob('../assets/classes/*.png', {
  eager: true,
  import: 'default',
});

const CLASS_META = {
  asesino: { color: '#3f2b24', file: 'assassin.png' },
  barbaro: { color: '#7a1f1f', file: 'Barbarian.png' },
  bardo: { color: '#7a1f5c', file: 'Bard.png' },
  clerigo: { color: '#8a5a2b', file: 'Cleric.png' },
  druida: { color: '#3f5a2a', file: 'Druid.png' },
  mago: { color: '#4b2a6b', file: 'Mage.png' },
  monje: { color: '#8a5a1f', file: 'Monk.png' },
  paladin: { color: '#4a4a5a', file: 'Paladin.png' },
  arquero: { color: '#1f4a6b', file: 'Ranger.png' },
  caballero_sombrio: { color: '#5e1f2a', file: 'Shadow Knight.png' },
  hechicero: { color: '#1f5a4a', file: 'Sorcerer.png' },
  guerrero: { color: '#5e1f2a', file: 'Warrior.png' },
  // Apocalipsis
  necromante: { color: '#3b1f5e', file: 'Necromancer.png' },
  chaman: { color: '#5a3a2a', file: 'Shaman.png' },
  mago_espadachin: { color: '#3a5a6b', file: 'Swordmage.png' },
  adalid: { color: '#6b1f2a', file: 'Warlord.png' },
};

const classEntry = (id, es, en) => ({
  es,
  en,
  color: CLASS_META[id]?.color || '#334155',
  icon: CLASS_META[id] ? CLASS_ICONS[`../assets/classes/${CLASS_META[id].file}`] || null : null,
});

export const HERO_CLASSES = {
  asesino: classEntry('asesino', 'Asesino', 'Assassin'),
  barbaro: classEntry('barbaro', 'Bárbaro', 'Barbarian'),
  bardo: classEntry('bardo', 'Bardo', 'Bard'),
  clerigo: classEntry('clerigo', 'Clérigo', 'Cleric'),
  druida: classEntry('druida', 'Druida', 'Druid'),
  mago: classEntry('mago', 'Mago', 'Mage'),
  monje: classEntry('monje', 'Monje', 'Monk'),
  paladin: classEntry('paladin', 'Paladín', 'Paladin'),
  arquero: classEntry('arquero', 'Arquero', 'Ranger'),
  caballero_sombrio: classEntry('caballero_sombrio', 'Caballero Sombrío', 'Shadow Knight'),
  hechicero: classEntry('hechicero', 'Hechicero', 'Sorcerer'),
  guerrero: classEntry('guerrero', 'Guerrero', 'Warrior'),
  // Apocalipsis
  necromante: classEntry('necromante', 'Necromante', 'Necromancer'),
  chaman: classEntry('chaman', 'Chamán', 'Shaman'),
  mago_espadachin: classEntry('mago_espadachin', 'Mago Espadachín', 'Spellblade'),
  adalid: classEntry('adalid', 'Adalid', 'Champion'),
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

/** Clase con etiquetas bilingües, color e icono, o null. */
export function getHeroClass(heroId) {
  const id = getHeroClassId(heroId);
  return id ? { id, ...HERO_CLASSES[id] } : null;
}

/**
 * Agrupa una lista de héroes por clase, ordenando los grupos alfabéticamente.
 * Los héroes sin clase conocida caen en un grupo «Sin clase».
 */
export function getHeroClassGroups(heroes = []) {
  const groups = new Map();

  heroes.forEach((hero) => {
    const classId = getHeroClassId(hero.id) || 'sin_clase';
    if (!groups.has(classId)) {
      const meta = HERO_CLASSES[classId] || {
        es: 'Sin clase',
        en: 'No class',
        color: '#334155',
        icon: null,
      };
      groups.set(classId, { id: classId, label: meta, color: meta.color, icon: meta.icon, heroes: [] });
    }
    groups.get(classId).heroes.push(hero);
  });

  return [...groups.values()].sort((a, b) => (
    (a.label.es || '').localeCompare(b.label.es || '', 'es')
  ));
}
