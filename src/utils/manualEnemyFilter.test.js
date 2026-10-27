import { describe, expect, it } from 'vitest';
import {
  collectManualFacets,
  filterManualEnemies,
  normalizeManualQuery,
} from '@/utils/manualEnemyFilter';

const POOL = [
  { id: 'skeleton_archer', nombre: 'Skeleton Archer', color: 'blanco', categoria: 'campeon' },
  { id: 'skeleton_archer', nombre: 'Skeleton Archer', color: 'blanco', categoria: 'bisoño' },
  { id: 'dark_vampire', nombre: 'Dark Vampire', color: 'gris', categoria: 'campeon' },
  { id: 'commander_thern', nombre: 'Thern', color: 'comandante', categoria: 'comandante' },
  { id: 'undead_king_boss_1', nombre: 'Undead King Boss', color: 'jefe', categoria: 'jefe' },
  { id: 'executioner', nombre: 'Executioner', color: 'escenario', categoria: 'escenario' },
];

describe('normalizeManualQuery', () => {
  it('quita acentos y mayúsculas', () => {
    expect(normalizeManualQuery('Bisoño')).toBe('bisono');
    expect(normalizeManualQuery(null)).toBe('');
  });
});

describe('collectManualFacets', () => {
  it('devuelve colores y categorías presentes en orden canónico', () => {
    const facets = collectManualFacets(POOL);

    expect(facets.colors).toEqual(['blanco', 'gris', 'comandante', 'jefe', 'escenario']);
    expect(facets.categories).toEqual(['campeon', 'bisoño', 'comandante', 'jefe', 'escenario']);
  });

  it('coloca los valores desconocidos al final', () => {
    const facets = collectManualFacets([{ color: 'raro', categoria: 'otra' }, ...POOL]);

    expect(facets.colors.at(-1)).toBe('raro');
    expect(facets.categories.at(-1)).toBe('otra');
  });

  it('tolera listas vacías o inválidas', () => {
    expect(collectManualFacets(null)).toEqual({ colors: [], categories: [] });
    expect(collectManualFacets([])).toEqual({ colors: [], categories: [] });
  });
});

describe('filterManualEnemies', () => {
  it('sin filtros devuelve la lista completa', () => {
    expect(filterManualEnemies(POOL)).toHaveLength(POOL.length);
  });

  it('combina color y categoría', () => {
    const result = filterManualEnemies(POOL, { color: 'blanco', category: 'campeon' });

    expect(result).toHaveLength(1);
    expect(result[0].categoria).toBe('campeon');
  });

  it('busca por id y por la etiqueta traducida sin acentos', () => {
    const getLabel = (enemy) => {
      if (enemy.id === 'executioner') return 'Verdugo Funesto';
      if (enemy.categoria === 'bisoño') return 'Bisoño';
      return enemy.nombre;
    };

    expect(filterManualEnemies(POOL, { query: 'verdugo', getLabel })[0].id).toBe('executioner');
    expect(filterManualEnemies(POOL, { query: 'BISONO', getLabel })[0].categoria).toBe('bisoño');
    expect(filterManualEnemies(POOL, { query: 'undead_king' })[0].id).toBe('undead_king_boss_1');
  });

  it('devuelve vacío cuando no hay coincidencias', () => {
    expect(filterManualEnemies(POOL, { query: 'zzz' })).toEqual([]);
    expect(filterManualEnemies(POOL, { color: 'negro' })).toEqual([]);
  });

  it('no muta la lista original', () => {
    const copy = [...POOL];
    filterManualEnemies(POOL, { color: 'blanco', query: 'skeleton' });
    expect(POOL).toEqual(copy);
  });
});
