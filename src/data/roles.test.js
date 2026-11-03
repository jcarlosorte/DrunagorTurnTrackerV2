import { describe, expect, it } from 'vitest';
import { OPPOSITE_ROLES, getRolesForExpansions } from '@/data/roles';

describe('getRolesForExpansions', () => {
  it('sin GenCon Exclusive no ofrece Asistente', () => {
    const roles = getRolesForExpansions(['base']).map((role) => role.id);
    expect(roles).toHaveLength(5);
    expect(roles).not.toContain('asistente');
  });

  it('con GenCon Exclusive añade Asistente', () => {
    const roles = getRolesForExpansions(['base', 'gencon']).map((role) => role.id);
    expect(roles).toHaveLength(6);
    expect(roles).toContain('asistente');
  });

  it('Asistente y Apoyo se excluyen entre sí', () => {
    expect(OPPOSITE_ROLES.asistente).toBe('apoyo');
    expect(OPPOSITE_ROLES.apoyo).toBe('asistente');
  });
});
