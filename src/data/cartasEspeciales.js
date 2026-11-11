export const CARTAS_COMANDANTE = [
  {
    id: 'cmd_1',
    expansionId: 'base',
    nombre: 'cmd_1',
    rune: 'azul',
    runePosition: 'arriba',
    capacidades: 'cmd_1',
    lista_capacidad: ["ESCUDO_X_SI", ";", "DAÑO_X"]
  },
  {
    id: 'cmd_2',
    expansionId: 'base',
    nombre: 'cmd_2',
    rune: 'verde',
    runePosition: 'arriba',
    capacidades: 'cmd_2',
    lista_capacidad: ["DAÑO_X", ",", "NO_PREVENIBLE"]
  },
  {
    id: 'cmd_3',
    expansionId: 'base',
    nombre: 'cmd_3',
    rune: 'gris',
    runePosition: 'arriba',
    capacidades: 'cmd_3',
    lista_capacidad: ["DAÑO_X"]
  },
   {
    id: 'cmd_4',
    expansionId: 'base',
    nombre: 'cmd_4',
    rune: 'gris',
    runePosition: 'abajo',
    capacidades: 'cmd_4',
    lista_capacidad: ["PASIVA", ":", "DAÑO_BASICO_X"]
  },
   {
    id: 'cmd_5',
    expansionId: 'base',
    nombre: 'cmd_5',
    rune: 'rojo',
    runePosition: 'abajo',
    capacidades: 'cmd_5',
    lista_capacidad: ["DAÑO_X", ",", "HEMORRAGIA_X"]
  },
   {
    id: 'cmd_6',
    expansionId: 'base',
    nombre: 'cmd_6',
    rune: 'naranja',
    runePosition: 'arriba',
    capacidades: 'cmd_6',
    lista_capacidad: ["PASIVA", ":", "QUEMADURA_I", ";", "QUEMADURA_X", ",", "LENTITUD"]
  },
  {
    id: 'cmd_7',
    expansionId: 'base',
    nombre: 'cmd_7',
    rune: 'azul',
    runePosition: 'abajo',
    capacidades: 'cmd_7',
    lista_capacidad: ["DAÑO_X", ",", "HEMORRAGIA_X"]
  },
   {
    id: 'cmd_8',
    expansionId: 'base',
    nombre: 'cmd_8',
    rune: 'verde',
    runePosition: 'abajo',
    capacidades: 'cmd_8',
    lista_capacidad: ["SANA_2_X_SI"]
  },
   {
    id: 'cmd_9',
    expansionId: 'base',
    nombre: 'cmd_9',
    rune: 'naranja',
    runePosition: 'abajo',
    capacidades: 'cmd_9',
    lista_capacidad: ["ACTIVA_0", ";", "ACTIVA_5_RUNA"]
  },
   {
    id: 'cmd_10',
    expansionId: 'base',
    nombre: 'cmd_10',
    rune: 'rojo',
    runePosition: 'arriba',
    capacidades: 'cmd_10',
    lista_capacidad: ["DAÑO_2", ",", "INTIMIDAR_X", ",", "FATIGA_X"]
  },

  {
    id: 'cmd_11',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_11',
    rune: 'azul',
    runePosition: 'arriba',
    capacidades: 'cmd_11',
    lista_capacidad: ['ESCUDO_X', ';', 'DAÑO_X', ',', 'LENTITUD'],
    special: 'shieldOverMax',
    shieldOverMax: true,
  },
  {
    id: 'cmd_12',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_12',
    rune: 'azul',
    runePosition: 'abajo',
    capacidades: 'cmd_12',
    lista_capacidad: ['SILENCIO', ';', 'DAÑO_?_X'],
    special: 'promptWisdom',
  },
  {
    id: 'cmd_13',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_13',
    rune: 'naranja',
    runePosition: 'arriba',
    capacidades: 'cmd_13',
    lista_capacidad: ['DAÑO_X', ';', 'QUEMADURA_X'],
    special: 'areaWeakest',
  },
  {
    id: 'cmd_14',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_14',
    rune: 'naranja',
    runePosition: 'abajo',
    capacidades: 'cmd_14',
    lista_capacidad: ['SANA_X_SI', ';', 'QUEMADURA_X'],
    maxHeal: true,
    special: 'burnNotCollateral',
  },
  {
    id: 'cmd_15',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_15',
    rune: 'rojo',
    runePosition: 'arriba',
    capacidades: 'cmd_15',
    lista_capacidad: ['DAÑO_1', ';', 'HEMORRAGIA_1'],
    special: 'separateMissiles',
  },
  {
    id: 'cmd_16',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_16',
    rune: 'rojo',
    runePosition: 'abajo',
    capacidades: 'cmd_16',
    lista_capacidad: ['PIERDE_X', ';', 'ESCUDO_2_X', ';', 'EVOLUCIONA'],
    special: 'loseAndShield',
    shieldOverMax: true,
  },
  {
    id: 'cmd_17',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_17',
    rune: 'verde',
    runePosition: 'arriba',
    capacidades: 'cmd_17',
    lista_capacidad: ['DAÑO_X', ';', 'VENENO_X', ';', 'SANA_X_SI_?'],
    special: 'promptDarkness',
  },
  {
    id: 'cmd_18',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_18',
    rune: 'verde',
    runePosition: 'abajo',
    capacidades: 'cmd_18',
    lista_capacidad: ['PASIVA', ';', 'DAÑO_X'],
    special: 'passiveHealOnDefeat',
  },
  {
    id: 'cmd_19',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_19',
    rune: 'gris',
    runePosition: 'abajo',
    capacidades: 'cmd_19',
    lista_capacidad: ['ROBA_1'],
    special: 'drawCommanderCard',
  },
  {
    id: 'cmd_20',
    expansionId: 'apocalypse_awakenings',
    nombre: 'cmd_20',
    rune: 'gris',
    runePosition: 'arriba',
    capacidades: 'cmd_20',
    lista_capacidad: ['PASIVA', ';', 'FALLO_X'],
    special: 'passiveFailDamage',
  }
];

