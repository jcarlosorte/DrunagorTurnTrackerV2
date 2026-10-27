/**
 * Geometría del tablero de iniciativa.
 *
 * Las pilas crecen SIEMPRE alejándose del track: la primera carta queda a
 * BASE_GAP de la barra central y cada carta siguiente se aleja un paso más.
 * El paso se reduce al acumular cartas para que el tablero no se estire.
 */
export const CARD_HEIGHT = 128;
export const BASE_GAP = 26;
export const MAX_STACK_HEIGHT = 320;
export const MIN_STEP = 30;
/** Altura mínima del slot del tablero: la justa para una carta a cada lado. */
export const MIN_SLOT_HEIGHT = 340;
export const MIN_COMPACT_SLOT_HEIGHT = 300;

/** Solape entre cartas consecutivas para que la pila quepa en MAX_STACK_HEIGHT. */
export function overlapFor(count) {
  if (count <= 1) return 0;
  const maxStep = (MAX_STACK_HEIGHT - BASE_GAP - CARD_HEIGHT) / (count - 1);
  const step = Math.max(MIN_STEP, Math.min(CARD_HEIGHT - 24, maxStep));
  return CARD_HEIGHT - step;
}

export function stepFor(count) {
  return CARD_HEIGHT - overlapFor(count);
}

/** Altura total de una pila medida desde la línea central. */
export function stackHeight(count) {
  if (count === 0) return 0;
  return BASE_GAP + (count - 1) * stepFor(count) + CARD_HEIGHT;
}

/**
 * Altura común para todos los slots del tablero (la etiqueta debe quedar
 * siempre en la misma línea aunque una posición acumule muchas cartas).
 * Recibe NÚMEROS DE CARTAS, no alturas.
 */
export function boardSlotHeightFrom(counts = []) {
  const tallest = counts.reduce((max, count) => Math.max(max, stackHeight(count)), 0);
  return Math.max(MIN_SLOT_HEIGHT, 2 * tallest + 16);
}

/** Altura de un slot aislado (vista de lista). */
export function compactSlotHeight(aboveCount, belowCount) {
  const tallest = Math.max(stackHeight(aboveCount), stackHeight(belowCount));
  return Math.max(MIN_COMPACT_SLOT_HEIGHT, 2 * tallest + 16);
}

/** Posición (px) de la carta `index` respecto a la línea central. */
export function cardDistance(count, index) {
  return BASE_GAP + index * stepFor(count);
}
