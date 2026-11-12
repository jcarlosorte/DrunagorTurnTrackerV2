import { describe, expect, it } from 'vitest';
import { getAbilityColor, getEnemyTone } from '@/components/track/enemyVisuals';

describe('colores de capacidades de enemigo', () => {
  it('usa verde para EMBATE/ANDANADA/HENDEDURA/ATAQUE DOBLE en todas las reglas', () => {
    expect(getAbilityColor('EMBATE_X')).toContain('emerald');
    expect(getAbilityColor('ANDANADA_X')).toContain('emerald');
    expect(getAbilityColor('HENDEDURA_X')).toContain('emerald');
    expect(getAbilityColor('ATAQUE DOBLE')).toContain('emerald');
    expect(getAbilityColor('HENDEDURA X')).toContain('emerald');
  });

  it('usa morado para SOBREPRESIÓN y CONTROL MENTAL en todas las reglas', () => {
    expect(getAbilityColor('SOBREPRESION')).toContain('violet');
    expect(getAbilityColor('CONTROL MENTAL')).toContain('violet');
  });

  it('mantiene los colores rosa y azul existentes y añade los nuevos', () => {
    expect(getAbilityColor('ESCUDO_X')).toContain('pink');
    expect(getAbilityColor('ESCUDO 2')).toContain('pink');
    expect(getAbilityColor('ESCUDO 0')).toContain('pink');
    expect(getAbilityColor('ESCUDO X-5')).toContain('pink');
    expect(getAbilityColor('ESCUDO X+2')).toContain('pink');
    expect(getAbilityColor('ALIVIAR_X')).toContain('pink');
    expect(getAbilityColor('ENCADENAR')).toContain('pink');
    expect(getAbilityColor('VUDU')).toContain('pink');
    expect(getAbilityColor('GRITO DE GUERRA')).toContain('pink');
    expect(getAbilityColor('SALTO')).toContain('blue');
    expect(getAbilityColor('CARGA')).toContain('blue');
    expect(getAbilityColor('ENJAMBRE')).toContain('blue');
    expect(getAbilityColor('CONTRAATAQUE_X')).toContain('blue');
    expect(getAbilityColor('ASESINAR')).toContain('blue');
    expect(getAbilityColor('ROMPECRANEOS')).toContain('blue');
    expect(getAbilityColor('ARMADURA DE ASALTO')).toContain('blue');
    expect(getAbilityColor('ESTE MONSTRUO SE MUEVE HACIA EL CAÑON TERRORÍFICO MÁS CERCANO Y LO DISPARA')).toContain('blue');
    expect(getAbilityColor('GIGANTE')).toContain('blue');
  });

  it('no colorea capacidades sin color asignado', () => {
    expect(getAbilityColor('FATIGA_X')).toBe('');
    expect(getAbilityColor('')).toBe('');
  });
});

describe('tonos de fondo de enemigos', () => {
  it('asigna el tono por color o por categoría', () => {
    expect(getEnemyTone(undefined, 'overlord')).toBe('#8b5cf6');
    expect(getEnemyTone(undefined, 'comandante')).toBe('#d97706');
    expect(getEnemyTone('blanco')).toBe('#cbd5e1');
    expect(getEnemyTone(undefined, 'desconocido')).toBe('#475569');
  });
});
