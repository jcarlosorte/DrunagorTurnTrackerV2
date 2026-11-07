const base = {
  expansionId: 'apocalypse_awakenings',
  posicion: 'arriba',
  tipo: 'incursion',
  accion: 'Manifiesta',
  numRunas: 1,
};

const counts = {
  A: [1, 2, 3],
  B: [1, 2, 3],
};

export const INCURSION_DESPERTAR = [
  {
    ...base,
    id: 'incursion_despertar_incansable',
    cara: 'A',
    nombre: 'Incursión Incansable',
    descripcionKey: 'incursion_despertar_incansable_A',
    descripcion: 'Manifiesta 1 runa. Luego, invoca el siguiente número de esbirros adyacente a una Pila de Runas, a elección del líder del grupo, que contenga 1 Runa que coincida con el color de la ficha revelada: 1-2 Héroes: 1 esbirro; 3-4 Héroes: 2 esbirros; 5 Héroes: 3 esbirros. Por último, voltea esta carta.',
    incursion: { counts: { A: [1, 2, 3], B: [0, 1, 2] } },
  },
  {
    ...base,
    id: 'incursion_despertar_incansable',
    cara: 'B',
    nombre: 'Incursión Incansable',
    descripcionKey: 'incursion_despertar_incansable_B',
    descripcion: 'Manifiesta 1 runa. Luego, invoca el siguiente número de esbirros adyacente a una Pila de Runas, a elección del líder del grupo, que contenga 1 Runa que coincida con el color de la ficha revelada: 1-2 Héroes: 0 esbirros; 3-4 Héroes: 1 esbirro; 5 Héroes: 2 esbirros. Por último, voltea esta carta.',
    incursion: { counts: { A: [1, 2, 3], B: [0, 1, 2] } },
  },
  {
    ...base,
    id: 'incursion_despertar_atroz',
    cara: 'A',
    nombre: 'Incursión Atroz',
    descripcionKey: 'incursion_despertar_atroz_A',
    descripcion: 'Chequeo Previo: Si hay Monstruos en el tablero, esta carta no tiene efecto durante este turno. Voltéala. Si lo anterior no se cumple: Manifiesta 1 runa. Luego, invoca un Grupo de Esbirros Incursores adyacente a una Pila de Runas en el tablero, a elección del líder del grupo, que contenga 1 Runa que coincida con el color de la ficha revelada: 1-2 Héroes: 1 esbirro; 3-4 Héroes: 2 esbirros; 5 Héroes: 3 esbirros. Por último, voltea esta carta.',
    incursion: { counts, requiresNoMonsters: true },
  },
  {
    ...base,
    id: 'incursion_despertar_atroz',
    cara: 'B',
    nombre: 'Incursión Atroz',
    descripcionKey: 'incursion_despertar_atroz_B',
    descripcion: 'Manifiesta 1 runa. Luego, invoca un Grupo de Esbirros Incursores adyacente a una Pila de Runas en el tablero, a elección del líder del grupo, que contenga 1 Runa que coincida con el color de la ficha revelada: 1-2 Héroes: 1 esbirro; 3-4 Héroes: 2 esbirros; 5 Héroes: 3 esbirros. Por último, voltea esta carta.',
    incursion: { counts },
  },
  {
    ...base,
    id: 'incursion_despertar_naval',
    cara: 'A',
    nombre: 'Incursión Naval',
    descripcionKey: 'incursion_despertar_naval_A',
    descripcion: 'Manifiesta 1 runa. Luego, invoca un Grupo de Esbirros Cazamareas adyacente al Cañón del Buque Cisne que coincida con el color de la Runa revelada: 1-2 Héroes: 1 Cazamareas; 3-4 Héroes: 2 Cazamareas; 5 Héroes: 3 Cazamareas. (Si se ha manifestado una Runa Azul, el Líder del grupo escoge el Cañón que será el Punto de Generación). Por último, voltea esta carta.',
    incursion: { counts, fixedMonsterId: 'tide_hunter' },
  },
  {
    ...base,
    id: 'incursion_despertar_naval',
    cara: 'B',
    nombre: 'Incursión Naval',
    descripcionKey: 'incursion_despertar_naval_B',
    descripcion: 'Manifiesta 1 runa. Luego, invoca un Grupo de Esbirros Cazamareas adyacente al Cañón del Buque Cisne que coincida con el color de la Runa revelada: 1-2 Héroes: 1 Cazamareas; 3-4 Héroes: 2 Cazamareas; 5 Héroes: 3 Cazamareas. (Si se ha manifestado una Runa Azul, el Líder del grupo escoge el Cañón que será el Punto de Generación). Por último, voltea esta carta.',
    incursion: { counts, fixedMonsterId: 'tide_hunter' },
  },
];

export const ACLARACIONES_INCURSION_DESPERTAR = {
  incursion_despertar_incansable: 'Selecciona previamente el monstruo de escenario. Comprueba las pilas de runas activas y coloca los esbirros adyacentes a una pila con el color manifestado.',
  incursion_despertar_atroz: 'Chequeo previo: si hay Monstruos en el tablero, la carta no tiene efecto este turno y se voltea. Si no, resuelve la invocación.',
  incursion_despertar_naval: 'Invoca siempre Cazamareas (tide_hunter) junto al Cañón del Buque Cisne del color manifestado. Máximo 4 copias o 12 enemigos; pregunta por cada colocación.',
};
