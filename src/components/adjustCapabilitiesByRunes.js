import { runeDependentCapabilities } from '@/components/constants';

const FORMULA_ABILITIES = [
  ...runeDependentCapabilities.map((ability) => ability.replace(/ X$/, '')),
  'VENENO',
];
const FORMULA_PATTERN = /^([A-ZÁÉÍÓÚÑ ]+?) X\s*([+-]\s*\d+)?$/i;

export const adjustCapabilitiesByRunes = (capacidades, runeColor, getRuneCount) => {
  if (!Array.isArray(capacidades)) {
    console.warn('⚠️ capacidades no es un array:', capacidades);
    return [];
  }
  return capacidades.map(cap => {
    // ESCUDO X-5, VENENO X+2…: calcula X y aplica la fórmula.
    const formulaMatch = String(cap).match(FORMULA_PATTERN);
    if (formulaMatch) {
      const ability = formulaMatch[1].trim().toUpperCase();
      if (FORMULA_ABILITIES.includes(ability)) {
        const offset = formulaMatch[2] ? Number(formulaMatch[2].replace(/\s+/g, '')) : 0;
        const runeCount = Number(getRuneCount(runeColor)) || 0;
        return `${ability} ${Math.max(0, runeCount + offset)}`;
      }
    }

    if (runeDependentCapabilities.includes(cap)) {
      const count = getRuneCount(runeColor);
      return cap.replace('X', `${count}`);
    }
    return cap;
  });
};
