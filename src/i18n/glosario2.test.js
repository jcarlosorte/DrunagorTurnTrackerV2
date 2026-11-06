import { describe, expect, it } from 'vitest';
import glosarioEs from '@/i18n/glosario2.es.json';
import glosarioEn from '@/i18n/glosario2.en.json';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

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

  it('incluye ESPARCIR en español y SPREAD en inglés', () => {
    expect(glosarioEs.ESPARCIR).toContain('daño no prevenible');
    expect(glosarioEn.ESPARCIR).toContain('SPREAD');
  });

  it('usa CARGA en lugar de CARGAR', () => {
    expect(glosarioEs.CARGA).toBeTruthy();
    expect(glosarioEn.CARGA).toBeTruthy();
    expect(glosarioEs.CARGAR).toBeUndefined();
    expect(glosarioEn.CARGAR).toBeUndefined();
  });

  it('incluye la capacidad del cañón terrorífico', () => {
    const key = 'ESTE MONSTRUO SE MUEVE HACIA EL CAÑON TERRORÍFICO MÁS CERCANO Y LO DISPARA';
    expect(glosarioEs[key]).toBe('este monstruo se mueve hacia el cañon terrorífico más cercano y lo dispara');
    expect(glosarioEn[key]).toBe('This monster moves toward the nearest terrifying cannon and fires it');
  });

  it('tiene etiquetas para ENJAMBRE, CARGA, RETROCEDER, COLERA y ENCADENAR', () => {
    for (const key of ['ENJAMBRE', 'CARGA', 'RETROCEDER', 'COLERA', 'ENCADENAR']) {
      expect(es.condiciones_t[key], key).toBeTruthy();
      expect(en.condiciones_t[key], key).toBeTruthy();
    }
    expect(en.condiciones_t.ENJAMBRE).toBe('SWARM');
    expect(en.condiciones_t.CARGA).toBe('CHARGE');
    expect(en.condiciones_t.RETROCEDER).toBe('PUSH BACK');
  });

  it('incluye ARMADURA DE ASALTO y SIEGE ARMOR', () => {
    const key = 'ARMADURA DE ASALTO';
    expect(glosarioEs[key]).toContain('Matones Violentos');
    expect(glosarioEn[key]).toContain('Vicious maulers');
    expect(es.condiciones_t[key]).toBe('ARMADURA DE ASALTO');
    expect(en.condiciones_t[key]).toBe('SIEGE ARMOR');
  });

  it('incluye GIGANTE y JUGGERNAUT', () => {
    expect(glosarioEs.GIGANTE).toContain('Monstruos');
    expect(glosarioEn.GIGANTE).toContain('Juggernaut');
    expect(es.condiciones_t.GIGANTE).toBe('GIGANTE');
    expect(en.condiciones_t.GIGANTE).toBe('JUGGERNAUT');
  });

  it('no conserva caracteres mal codificados en español', () => {
    expect(JSON.stringify(glosarioEs)).not.toMatch(/[ÃÂ]/);
    expect(glosarioEs.CODICIA).toContain('CONCENTRACIÓN');
  });
});
