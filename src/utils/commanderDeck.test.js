import { describe, expect, it } from 'vitest';
import { CARTAS_COMANDANTE } from '@/data/cartasEspeciales';
import {
  buildCommanderDeckFromSelection,
  generateRandomCommanderDeck,
  getCommanderDeckForExpansion,
  isCommanderDeckValid,
} from '@/utils/commanderDeck';

describe('barajas de comandante', () => {
  it('la baraja estándar de cada expansión tiene 10 cartas y respeta color/posición', () => {
    expect(isCommanderDeckValid(getCommanderDeckForExpansion('base'))).toBe(true);
    expect(isCommanderDeckValid(getCommanderDeckForExpansion('apocalypse_awakenings'))).toBe(true);
  });

  it('la baraja aleatoria usa las 10 posiciones sin repetir', () => {
    const deck = generateRandomCommanderDeck(() => 0);
    expect(isCommanderDeckValid(deck)).toBe(true);
    expect(new Set(deck.map((card) => card.id)).size).toBe(10);
  });

  it('la baraja manual solo es válida si tiene las 10 posiciones', () => {
    const standard = getCommanderDeckForExpansion('base');
    const selection = Object.fromEntries(
      standard.map((card) => [`${card.rune}_${card.runePosition}`, card.id]),
    );
    expect(isCommanderDeckValid(buildCommanderDeckFromSelection(selection))).toBe(true);

    const incomplete = { ...selection };
    delete incomplete[`${CARTAS_COMANDANTE[0].rune}_${CARTAS_COMANDANTE[0].runePosition}`];
    expect(isCommanderDeckValid(buildCommanderDeckFromSelection(incomplete))).toBe(false);
  });
});
