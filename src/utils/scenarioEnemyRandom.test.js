import { describe, expect, it } from 'vitest';
import {
  getNavalExcludedEnemyIds,
  getRuneNavalExcludedEnemyIds,
  getScenarioLinkedEnemyIds,
  isEnemyAllowedInRandom,
} from './scenarioEnemyRandom';

const IMAGE_A = 'shared-image';
const IMAGE_B = 'other-image';

const enemies = [
  { id: 'scenario_a', nombre: 'Scenario A', imagen: IMAGE_A, scenario: 'escenario' },
  { id: 'normal_a', nombre: 'Normal A', imagen: IMAGE_A },
  { id: 'normal_a_com', nombre: 'Commander A', imagen: IMAGE_A, categoria: 'comandante' },
  { id: 'normal_b', nombre: 'Normal B', imagen: IMAGE_B },
];

describe('scenarioEnemyRandom', () => {
  it('relaciona por imagen todas las versiones no escenario', () => {
    const linked = getScenarioLinkedEnemyIds(enemies[0], enemies);
    expect([...linked]).toEqual(['normal_a', 'normal_a_com']);
  });

  it('no relaciona imágenes distintas ni al propio escenario', () => {
    const linked = getScenarioLinkedEnemyIds(enemies[0], enemies);
    expect(linked.has('scenario_a')).toBe(false);
    expect(linked.has('normal_b')).toBe(false);
  });

  it('excluye escenarios y versiones vinculadas de la selección aleatoria', () => {
    const linked = getScenarioLinkedEnemyIds(enemies[0], enemies);
    expect(isEnemyAllowedInRandom(enemies[0], linked)).toBe(false);
    expect(isEnemyAllowedInRandom(enemies[1], linked)).toBe(false);
    expect(isEnemyAllowedInRandom(enemies[2], linked)).toBe(false);
    expect(isEnemyAllowedInRandom(enemies[3], linked)).toBe(true);
  });

  it('sin escenario seleccionado solo excluye a los propios escenarios', () => {
    const linked = getScenarioLinkedEnemyIds(null, enemies);
    expect(linked.size).toBe(0);
    expect(isEnemyAllowedInRandom(enemies[0], linked)).toBe(false);
    expect(isEnemyAllowedInRandom(enemies[1], linked)).toBe(true);
  });

  it('Incursión Naval excluye Cazamareas y Executioner', () => {
    const navalEnemies = [
      { id: 'nagian_hunter', imagen: 'nagian_hunter' },
      { id: 'nagian_hunter_com', imagen: 'nagian_hunter' },
      { id: 'executioner', imagen: 'executioner' },
      { id: 'executioner_scenario1', imagen: 'executioner' },
      { id: 'scenario', imagen: 'nagian_hunter', scenario: 'escenario' },
      { id: 'other', imagen: 'other' },
    ];
    expect([...getNavalExcludedEnemyIds(navalEnemies)]).toEqual([
      'nagian_hunter',
      'nagian_hunter_com',
      'executioner',
      'executioner_scenario1',
    ]);
  });

  it('Batalla Naval excluye las versiones de Fell Asteris', () => {
    const runeNavalEnemies = [
      { id: 'fell_asteris', imagen: 'fell_asteris' },
      { id: 'fell_asteris_com', imagen: 'fell_asteris' },
      { id: 'infamous_striker', imagen: 'fell_asteris', scenario: 'escenario' },
      { id: 'other', imagen: 'other' },
    ];
    expect([...getRuneNavalExcludedEnemyIds(runeNavalEnemies)]).toEqual([
      'fell_asteris',
      'fell_asteris_com',
    ]);
  });
});
