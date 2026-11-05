import { describe, expect, it } from 'vitest';
import { getCommanderCandidates, getEnemyFamilyId } from '@/utils/commanderSelection';

describe('selección de comandantes', () => {
  it('incluye el comandante de un enemigo seleccionado en la campaña', () => {
    const candidates = getCommanderCandidates({
      mainBox: 'core',
      selectedEnemyIds: ['dark_vampire'],
    });

    expect(candidates.some((enemy) => enemy.id === 'dark_vampire_com')).toBe(true);
    expect(candidates.every((enemy) => enemy.expansionId === 'base')).toBe(true);
    expect(candidates.every((enemy) => enemy.color !== 'escenario' && !enemy.scenario)).toBe(true);
  });

  it('excluye comandantes que no están en la lista seleccionada', () => {
    const candidates = getCommanderCandidates({
      mainBox: 'core',
      selectedEnemyIds: ['dark_vampire'],
    });

    expect(candidates.some((enemy) => enemy.id === 'shadow_cultist_com')).toBe(false);
  });

  it('respeta la campaña activa', () => {
    const candidates = getCommanderCandidates({
      mainBox: 'awakenings',
      selectedEnemyIds: ['dark_vampire'],
    });

    expect(candidates.every((enemy) => enemy.expansionId === 'apocalypse_awakenings')).toBe(true);
  });

  it('extrae el id base de las variantes', () => {
    expect(getEnemyFamilyId('dark_vampire_com')).toBe('dark_vampire');
    expect(getEnemyFamilyId('shadow_knight_scenario2')).toBe('shadow_knight');
    expect(getEnemyFamilyId('commander_thern')).toBe('commander_thern');
  });
});