export const CARTAS_OVERLORD = [
  {
    id: 'over_1',
    nombre: 'over_1',
    rune: 'azul',
    runePosition: 'arriba',
    capacidades: 'over_1',
    lista_capacidad: ["DAÑO_X", ",", "ATURDIMIENTO_X"]
  },
  {
    id: 'over_2',
    nombre: 'over_2',
    rune: 'azul',
    runePosition: 'abajo',
    capacidades: 'over_2',
    lista_capacidad: ["ESCUDO_?_SI", ";", "DAÑO_X"]
  },
  {
    id: 'over_3',
    nombre: 'over_3',
    rune: 'gris',
    runePosition: 'arriba',
    capacidades: 'over_3',
    lista_capacidad: ["DAÑO_2_X", ",", "ATURDIMIENTO_<_4"]
  },
   {
    id: 'over_4',
    nombre: 'over_4',
    rune: 'gris',
    runePosition: 'abajo',
    capacidades: 'over_4',
    lista_capacidad: ["RECUPERA_2_CUBOMALDICION", ";", "ACTIVA_10_SANA"]
  },
   {
    id: 'over_5',
    nombre: 'over_5',
    rune: 'rojo',
    runePosition: 'arriba',
    capacidades: 'over_5',
    lista_capacidad: ["DAÑO_2", ",", "HEMORRAGIA_X", ";", "REPITE_5"]
  },
   {
    id: 'over_6',
    nombre: 'over_6',
    rune: 'rojo',
    runePosition: 'abajo',
    capacidades: 'over_6',
    lista_capacidad: ["DAÑO_X"]
  },
  {
    id: 'over_7',
    nombre: 'over_7',
    rune: 'verde',
    runePosition: 'arriba',
    capacidades: 'over_7',
    lista_capacidad: ["DAÑO_2_X", ",", "HEMORRAGIA_<>_VENENO"]
  },
   {
    id: 'over_8',
    nombre: 'over_8',
    rune: 'verde',
    runePosition: 'abajo',
    capacidades: 'over_8',
    lista_capacidad: ["VENENO_X", ",", "DERRIBO_>_5"]
  },
   {
    id: 'over_9',
    nombre: 'over_9',
    rune: 'naranja',
    runePosition: 'arriba',
    capacidades: 'over_9',
    lista_capacidad: ["QUEMADURA_X", ",", "DERRIBO_>_5"]
  },
   {
    id: 'over_10',
    nombre: 'over_10',
    rune: 'naranja',
    runePosition: 'abajo',
    capacidades: 'over_10',
    lista_capacidad: ["DAÑO_2_X", ",", "HEMORRAGIA_<>_QUEMADURA"]
  },
  {
    id: 'over_11',
    nombre: 'over_11',
    rune: 'rojo',
    runePosition: 'arriba',
    capacidades: 'over_11',
    lista_capacidad: ["SANA_X_SI", ";", "HEMORRAGIA_2", ";", "SANA_X_SI_NO_HEMORRAGIA"]
  },
  {
    id: 'over_12',
    nombre: 'over_12',
    rune: 'rojo',
    runePosition: 'abajo',
    capacidades: 'over_12',
    lista_capacidad: ["ACTIVA_0", ",", "DANO_BASICO_X"]
  },
  {
    id: 'over_13',
    nombre: 'over_13',
    rune: 'gris',
    runePosition: 'arriba',
    capacidades: 'over_13',
    lista_capacidad: ["SANA_X_SI", ";", "EVOLUCIONA"]
  },
  {
    id: 'over_14',
    nombre: 'over_14',
    rune: 'gris',
    runePosition: 'abajo',
    capacidades: 'over_14',
    lista_capacidad: ["ESCUDO_X_SI"]
  },
  {
    id: 'over_15',
    nombre: 'over_15',
    rune: 'azul',
    runePosition: 'abajo',
    capacidades: 'over_15',
    lista_capacidad: ["SILENCIO"]
  },
  {
    id: 'over_16',
    nombre: 'over_16',
    rune: 'azul',
    runePosition: 'arriba',
    capacidades: 'over_16',
    lista_capacidad: ["ESCUDO_POR_CARTA"]
  },
  {
    id: 'over_17',
    nombre: 'over_17',
    rune: 'verde',
    runePosition: 'abajo',
    capacidades: 'over_17',
    lista_capacidad: ["SANA_X_SI", ";", "VENENO_2"]
  },
  {
    id: 'over_18',
    nombre: 'over_18',
    rune: 'verde',
    runePosition: 'arriba',
    capacidades: 'over_18',
    lista_capacidad: ["VENENO_X_ALCANCE_1"]
  },
  {
    id: 'over_19',
    nombre: 'over_19',
    rune: 'naranja',
    runePosition: 'abajo',
    capacidades: 'over_19',
    lista_capacidad: ["SANA_X_SI"]
  },
  {
    id: 'over_20',
    nombre: 'over_20',
    rune: 'naranja',
    runePosition: 'arriba',
    capacidades: 'over_20',
    lista_capacidad: ["ESCUDO_X_SI", ";", "QUEMADURA_2"]
  }
];

