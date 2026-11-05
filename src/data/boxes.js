import coreLogo from '@/assets/Corebox_Logo-1536x864.avif';
import apocalypseLogo from '@/assets/home/logo-apocalypse-transparent.webp';
import awakeningsLogo from '@/assets/home/logo-awakenings-transparent.webp';
import { EXPANSIONS } from '@/data/expansions';

/** Expansiones que forman cada campaña (solo las que existan en el catálogo). */
export const CAMPAIGN_EXPANSIONS = {
  core: [
    'base',
    'luccanor',
    'undead_dragon',
    'dark_world',
    'infernal_desert',
    'monsters_pack_1',
    'war_loot',
  ],
  awakenings: ['apocalypse_awakenings', 'apocalypse_sisters'],
  apocalypse: ['apocalypse_adventures', 'apocalypse_sisters'],
};

/** Las tres cajas principales del juego. */
export const MAIN_BOXES = [
  { id: 'core', expansionId: 'base', label: 'Core', logo: coreLogo },
  {
    id: 'awakenings',
    expansionId: 'apocalypse_awakenings',
    label: 'Despertar',
    logo: awakeningsLogo,
  },
  {
    id: 'apocalypse',
    expansionId: 'apocalypse_adventures',
    label: 'Apocalipsis',
    logo: apocalypseLogo,
  },
];

export function getMainBox(id) {
  return MAIN_BOXES.find((box) => box.id === id) || MAIN_BOXES[0];
}

/** Expansiones que forman parte de la campaña indicada. */
export function getCampaignExpansionIds(boxId) {
  return [...(CAMPAIGN_EXPANSIONS[getMainBox(boxId).id] || [])];
}

/** Expansiones cuyos enemigos de escenario pertenecen a la campaña. */
export function getScenarioExpansionIds(boxId) {
  return getCampaignExpansionIds(boxId);
}

/** Campañas a las que pertenece una expansión (una puede estar en varias). */
export function getExpansionCampaigns(expansionId) {
  return Object.entries(CAMPAIGN_EXPANSIONS)
    .filter(([, expansionIds]) => expansionIds.includes(expansionId))
    .map(([campaignId]) => campaignId);
}

export function isBoxUnlocked(box) {
  if (!box) return false;
  const expansion = EXPANSIONS.find((entry) => entry.id === box.expansionId);
  return Boolean(expansion && expansion.active !== 'off');
}
