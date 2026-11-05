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

  it('mantiene el ajuste del resto de capacidades', () => {
    expect(adjustCapabilitiesByRunes(['SANAR X'], 'rojo', runeCount(2))).toEqual(['SANAR 2']);
    expect(adjustCapabilitiesByRunes(['DESAFIO'], 'rojo', runeCount(2))).toEqual(['DESAFIO']);

    expect(adjustCapabilitiesByRunes('no-es-array', 'rojo', runeCount(2))).toEqual([]);
  });
});
