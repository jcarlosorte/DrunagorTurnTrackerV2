import { describe, expect, it } from 'vitest';
import { getFollowerAbility } from '@/data/followerAbilities';
import {
  COHORT_FOLLOWERS,
  FOLLOWERS,
  getFollower,
  getFollowerEpithet,
  getFollowerName,
  getFollowerState,
  getFollowerStateName,
  getFollowersForCampaign,
  isCohortFollower,
} from '@/data/followers';

describe('seguidores de Despertar y Apocalipsis', () => {
  it('incluye los seguidores de ambas campañas con rol y estados', () => {
    expect(FOLLOWERS).toHaveLength(15);
    for (const follower of FOLLOWERS) {
      expect(follower.role).toBeTruthy();
      expect(follower.states.length).toBeGreaterThanOrEqual(1);
      expect(['apocalypse_awakenings', 'apocalypse_adventures']).toContain(follower.expansionId);
    }
  });

  it('resuelve estados y cae en el primero si no existe', () => {
    expect(getFollowerState('elros_asesino', 'energico')?.ataque).toBe(3);
    expect(getFollowerState('elros_asesino', 'desconocido')?.id).toBe('energico');
    expect(getFollower('no-existe')).toBeNull();
  });

  it('añade los seis seguidores de Apocalipsis con sus valores', () => {
    expect(getFollower('khadija')).toMatchObject({
      role: 'agresor',
      attackType: 'cuerpo',
      capabilities: ['1 HÉROE ADYACENTE', 'INSPIRAR'],
    });
    expect(getFollowerState('khadija', 'normal')).toMatchObject({ ataque: 4, movimiento: 5, vida: 6 });
    expect(getFollowerState('daviggo', 'normal')).toMatchObject({ ataque: 3, movimiento: 4, vida: 7 });
    expect(getFollowerState('amsterd', 'normal')).toMatchObject({ ataque: 3, movimiento: 5, vida: 6 });
    expect(getFollowerState('randy', 'normal')).toMatchObject({ ataque: 6, movimiento: 5, vida: 7 });
    expect(getFollowerState('carmilla', 'normal')).toMatchObject({ ataque: 3, movimiento: 5, vida: 6 });
  });

  it('Robin Rising tiene dos estados y el resto uno', () => {
    expect(getFollower('robin').states.map((state) => state.id)).toEqual(['herido', 'sano']);
    expect(getFollowerState('robin', 'herido')).toMatchObject({ ataque: 3, movimiento: 5, vida: 6 });
    expect(getFollowerState('robin', 'sano')).toMatchObject({ ataque: 4, movimiento: 5, vida: 7 });
    const others = FOLLOWERS.filter((follower) => (
      follower.expansionId === 'apocalypse_adventures' && follower.id !== 'robin' && !follower.cohort
    ));
    expect(others).toHaveLength(5);
    expect(others.every((follower) => follower.states.length === 1)).toBe(true);
  });

  it('localiza nombres, epítetos y estados', () => {
    const khadija = getFollower('khadija');
    expect(getFollowerName(khadija, 'es')).toBe('Surcadora Khadija');
    expect(getFollowerName(khadija, 'en')).toBe('Dunedancer Khadija');
    expect(getFollowerEpithet(khadija, 'en')).toBe('Amazon Prodigy');
    expect(getFollowerName(getFollower('daviggo'), 'en')).toBe('Condottieri DaViggo');
    expect(getFollowerStateName(getFollowerState('robin', 'sano'), 'en')).toBe('Healthy');
  });

  it('resuelve las capacidades de los seguidores en ambos idiomas', () => {
    for (const follower of FOLLOWERS) {
      for (const label of follower.capabilities) {
        const ability = getFollowerAbility(label);
        expect(ability, `${follower.id}: ${label}`).toBeTruthy();
        expect(ability.nameEn).toBeTruthy();
        expect(ability.descriptionEn).toBeTruthy();
      }
    }
    expect(getFollowerAbility('1 HÉROE ADYACENTE')?.nameEn).toBe('1 adjacent hero');
  });

  it('filtra los seguidores por campaña y vista previa', () => {
    const ids = (options) => getFollowersForCampaign(options).map((follower) => follower.id);
    expect(ids({ mainBox: 'core' })).toEqual([]);
    expect(ids({ mainBox: 'awakenings' })).toHaveLength(6);
    expect(ids({ mainBox: 'apocalypse' })).toEqual([
      'khadija', 'daviggo', 'amsterd', 'randy', 'carmilla', 'robin',
      'surcadora', 'condotierro', 'christiyjefrey',
    ]);
    expect(ids({ mainBox: 'core', previewOtherBoxes: true })).toHaveLength(15);
  });

  it('marca los Acompañantes (Cohort) y sus valores', () => {
    expect(COHORT_FOLLOWERS.map((follower) => follower.id)).toEqual([
      'surcadora', 'condotierro', 'christiyjefrey',
    ]);
    expect(COHORT_FOLLOWERS.every((follower) => isCohortFollower(follower.id))).toBe(true);
    expect(getFollowerState('surcadora', 'normal')).toMatchObject({ ataque: 2, movimiento: 5, vida: 5 });
    expect(getFollowerState('condotierro', 'normal')).toMatchObject({ ataque: 2, movimiento: 4, vida: 7 });
    expect(getFollowerState('christiyjefrey', 'normal')).toMatchObject({ ataque: 3, movimiento: 4, vida: 7 });
    expect(getFollower('surcadora')).toMatchObject({
      role: 'controlador',
      expansionId: 'apocalypse_adventures',
      capabilities: ['HEMORRAGIA 2'],
    });
  });
});
