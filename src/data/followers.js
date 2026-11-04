// Seguidores de la caja Despertar. Sus imágenes quedan pendientes.
export const FOLLOWERS = [
  {
    id: 'elros_asesino',
    name: 'Elros',
    epithet: 'el Asesino',
    role: 'lider',
    expansionId: 'apocalypse_awakenings',
    attackType: 'cuerpo',
    capabilities: ['VENENO 2'],
    states: [
      { id: 'energico', name: 'Enérgico', ataque: 3, movimiento: 4, vida: 5 },
      { id: 'desanimado', name: 'Desanimado', ataque: 1, movimiento: 3, vida: 5 },
    ],
  },
  {
    id: 'vorn_guerrero',
    name: 'Vorn',
    epithet: 'el Guerrero',
    role: 'defensor',
    expansionId: 'apocalypse_awakenings',
    attackType: 'cuerpo',
    capabilities: ['HENDEDURA 2'],
    states: [
      { id: 'animado', name: 'Animado', ataque: 3, movimiento: 4, vida: 5 },
      { id: 'sediento', name: 'Sediento', ataque: 2, movimiento: 3, vida: 5 },
    ],
  },
  {
    id: 'minerva_renacida',
    name: 'Minerva',
    epithet: 'Maestra Renacida',
    role: 'lider',
    expansionId: 'apocalypse_awakenings',
    attackType: 'cuerpo',
    capabilities: ['HENDEDURA 2'],
    states: [
      { id: 'normal', name: 'Normal', ataque: 5, movimiento: 5, vida: 7 },
    ],
  },
  {
    id: 'jaheen_clerigo',
    name: 'Jaheen',
    epithet: 'el Clérigo',
    role: 'apoyo',
    expansionId: 'apocalypse_awakenings',
    attackType: 'cuerpo',
    capabilities: ['ALCANCE 1', 'ESCUDO 2'],
    states: [
      { id: 'esperanzado', name: 'Esperanzado', ataque: 3, movimiento: 4, vida: 6 },
      { id: 'desesperado', name: 'Desesperado', ataque: 2, movimiento: 3, vida: 4 },
    ],
  },
  {
    id: 'maya_montaraz',
    name: 'Maya',
    epithet: 'la Montaraz',
    role: 'agresor',
    expansionId: 'apocalypse_awakenings',
    attackType: 'distancia',
    capabilities: ['ATAQUE DOBLE'],
    states: [
      { id: 'alerta', name: 'Alerta', ataque: 3, movimiento: 5, vida: 5 },
      { id: 'tranquila', name: 'Tranquila', ataque: 2, movimiento: 4, vida: 5 },
    ],
  },
  {
    id: 'lorelai_maga',
    name: 'Lorelai',
    epithet: 'la Maga',
    role: 'controlador',
    expansionId: 'apocalypse_awakenings',
    attackType: 'distancia',
    capabilities: ['LENTITUD'],
    states: [
      { id: 'tenaz', name: 'Tenaz', ataque: 3, movimiento: 4, vida: 5 },
      { id: 'agotada', name: 'Agotada', ataque: 2, movimiento: 4, vida: 5 },
    ],
  },
];

export function getFollower(id) {
  return FOLLOWERS.find((follower) => follower.id === id) || null;
}

export function getFollowerState(followerId, stateId) {
  const follower = getFollower(followerId);
  if (!follower) return null;
  return follower.states.find((state) => state.id === stateId) || follower.states[0];
}
