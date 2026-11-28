import AURAS_SOURCE from './auras';
import CONSECUENCIAS_SOURCE from './consecuencias';
import ESTADOS_HEROE_SOURCE from './estados';

/** Campañas principales a las que puede pertenecer un efecto de héroe. */
export const HERO_EFFECT_CAMPAIGNS = ['core', 'awakenings', 'apocalypse'];

const withCampaign = (items) => items.map((item) => ({
  ...item,
  campaign: HERO_EFFECT_CAMPAIGNS.includes(item.campaign) ? item.campaign : 'core',
}));

export const AURAS = withCampaign(AURAS_SOURCE);
export const CONSECUENCIAS = withCampaign(CONSECUENCIAS_SOURCE);
export const ESTADOS_HEROE = withCampaign(ESTADOS_HEROE_SOURCE);

export const HERO_EFFECT_GROUPS = [
  { id: 'auras', label: { es: 'Auras', en: 'Auras' }, items: AURAS },
  { id: 'consecuencias', label: { es: 'Consecuencias', en: 'Outcomes' }, items: CONSECUENCIAS },
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
  if (!item?.effect) return '';
  return item.effect[language] || item.effect.es || '';
};

export const HERO_EFFECTS_NEEDING_REVIEW = ALL_HERO_EFFECTS.filter((item) => item.needsReview);

/** Roles que ocupan la posición de líder en el track. */
export const AURA_LEADER_ROLES = ['lider', 'lanza_dados', 'guardian'];

export const isLeaderRole = (role) => AURA_LEADER_ROLES.includes(role);

export const AURA_GROUP_IDS = ['leader-private', 'leader-party', 'hero-private'];

const CONSECUENCIAS_BY_ID = new Map(CONSECUENCIAS.map((item) => [item.id, item]));

export const getConsecuencia = (id) => CONSECUENCIAS_BY_ID.get(id) || null;

export const getConsecuenciaName = (id, language = 'es') => {
  const consequence = CONSECUENCIAS_BY_ID.get(id);
  if (!consequence) return id;
  return consequence.name[language] || consequence.name.es || id;
};

const AURAS_BY_ID = new Map(AURAS.map((item) => [item.id, item]));

export const getAura = (id) => AURAS_BY_ID.get(id) || null;

export const getAuraName = (id, language = 'es') => {
  const aura = AURAS_BY_ID.get(id);
  if (!aura) return id;
  return aura.name[language] || aura.name.es || id;
};

export const getAuraEffect = (id, language = 'es') => {
  const aura = AURAS_BY_ID.get(id);
  if (!aura) return '';
  return aura.effect[language] || aura.effect.es || '';
};

export const getAuraCapability = (id, language = 'es') => {
  const aura = AURAS_BY_ID.get(id);
  if (!aura) return '';
  return aura.capability[language] || aura.capability.es || '';
};

/** Un aura de líder solo puede elegirla un héroe que ocupe su posición. */
export const canHeroChooseAura = (aura, role) => (
  Boolean(aura) && (aura.eligibility !== 'leader' || isLeaderRole(role))
);