const OVERLORD_DECKS = {
  fallen_sisters: [
    'over_11', 'over_12', 'over_13', 'over_14', 'over_15',
    'over_16', 'over_17', 'over_18', 'over_19', 'over_20',
  ],
};

const DEFAULT_OVERLORD_DECK = [
  'over_1', 'over_2', 'over_3', 'over_4', 'over_5',
  'over_6', 'over_7', 'over_8', 'over_9', 'over_10',
];

/** Cartas de acción que corresponden a cada Señor Supremo. */
export function getOverlordDeck(enemyId) {
  const ids = OVERLORD_DECKS[enemyId] || DEFAULT_OVERLORD_DECK;
  return CARTAS_OVERLORD.filter((carta) => ids.includes(carta.id));
}

export const CARTAS_JEFE = [
  {
    id: 'boss_1',
    nombre: 'boss_1',
    rune: 'azul',
    runePosition: 'arriba',
    idJefe: 'undead_king_boss_1',
    capacidades: 'boss_1',
    lista_capacidad: ['CONDICIONES', 'DAÑO_X']
  },
  {
    id: 'boss_2',
    nombre: 'boss_2',
    rune: 'gris',
    runePosition: 'arriba',
    idJefe: 'undead_king_boss_1',
    capacidades: 'boss_2',
    lista_capacidad: ['MALDICION_1', 'DAÑO_X']
  },
  {
    id: 'boss_3',
    nombre: 'boss_3',
    rune: 'rojo',
    runePosition: 'abajo',
    idJefe: 'undead_king_boss_1',
    capacidades: 'boss_3',
    lista_capacidad: ['ACTIVA_E_ESBIRROS']
  },
  {
    id: 'boss_4',
    nombre: 'boss_4',
    rune: 'verde',
    runePosition: 'abajo',
    idJefe: 'undead_king_boss_1',
    capacidades: 'boss_4',
    lista_capacidad: []
  },
  {
    id: 'boss_5',
    nombre: 'boss_5',
    rune: 'naranja',
    runePosition: 'arriba',
    idJefe: 'undead_king_boss_1',
    capacidades: 'boss_5',
    lista_capacidad: ["ROBA_2_noShow", "INVOCA_4_MAX_4", "skeleton_archer_esbirro1", "esbirro"]
  },
  {
    id: 'boss_6',
    nombre: 'boss_6',
    rune: 'azul',
    runePosition: 'abajo',
    idJefe: 'undead_king_boss_2',
    capacidades: 'boss_6',
    lista_capacidad: ['CONDICIONES', 'DAÑO_X', 'MALDICION_1']
  },
  {
    id: 'boss_7',
    nombre: 'boss_7',
    rune: 'rojo',
    runePosition: 'arriba',
    idJefe: 'undead_king_boss_2',
    capacidades: 'boss_7',
    lista_capacidad: ['ACTIVA_E_ESBIRROS', 'ACTIVA_E_CARTA', 'DAÑO_X']
  },
  {
    id: 'boss_8',
    nombre: 'boss_8',
    rune: 'verde',
    runePosition: 'arriba',
    idJefe: 'undead_king_boss_2',
    capacidades: 'boss_8',
    lista_capacidad: ["SANA_CASILLAS"]
  },
  {
    id: 'boss_9',
    nombre: 'boss_9',
    rune: 'gris',
    runePosition: 'abajo',
    idJefe: 'undead_king_boss_2',
    capacidades: 'boss_9',
    lista_capacidad: ["ROBA_2", "INVOCA_4_MAX_4", "skeleton_archer_esbirro2", "esbirro"]
  },
  {
    id: 'boss_10',
    nombre: 'boss_10',
    rune: 'naranja',
    runePosition: 'abajo',
    idJefe: 'undead_king_boss_2',
    capacidades: 'boss_10',
    lista_capacidad: ["PILA"]
  },
  {
    id: 'boss_11',
    nombre: 'boss_11',
    rune: 'azul',
    runePosition: 'arriba',
    idJefe: 'wermunggdir',
    capacidades: 'boss_11',
    lista_capacidad: ["DAÑO_2_X"]
  },
  {
    id: 'boss_12',
    nombre: 'boss_12',
    rune: 'gris',
    runePosition: 'arriba',
    idJefe: 'wermunggdir',
    capacidades: 'boss_12',
    lista_capacidad: ["ROBA_1", "INVOCA_2_MAX_NO", "corrupted_worm_esbirro", "bisoño"]
  },
  {
    id: 'boss_13',
    nombre: 'boss_13',
    rune: 'rojo',
    runePosition: 'arriba',
    idJefe: 'wermunggdir',
    capacidades: 'boss_13',
    lista_capacidad: ['CONDICIONES']
  },
  {
    id: 'boss_14',
    nombre: 'boss_14',
    rune: 'verde',
    runePosition: 'arriba',
    idJefe: 'wermunggdir',
    capacidades: 'boss_14',
    lista_capacidad: ["FATIGA_2", "DAÑO_X", "VENENO_X"]
  },
  {
    id: 'boss_15',
    nombre: 'boss_15',
    rune: 'naranja',
    runePosition: 'arriba',
    idJefe: 'wermunggdir',
    capacidades: 'boss_15',
    lista_capacidad: ["DAÑO_2_X", "DERRIBO"]
  },
  {
    id: 'boss_16',
    nombre: 'boss_16',
    rune: 'azul',
    runePosition: 'arriba',
    idJefe: 'aralhezec',
    capacidades: 'boss_16',
    lista_capacidad: []
  },
  {
    id: 'boss_17',
    nombre: 'boss_17',
    rune: 'gris',
    runePosition: 'arriba',
    idJefe: 'aralhezec',
    capacidades: 'boss_17',
    lista_capacidad: []
  },
  {
    id: 'boss_18',
    nombre: 'boss_18',
    rune: 'rojo',
    runePosition: 'arriba',
    idJefe: 'aralhezec',
    capacidades: 'boss_18',
    lista_capacidad: []
  },
  {
    id: 'boss_19',
    nombre: 'boss_19',
    rune: 'verde',
    runePosition: 'arriba',
    idJefe: 'aralhezec',
    capacidades: 'boss_19',
    lista_capacidad: ['CONDICIONES']
  },
  {
    id: 'boss_20',
    nombre: 'boss_20',
    rune: 'naranja',
    runePosition: 'arriba',
    idJefe: 'aralhezec',
    capacidades: 'boss_20',
    lista_capacidad: []
  },
  {
    id: 'boss_21',
    nombre: 'boss_21',
    rune: 'naranja',
    runePosition: 'abajo',
    idJefe: 'soul_harvester_boss',
    capacidades: 'boss_21',
    lista_capacidad: ['CONDICIONES']
  },
  {
    id: 'boss_22',
    nombre: 'boss_22',
    rune: 'rojo',
    runePosition: 'abajo',
    idJefe: 'soul_harvester_boss',
    capacidades: 'boss_22',
    invoca: 'fallen_woodcutter',
    lista_capacidad: []
  },
  {
    id: 'boss_23',
    nombre: 'boss_23',
    rune: 'verde',
    runePosition: 'arriba',
    idJefe: 'soul_harvester_boss',
    capacidades: 'boss_23',
    lista_capacidad: []
  },
  {
    id: 'boss_24',
    nombre: 'boss_24',
    rune: 'gris',
    runePosition: 'abajo',
    idJefe: 'soul_harvester_boss',
    capacidades: 'boss_24',
    lista_capacidad: []
  },
  {
    id: 'boss_25',
    nombre: 'boss_25',
    rune: 'azul',
    runePosition: 'abajo',
    idJefe: 'soul_harvester_boss',
    capacidades: 'boss_25',
    lista_capacidad: []
  },
  // Mazo del Rey Avivado. Las cartas dobles se colocan por su anverso.
  {
    id: 'boss_26',
    nombre: 'boss_26',
    cara: 'A',
    rune: 'gris',
    runePosition: 'abajo',
    idJefe: 'wakened_king_boss',
    capacidades: 'boss_26_A',
    lista_capacidad: []
  },
  {
    id: 'boss_26',
    nombre: 'boss_26',
    cara: 'B',
    rune: 'gris',
    runePosition: 'abajo',
    idJefe: 'wakened_king_boss',
    capacidades: 'boss_26_B',
    lista_capacidad: []
  },
  {
    id: 'boss_27',
    nombre: 'boss_27',
    cara: 'A',
    rune: 'rojo',
    runePosition: 'abajo',
    idJefe: 'wakened_king_boss',
    capacidades: 'boss_27_A',
    lista_capacidad: []
  },
  {
    id: 'boss_27',
    nombre: 'boss_27',
    cara: 'B',
    rune: 'rojo',
    runePosition: 'abajo',
    idJefe: 'wakened_king_boss',
    capacidades: 'boss_27_B',
    lista_capacidad: []
  },
  {
    id: 'boss_28',
    nombre: 'boss_28',
    cara: 'A',
    rune: 'verde',
    runePosition: 'abajo',
    idJefe: 'wakened_king_boss',
    capacidades: 'boss_28',
    lista_capacidad: []
  },
  {
    id: 'boss_29',
    nombre: 'boss_29',
    cara: 'A',
    rune: 'naranja',
    runePosition: 'arriba',
    idJefe: 'wakened_king_boss',
    capacidades: 'boss_29',
    lista_capacidad: []
  },
  {
    id: 'boss_30',
    nombre: 'boss_30',
    cara: 'A',
    rune: 'azul',
    runePosition: 'arriba',
    idJefe: 'wakened_king_boss',
    capacidades: 'boss_30',
    lista_capacidad: []
  }
];

