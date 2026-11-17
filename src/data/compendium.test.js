import { describe, expect, it } from 'vitest';
import {
  COMPENDIUM_ENTRIES,
  normalizeCompendiumText,
  searchCompendium,
} from '@/data/compendium';

describe('compendio', () => {
  it('incluye el glosario completo con descripciones en ambos idiomas', () => {
    expect(COMPENDIUM_ENTRIES.length).toBeGreaterThan(150);
    for (const entry of COMPENDIUM_ENTRIES) {
      expect(entry.term.es, entry.key).toBeTruthy();
      expect(entry.term.en, entry.key).toBeTruthy();
      expect(entry.description.es, entry.key).toBeTruthy();
      expect(entry.description.en, entry.key).toBeTruthy();
    }
  });

  it('normaliza mayúsculas, tildes y separadores', () => {
    expect(normalizeCompendiumText('  ATURDIMIENTO  ')).toBe('aturdimiento');
    expect(normalizeCompendiumText('Cubos_de_Maldición')).toBe('cubos de maldicion');
  });

  it('encuentra por nombre, alias y descripción', () => {
    const byName = searchCompendium(COMPENDIUM_ENTRIES, { query: 'aturdimiento' });
    expect(byName[0]?.key).toBe('ATURDIMIENTO');

    const byDescription = searchCompendium(COMPENDIUM_ENTRIES, { query: 'condición redundante' });
    expect(byDescription.length).toBeGreaterThan(0);

    const byAlias = searchCompendium(COMPENDIUM_ENTRIES, { query: 'stun', language: 'en' });
    expect(byAlias.some((entry) => entry.key === 'ATURDIMIENTO')).toBe(true);
  });

  it('filtra por categoría y por términos con icono', () => {
    const conditions = searchCompendium(COMPENDIUM_ENTRIES, { category: 'conditions' });
    expect(conditions.length).toBeGreaterThan(10);
    expect(conditions.every((entry) => entry.category === 'conditions')).toBe(true);

    const withIcon = searchCompendium(COMPENDIUM_ENTRIES, { onlyWithIcon: true });
    expect(withIcon.length).toBeGreaterThan(10);
    expect(withIcon.every((entry) => Boolean(entry.icon))).toBe(true);
  });

  it('no deja etiquetas con viñetas ni claves técnicas', () => {
    for (const entry of COMPENDIUM_ENTRIES) {
      expect(entry.term.es.startsWith('•'), entry.key).toBe(false);
      expect(entry.term.en.startsWith('•'), entry.key).toBe(false);
      expect(entry.term.es.includes('_'), entry.key).toBe(false);
    }
  });
});
