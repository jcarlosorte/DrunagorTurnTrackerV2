import { describe, expect, it } from 'vitest';
import {
  applyCompanionTurnEffects,
  parseCompanionAbilities,
  parseCompanionAbilityKeys,
} from '@/utils/companionAbilities';

const labels = {
  SALTO: 'SALTO',
  QUEMADURA_X: 'QUEMADURA {x}',
  ESCUDO_X: 'ESCUDO {x}',
  PERSONAL: 'PERSONAL',
  UNICA: 'ÚNICA',
  PERMUTAR: 'PERMUTA',
  SANAR_X: 'SANAR {x}',
  NO_MUERTO: 'NO MUERTO',
  DRAUGR: 'DRAUGR',
};
const descriptions = {
  SALTO: 'Salta.',
  QUEMADURA_X: 'Recibe {x} fichas de quemadura.',
  ESCUDO_X: 'Gana {x} fichas de escudo.',
  PERSONAL: 'Solo afecta a su portador.',
  UNICA: 'Solo una vez.',
  PERMUTAR: 'Permuta con el héroe.',
  SANAR_X: 'Sana {x}.',
  NO_MUERTO: 'Descripción de no muerto.',
  DRAUGR: 'Descripción de draugr.',
};

describe('parseCompanionAbilities', () => {
  it('separa por punto y coma y por coma', () => {
    expect(parseCompanionAbilities('SALTO; QUEMADURA 1', { labels, descriptions })).toHaveLength(2);
    expect(parseCompanionAbilities('PERSONAL, ESCUDO 2', { labels, descriptions })).toHaveLength(2);
  });

  it('reconoce las claves con guion bajo', () => {
    const result = parseCompanionAbilities('ESCUDO_2', { labels, descriptions });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('ESCUDO_X');
    expect(result[0].label).toBe('ESCUDO 2');
    expect(result[0].description).toBe('Gana 2 fichas de escudo.');
  });

  it('separa las dos partes de «PERSONAL: ESCUDO 2»', () => {
    const result = parseCompanionAbilities('PERSONAL: ESCUDO 2', { labels, descriptions });
    expect(result.map((ability) => ability.key)).toEqual(['PERSONAL', 'ESCUDO_X']);
    expect(result[1].label).toBe('ESCUDO 2');
  });

  it('normaliza tildes y números', () => {
    const result = parseCompanionAbilities('ÚNICA', { labels, descriptions });
    expect(result[0].key).toBe('UNICA');
    expect(result[0].description).toBe('Solo una vez.');
  });

  it('usa la descripción de la palabra clave en frases largas', () => {
    const result = parseCompanionAbilities('UN HÉROE A CUALQUIER ALCANCE GANA SANAR 2', { labels, descriptions });
    expect(result[0].label).toBe('UN HÉROE A CUALQUIER ALCANCE GANA SANAR 2');
    expect(result[0].description).toBe('Sana 2.');
    expect(result[0].pending).toBe(false);
  });

  it('reconoce NO MUERTO y DRAUGR', () => {
    const result = parseCompanionAbilities('NO MUERTO; LOS DRAUGR NO RECIBEN DAÑO POR OSCURIDAD', { labels, descriptions });
    expect(result[0].key).toBe('NO_MUERTO');
    expect(result[0].description).toBe('Descripción de no muerto.');
    expect(result[1].key).toBe('DRAUGR');
    expect(result[1].description).toBe('Descripción de draugr.');
  });

  it('devuelve vacío para «-»', () => {
    expect(parseCompanionAbilities('-', { labels, descriptions })).toEqual([]);
  });
});

describe('capacidades de turno', () => {
  it('normaliza las claves como las de los enemigos', () => {
    expect(parseCompanionAbilityKeys('PERSONAL, ESCUDO 2')).toEqual(['PERSONAL', 'ESCUDO_2']);
    expect(parseCompanionAbilityKeys('SALTO; QUEMADURA 1')).toEqual(['SALTO', 'QUEMADURA_1']);
    expect(parseCompanionAbilityKeys('-')).toEqual([]);
  });

  it('el oso gana 2 escudos al inicio de su turno', () => {
    const { entry, shields } = applyCompanionTurnEffects(
      { uid: 'bronx', estadosAlterados: [] },
      { abilities: 'PERSONAL, ESCUDO 2' },
    );

    expect(shields).toBe(2);
    expect(entry.estadosAlterados).toEqual([{ id: 'ESCUDO', count: 2 }]);
  });

  it('acumula escudos sin pasar del máximo', () => {
    const { entry, shields } = applyCompanionTurnEffects(
      { uid: 'bronx', estadosAlterados: [{ id: 'ESCUDO', count: 3 }] },
      { abilities: 'ESCUDO 2' },
    );

    expect(shields).toBe(1);
    expect(entry.estadosAlterados[0]).toEqual({ id: 'ESCUDO', count: 4 });
  });

  it('no cambia nada si no tiene escudo', () => {
    const original = { uid: 'drumm', estadosAlterados: [] };
    const { entry, shields } = applyCompanionTurnEffects(original, { abilities: 'SALTO; QUEMADURA 1' });

    expect(shields).toBe(0);
    expect(entry).toBe(original);
  });
});
