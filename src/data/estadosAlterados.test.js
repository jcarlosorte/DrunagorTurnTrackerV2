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
