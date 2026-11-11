import { describe, expect, it } from 'vitest';
import { applyBossRuneEffect } from '@/utils/bossRunes';

const baseBoss = {
  id: 'soul_harvester_boss',
  bossRune: 'gris',
  capacidades: ['ARMADURA'],
  capacidadesOriginales: ['ARMADURA'],
  inmunidad: ['GRANDE', 'QUEMADURA_I', 'HEMORRAGIA_I', 'VENENO_I'],
  bossBaseImmunities: ['GRANDE', 'QUEMADURA_I', 'HEMORRAGIA_I', 'VENENO_I'],
  bossRuneLostImmunities: [],
  estadosAlterados: [],
};

describe('runas del Cosechador', () => {
  it('la runa gris mantiene ARMADURA y todas las inmunidades', () => {
    const result = applyBossRuneEffect(baseBoss, 'gris');
    expect(result.capacidades).toContain('ARMADURA');
    expect(result.inmunidad).toContain('QUEMADURA_I');
  });

  it('acumula las inmunidades perdidas y las restaura al volver a gris', () => {
    const orange = applyBossRuneEffect(baseBoss, 'naranja');
    expect(orange.capacidades).not.toContain('ARMADURA');
    expect(orange.inmunidad).not.toContain('QUEMADURA_I');

    const red = applyBossRuneEffect(orange, 'rojo');
    expect(red.inmunidad).not.toContain('QUEMADURA_I');
    expect(red.inmunidad).not.toContain('HEMORRAGIA_I');

    const gray = applyBossRuneEffect(red, 'gris');
    expect(gray.capacidades).toContain('ARMADURA');
    expect(gray.inmunidad).toEqual(baseBoss.inmunidad);
  });

  it('la runa azul añade ATURDIMIENTO sin quitar esa inmunidad', () => {
    const blue = applyBossRuneEffect(baseBoss, 'azul');
    expect(blue.capacidades).not.toContain('ARMADURA');
    expect(blue.estadosAlterados.find((estado) => estado.id === 'ATURDIMIENTO')?.count).toBe(1);
    expect(blue.inmunidad).toContain('GRANDE');
  });
});
