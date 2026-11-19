import { describe, expect, it } from 'vitest';
import { ENEMIES, isEnemyLarge } from '@/data/enemies';
import { EXPANSIONS } from '@/data/expansions';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

const NAMES = {
  'Dream Titan': 'Titán Onírico',
  'Thought Drinker': 'Absorbejuicios',
  'Hellish Flayer': 'Azote Bélico',
  'Chained Reckoner': 'Vengador Encadenado',
  'Shadow Witch': 'Bruja Sombría',
  'Fell Warcaller': 'Llamaguerra Caído',
  'Skeleton Knight': 'Caballero Esqueleto',
  'Fallen Champion': 'Campeón Caído',
  'Faceless Conjurer': 'Hechicero Sin Rostro',
  'Consuming Horror': 'Miedo Devorador',
};

describe('enemigos de Apocalipsis', () => {
  it('la expansión está activa y sus enemigos están catalogados', () => {
    const expansion = EXPANSIONS.find((item) => item.id === 'apocalypse_adventures');
    expect(expansion?.active).toBe('on');
    expect(expansion?.enemies).toEqual(expect.arrayContaining([
      'dream_titan', 'hellish_flayer', 'faceless_conjurer', 'shadow_witch', 'skeleton_knight',
    ]));

    const ids = new Set(ENEMIES
      .filter((enemy) => enemy.expansionId === 'apocalypse_adventures')
      .map((enemy) => enemy.id));
    expect(ids).toEqual(new Set([
      'dream_titan', 'hellish_flayer', 'faceless_conjurer', 'shadow_witch', 'skeleton_knight',
      'war_horsemen', 'death_horsemen', 'plague_horsemen', 'famine_horsemen',
    ]));
  });

  it('traduce los nombres estándar y alternativos', () => {
    expect(es.enemies.nombres).toMatchObject(NAMES);
    expect(en.enemies.nombres).toMatchObject(Object.fromEntries(
      Object.keys(NAMES).map((name) => [name, name]),
    ));
  });

  it('mantiene nombres alternativos distintos para cada tipo', () => {
    for (const id of ['dream_titan', 'hellish_flayer', 'faceless_conjurer', 'shadow_witch', 'skeleton_knight']) {
      const variants = ENEMIES.filter((enemy) => enemy.id === id);
      const standard = variants.find((enemy) => enemy.comportamiento === 'estandar');
      const alternative = variants.find((enemy) => enemy.comportamiento === 'alternativo');
      expect(standard?.nombre, id).toBeTruthy();
      expect(alternative?.nombre, id).toBeTruthy();
      expect(alternative?.nombre, id).not.toBe(standard?.nombre);
    }
    expect(isEnemyLarge({ id: 'dream_titan' })).toBe(true);
  });
});
