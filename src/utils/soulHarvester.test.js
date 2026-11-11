import { describe, expect, it } from 'vitest';
import { resolveSoulHarvesterTimeZero } from '@/utils/soulHarvester';

const boss = {
  id: 'soul_harvester_boss',
  vida: 20,
  vidaMax: 20,
  bossRune: 'azul',
  capacidades: [],
  capacidadesOriginales: ['ARMADURA'],
  inmunidad: ['GRANDE'],
  bossBaseImmunities: ['GRANDE'],
  bossRuneLostImmunities: ['ATURDIMIENTO_I'],
  estadosAlterados: [
    { id: 'TIEMPO', count: 0 },
    { id: 'ATURDIMIENTO_I', count: 1 },
    { id: 'QUEMADURA_I', count: 2 },
    { id: 'VENENO_I', count: 1 },
  ],
};

describe('Ficha de Tiempo del Cosechador', () => {
  it('suma los estados, aplica el daño y vuelve a la runa gris', () => {
    const result = resolveSoulHarvesterTimeZero(boss);
    expect(result.triggered).toBe(true);
    expect(result.damage).toBe(4);
    expect(result.vidaAntes).toBe(20);
    expect(result.vidaDespues).toBe(16);
    expect(result.enemy.vida).toBe(16);
    expect(result.enemy.bossRune).toBe('gris');
    expect(result.enemy.capacidades).toContain('ARMADURA');
    expect(result.enemy.estadosAlterados).toEqual([{ id: 'TIEMPO', count: 0 }]);
  });

  it('no se dispara mientras quede Ficha de Tiempo', () => {
    const pending = {
      ...boss,
      estadosAlterados: [{ id: 'TIEMPO', count: 1 }],
    };
    const result = resolveSoulHarvesterTimeZero(pending);
    expect(result.triggered).toBe(false);
    expect(result.enemy).toBe(pending);
  });
});
