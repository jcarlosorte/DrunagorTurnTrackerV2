import { describe, expect, it } from 'vitest';
import { appendGenerationPoint } from '@/utils/generationPoints';

describe('fichas de generación', () => {
  it('solo permite una ficha por color', () => {
    const first = appendGenerationPoint([], 'naranja', 'a');
    expect(first).toHaveLength(1);
    expect(appendGenerationPoint(first, 'naranja', 'b')).toBe(first);
    expect(appendGenerationPoint(first, 'verde', 'c')).toHaveLength(2);
    const withBlue = appendGenerationPoint(first, 'azul', 'd');
    expect(withBlue).toHaveLength(2);
    expect(withBlue.find((point) => point.color === 'azul')).toBeTruthy();
  });
});
