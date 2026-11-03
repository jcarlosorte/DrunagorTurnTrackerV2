import { describe, expect, it } from 'vitest';
import { EXPANSIONS } from '@/data/expansions';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';

describe('expansiones de Apocalipsis', () => {
  it('Lorien y el Pack de Héroes están disponibles', () => {
    expect(EXPANSIONS.find((expansion) => expansion.id === 'apocalypse_lorien')?.active).toBe('on');
    expect(EXPANSIONS.find((expansion) => expansion.id === 'apocalypse_heroes_1')?.active).toBe('on');
  });

  it('sus héroes existen y pertenecen a la expansión correcta', () => {
    const lorien = HEROES.find((hero) => hero.id === 'lorien');
    expect(lorien?.expansionId).toBe('apocalypse_lorien');

    const pack = EXPANSIONS.find((expansion) => expansion.id === 'apocalypse_heroes_1');
    expect(pack?.heroes).toHaveLength(8);
    pack.heroes.forEach((id) => {
      expect(HEROES.find((hero) => hero.id === id)?.expansionId).toBe('apocalypse_heroes_1');
    });
  });

  it('Hermanas Fatídicas está activa y su overlord existe', () => {
    const sisters = EXPANSIONS.find((expansion) => expansion.id === 'apocalypse_sisters');
    expect(sisters?.active).toBe('on');

    const overlord = ENEMIES.find((enemy) => enemy.id === 'fallen_sisters');
    expect(overlord).toMatchObject({
      vida: 8,
      movimiento: 3,
      color: 'overlord',
      categoria: 'overlord',
    });
  });
});
