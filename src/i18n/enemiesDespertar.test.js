import { describe, expect, it } from 'vitest';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

describe('traducciones de enemigos de Despertar', () => {
  it('traduce los enemigos base', () => {
    expect(es.enemies.gorgoness_witch).toBe('Bruja Gorgona');
    expect(es.enemies.gremlin_horde).toBe('Horda de Duendes');
    expect(es.enemies.grim_doctor).toBe('Doctor Nefasto');
    expect(es.enemies.nagian_hunter).toBe('Cazador Nagiano');
    expect(es.enemies.hellspawn_brute).toBe('Bruto Infernal');
    expect(es.enemies.fell_asteris).toBe('Aestris Letal');
    expect(es.enemies.gorgon_hexer).toBe('Hechicero Gorgona');
    expect(es.enemies.night_stalker).toBe('Acechador Nocturno');
    expect(es.enemies.fallen_woodcutter).toBe('Leñador Caído');
    expect(es.enemies.nightmare).toBe('Pesadilla');
    expect(es.enemies.boatswain).toBe('Contramaestre');
    expect(es.enemies.tide_hunter).toBe('Cazamareas');
    expect(es.enemies.skeleton_guard).toBe('Guardia Esqueleto');
    expect(es.enemies.violent_bully).toBe('Matón Violento');
    expect(es.enemies.tangled_witch).toBe('Bruja Enredada');
    expect(es.enemies.infamous_monster).toBe('Engendro Infame');
    expect(es.enemies.infamous_striker).toBe('Artillero Infame');
    expect(en.enemies.fallen_woodcutter).toBe('Fell Woodman');
    expect(en.enemies.tide_hunter).toBe('Tidehunter');
    expect(en.enemies.violent_bully).toBe('Vicious Mauler');
    expect(en.enemies.tangled_witch).toBe('Coiled Harridan');
    expect(en.enemies.infamous_monster).toBe('Vile Spawn');
    expect(en.enemies.infamous_striker).toBe('Foul Shooter');
  });

  it('traduce sus comandantes', () => {
    expect(es.enemies.gorgoness_witch_com).toBe('Comandante Bruja');
    expect(es.enemies.gremlin_horde_com).toBe('Comandante Horda');
    expect(es.enemies.grim_doctor_com).toBe('Comandante Doctor');
    expect(es.enemies.nagian_hunter_com).toBe('Comandante Cazador');
    expect(es.enemies.hellspawn_brute_com).toBe('Comandante Vástago');
    expect(es.enemies.fell_asteris_com).toBe('Comandante Buey');
    expect(es.enemies.gorgon_hexer_com).toBe('Comandante Hechicero');
    expect(es.enemies.night_stalker_com).toBe('Comandante Espantoso');
    expect(es.enemies.maya_ranger_com).toBe('Maya, La Montaraz');
    expect(en.enemies.maya_ranger_com).toBe('Commander Maya');
    expect(en.enemies.gorgoness_witch_com).toBe('Witch Commander');
    expect(en.enemies.hellspawn_brute_com).toBe('Brute Commander');
    expect(en.enemies.fell_asteris_com).toBe('Ox Commander');
    expect(en.enemies.nagian_hunter_com).toBe('Hunter Commander');
    expect(en.enemies.gorgon_hexer_com).toBe('Hexer Commander');
    expect(en.enemies.night_stalker_com).toBe('Stalker Commander');
    expect(en.enemies.maya_ranger_com).toBe('Commander Maya');
  });
});
