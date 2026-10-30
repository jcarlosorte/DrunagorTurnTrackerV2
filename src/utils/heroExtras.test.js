import { describe, expect, it } from 'vitest';
import { getHeroExtras, patchHeroExtras, resetHero } from '@/utils/heroExtras';

describe('resetHero', () => {
  it('quita estados y recursos, recobra cubos y conserva la vida', () => {
    const before = getHeroExtras('sun');
    patchHeroExtras('sun', {
      vida: 4,
      estados: [{ id: 'AURA_X', count: 1 }],
      estadosAlterados: [
        { id: 'CONCENTRACION', count: 3 },
        { id: 'KI', count: 2 },
      ],
      cubos: { ...before.cubosMax, amarillo: 0 },
      trauma: 2,
      maldicion: 3,
    });

    const after = resetHero('sun');

    expect(after.vida).toBe(4);
    expect(after.estados).toEqual([]);
    expect(after.estadosAlterados).toEqual([]);
    expect(after.trauma).toBe(0);
    expect(after.maldicion).toBe(0);
    expect(after.cubos).toEqual(after.cubosMax);
  });
});
