import { describe, expect, it } from 'vitest';
import {
  COMPANIONS,
  getCompanion,
  getCompanionAlias,
  getCompanionBackground,
  getCompanionGroup,
  getCompanionImage,
  getCompanionName,
  getCompanionSubtype,
  getCompanionsForExpansions,
} from '@/data/companions';

describe('getCompanionsForExpansions', () => {
  it('devuelve las 23 criaturas del juego base', () => {
    const base = getCompanionsForExpansions(['base']);
    expect(base).toHaveLength(23);
    expect(base.every((companion) => companion.expansionId === 'base')).toBe(true);
  });

  it('filtra por las expansiones activas', () => {
    expect(getCompanionsForExpansions([])).toEqual([]);
    expect(getCompanionsForExpansions(['luccanor'])).toEqual([]);
    expect(getCompanionsForExpansions(['base', 'luccanor'])).toHaveLength(23);
  });

  it('todas las criaturas declaran su expansión', () => {
    expect(COMPANIONS.every((companion) => typeof companion.expansionId === 'string' && companion.expansionId)).toBe(true);
  });

  it('el Pack de Héroes añade a Neva y Hakkon', () => {
    const pack = getCompanionsForExpansions(['apocalypse_heroes_1']);
    expect(pack.map((companion) => companion.id).sort()).toEqual(['hakkon', 'neva']);
    expect(pack.find((companion) => companion.id === 'hakkon').subtype).toBe('Draugr');
  });

  it('Neva y Hakkon tienen retrato', () => {
    expect(getCompanionImage('neva')).toBeTruthy();
    expect(getCompanionImage('hakkon')).toBeTruthy();
  });
});

describe('getCompanionGroup', () => {
  it('separa mascotas, compañeros y Héroes de Daren', () => {
    const drummer = COMPANIONS.find((companion) => companion.id === 'drumm');
    const conner = COMPANIONS.find((companion) => companion.id === 'capitan_conner');
    const lorelai = COMPANIONS.find((companion) => companion.id === 'lorelai_companion');
    const reborn = COMPANIONS.find((companion) => companion.id === 'heroe_renacido');

    expect(getCompanionGroup(drummer)).toBe('mascota');
    expect(getCompanionGroup(conner)).toBe('companero');
    expect(getCompanionGroup(lorelai)).toBe('daren_hero');
    expect(getCompanionGroup(reborn)).toBe('daren_hero');
  });
});

describe('traducciones de compañeros', () => {
  it('localiza nombres, alias y subtipos', () => {
    expect(getCompanionName('capitan_conner', 'en')).toBe('Captain Conner');
    expect(getCompanionName('conner_desarmado', 'en')).toBe('Conner (unarmed)');
    expect(getCompanionName('tharmagar_leal', 'en')).toBe('Tharmagar (loyal)');
    expect(getCompanionAlias(getCompanion('drumm'), 'en')).toBe('the dragon hatchling');
    expect(getCompanionAlias(getCompanion('lorelai_companion'), 'en')).toBe('Daren hero');
    expect(getCompanionSubtype(getCompanion('drumm'), 'en')).toBe('Dragon');
  });
});

describe('getCompanionBackground', () => {
  it('asigna un fondo de interacción a cada criatura', () => {
    expect(getCompanionBackground('drumm')).toBeTruthy();
    expect(getCompanionBackground('vorn_companion')).toBeTruthy();
    expect(getCompanionBackground('no-existe')).toBeTruthy();
  });
});
