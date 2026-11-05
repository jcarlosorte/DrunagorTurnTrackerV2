import { describe, expect, it } from 'vitest';
import { MAIN_BOXES, getMainBox, getScenarioExpansionIds, isBoxUnlocked } from '@/data/boxes';

describe('cajas principales', () => {
  it('core y Despertar están desbloqueadas; Apocalipsis todavía no', () => {
    expect(isBoxUnlocked(getMainBox('core'))).toBe(true);
    expect(isBoxUnlocked(getMainBox('awakenings'))).toBe(true);
    expect(isBoxUnlocked(getMainBox('apocalypse'))).toBe(false);
  });

  it('cae en core para identificadores desconocidos', () => {
    expect(getMainBox('desconocida').id).toBe('core');
    expect(MAIN_BOXES).toHaveLength(3);
  });

  it('asocia los enemigos de escenario a su caja', () => {
    expect(getScenarioExpansionIds('core')).toEqual(['base']);
    expect(getScenarioExpansionIds('awakenings')).toEqual(['apocalypse_awakenings']);
    expect(getScenarioExpansionIds('apocalypse')).toContain('apocalypse_adventures');
    expect(getScenarioExpansionIds('apocalypse')).not.toContain('apocalypse_awakenings');
  });
});
