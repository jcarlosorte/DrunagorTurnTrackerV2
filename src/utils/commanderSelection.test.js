import { describe, expect, it } from 'vitest';
import { getCommanderCandidates, getEnemyFamilyId } from '@/utils/commanderSelection';

describe('selección de comandantes', () => {
  it('incluye el comandante de un enemigo seleccionado', () => {
    const candidates = getCommanderCandidates({
      selectedEnemyIds: ['dark_vampire'],
    });

    expect(candidates.some((enemy) => enemy.id === 'dark_vampire_com')).toBe(true);
    expect(candidates.every((enemy) => enemy.expansionId === 'base')).toBe(true);
    expect(candidates.every((enemy) => enemy.color !== 'escenario' && !enemy.scenario)).toBe(true);
  });

  it('excluye comandantes que no están en la lista seleccionada', () => {
    const candidates = getCommanderCandidates({
      selectedEnemyIds: ['dark_vampire'],
    });

    expect(candidates.some((enemy) => enemy.id === 'shadow_cultist_com')).toBe(false);
  });

  it('no filtra por campaña: la lista seleccionada manda', () => {
    const candidates = getCommanderCandidates({
      selectedEnemyIds: ['dark_vampire'],
    });

    expect(candidates.some((enemy) => enemy.id === 'dark_vampire_com')).toBe(true);
  });

  it('extrae el id base de las variantes', () => {
    expect(getEnemyFamilyId('dark_vampire_com')).toBe('dark_vampire');
    expect(getEnemyFamilyId('shadow_knight_scenario2')).toBe('shadow_knight');
    expect(getEnemyFamilyId('gorgoness_witch_scenario_com')).toBe('gorgoness_witch');
    expect(getEnemyFamilyId('commander_thern')).toBe('commander_thern');
  });
});
