import { describe, expect, it } from 'vitest';
import { EXPANSIONS } from '@/data/expansions';
import { getExpansionColor, getExpansionIcon } from '@/data/expansionIcons';

describe('iconos de expansión', () => {
  it('todas las expansiones tienen símbolo y color', () => {
    EXPANSIONS.forEach((expansion) => {
      expect(getExpansionIcon(expansion.id), expansion.id).toBeTruthy();
      expect(getExpansionColor(expansion.id)).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
