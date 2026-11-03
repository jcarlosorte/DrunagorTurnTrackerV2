import { describe, expect, it } from 'vitest';
import { OPPOSITE_ROLES, getRolesForExpansions } from '@/data/roles';

describe('getRolesForExpansions', () => {
  it('sin expansiones exclusivas no ofrece Asistente ni Lanza Dados', () => {
    const roles = getRolesForExpansions(['base']).map((role) => role.id);
    expect(roles).toHaveLength(5);
    expect(roles).not.toContain('asistente');
    expect(roles).not.toContain('lanza_dados');
  });

  it('GenCon Exclusive añade Asistente', () => {
    const roles = getRolesForExpansions(['base', 'gencon']).map((role) => role.id);
    expect(roles).toHaveLength(6);
    expect(roles).toContain('asistente');
    expect(roles).not.toContain('lanza_dados');
  });

  it('Dice Tower Exclusive añade Lanza Dados', () => {
    const roles = getRolesForExpansions(['base', 'dicetower']).map((role) => role.id);
    expect(roles).toHaveLength(6);
    expect(roles).toContain('lanza_dados');
    expect(roles).not.toContain('asistente');
  });

  it('con las dos expansiones hay siete roles', () => {
    const roles = getRolesForExpansions(['base', 'gencon', 'dicetower']).map((role) => role.id);
    expect(roles).toHaveLength(7);
    expect(roles).toContain('asistente');
    expect(roles).toContain('lanza_dados');
  });

  it('Asistente/Apoyo y Lanza Dados/Líder se excluyen entre sí', () => {
    expect(OPPOSITE_ROLES.asistente).toBe('apoyo');
    expect(OPPOSITE_ROLES.apoyo).toBe('asistente');
    expect(OPPOSITE_ROLES.lanza_dados).toBe('lider');
    expect(OPPOSITE_ROLES.lider).toBe('lanza_dados');
  });
});
