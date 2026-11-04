import { describe, expect, it } from 'vitest';
import { MAIN_BOXES, getMainBox, isBoxUnlocked } from '@/data/boxes';

describe('cajas principales', () => {
  it('solo la caja core está desbloqueada por ahora', () => {
    expect(isBoxUnlocked(getMainBox('core'))).toBe(true);
    expect(isBoxUnlocked(getMainBox('awakenings'))).toBe(false);
    expect(isBoxUnlocked(getMainBox('apocalypse'))).toBe(false);
  });

  it('cae en core para identificadores desconocidos', () => {
    expect(getMainBox('desconocida').id).toBe('core');
    expect(MAIN_BOXES).toHaveLength(3);
  });
});
