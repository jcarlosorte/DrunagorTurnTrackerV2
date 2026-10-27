import { describe, expect, it } from 'vitest';
import { TURN_WARNING_SECONDS, formatClock, isOverWarning } from '@/utils/turnTimer';

describe('formatClock', () => {
  it('formatea segundos como mm:ss', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(9)).toBe('00:09');
    expect(formatClock(65)).toBe('01:05');
    expect(formatClock(600)).toBe('10:00');
  });

  it('tolera valores inválidos', () => {
    expect(formatClock(null)).toBe('00:00');
    expect(formatClock(-5)).toBe('00:00');
    expect(formatClock('12')).toBe('00:12');
    expect(formatClock('x')).toBe('00:00');
  });
});

describe('isOverWarning', () => {
  it('avisa a partir de cinco minutos', () => {
    expect(isOverWarning(299)).toBe(false);
    expect(isOverWarning(TURN_WARNING_SECONDS)).toBe(true);
    expect(isOverWarning(1000)).toBe(true);
  });
});
