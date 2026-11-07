import { describe, expect, it } from 'vitest';
import { RUNAS_DESPERTAR } from '@/data/runasDespertar';

describe('runas de Despertar', () => {
  it('contiene las 5 cartas con sus dos caras', () => {
    const ids = [...new Set(RUNAS_DESPERTAR.map((card) => card.id))];
    expect(ids).toHaveLength(5);
    expect(RUNAS_DESPERTAR).toHaveLength(10);
    RUNAS_DESPERTAR.forEach((card) => {
      expect(card.tipo).toBe('runa');
      expect(card.posicion).toBe('abajo');
      expect(card.expansionId).toBe('apocalypse_awakenings');
      expect(['A', 'B']).toContain(card.cara);
      expect(card.numRunas).toBeGreaterThan(0);
      expect(card.descripcion).toBeTruthy();
    });
  });
});
