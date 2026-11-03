import { describe, expect, it } from 'vitest';
import { getAbilityColor } from '@/components/track/enemyVisuals';

describe('colores de capacidades de enemigo', () => {
  it('usa verde para EMBATE/ANDANADA y morado para SOBREPRESIÓN solo en 2.0', () => {
    expect(getAbilityColor('EMBATE_X', '2.0')).toContain('emerald');
    expect(getAbilityColor('ANDANADA_X', '2.0')).toContain('emerald');
    expect(getAbilityColor('SOBREPRESION', '2.0')).toContain('violet');
    expect(getAbilityColor('EMBATE_X', '1.5')).toBe('');
    expect(getAbilityColor('SOBREPRESION', '1.5')).toBe('');
  });

  it('mantiene los colores rosa y azul existentes', () => {
    expect(getAbilityColor('ESCUDO_X', '1.5')).toContain('pink');
    expect(getAbilityColor('SALTO', '1.5')).toContain('blue');
  });
});
