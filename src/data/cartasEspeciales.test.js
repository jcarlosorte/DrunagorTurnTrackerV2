import { describe, expect, it } from 'vitest';
import { CARTAS_COMANDANTE, CARTAS_JEFE, CARTAS_OVERLORD, getOverlordDeck } from '@/data/cartasEspeciales';

describe('cartas de comandante', () => {
  it('las 10 cartas base pertenecen al juego base', () => {
    const base = CARTAS_COMANDANTE.filter((carta) => carta.expansionId === 'base');
    expect(base).toHaveLength(10);
  });

  it('incluye las 10 cartas de Despertar', () => {
    const awakenings = CARTAS_COMANDANTE.filter(
      (carta) => carta.expansionId === 'apocalypse_awakenings',
    );
    expect(awakenings.map((carta) => carta.id)).toEqual([
      'cmd_11', 'cmd_12', 'cmd_13', 'cmd_14', 'cmd_15',
      'cmd_16', 'cmd_17', 'cmd_18', 'cmd_19', 'cmd_20',
    ]);
    expect(awakenings.find((carta) => carta.id === 'cmd_12')?.rune).toBe('azul');
  });
});

describe('cartas de Señor Supremo', () => {
  it('incluye las 10 cartas de las Hermanas Fatídicas', () => {
    const ids = CARTAS_OVERLORD.map((carta) => carta.id);
    for (let i = 11; i <= 20; i += 1) {
      expect(ids).toContain(`over_${i}`);
    }
  });

  it('cada Señor Supremo usa su propia baraja', () => {
    expect(getOverlordDeck('fallen_sisters').map((carta) => carta.id))
      .toEqual(Array.from({ length: 10 }, (_, index) => `over_${index + 11}`));
    expect(getOverlordDeck('demon_lord').map((carta) => carta.id))
      .toEqual(Array.from({ length: 10 }, (_, index) => `over_${index + 1}`));
  });

  it('mantiene las runas y posiciones indicadas', () => {
    expect(CARTAS_OVERLORD.find((carta) => carta.id === 'over_11'))
      .toMatchObject({ rune: 'rojo', runePosition: 'arriba' });
    expect(CARTAS_OVERLORD.find((carta) => carta.id === 'over_15'))
      .toMatchObject({ rune: 'azul', runePosition: 'abajo' });
    expect(CARTAS_OVERLORD.find((carta) => carta.id === 'over_20'))
      .toMatchObject({ rune: 'naranja', runePosition: 'arriba' });
  });
});

describe('cartas del Cosechador de Almas', () => {
  it('incluye las cinco cartas del jefe con sus runas y posiciones', () => {
    const deck = CARTAS_JEFE.filter((carta) => carta.idJefe === 'soul_harvester_boss');
    expect(deck.map((carta) => carta.id)).toEqual([
      'boss_21', 'boss_22', 'boss_23', 'boss_24', 'boss_25',
    ]);
    expect(deck.map((carta) => `${carta.rune}-${carta.runePosition}`)).toEqual([
      'naranja-abajo',
      'rojo-abajo',
      'verde-arriba',
      'gris-abajo',
      'azul-abajo',
    ]);
    expect(deck.find((carta) => carta.id === 'boss_22')?.invoca).toBe('fallen_woodcutter');
  });
});
