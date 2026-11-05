import { describe, expect, it } from 'vitest';
import { adjustCapabilitiesByRunes } from '@/components/adjustCapabilitiesByRunes';

const runeCount = (count) => () => count;

describe('ajuste de capacidades por runas', () => {
  it('calcula ESCUDO X con fórmula y nunca baja de 0', () => {
    expect(adjustCapabilitiesByRunes(['ESCUDO X'], 'rojo', runeCount(2))).toEqual(['ESCUDO 2']);
    expect(adjustCapabilitiesByRunes(['ESCUDO X-5'], 'rojo', runeCount(7))).toEqual(['ESCUDO 2']);
    expect(adjustCapabilitiesByRunes(['ESCUDO X-5'], 'rojo', runeCount(2))).toEqual(['ESCUDO 0']);
    expect(adjustCapabilitiesByRunes(['ESCUDO X+2'], 'rojo', runeCount(2))).toEqual(['ESCUDO 4']);
    expect(adjustCapabilitiesByRunes(['ESCUDO X - 5'], 'rojo', runeCount(7))).toEqual(['ESCUDO 2']);
  });

  it('calcula VENENO X con fórmula y nunca baja de 0', () => {
    expect(adjustCapabilitiesByRunes(['VENENO X'], 'rojo', runeCount(2))).toEqual(['VENENO 2']);
    expect(adjustCapabilitiesByRunes(['VENENO X-5'], 'rojo', runeCount(7))).toEqual(['VENENO 2']);
    expect(adjustCapabilitiesByRunes(['VENENO X-5'], 'rojo', runeCount(2))).toEqual(['VENENO 0']);
    expect(adjustCapabilitiesByRunes(['VENENO X+2'], 'rojo', runeCount(2))).toEqual(['VENENO 4']);
  });

  it('calcula HEMORRAGIA X con fórmula y nunca baja de 0', () => {
    expect(adjustCapabilitiesByRunes(['HEMORRAGIA X'], 'rojo', runeCount(2))).toEqual(['HEMORRAGIA 2']);
    expect(adjustCapabilitiesByRunes(['HEMORRAGIA X-5'], 'rojo', runeCount(7))).toEqual(['HEMORRAGIA 2']);
    expect(adjustCapabilitiesByRunes(['HEMORRAGIA X-5'], 'rojo', runeCount(2))).toEqual(['HEMORRAGIA 0']);
    expect(adjustCapabilitiesByRunes(['HEMORRAGIA X+2'], 'rojo', runeCount(2))).toEqual(['HEMORRAGIA 4']);
  });

  it('calcula ABSORBER SALUD y QUEMADURA X con fórmula y nunca baja de 0', () => {
    expect(adjustCapabilitiesByRunes(['ABSORBER SALUD X'], 'rojo', runeCount(2))).toEqual(['ABSORBER SALUD 2']);
    expect(adjustCapabilitiesByRunes(['ABSORBER SALUD X-5'], 'rojo', runeCount(7))).toEqual(['ABSORBER SALUD 2']);
    expect(adjustCapabilitiesByRunes(['ABSORBER SALUD X-5'], 'rojo', runeCount(2))).toEqual(['ABSORBER SALUD 0']);
    expect(adjustCapabilitiesByRunes(['ABSORBER SALUD X+2'], 'rojo', runeCount(2))).toEqual(['ABSORBER SALUD 4']);

    expect(adjustCapabilitiesByRunes(['QUEMADURA X'], 'rojo', runeCount(2))).toEqual(['QUEMADURA 2']);
    expect(adjustCapabilitiesByRunes(['QUEMADURA X-5'], 'rojo', runeCount(7))).toEqual(['QUEMADURA 2']);
    expect(adjustCapabilitiesByRunes(['QUEMADURA X-5'], 'rojo', runeCount(2))).toEqual(['QUEMADURA 0']);
    expect(adjustCapabilitiesByRunes(['QUEMADURA X+2'], 'rojo', runeCount(2))).toEqual(['QUEMADURA 4']);
  });

  it('mantiene el ajuste del resto de capacidades', () => {
    expect(adjustCapabilitiesByRunes(['SANAR X'], 'rojo', runeCount(2))).toEqual(['SANAR 2']);
    expect(adjustCapabilitiesByRunes(['DESAFIO'], 'rojo', runeCount(2))).toEqual(['DESAFIO']);

    expect(adjustCapabilitiesByRunes('no-es-array', 'rojo', runeCount(2))).toEqual([]);
  });
});
