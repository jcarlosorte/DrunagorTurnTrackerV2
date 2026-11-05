import { describe, expect, it } from 'vitest';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

describe('traducciones de enemigos de Despertar', () => {
  it('traduce los enemigos base', () => {
    expect(es.enemies.gorgoness_witch).toBe('Bruja Gorgona');
    expect(es.enemies.gremlin_horde).toBe('Horda de Duendes');
    expect(es.enemies.grim_doctor).toBe('Doctor Nefasto');
    expect(es.enemies.nagian_hunter).toBe('Cazador Nagiano');
  });

  it('traduce sus comandantes', () => {
    expect(es.enemies.gorgoness_witch_com).toBe('Comandante Bruja');
    expect(es.enemies.gremlin_horde_com).toBe('Comandante Horda');
    expect(es.enemies.grim_doctor_com).toBe('Comandante Doctor');
    expect(es.enemies.nagian_hunter_com).toBe('Comandante Cazador');
    expect(en.enemies.gorgoness_witch_com).toBe('Witch Commander');
    expect(en.enemies.nagian_hunter_com).toBe('Hunter Commander');
  });
});