export const CARTAS_HEROE_CAIDO = [
  {
    id: 'fallen_1',
    nombre: 'fallen_1',
    rune: 'naranja',
    runePosition: 'arriba',
    capacidades: 'fallen_1',
    lista_capacidad: ["MANIFIESTA", ",", "TIEMPO_1"]
  },
  {
    id: 'fallen_2',
    nombre: 'fallen_2',
    rune: 'naranja',
    runePosition: 'abajo',
    capacidades: 'fallen_2',
    lista_capacidad: ["DAÑO_X", ",", "SANA_2_X_?"]
  }
];

export const ALDEANO = [
  {
    id: 'aldeano_1',
    nombre: 'aldeano_1',
    accion: 'aldeano_1',
    texto: 'aldeano_1'
  },
  {
    id: 'aldeano_2',
    nombre: 'aldeano_2',
    accion: 'aldeano_2',
    texto: 'aldeano_2'
  },
  {
    id: 'aldeano_3',
    nombre: 'aldeano_3',
    accion: 'aldeano_3',
    texto: 'aldeano_3'
  },
  {
    id: 'aldeano_4',
    nombre: 'aldeano_4',
    accion: 'aldeano_4',
    texto: 'aldeano_4'
  },
  {
    id: 'aldeano_5',
    nombre: 'aldeano_5',
    accion: 'aldeano_5',
    texto: 'aldeano_5'
  },
  {
    id: 'aldeano_6',
    nombre: 'aldeano_6',
    accion: 'aldeano_6',
    texto: 'aldeano_6'
  }
];

