import { describe, expect, it } from 'vitest';
import {
  canUseBaseScenarioCards,
  getScenarioMonstersForCampaign,
} from '@/utils/scenarioCampaign';

describe('escenario por campaña', () => {
  it('las cartas base solo se permiten en la campaña Core', () => {
    expect(canUseBaseScenarioCards('core')).toBe(true);
    expect(canUseBaseScenarioCards('awakenings')).toBe(false);
    expect(canUseBaseScenarioCards('apocalypse')).toBe(false);
  });

  it('Core muestra los monstruos de escenario base y no los de Despertar', () => {
    const ids = getScenarioMonstersForCampaign('core').map((enemy) => enemy.id);
    expect(ids).toContain('dark_vampire');
    expect(ids).not.toContain('soul_harvester');
  });

  it('Despertar muestra sus monstruos de escenario y no los base', () => {
    const ids = getScenarioMonstersForCampaign('awakenings').map((enemy) => enemy.id);
    expect(ids).toContain('infamous_striker');
    expect(ids).not.toContain('soul_harvester');
    expect(ids).not.toContain('dark_vampire');
  });
});
