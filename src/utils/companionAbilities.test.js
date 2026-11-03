import { describe, expect, it } from 'vitest';
import { parseCompanionAbilities } from '@/utils/companionAbilities';

const labels = {
  SALTO: 'SALTO',
  QUEMADURA_X: 'QUEMADURA {x}',
  ESCUDO_X: 'ESCUDO {x}',
  PERSONAL: 'PERSONAL',
  UNICA: 'ÚNICA',
  PERMUTAR: 'PERMUTA',
  SANAR_X: 'SANAR {x}',
};
const descriptions = {
  SALTO: 'Salta.',
  QUEMADURA_X: 'Recibe {x} fichas de quemadura.',
  ESCUDO_X: 'Gana {x} fichas de escudo.',
  PERSONAL: 'Solo afecta a su portador.',
  UNICA: 'Solo una vez.',
  PERMUTAR: 'Permuta con el héroe.',
  SANAR_X: 'Sana {x}.',
};

describe('parseCompanionAbilities', () => {
  it('separa por punto y coma y por coma', () => {
    expect(parseCompanionAbilities('SALTO; QUEMADURA 1', { labels, descriptions })).toHaveLength(2);
    expect(parseCompanionAbilities('PERSONAL, ESCUDO 2', { labels, descriptions })).toHaveLength(2);
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

  it('devuelve vacío para «-»', () => {
    expect(parseCompanionAbilities('-', { labels, descriptions })).toEqual([]);
  });
});