export const ERRANTES = [
  {
    id: 'errantes_1',
    nombre: 'errantes_1',
    accion: 'errantes_1',
    texto: {
      1: 'errantes_11',
      2: 'errantes_12',
      3: 'errantes_13',
      4: 'errantes_14',
      5: 'errantes_15'
    }
  },
  {
    id: 'errantes_2',
    nombre: 'errantes_2',
    accion: 'errantes_2',
    texto: {
      1: 'errantes_21',
      2: 'errantes_22',
      3: 'errantes_23',
      4: 'errantes_24',
      5: 'errantes_25'
    }
  },
  {
    id: 'errantes_3',
    nombre: 'errantes_3',
    accion: 'errantes_3',
    texto: {
      1: 'errantes_31',
      2: 'errantes_32',
      3: 'errantes_33',
      4: 'errantes_34',
      5: 'errantes_35'
    }
  },
  {
    id: 'errantes_4',
    nombre: 'errantes_4',
    accion: 'errantes_4',
    texto: {
      1: 'errantes_41',
      2: 'errantes_42',
      3: 'errantes_43',
      4: 'errantes_44',
      5: 'errantes_45'
    }
  },
  {
    id: 'errantes_5',
    nombre: 'errantes_5',
    accion: 'errantes_5',
    texto: {
      1: 'errantes_51',
      3: 'errantes_52',
      5: 'errantes_53'
    },
    textoPorRango: [
      { rango: [1, 2], texto: 'errantes_5_1' },
      { rango: [3, 4], texto: 'errantes_5_2' },
      { rango: [5, 5], texto: 'errantes_5_3' }
    ]
  },
  {
    id: 'errantes_6',
    nombre: 'errantes_6',
    accion: 'errantes_6',
    texto: {
      1: 'errantes_61',
      3: 'errantes_62',
      5: 'errantes_63'
    },
    textoPorRango: [
      { rango: [1, 2], texto: 'errantes_6_1' },
      { rango: [3, 4], texto: 'errantes_6_1' },
      { rango: [5, 5], texto: 'errantes_6_1' }
    ]
  }
];
export const SORPRESA = [
  {
    id: 'sorpresa_1',
    nombre: 'sorpresa_1',
    texto: 'sorpresa_1'
  },
  {
    id: 'sorpresa_2',
    nombre: 'sorpresa_2',
    texto: 'sorpresa_2'
  },
  {
    id: 'sorpresa_3',
    nombre: 'sorpresa_3',
    texto: 'sorpresa_3'
  },
  {
    id: 'sorpresa_4',
    nombre: 'sorpresa_4',
    texto: 'sorpresa_4'
  },
  {
    id: 'sorpresa_5',
    nombre: 'sorpresa_5',
    texto: 'sorpresa_5'
  }
];
export const CARTAS_GUSANO = [
  {
    id: 'boss_w_1',
    rune: 'naranja',
    runePosition: 'arriba',
    nombre: 'boss_w_1',
    texto: 'boss_w_1',
    lista_capacidad: []
  },
  {
    id: 'boss_w_2',
    rune: 'azul',
    runePosition: 'arriba',
    nombre: 'boss_w_2',
    texto: 'boss_w_2',
    lista_capacidad: []
  },
  {
    id: 'boss_w_3',
    rune: 'gris',
    runePosition: 'arriba',
    nombre: 'boss_w_3',
    texto: 'boss_w_3',
    lista_capacidad: ["ROBA_1", "INVOCA_2", "corrupted_worm", "bisoño", "vida_3"]
  },
  {
    id: 'boss_w_4',
    rune: 'verde',
    runePosition: 'arriba',
    nombre: 'boss_w_4',
    texto: 'boss_w_4',
    lista_capacidad: []
  },
  {
    id: 'boss_w_5',
    rune: 'rojo',
    runePosition: 'arriba',
    nombre: 'boss_w_5',
    texto: 'boss_w_5',
    lista_capacidad: ["CONDICIONES"]
  }
];

