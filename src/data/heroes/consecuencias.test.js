import { describe, expect, it } from 'vitest';
import { CONSECUENCIAS, getConsecuencia, getConsecuenciaName } from '@/data/heroes/index';

const EXPECTED = [
  ['humillacion', 'Humillación', 'Humbled'],
  ['inquebrantable', 'Inquebrantable', 'Unbroken'],
  ['maldicion_del_guardian', 'Maldición del guardián', 'Guardian’s Curse'],
  ['sembrando_vientos', 'Sembrando vientos', 'Sowing Winds'],
  ['inflexible', 'Inflexible', 'Adamant'],
  ['acto_repulsivo', 'Un acto repulsivo', 'A Hideous Act'],
  ['trabajo_de_mensajero', 'Trabajo de mensajero', 'A Courier’s Job'],
  ['rompemaldiciones', 'Rompemaldiciones', 'Cursebreaker'],
  ['peticion_de_un_enamorado', 'La petición de un enamorado', 'A Lover’s Request'],
  ['cuentacuentos', 'Cuentacuentos', 'Storyteller'],
  ['heroe_corrupto', 'Héroe corrupto', 'Corrupted Hero'],
  ['relevo', 'Relevo', 'Gentle Dismiss'],
  ['romperreliquias', 'Romperreliquias', 'Relic Breaker'],
  ['amantes_reunidos', 'Amantes reunidos', 'Lovebirds Reunited'],
  ['duo_dinamico', 'Dúo Dinámico', 'Dynamic Duo'],
];

describe('consecuencias compartidas', () => {
  it('contiene las 15 consecuencias base con nombres bilingües', () => {
    expect(CONSECUENCIAS).toHaveLength(EXPECTED.length);
    expect(new Set(CONSECUENCIAS.map((item) => item.id)).size).toBe(EXPECTED.length);

    EXPECTED.forEach(([id, es, en]) => {
      expect(getConsecuencia(id)).toBeTruthy();
      expect(getConsecuenciaName(id, 'es')).toBe(es);
      expect(getConsecuenciaName(id, 'en')).toBe(en);
    });
  });

  it('marca la consecuencia especial de Héroe corrupto', () => {
    expect(getConsecuencia('heroe_corrupto').special).toBe(true);
    expect(CONSECUENCIAS.filter((item) => item.special)).toHaveLength(1);
  });
});
