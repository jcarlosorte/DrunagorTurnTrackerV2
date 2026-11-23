import { describe, expect, it } from 'vitest';
import { sanitizeConfiguration } from '@/utils/configValidation';
import { createCampRecord } from '@/utils/campRecord';

describe('sanitizeConfiguration', () => {
  it('normaliza el nombre del grupo y el registro del campamento', () => {
    const campRecord = {
      ...createCampRecord(),
      legacyTrail: { perseverancia: 9 },
      darenTraits: { folkHero: true, knightOfAmira: true },
    };

    const { data } = sanitizeConfiguration({
      trackerData: {
        heroes: [],
        roles: {},
        enemies: [],
        behaviors: [],
        groupName: '  Los Buscadores  ',
        campRecord,
      },
    });

    expect(data.trackerData.groupName).toBe('Los Buscadores');
    expect(data.trackerData.campRecord.legacyTrail.perseverancia).toBe(3);
    expect(data.trackerData.campRecord.darenTraits.folkHero).toBe(true);
    expect(data.trackerData.campRecord.darenTraits.knightOfAmira).toBe(false);
  });

  it('elimina un nombre de grupo que no sea texto', () => {
    const { data } = sanitizeConfiguration({
      trackerData: {
        heroes: [],
        roles: {},
        enemies: [],
        behaviors: [],
        groupName: 42,
      },
    });

    expect(data.trackerData.groupName).toBeUndefined();
  });
});
