import { runeDependentCapabilities } from '@/components/constants';

const ESCUDO_X_FORMULA = /^ESCUDO X\s*([+-]\s*\d+)?$/i;

export const adjustCapabilitiesByRunes = (capacidades, runeColor, getRuneCount) => {
  if (!Array.isArray(capacidades)) {
    console.warn('⚠️ capacidades no es un array:', capacidades);
    return [];
  }
  return capacidades.map(cap => {
    // ESCUDO X, ESCUDO X-5, ESCUDO X+2…: calcula X y aplica la fórmula.
    const escudoMatch = String(cap).match(ESCUDO_X_FORMULA);
    if (escudoMatch) {
      const offset = escudoMatch[1] ? Number(escudoMatch[1].replace(/\s+/g, '')) : 0;
      const runeCount = Number(getRuneCount(runeColor)) || 0;
      return `ESCUDO ${Math.max(0, runeCount + offset)}`;
    }

    if (runeDependentCapabilities.includes(cap)) {
      const count = getRuneCount(runeColor);
      return cap.replace('X', `${count}`);
    }
    return cap;
  });
};
