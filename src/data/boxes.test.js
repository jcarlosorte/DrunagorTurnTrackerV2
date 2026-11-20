import { describe, expect, it } from 'vitest';
import {
  MAIN_BOXES,
  getCampaignExpansionIds,
  getExpansionCampaigns,
  getMainBox,
  getScenarioExpansionIds,
  isBoxUnlocked,
} from '@/data/boxes';

describe('cajas principales', () => {
  it('core, Despertar y Apocalipsis están desbloqueadas', () => {
    expect(isBoxUnlocked(getMainBox('core'))).toBe(true);
    expect(isBoxUnlocked(getMainBox('awakenings'))).toBe(true);
    expect(isBoxUnlocked(getMainBox('apocalypse'))).toBe(true);
  });

  it('solo desbloquea una campaña si su expansión está seleccionada', () => {
    expect(isBoxUnlocked(getMainBox('apocalypse'), ['base'])).toBe(false);
    expect(isBoxUnlocked(getMainBox('apocalypse'), ['base', 'apocalypse_adventures'])).toBe(true);
    expect(isBoxUnlocked(getMainBox('awakenings'), ['base'])).toBe(false);
  });

  it('cae en core para identificadores desconocidos', () => {
    expect(getMainBox('desconocida').id).toBe('core');
    expect(MAIN_BOXES).toHaveLength(3);
  });

  it('asocia las expansiones de cada campaña', () => {
    expect(getCampaignExpansionIds('core')).toEqual([
      'base',
      'luccanor',
      'undead_dragon',
      'dark_world',
      'infernal_desert',
      'monsters_pack_1',
      'war_loot',
    ]);
    expect(getCampaignExpansionIds('awakenings')).toEqual([
      'apocalypse_awakenings',
      'apocalypse_sisters',
    ]);
    expect(getCampaignExpansionIds('apocalypse')).toEqual([
      'apocalypse_adventures',
      'apocalypse_sisters',
    ]);
    expect(getScenarioExpansionIds('core')).toEqual(getCampaignExpansionIds('core'));
  });

  it('una expansión puede pertenecer a varias campañas', () => {
    expect(getExpansionCampaigns('apocalypse_sisters')).toEqual(['awakenings', 'apocalypse']);
    expect(getExpansionCampaigns('base')).toEqual(['core']);
  });
});
