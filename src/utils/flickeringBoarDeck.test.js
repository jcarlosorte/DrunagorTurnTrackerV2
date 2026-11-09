import { describe, expect, it } from 'vitest';
import {
  createFlickeringBoarDeck,
  drawFlickeringBoarCard,
  emptyFlickeringBoarDeck,
} from '@/utils/flickeringBoarDeck';
import { FLICKERING_BOAR_CARD_IDS } from '@/data/flickeringBoarDeck';

describe('baraja Comportamiento Jabalí Parpadeante', () => {
  it('se inicializa barajada con las 8 cartas', () => {
    const deck = createFlickeringBoarDeck('boar-1');
    expect(deck.active).toBe(true);
    expect(deck.enemyUuid).toBe('boar-1');
    expect(deck.deck).toHaveLength(8);
    expect(new Set(deck.deck)).toEqual(new Set(FLICKERING_BOAR_CARD_IDS));
  });

  it('roba y descarta hasta agotar el mazo', () => {
    let deck = createFlickeringBoarDeck('boar-1');
    for (let index = 0; index < 8; index += 1) {
      deck = drawFlickeringBoarCard(deck);
      expect(deck.current).toBeTruthy();
      expect(deck.discarded).toHaveLength(index + 1);
    }
    expect(deck.deck).toHaveLength(0);
    expect(deck.discarded).toHaveLength(8);
  });

  it('al volver a robar recarga y baraja las 8 cartas', () => {
    let deck = createFlickeringBoarDeck('boar-1');
    for (let index = 0; index < 8; index += 1) deck = drawFlickeringBoarCard(deck);
    deck = drawFlickeringBoarCard(deck);
    expect(deck.cycles).toBe(1);
    expect(deck.deck).toHaveLength(7);
    expect(deck.discarded).toHaveLength(1);
  });

  it('el estado vacío no está activo', () => {
    expect(emptyFlickeringBoarDeck()).toMatchObject({ active: false, deck: [], discarded: [] });
  });
});
