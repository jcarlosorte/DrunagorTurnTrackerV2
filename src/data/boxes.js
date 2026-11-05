import coreLogo from '@/assets/Corebox_Logo-1536x864.avif';
import apocalypseLogo from '@/assets/home/logo-apocalypse-transparent.webp';
import awakeningsLogo from '@/assets/home/logo-awakenings-transparent.webp';
import { EXPANSIONS } from '@/data/expansions';

/** Las tres cajas principales del juego. */
const APOCALYPSE_SCENARIO_EXPANSIONS = EXPANSIONS
  .filter((expansion) => expansion.id.startsWith('apocalypse_') && expansion.id !== 'apocalypse_awakenings')
  .map((expansion) => expansion.id);

export const MAIN_BOXES = [
  { id: 'core', expansionId: 'base', label: 'Core', logo: coreLogo, scenarioExpansionIds: ['base'] },
  {
    id: 'awakenings',
    expansionId: 'apocalypse_awakenings',
    label: 'Despertar',
    logo: awakeningsLogo,
    scenarioExpansionIds: ['apocalypse_awakenings'],
  },
  {
    id: 'apocalypse',
    expansionId: 'apocalypse_adventures',
    label: 'Apocalipsis',
    logo: apocalypseLogo,
    scenarioExpansionIds: APOCALYPSE_SCENARIO_EXPANSIONS,
  },
];

export function getMainBox(id) {
  return MAIN_BOXES.find((box) => box.id === id) || MAIN_BOXES[0];
}

/** Expansiones cuyos enemigos de escenario pertenecen a la caja indicada. */
export function getScenarioExpansionIds(boxId) {
  return getMainBox(boxId).scenarioExpansionIds || [];
}

export function isBoxUnlocked(box) {
  if (!box) return false;
  const expansion = EXPANSIONS.find((entry) => entry.id === box.expansionId);
  return Boolean(expansion && expansion.active !== 'off');
}
