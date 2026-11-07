import { describe, expect, it } from 'vitest';
import { appendGenerationPoint } from '@/utils/generationPoints';

describe('fichas de generación', () => {
  it('solo permite una ficha por color', () => {
    const first = appendGenerationPoint([], 'naranja', 'a');
    expect(first).toHaveLength(1);
    expect(appendGenerationPoint(first, 'naranja', 'b')).toBe(first);
    expect(appendGenerationPoint(first, 'azul', 'c')).toHaveLength(2);
  });
});
