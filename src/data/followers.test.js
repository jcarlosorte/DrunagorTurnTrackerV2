import { describe, expect, it } from 'vitest';
import { FOLLOWERS, getFollower, getFollowerState } from '@/data/followers';

describe('seguidores de Despertar', () => {
  it('incluye los seis seguidores y todos con rol y estados', () => {
    expect(FOLLOWERS).toHaveLength(6);
    for (const follower of FOLLOWERS) {
      expect(follower.role).toBeTruthy();
      expect(follower.states.length).toBeGreaterThanOrEqual(1);
      expect(follower.expansionId).toBe('apocalypse_awakenings');
    }
  });

  it('resuelve estados y cae en el primero si no existe', () => {
    expect(getFollowerState('elros_asesino', 'energico')?.ataque).toBe(3);
    expect(getFollowerState('elros_asesino', 'desconocido')?.id).toBe('energico');
    expect(getFollower('no-existe')).toBeNull();
  });
});
