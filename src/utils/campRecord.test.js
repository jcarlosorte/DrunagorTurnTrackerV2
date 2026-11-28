import { describe, expect, it } from 'vitest';
import {
  CAMP_ACTS,
  DAREN_TRAITS,
  LEGACY_TRAILS,
  MAX_LINES,
  createCampRecord,
  normalizeCampRecord,
  withConsecuencia,
  withDarenTrait,
  withLegacyLevel,
  withUnfoldingLine,
  withoutUnfoldingLine,
} from '@/utils/campRecord';

describe('registro de historia del campamento', () => {
  it('crea un registro vacío para cada ruta y acto', () => {
    const record = createCampRecord();

    LEGACY_TRAILS.forEach(({ id }) => expect(record.legacyTrail[id]).toBe(0));
    DAREN_TRAITS.forEach(({ id }) => expect(record.darenTraits[id]).toBe(false));
    CAMP_ACTS.forEach(({ id }) => expect(record.unfoldings[id]).toEqual([]));
    expect(record.consecuencias).toEqual([]);
  });

  it('normaliza niveles, rasgos y líneas importadas', () => {
    const record = normalizeCampRecord({
      legacyTrail: { perseverancia: 9, desastre: -2, tragedia: '2', heroismo: 'x' },
      darenTraits: { folkHero: true, redeemer: 'true' },
      unfoldings: {
        first: ['  Una línea  ', '', 42],
        second: 'no es una lista',
        third: Array.from({ length: MAX_LINES + 3 }, (_, index) => `Línea ${index}`),
      },
    });

    expect(record.legacyTrail).toMatchObject({
      perseverancia: 3,
      desastre: 0,
      tragedia: 2,
      heroismo: 0,
    });
    expect(record.darenTraits.folkHero).toBe(true);
    expect(record.darenTraits.redeemer).toBe(false);
    expect(record.unfoldings.first).toEqual(['Una línea', '42']);
    expect(record.unfoldings.second).toEqual([]);
    expect(record.unfoldings.third).toHaveLength(MAX_LINES);
  });

  it('actualiza niveles y rasgos sin mutar el registro anterior', () => {
    const record = createCampRecord();
    const leveled = withLegacyLevel(record, 'perseverancia', 2);
    const trained = withDarenTrait(leveled, 'redeemer', true);

    expect(record.legacyTrail.perseverancia).toBe(0);
    expect(leveled.legacyTrail.perseverancia).toBe(2);
    expect(trained.darenTraits.redeemer).toBe(true);
    expect(leveled.darenTraits.redeemer).toBe(false);
  });

  it('añade y elimina líneas de repercusión por acto', () => {
    let record = createCampRecord();
    record = withUnfoldingLine(record, 'first', '  El grupo escapó  ');
    record = withUnfoldingLine(record, 'first', 'Perdieron la reliquia');
    record = withUnfoldingLine(record, 'second', 'Otra línea');

    expect(record.unfoldings.first).toEqual(['El grupo escapó', 'Perdieron la reliquia']);
    expect(record.unfoldings.second).toEqual(['Otra línea']);

    record = withoutUnfoldingLine(record, 'first', 0);
    expect(record.unfoldings.first).toEqual(['Perdieron la reliquia']);
  });

  it('mantiene excluyentes los orígenes Héroe Popular y Caballero de Amira', () => {
    let record = withDarenTrait(createCampRecord(), 'folkHero', true);
    record = withDarenTrait(record, 'redeemer', true);
    record = withDarenTrait(record, 'knightOfAmira', true);

    expect(record.darenTraits).toMatchObject({
      folkHero: false,
      knightOfAmira: true,
      redeemer: true,
    });

    record = withDarenTrait(record, 'folkHero', true);
    expect(record.darenTraits).toMatchObject({
      folkHero: true,
      knightOfAmira: false,
      redeemer: true,
    });

    const imported = normalizeCampRecord({
      darenTraits: { folkHero: true, knightOfAmira: true, passionate: true },
    });
    expect(imported.darenTraits).toMatchObject({
      folkHero: true,
      knightOfAmira: false,
      passionate: true,
    });
  });

  it('comparte las consecuencias, sin duplicados ni límite', () => {
    const record = createCampRecord();
    const withTwo = withConsecuencia(
      withConsecuencia(record, 'humillacion'),
      'inquebrantable',
    );

    expect(record.consecuencias).toEqual([]);
    expect(withTwo.consecuencias).toEqual(['humillacion', 'inquebrantable']);

    const withoutFirst = withConsecuencia(withTwo, 'humillacion', false);
    expect(withoutFirst.consecuencias).toEqual(['inquebrantable']);

    const imported = normalizeCampRecord({
      consecuencias: ['humillacion', 'humillacion', 'no_existe', 'duo_dinamico'],
    });
    expect(imported.consecuencias).toEqual(['humillacion', 'duo_dinamico']);
    expect(withConsecuencia(record, 'no_existe').consecuencias).toEqual([]);
  });

  it('ignora actos y rasgos desconocidos', () => {
    const record = normalizeCampRecord({});
    const unknown = withLegacyLevel(record, 'destino', 3);

    expect(unknown.legacyTrail.destino).toBeUndefined();
    expect(withDarenTrait(record, 'unknown', true).darenTraits.unknown).toBeUndefined();
    expect(withUnfoldingLine(record, 'fifth', 'x').unfoldings.fifth).toBeUndefined();
  });
});
