import { describe, expect, it } from 'vitest';
import { extractSnapshotData, migrateSnapshot, SNAPSHOT_SCHEMA_VERSION } from '@/utils/storage';

describe('migrateSnapshot', () => {
  it('migra el formato v1 de datos planos', () => {
    const result = migrateSnapshot({ schemaVersion: 1, data: { lang: 'es' } });
    expect(result.schemaVersion).toBe(SNAPSHOT_SCHEMA_VERSION);
    expect(result.data).toEqual({ lang: 'es' });
  });

  it('migra v2 a v3 añadiendo heroExtras saneado', () => {
    const result = migrateSnapshot({
      schemaVersion: 2,
      configuration: { expansions: ['base'] },
      track: { gameState: {}, heroExtras: { vorn: { vida: 999, vidaMax: 10 } } },
    });

    expect(result.schemaVersion).toBe(SNAPSHOT_SCHEMA_VERSION);
    expect(result.track.heroExtras.vorn.vida).toBe(10);
    expect(result.configuration.expansions).toEqual(['base']);
  });

  it('no inventa heroExtras si el guardado no lo tenía', () => {
    const result = migrateSnapshot({ schemaVersion: 2, configuration: {}, track: {} });
    expect(result.track.heroExtras).toBeUndefined();
  });
});

describe('extractSnapshotData', () => {
  it('acepta v1, v2 y v3', () => {
    expect(extractSnapshotData({ schemaVersion: 1, data: { lang: 'es' } }).lang).toBe('es');
    expect(extractSnapshotData({ schemaVersion: 2, configuration: { lang: 'en' }, track: {} }).lang).toBe('en');
    expect(extractSnapshotData({ schemaVersion: 3, configuration: { lang: 'es' }, track: {} }).lang).toBe('es');
  });

  it('rechaza versiones desconocidas', () => {
    expect(() => extractSnapshotData({ schemaVersion: 99, configuration: {}, track: {} }))
      .toThrow(/no compatible/i);
  });

  it('separa configuración y track por ámbito', () => {
    const snapshot = {
      schemaVersion: 3,
      configuration: { expansions: ['base'] },
      track: { gameState: { round: 1 } },
    };

    expect(extractSnapshotData(snapshot, 'configuration')).toEqual({ expansions: ['base'] });
    expect(extractSnapshotData(snapshot, 'track')).toEqual({ gameState: { round: 1 } });
  });

  it('valida el tipo de heroManagement', () => {
    expect(() => extractSnapshotData({
      schemaVersion: 3,
      configuration: { heroManagement: 'sí' },
      track: {},
    })).toThrow(/gestión de héroes/i);
  });
});
