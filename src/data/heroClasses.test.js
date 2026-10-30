import { describe, expect, it } from 'vitest';
import { getHeroClass, getHeroClassId, normalizeHeroClass } from '@/data/heroClasses';

describe('clases de héroe', () => {
  it('normaliza las profesiones con género', () => {
    expect(normalizeHeroClass('Bárbara')).toBe('barbaro');
    expect(normalizeHeroClass('Bárbaro')).toBe('barbaro');
    expect(normalizeHeroClass('Maga')).toBe('mago');
    expect(normalizeHeroClass('Paladina')).toBe('paladin');
    expect(normalizeHeroClass('Arquera')).toBe('arquero');
    expect(normalizeHeroClass('Guerrero_Sombrio')).toBe('caballero_sombrio');
    expect(normalizeHeroClass('Desconocida')).toBeNull();
  });

  it('asigna la clase a los héroes del listado', () => {
    expect(getHeroClassId('sun')).toBe('monje');
    expect(getHeroClassId('katarina')).toBe('barbaro');
    expect(getHeroClassId('tork')).toBe('barbaro');
    expect(getHeroClassId('savran')).toBe('druida');
    expect(getHeroClassId('willow')).toBe('druida');
    expect(getHeroClassId('vorn')).toBe('guerrero');
    expect(getHeroClassId('lorelai')).toBe('mago');
    expect(getHeroClassId('maya')).toBe('arquero');
    expect(getHeroClassId('devron')).toBe('caballero_sombrio');
    expect(getHeroClassId('lord-of-wrath')).toBe('caballero_sombrio');
  });

  it('devuelve etiquetas bilingües', () => {
    expect(getHeroClass('sun')).toMatchObject({ id: 'monje', es: 'Monje', en: 'Monk' });
    expect(getHeroClass('no-existe')).toBeNull();
  });
});
