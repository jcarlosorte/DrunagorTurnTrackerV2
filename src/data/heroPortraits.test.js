import { describe, expect, it } from 'vitest';
import { getHeroPortrait } from '@/data/heroPortraits';

describe('getHeroPortrait', () => {
  it('encuentra los retratos y resuelve los alias de archivo', () => {
    expect(getHeroPortrait('vorn')).toBeTruthy();
    expect(getHeroPortrait('brigitte')).toBeTruthy();
    expect(getHeroPortrait('lord-of-wrath')).toBeTruthy();
    expect(getHeroPortrait('vacrem')).toBeTruthy();
    expect(getHeroPortrait('no-existe')).toBeNull();
  });
});