export const ASALTO_GUSANO = [
  {
    id: 'asalto_w_1',
    rune: 'naranja',
    nombre: 'asalto_w_1',
    texto: 'asalto_w_1',
    lista_capacidad: []
  },
  {
    id: 'asalto_w_2',
    rune: 'verde',
    nombre: 'asalto_w_2',
    texto: 'asalto_w_2',
    lista_capacidad: []
  },
  {
    id: 'asalto_w_3',
    rune: 'azul',
    nombre: 'asalto_w_3',
    texto: 'asalto_w_3',
    lista_capacidad: ["ROBA_1"]
  },
  {
    id: 'asalto_w_4',
    rune: 'rojo',
    nombre: 'asalto_w_4',
    texto: 'asalto_w_4',
    lista_capacidad: []
  },
  {
    id: 'asalto_w_5',
    rune: 'gris',
    nombre: 'asalto_w_5',
    texto: 'asalto_w_5',
    lista_capacidad: ["INVOCA_X", "corrupted_worm", "bisoño"]
  }
];

export const ACECHO = [
  {
    id: 'acecho_1',
    rune: 'naranja',
    nombre: 'acecho_1',
    texto: 'acecho_1',
    lista_capacidad: ["QUEMADURA_X"]
  },
  {
    id: 'acecho_2',
    rune: 'verde',
    nombre: 'acecho_2',
    texto: 'acecho_2',
    lista_capacidad: ["VENENO_X"]
  },
  {
    id: 'acecho_3',
    rune: 'azul',
    nombre: 'acecho_3',
    texto: 'acecho_3',
    lista_capacidad: ["ESCUDO_X"]
  },
  {
    id: 'acecho_4',
    rune: 'rojo',
    nombre: 'acecho_4',
    texto: 'acecho_4',
    lista_capacidad: ["HEMORRAGIA_X"]
  },
  {
    id: 'acecho_5',
    rune: 'gris',
    nombre: 'acecho_5',
    texto: 'acecho_5',
    lista_capacidad: ["INTIMIDAR_X"]
  }
];

export const IRA = [
  {
    id: 'ira_1',
    rune: 'naranja',
    nombre: 'ira_1',
    texto: 'ira_1',
    lista_capacidad: ["QUEMADURA_X"]
  },
  {
    id: 'ira_2',
    rune: 'verde',
    nombre: 'ira_2',
    texto: 'ira_2',
    lista_capacidad: ["VENENO_X"]
  },
  {
    id: 'ira_3',
    rune: 'azul',
    nombre: 'ira_3',
    texto: 'ira_3',
    lista_capacidad: ["ESCUDO_X"]
  },
  {
    id: 'ira_4',
    rune: 'rojo',
    nombre: 'ira_4',
    texto: 'ira_4',
    lista_capacidad: ["HEMORRAGIA_X"]
  },
  {
    id: 'ira_5',
    rune: 'gris',
    nombre: 'ira_5',
    texto: 'ira_5',
    lista_capacidad: ["INTIMIDAR_X"]
  }
];
