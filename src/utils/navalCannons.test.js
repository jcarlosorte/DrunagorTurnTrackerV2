import { describe, expect, it } from 'vitest';
import { planNavalCannonLoads } from './navalCannons';

const cannon = (id, color, loaded = false) => ({ id, color, loaded });
const rune = (color) => ({ runa: color });

describe('planNavalCannonLoads', () => {
  it('carga automáticamente los cañones descargados que coinciden', () => {
    const plan = planNavalCannonLoads(
      [cannon('n', 'naranja'), cannon('v', 'verde'), cannon('a', 'azul')],
      [rune('naranja'), rune('verde')],
    );
    expect(plan.autoLoadedIds).toEqual(['n', 'v']);
    expect(plan.pending).toEqual([]);
    expect(plan.failures).toEqual([]);
  });

  it('si el cañón coincide pero ya está cargado, ofrece otro descargado', () => {
    const plan = planNavalCannonLoads(
      [cannon('n', 'naranja', true), cannon('v', 'verde')],
      [rune('naranja')],
    );
    expect(plan.autoLoadedIds).toEqual([]);
    expect(plan.pending).toEqual([{ rune: 'naranja', reason: 'loaded' }]);
  });

  it('la runa azul pide elegir un cañón descargado', () => {
    const plan = planNavalCannonLoads(
      [cannon('n', 'naranja')],
      [rune('azul')],
    );
    expect(plan.pending).toEqual([{ rune: 'azul', reason: 'blue' }]);
  });

  it('marca fallo cuando no quedan cañones descargados', () => {
    const plan = planNavalCannonLoads(
      [cannon('n', 'naranja', true)],
      [rune('naranja'), rune('azul')],
    );
    expect(plan.failures).toEqual([
      { rune: 'naranja', reason: 'no-unloaded' },
      { rune: 'azul', reason: 'no-unloaded' },
    ]);
  });

  it('la segunda runa del mismo color ya no encuentra su cañón libre', () => {
    const plan = planNavalCannonLoads(
      [cannon('n', 'naranja'), cannon('v', 'verde')],
      [rune('naranja'), rune('naranja')],
    );
    expect(plan.autoLoadedIds).toEqual(['n']);
    expect(plan.pending).toEqual([{ rune: 'naranja', reason: 'loaded' }]);
  });
});
