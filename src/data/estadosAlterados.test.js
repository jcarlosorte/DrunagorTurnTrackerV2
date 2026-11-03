import { describe, expect, it } from 'vitest';
import {
  ESTADOS_ALTERADOS,
  getEnemyStatusCatalog,
  getHeroStatusCatalog,
} from '@/data/estadosAlterados';

const ids = (catalogo) => catalogo.map((estado) => estado.id);

describe('recursos de héroe', () => {
  it('Concentración está disponible para todos y Ki solo para el monje', () => {
    const sun = ids(getHeroStatusCatalog('sun'));
    expect(sun).toContain('CONCENTRACION');
    expect(sun).toContain('KI');
    expect(sun).not.toContain('FURIA');
    expect(sun).not.toContain('FRUTO_DE_VIDA');
  });

  it('Furia es de bárbaros y Fruto de vida de druidas', () => {
    const katarina = ids(getHeroStatusCatalog('katarina'));
    expect(katarina).toContain('FURIA');
    expect(katarina).not.toContain('KI');

    const savran = ids(getHeroStatusCatalog('savran'));
    expect(savran).toContain('FRUTO_DE_VIDA');
    expect(savran).not.toContain('FURIA');
  });

  it('los recursos no aparecen en enemigos', () => {
    const enemigos = ids(getEnemyStatusCatalog());
    expect(enemigos).not.toContain('CONCENTRACION');
    expect(enemigos).not.toContain('KI');
    expect(enemigos).not.toContain('FURIA');
    expect(enemigos).not.toContain('FRUTO_DE_VIDA');
    expect(enemigos).toContain('ESCUDO');
  });

  it('los cuatro recursos se acumulan hasta 4', () => {
    ['CONCENTRACION', 'KI', 'FURIA', 'FRUTO_DE_VIDA'].forEach((id) => {
      expect(ESTADOS_ALTERADOS.find((estado) => estado.id === id)?.max).toBe(4);
    });
  });
});

describe('estados de la versión 2.0', () => {
  it('solo aparecen con el reglamento nuevo', () => {
    const enemigos15 = ids(getEnemyStatusCatalog());
    const enemigos20 = ids(getEnemyStatusCatalog('2.0'));

    expect(enemigos15).not.toContain('FRAGIL');
    expect(enemigos20).toEqual(expect.arrayContaining(['FRAGIL', 'POLIMORFISMO', 'RESTRICCION']));
    expect(enemigos20).toContain('SEMILLA_DEL_CAOS');

    const heroe20 = ids(getHeroStatusCatalog('sun', '2.0'));
    expect(heroe20).toContain('FRAGIL');
    expect(heroe20).toContain('SEMILLA_DEL_CAOS');

    const diana = ids(getHeroStatusCatalog('diana', '2.0'));
    expect(diana).toContain('ENTROPIA');
    expect(ids(getHeroStatusCatalog('vorn', '2.0'))).not.toContain('ENTROPIA');

    const gramosh = ids(getHeroStatusCatalog('gramosh', '2.0'));
    expect(gramosh).toEqual(expect.arrayContaining(['IDOLO_DE_FURIA', 'IDOLO_DE_RESISTENCIA', 'IDOLO_DE_TORMENTA', 'IDOLO_DE_TRANQUILIDAD']));
    expect(ids(getHeroStatusCatalog('sun', '2.0'))).not.toContain('IDOLO_DE_FURIA');
  });

  it('Frágil, Polimorfismo y Restricción se limitan a 1; Semilla del caos a 4', () => {
    ['FRAGIL', 'POLIMORFISMO', 'RESTRICCION'].forEach((id) => {
      expect(ESTADOS_ALTERADOS.find((estado) => estado.id === id)?.max).toBe(1);
    });
    expect(ESTADOS_ALTERADOS.find((estado) => estado.id === 'SEMILLA_DEL_CAOS')?.max).toBe(4);
  });
});
