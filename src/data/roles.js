// src/data/roles.js
export const ROLES = [
  {
    id: 'controlador',
    expansionId: 'base',
  },
  {
    id: 'defensor',
    expansionId: 'base',
  },
  {
    id: 'lider',
    expansionId: 'base',
  },
  {
    id: 'agresor',
    expansionId: 'base',
  },
  {
    id: 'apoyo',
    expansionId: 'base',
  },
  {
    id: 'asistente',
    expansionId: 'gencon',
  },
  {
    id: 'lanza_dados',
    expansionId: 'dicetower',
  },
  {
    id: 'sanador',
    expansionId: 'apocalypse_awakenings',
    replaces: 'apoyo',
  },
  {
    id: 'maton',
    expansionId: 'apocalypse_awakenings',
    replaces: 'defensor',
  },
  {
    id: 'asesino',
    expansionId: 'apocalypse_awakenings',
    replaces: 'agresor',
  },
  {
    id: 'embaucador',
    expansionId: 'apocalypse_awakenings',
    replaces: 'controlador',
  },
  {
    id: 'guardian',
    expansionId: 'apocalypse_awakenings',
    replaces: 'lider',
  },
];

/** Roles disponibles según las expansiones activas. */
export function getRolesForExpansions(expansionIds = []) {
  if (!Array.isArray(expansionIds) || expansionIds.length === 0) return [];
  const selected = new Set(expansionIds);
  return ROLES.filter((role) => selected.has(role.expansionId));
}

/** Roles que comparten posición y se excluyen entre sí. */
export const ROLE_POSITIONS = {
  defensor: 0,
  maton: 0,
  apoyo: 2,
  asistente: 2,
  sanador: 2,
  lider: 4,
  lanza_dados: 4,
  guardian: 4,
  agresor: 6,
  asesino: 6,
  controlador: 8,
  embaucador: 8,
};

/** Roles cuyo héroe se coloca en la línea superior. */
export const ROLES_ON_TOP = ['defensor', 'maton', 'lider', 'lanza_dados', 'guardian', 'controlador', 'embaucador'];
/** Roles cuyo héroe se coloca en la línea inferior. */
export const ROLES_ON_BOTTOM = ['apoyo', 'asistente', 'sanador', 'agresor', 'asesino'];

/** Línea del track en la que se coloca el héroe de un rol. */
export function getRoleSide(role) {
  if (ROLES_ON_TOP.includes(role)) return 'arriba';
  if (ROLES_ON_BOTTOM.includes(role)) return 'abajo';
  return null;
}

/** Línea del track en la que se coloca un seguidor de ese rol (la contraria). */
export function getFollowerSide(role) {
  const side = getRoleSide(role);
  if (!side) return null;
  return side === 'arriba' ? 'abajo' : 'arriba';
}

/** Roles que comparten posición y se excluyen entre sí. */
export const OPPOSITE_ROLES = {
  apoyo: ['asistente', 'sanador'],
  asistente: ['apoyo', 'sanador'],
  sanador: ['apoyo', 'asistente'],
  defensor: ['maton'],
  maton: ['defensor'],
  agresor: ['asesino'],
  asesino: ['agresor'],
  controlador: ['embaucador'],
  embaucador: ['controlador'],
  lider: ['lanza_dados', 'guardian'],
  lanza_dados: ['lider', 'guardian'],
  guardian: ['lider', 'lanza_dados'],
};

