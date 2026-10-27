import { describe, expect, it } from 'vitest';
import { classifyScenarioToast } from '@/utils/toastKind';

describe('classifyScenarioToast', () => {
  it('detecta muertes', () => {
    expect(classifyScenarioToast('☠ El enemigo muere').kind).toBe('death');
  });

  it('detecta daño', () => {
    expect(classifyScenarioToast('inflige 3 de daño')).toBeTruthy();
    expect(classifyScenarioToast('🌀 Jaheen: quemadura inflige 2 de daño').kind).toBe('damage');
  });

  it('detecta estados alterados', () => {
    expect(classifyScenarioToast('🌀 veneno aparece').kind).toBe('status');
  });

  it('detecta invocaciones', () => {
    expect(classifyScenarioToast('Aparece Arquero Esqueleto (Blanco)').kind).toBe('summon');
  });

  it('detecta runas y rondas', () => {
    expect(classifyScenarioToast('Roba Naranja · II').kind).toBe('rune');
    expect(classifyScenarioToast('🔁 Nueva Ronda: 3').kind).toBe('round');
  });

  it('usa el tipo por defecto para textos neutros', () => {
    expect(classifyScenarioToast('Anotación cualquiera').kind).toBe('event');
    expect(classifyScenarioToast('').kind).toBe('event');
  });
});
