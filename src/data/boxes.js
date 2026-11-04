import coreLogo from '@/assets/Corebox_Logo-1536x864.avif';
import apocalypseLogo from '@/assets/home/logo-apocalypse-transparent.webp';
import awakeningsLogo from '@/assets/home/logo-awakenings-transparent.webp';
import { EXPANSIONS } from '@/data/expansions';

/** Las tres cajas principales del juego. */
export const MAIN_BOXES = [
  { id: 'core', expansionId: 'base', label: 'Core', logo: coreLogo },
  { id: 'awakenings', expansionId: 'apocalypse_awakenings', label: 'Despertar', logo: awakeningsLogo },
  { id: 'apocalypse', expansionId: 'apocalypse_adventures', label: 'Apocalipsis', logo: apocalypseLogo },
];

export function getMainBox(id) {
  return MAIN_BOXES.find((box) => box.id === id) || MAIN_BOXES[0];
}

export function isBoxUnlocked(box) {
  if (!box) return false;
  const expansion = EXPANSIONS.find((entry) => entry.id === box.expansionId);
  return Boolean(expansion && expansion.active !== 'off');
}
