import { FLICKERING_BOAR_CARD_IDS } from '@/data/flickeringBoarDeck';

function shuffled(ids, random = Math.random) {
  const deck = [...ids];
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}

export function createFlickeringBoarDeck(enemyUuid, random = Math.random) {
  return {
    active: true,
    enemyUuid: enemyUuid || null,
    deck: shuffled(FLICKERING_BOAR_CARD_IDS, random),
    discarded: [],
    current: null,
    cycles: 0,
  };
}

export function emptyFlickeringBoarDeck() {
  return { active: false, enemyUuid: null, deck: [], discarded: [], current: null, cycles: 0 };
}

/**
 * Roba una carta. Si el mazo está agotado, recarga y baraja todas las cartas
 * descartadas antes de robar la siguiente.
 */
export function drawFlickeringBoarCard(state, random = Math.random) {
  if (!state?.active) return state;

  let deck = [...state.deck];
  let discarded = [...state.discarded];
  let cycles = state.cycles || 0;

  if (deck.length === 0) {
    deck = shuffled(FLICKERING_BOAR_CARD_IDS, random);
    discarded = [];
    cycles += 1;
  }
  if (deck.length === 0) return state;

  const [current, ...rest] = deck;
  return {
    ...state,
    deck: rest,
    discarded: [...discarded, current],
    current,
    cycles,
  };
}
