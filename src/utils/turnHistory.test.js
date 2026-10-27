import { describe, expect, it } from 'vitest';
import { popEntry, pushEntry } from '@/utils/turnHistory';

describe('turnHistory', () => {
  it('apila y desapila en orden LIFO', () => {
    const stack = [];
    pushEntry(stack, { turn: 1 });
    pushEntry(stack, { turn: 2 });
    expect(popEntry(stack)).toEqual({ turn: 2 });
    expect(popEntry(stack)).toEqual({ turn: 1 });
    expect(popEntry(stack)).toBeNull();
  });

  it('respeta el límite descartando lo más antiguo', () => {
    const stack = [];
    for (let i = 0; i < 15; i += 1) pushEntry(stack, { turn: i }, 10);
    expect(stack).toHaveLength(10);
    expect(stack[0]).toEqual({ turn: 5 });
    expect(popEntry(stack)).toEqual({ turn: 14 });
  });

  it('tolera entradas y pilas inválidas', () => {
    expect(popEntry(null)).toBeNull();
    expect(popEntry([])).toBeNull();
    expect(pushEntry(null, {})).toBe(0);
    expect(popEntry([undefined])).toBeNull();
  });
});
