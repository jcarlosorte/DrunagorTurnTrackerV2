import { CARTAS_COMANDANTE } from '@/data/cartasEspeciales';

export const COMMANDER_COLORS = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
export const COMMANDER_POSITIONS = ['arriba', 'abajo'];

export const getCommanderDeckForExpansion = (expansionId) => CARTAS_COMANDANTE.filter((card) => (
  expansionId === 'apocalypse_awakenings'
    ? card.expansionId === 'apocalypse_awakenings'
    : card.expansionId === 'base'
));

export const getCommanderSlotCards = (color, position) => CARTAS_COMANDANTE.filter(
  (card) => card.rune === color && card.runePosition === position,
);

export function isCommanderDeckValid(deck) {
  if (!Array.isArray(deck) || deck.length !== 10) return false;
  const slots = new Set(deck.map((card) => `${card.rune}_${card.runePosition}`));
  return slots.size === 10
    && COMMANDER_COLORS.every((color) => (
      COMMANDER_POSITIONS.every((position) => slots.has(`${color}_${position}`))
    ));
}

export function generateRandomCommanderDeck(random = Math.random) {
  return COMMANDER_COLORS.flatMap((color) => COMMANDER_POSITIONS.map((position) => {
    const options = getCommanderSlotCards(color, position);
    return options[Math.floor(random() * options.length)];
  })).filter(Boolean);
}

export function buildCommanderDeckFromSelection(selection = {}) {
  return COMMANDER_COLORS.flatMap((color) => COMMANDER_POSITIONS.map((position) => (
    CARTAS_COMANDANTE.find((card) => card.id === selection[`${color}_${position}`])
  ))).filter(Boolean);
}
