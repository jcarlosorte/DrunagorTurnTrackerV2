import { describe, expect, it } from 'vitest';
import { resolveEntityLabel } from '@/utils/entityLabel';

const translations = {
  enemies: { dark_vampire_com: 'Comandante Bane' },
  heroes: { vorn: 'Vorn' },
  runas: { runa1: 'Runa de asalto' },
  cartas_ataque: { nombre: { ataqueC: 'Ataque del comandante' } },
  scenarioCard: { defen1: 'Defensa 1' },
  defensaCard: { nombre: { defen2: 'Defensa 2' } },
};

describe('resolveEntityLabel', () => {
  it('traduce enemigos, héroes y runas', () => {
    expect(resolveEntityLabel({ id: 'dark_vampire_com', translations })).toBe('Comandante Bane');
    expect(resolveEntityLabel({ id: 'vorn', translations })).toBe('Vorn');
    expect(resolveEntityLabel({ id: 'runa1', translations })).toBe('Runa de asalto');
  });

  it('traduce cartas de comandante y de escenario', () => {
    expect(resolveEntityLabel({ id: 'ataqueC', translations })).toBe('Ataque del comandante');
    expect(resolveEntityLabel({ id: 'defen1', translations })).toBe('Defensa 1');
    expect(resolveEntityLabel({ id: 'defen2', translations })).toBe('Defensa 2');
  });

  it('usa el nombre del catálogo cuando no hay traducción', () => {
    expect(resolveEntityLabel({ id: 'carta_x', name: 'Carta X', translations })).toBe('Carta X');
  });

  it('cae al id si no hay nada mejor', () => {
    expect(resolveEntityLabel({ id: 'desconocido', translations })).toBe('desconocido');
    expect(resolveEntityLabel({})).toBe('');
  });
});
