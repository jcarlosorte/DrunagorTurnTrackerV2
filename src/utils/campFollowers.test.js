import { beforeEach, describe, expect, it } from 'vitest';
import { readCampFollowers, removeCampFollower, saveCampFollower } from '@/utils/campFollowers';

const blueprint = {
  id: 'elros_asesino',
  role: 'lider',
  position: 4,
  stateId: 'energico',
  background: null,
};

describe('seguidores del campamento', () => {
  beforeEach(() => {
    const store = new Map();
    globalThis.window = {
      localStorage: {
        getItem: (key) => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => store.set(key, String(value)),
        removeItem: (key) => store.delete(key),
        clear: () => store.clear(),
      },
    };
  });

  it('guarda sin duplicar y conserva el perfil', () => {
    saveCampFollower(blueprint);
    saveCampFollower(blueprint);

    const list = readCampFollowers();
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: 'elros_asesino', stateId: 'energico' });
  });

  it('elimina un seguidor del campamento', () => {
    saveCampFollower(blueprint);
    removeCampFollower('elros_asesino');
    expect(readCampFollowers()).toEqual([]);
  });
});
