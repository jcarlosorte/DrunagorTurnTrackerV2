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
];

/** Roles disponibles según las expansiones activas. */
export function getRolesForExpansions(expansionIds = []) {
  if (!Array.isArray(expansionIds) || expansionIds.length === 0) return [];
  const selected = new Set(expansionIds);
  return ROLES.filter((role) => selected.has(role.expansionId));
}

/** Roles que comparten posición y se excluyen entre sí. */
export const OPPOSITE_ROLES = {
  asistente: 'apoyo',
  apoyo: 'asistente',
};

