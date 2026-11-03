import { describe, expect, it } from 'vitest';
import { HEROES } from '@/data/heroes';
import { getHeroPortrait } from '@/data/heroPortraits';

describe('getHeroPortrait', () => {
  it('encuentra los retratos y resuelve los alias de archivo', () => {
    expect(getHeroPortrait('vorn')).toBeTruthy();
    expect(getHeroPortrait('arkanos')).toBeTruthy();
    expect(getHeroPortrait('gramosh')).toBeTruthy();
    expect(getHeroPortrait('brigitte')).toBeTruthy();
    expect(getHeroPortrait('lord-of-wrath')).toBeTruthy();
    expect(getHeroPortrait('vacrem')).toBeTruthy();
    expect(getHeroPortrait('no-existe')).toBeNull();
  });

  it('todos los héroes tienen retrato en la carpeta nueva', () => {
    const missing = HEROES.filter((hero) => !getHeroPortrait(hero.id)).map((hero) => hero.id);
    expect(missing).toEqual([]);
  });
});
