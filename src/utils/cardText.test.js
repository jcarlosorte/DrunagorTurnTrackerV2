import { describe, expect, it } from 'vitest';
import { formatCardText } from '@/utils/cardText';

describe('texto de cartas de comandante', () => {
  it('sustituye X y las palabras del glosario sin dejar corchetes', () => {
    const result = formatCardText('{X} {DAÑO} y {2*X} {ESCUDO}', {
      x: 3,
      ttr: { 'DAÑO': 'Daño', 'ESCUDO': 'Escudo' },
    });
    expect(result).toBe('3 Daño y 6 Escudo');
  });

  it('sustituye el número de héroes', () => {
    expect(formatCardText('{X_H} héroes', { heroes: 4 })).toBe('4 héroes');
  });
});
