/**
 * Baraja de evento «Asedio de Limiternia».
 * Las cartas se roban en orden 1–10 y cada efecto indica los monstruos que
 * aparecen sobre fichas de generación concretas.
 */
export const SIEGE_CARDS = [
  {
    number: 1,
    titleKey: 'siegeCard1Title',
    textKey: 'siegeCard1Text',
    spawns: [{ enemyId: 'violent_bully', color: 'azul' }],
  },
  {
    number: 2,
    titleKey: 'siegeCard2Title',
    textKey: 'siegeCard2Text',
    spawns: [
      { enemyId: 'tangled_witch', color: 'rojo', minHeroes: 1 },
      { enemyId: 'infamous_monster', color: 'verde', minHeroes: 2 },
      { enemyId: 'tangled_witch', color: 'azul', minHeroes: 3 },
      { enemyId: 'infamous_monster', color: 'gris', minHeroes: 4 },
      { enemyId: 'tangled_witch', color: 'naranja', minHeroes: 5 },
    ],
  },
  {
    number: 3,
    titleKey: 'siegeCard3Title',
    textKey: 'siegeCard3Text',
    spawns: [
      { enemyId: 'violent_bully', color: 'verde', minHeroes: 1 },
      { enemyId: 'violent_bully', color: 'gris', minHeroes: 3 },
    ],
    concentration: 2,
  },
  {
    number: 4,
    titleKey: 'siegeCard4Title',
    textKey: 'siegeCard4Text',
    spawns: [
      { enemyId: 'infamous_monster', color: 'verde', minHeroes: 1 },
      { enemyId: 'tangled_witch', color: 'rojo', minHeroes: 2 },
      { enemyId: 'infamous_monster', color: 'azul', minHeroes: 3 },
      { enemyId: 'tangled_witch', color: 'gris', minHeroes: 4 },
      { enemyId: 'infamous_monster', color: 'naranja', minHeroes: 5 },
    ],
  },
  {
    number: 5,
    titleKey: 'siegeCard5Title',
    textKey: 'siegeCard5Text',
    spawns: [
      { enemyId: 'violent_bully', color: 'naranja', minHeroes: 1 },
      { enemyId: 'violent_bully', color: 'rojo', minHeroes: 3 },
    ],
    traps: 2,
  },
  {
    number: 6,
    titleKey: 'siegeCard6Title',
    textKey: 'siegeCard6Text',
    adventureEnd: true,
  },
  {
    number: 7,
    titleKey: 'siegeCard7Title',
    textKey: 'siegeCard7Text',
    spawns: [
      { enemyId: 'infamous_monster', color: 'verde', minHeroes: 1 },
      { enemyId: 'tangled_witch', color: 'rojo', minHeroes: 2 },
      { enemyId: 'infamous_monster', color: 'azul', minHeroes: 3 },
      { enemyId: 'tangled_witch', color: 'gris', minHeroes: 4 },
      { enemyId: 'infamous_monster', color: 'naranja', minHeroes: 5 },
    ],
    activateViolent: true,
  },
  {
    number: 8,
    titleKey: 'siegeCard8Title',
    textKey: 'siegeCard8Text',
    spawns: [
      { enemyId: 'infamous_monster', color: 'azul', minHeroes: 1 },
      { enemyId: 'tangled_witch', color: 'gris', minHeroes: 2 },
      { enemyId: 'infamous_monster', color: 'naranja', minHeroes: 3 },
      { enemyId: 'tangled_witch', color: 'verde', minHeroes: 4 },
      { enemyId: 'infamous_monster', color: 'rojo', minHeroes: 5 },
    ],
  },
  {
    number: 9,
    titleKey: 'siegeCard9Title',
    textKey: 'siegeCard9Text',
    spawns: [
      { enemyId: 'violent_bully', color: 'verde', minHeroes: 1 },
      { enemyId: 'violent_bully', color: 'rojo', minHeroes: 3 },
    ],
    traps: 2,
  },
  {
    number: 10,
    titleKey: 'siegeCard10Title',
    textKey: 'siegeCard10Text',
    spawns: [
      { enemyId: 'tangled_witch', color: 'naranja', minHeroes: 1 },
      { enemyId: 'infamous_monster', color: 'gris', minHeroes: 2 },
      { enemyId: 'tangled_witch', color: 'rojo', minHeroes: 3 },
      { enemyId: 'infamous_monster', color: 'azul', minHeroes: 4 },
      { enemyId: 'tangled_witch', color: 'verde', minHeroes: 5 },
    ],
  },
];

export const SIEGE_CARD_IDS = SIEGE_CARDS.map((card) => card.number);

export default SIEGE_CARDS;
