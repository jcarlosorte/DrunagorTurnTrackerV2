import { describe, expect, it } from 'vitest';
import {
  AURAS,
  canHeroChooseAura,
  getAura,
  getAuraCapability,
  getAuraEffect,
  getAuraName,
  getAurasForCampaign,
  isLeaderRole,
} from '@/data/heroes/index';

const ids = AURAS.map((aura) => aura.id);

describe('auras base', () => {
  it('contiene exactamente las 20 auras de la especificación', () => {
    expect(AURAS).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
    expect(ids).toEqual(expect.arrayContaining([
      'bendicion_de_gratitud',
      'desprecio',
      'bendicion_de_empatia',
      'buenas_intenciones',
      'ansia_asesina',
      'conciencia_tranquila',
      'bendicion_del_guardian',
      'bendicion_de_corazon',
      'bendicion_de_buena_fortuna',
      'grandeza',
      'camino_al_infierno',
      'asomando_al_borde',
      'liderazgo_inspirador',
      'almas_gemelas_reunidas',
      'hechizo_fallido',
      'envenenamiento',
      'sed_de_sangre',
      'corazon_frio',
      'corazon_bravo',
      'vinculo_de_amistad',
    ]));
  });

  it('reparte los grupos 6 / 7 / 7 y todas afectan al juego base', () => {
    const counts = AURAS.reduce((acc, aura) => {
      acc[aura.group] = (acc[aura.group] || 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({
      'leader-private': 6,
      'leader-party': 7,
      'hero-private': 7,
    });
    expect(AURAS.every((aura) => aura.campaign === 'core')).toBe(true);
  });

  it('tiene textos y capacidades en español e inglés', () => {
    AURAS.forEach((aura) => {
      expect(aura.name.es).toBeTruthy();
      expect(aura.name.en).toBeTruthy();
      expect(aura.effect.es.length).toBeGreaterThan(20);
      expect(aura.effect.en.length).toBeGreaterThan(20);
      expect(aura.capability.es).toBeTruthy();
      expect(aura.capability.en).toBeTruthy();
    });
    expect(getAuraName('sed_de_sangre', 'es')).toBe('Sed de sangre');
    expect(getAuraName('sed_de_sangre', 'en')).toBe('Bloodlust');
    expect(getAuraCapability('sed_de_sangre', 'es')).toBe('Matar: 1 acción de cubo extra');
    expect(getAuraEffect('sed_de_sangre', 'en')).toContain('additional Cube Action');
  });

  it('solo expone las auras del juego base en la campaña base', () => {
    expect(getAurasForCampaign('core')).toHaveLength(20);
    expect(getAurasForCampaign()).toHaveLength(20);
    expect(getAurasForCampaign('awakenings')).toHaveLength(0);
    expect(getAurasForCampaign('apocalypse')).toHaveLength(0);
  });

  it('solo permite elegir las auras de líder a los roles de líder', () => {
    const leaderAura = getAura('liderazgo_inspirador');
    const heroAura = getAura('vinculo_de_amistad');
    expect(isLeaderRole('lider')).toBe(true);
    expect(isLeaderRole('guardian')).toBe(true);
    expect(isLeaderRole('defensor')).toBe(false);
    expect(canHeroChooseAura(leaderAura, 'lider')).toBe(true);
    expect(canHeroChooseAura(leaderAura, 'defensor')).toBe(false);
    expect(canHeroChooseAura(heroAura, 'defensor')).toBe(true);
  });
});
