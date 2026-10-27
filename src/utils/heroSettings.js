import { readJsonStorage, writeJsonStorage } from '@/utils/storage';

export const HERO_MANAGEMENT_KEY = 'heroManagement';

export function isHeroManagementEnabled() {
  return Boolean(readJsonStorage(HERO_MANAGEMENT_KEY, false, (value) => typeof value === 'boolean'));
}

export function setHeroManagementEnabled(value) {
  writeJsonStorage(HERO_MANAGEMENT_KEY, Boolean(value));
}
