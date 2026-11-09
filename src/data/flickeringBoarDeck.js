const CARD_BLUEPRINTS = [
  { suffix: 1, kind: 'forward', fury: false },
  { suffix: 2, kind: 'forward', fury: true },
  { suffix: 3, kind: 'rest', fury: false },
  { suffix: 4, kind: 'rest', fury: true },
  { suffix: 5, kind: 'west', fury: false },
  { suffix: 6, kind: 'west', fury: true },
  { suffix: 7, kind: 'east', fury: false },
  { suffix: 8, kind: 'east', fury: true },
];

const TITLE_KEYS = {
  forward: 'boarForward',
  rest: 'boarRest',
  west: 'boarWest',
  east: 'boarEast',
};

export const FLICKERING_BOAR_CARDS = CARD_BLUEPRINTS.map(({ suffix, kind, fury }) => ({
  id: `flickering_boar_${kind}_${suffix}`,
  number: suffix,
  kind,
  fury,
  titleKey: TITLE_KEYS[kind],
  textKey: `boar${kind.charAt(0).toUpperCase()}${kind.slice(1)}Text`,
}));

export const FLICKERING_BOAR_CARD_IDS = FLICKERING_BOAR_CARDS.map((card) => card.id);

export default FLICKERING_BOAR_CARDS;
