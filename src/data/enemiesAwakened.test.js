import { describe, expect, it } from 'vitest';
import { ENEMIES } from '@/data/enemies';

describe('Rey Avivado', () => {
  it('tiene 80 de vida en su ficha de jefe', () => {
    const boss = ENEMIES.find((enemy) => enemy.id === 'wakened_king_boss');
    expect(boss?.vida).toBe(80);
    expect(boss?.categoria).toBe('jefe');
  });
});
