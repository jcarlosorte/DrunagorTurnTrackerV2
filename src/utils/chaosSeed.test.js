import { describe, expect, it } from 'vitest';
import { isChaosSeedBurst } from '@/utils/chaosSeed';

describe('Semilla del Caos', () => {
  it('explota solo con el reglamento 2.0 al llegar a 4', () => {
    expect(isChaosSeedBurst('SEMILLA_DEL_CAOS', 4, '2.0')).toBe(true);
    expect(isChaosSeedBurst('SEMILLA_DEL_CAOS', 3, '2.0')).toBe(false);
    expect(isChaosSeedBurst('SEMILLA_DEL_CAOS', 4, '1.5')).toBe(false);
    expect(isChaosSeedBurst('VENENO_I', 4, '2.0')).toBe(false);
  });
});
