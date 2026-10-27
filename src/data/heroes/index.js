import AURAS from './auras';
import CONSECUENCIAS from './consecuencias';
import ESTADOS_HEROE from './estados';

export { AURAS, CONSECUENCIAS, ESTADOS_HEROE };

export const HERO_EFFECT_GROUPS = [
  { id: 'auras', label: { es: 'Auras', en: 'Auras' }, items: AURAS },
  { id: 'consecuencias', label: { es: 'Consecuencias', en: 'Consequences' }, items: CONSECUENCIAS },
  { id: 'estados', label: { es: 'Estados', en: 'Conditions' }, items: ESTADOS_HEROE },
];

export const ALL_HERO_EFFECTS = [...AURAS, ...CONSECUENCIAS, ...ESTADOS_HEROE];

const BY_ID = new Map(ALL_HERO_EFFECTS.map((item) => [item.id, item]));

export const getHeroEffect = (id) => BY_ID.get(id) || null;

export const getHeroEffectName = (id, language = 'es') => {
  const item = BY_ID.get(id);
  if (!item) return id;
  return item.name[language] || item.name.es || id;
};

export const getHeroEffectDescription = (id, language = 'es') => {
  const item = BY_ID.get(id);
  if (!item) return '';
  return item.effect[language] || item.effect.es || '';
};

export const HERO_EFFECTS_NEEDING_REVIEW = ALL_HERO_EFFECTS.filter((item) => item.needsReview);
