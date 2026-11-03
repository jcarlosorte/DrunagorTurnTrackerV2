export const categoryTextGlowMap = {
  bisoño: 'glow-bisono',
  soldado: 'glow-soldado',
  veterano: 'glow-veterano',
  campeon: 'glow-campeon',
  comandante: 'glow-commander',
  overlord: 'glow-commander',
  jefe: 'glow-commander',
  esbirro: 'glow-escenario',
  escenario: 'glow-escenario',
};

export const borderColorMap = {
  esbirro: 'border-cyan',
  escenario: 'border-blue',
  blanco: 'border-blanco',
  gris: 'border-gris',
  negro: 'border-negro',
  comandante: 'border-dorado',
  overlord: 'border-morado',
  jefe: 'border-morado',
};

export const textBgColorMap = {
  esbirro: 'bg-cyan-300',
  escenario: 'bg-cyan-600',
  blanco: 'bg-white',
  gris: 'bg-slate-500',
  negro: 'bg-black',
  comandante: 'bg-orange-400 ',
  overlord: 'bg-purple-800',
  jefe: 'bg-purple-700',
};

const PINK_ABILITIES = ['ESCUDO_X', 'REGENERACION_X', 'MANDO', 'EVOLUCION', 'SANAR_X', 'VORAGINE', 'HASTA 2 MOSTRUOS MAS DEBILES'];
const BLUE_ABILITIES = ['SANGUINARIO', 'IMPLACABLE', 'DESAFIO', 'SALTO', 'VENGATIVO', 'CODICIA', 'BRUTAL'];
const GREEN_2_ABILITIES = ['EMBATE_X', 'ANDANADA_X'];
const VIOLET_2_ABILITIES = ['SOBREPRESION'];

/** Color de una capacidad según la versión de reglas. */
export function getAbilityColor(claveGeneral, rulesVersion) {
  if (rulesVersion === '2.0' && GREEN_2_ABILITIES.includes(claveGeneral)) {
    return 'text-emerald-500 font-semibold';
  }
  if (rulesVersion === '2.0' && VIOLET_2_ABILITIES.includes(claveGeneral)) {
    return 'text-violet-500 font-semibold';
  }
  if (PINK_ABILITIES.includes(claveGeneral)) {
    return 'text-pink-500 font-semibold';
  }
  if (BLUE_ABILITIES.includes(claveGeneral)) {
    return 'text-blue-500 font-semibold';
  }
  return '';
}
