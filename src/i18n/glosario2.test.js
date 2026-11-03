import { describe, expect, it } from 'vitest';
import glosarioEs from '@/i18n/glosario2.es.json';
import glosarioEn from '@/i18n/glosario2.en.json';

describe('glosario 2.0', () => {
  it('incluye las descripciones nuevas en ambos idiomas', () => {
    for (const clave of ['NO_MUERTO', 'DRAUGR', 'ATURDIMIENTO', 'CEGUERA', 'TRAMPA_VENENOSA', 'SEMILLA_DEL_CAOS']) {
      expect(glosarioEs[clave], clave).toBeTruthy();
      expect(glosarioEn[clave], clave).toBeTruthy();
    }
  });

  it('tiene el glosario completo', () => {
    expect(Object.keys(glosarioEs).length).toBeGreaterThan(150);
    expect(Object.keys(glosarioEn).length).toBe(Object.keys(glosarioEs).length);
  });

  it('no conserva caracteres mal codificados en español', () => {
    expect(JSON.stringify(glosarioEs)).not.toMatch(/[ÃÂ]/);
    expect(glosarioEs.CODICIA).toContain('CONCENTRACIÓN');
  });
});
