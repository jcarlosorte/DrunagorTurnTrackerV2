import { describe, expect, it } from 'vitest';
import { ENEMIES } from '@/data/enemies';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';
import { hasCapabilityLabel, resolveCapabilityLabel } from '@/utils/enemyCapability';

const SEPARATORS = new Set([';', ',', 'Y', ':']);

const capabilityTokens = () => {
  const tokens = new Set();
  ENEMIES.forEach((enemy) => {
    (enemy.capacidades || []).forEach((capability) => {
      const token = String(capability).trim();
      if (token && !SEPARATORS.has(token)) tokens.add(token);
    });
  });
  return [...tokens];
};

describe('etiquetas de capacidades de enemigo', () => {
  it('todas las capacidades tienen etiqueta en español y en inglés', () => {
    const missingEs = [];
    const missingEn = [];
    capabilityTokens().forEach((token) => {
      if (!hasCapabilityLabel(token, es.condiciones_t)) missingEs.push(token);
      if (!hasCapabilityLabel(token, en.condiciones_t)) missingEn.push(token);
    });
    expect(missingEs).toEqual([]);
    expect(missingEn).toEqual([]);
  });

  it('resuelve VUDÚ, ALIVIAR y CONTRAATAQUE', () => {
    expect(resolveCapabilityLabel('VUDU', es.condiciones_t).texto).toBe('VUDÚ');
    expect(resolveCapabilityLabel('VUDU', en.condiciones_t).texto).toBe('VOODOO');
    expect(resolveCapabilityLabel('ALIVIAR 1', es.condiciones_t).texto).toContain('ALIVIAR');
    expect(resolveCapabilityLabel('CONTRAATAQUE X', en.condiciones_t).texto).toContain('COUNTERATTACK');
  });

  it('resuelve variantes X-N', () => {
    const resultado = resolveCapabilityLabel('ESCUDO X-3', es.condiciones_t);
    expect(resultado.texto).toContain('ESCUDO');
    expect(resultado.texto).toContain('X-3');
  });
});
