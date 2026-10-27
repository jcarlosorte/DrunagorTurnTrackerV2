import { runeDependentCapabilities } from '@/components/constants';


export const adjustCapabilitiesByRunes = (capacidades, runeColor, getRuneCount) => {
  if (!Array.isArray(capacidades)) {
    console.warn('⚠️ capacidades no es un array:', capacidades);
    return [];
  }
  return capacidades.map(cap => {
    if (runeDependentCapabilities.includes(cap)) {
      const count = getRuneCount(runeColor);
      return cap.replace('X', `${count}`);
    }
    return cap;
  });
};
