import { describe, expect, it } from 'vitest';
import { getAbilityColor, getEnemyTone } from '@/components/track/enemyVisuals';

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

describe('tonos de fondo de enemigos', () => {
  it('asigna el tono por color o por categoría', () => {
    expect(getEnemyTone(undefined, 'overlord')).toBe('#a855f7');
    expect(getEnemyTone(undefined, 'comandante')).toBe('#f59e0b');
    expect(getEnemyTone('blanco')).toBe('#cbd5e1');
    expect(getEnemyTone(undefined, 'desconocido')).toBe('#475569');
  });
});
