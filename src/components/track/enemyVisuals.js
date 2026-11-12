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

const PINK_ABILITIES = [
  'ESCUDO_X',
  'REGENERACION_X',
  'MANDO',
  'EVOLUCION',
  'SANAR_X',
  'VORAGINE',
  'HASTA_2_MOSTRUOS_MAS_DEBILES',
  'ALIVIAR_X',
  'ENCADENAR',
  'VUDU',
  'GRITO_DE_GUERRA',
];
const BLUE_ABILITIES = [
  'SANGUINARIO',
  'IMPLACABLE',
  'DESAFIO',
  'SALTO',
  'VENGATIVO',
  'CODICIA',
  'BRUTAL',
  'CARGA',
  'ENJAMBRE',
  'CONTRAATAQUE_X',
  'ASESINAR',
  'ROMPECRANEOS',
  'ARMADURA_DE_ASALTO',
  'GIGANTE',
  'ESTE_MONSTRUO_SE_MUEVE_HACIA_EL_CAÑON_TERRORÍFICO_MÁS_CERCANO_Y_LO_DISPARA',
];
const GREEN_ABILITIES = ['EMBATE_X', 'ANDANADA_X', 'HENDEDURA_X', 'ATAQUE_DOBLE'];
const VIOLET_ABILITIES = ['SOBREPRESION', 'CONTROL_MENTAL'];

const normalizeAbility = (key) => String(key || '').trim().toUpperCase().replace(/\s+/g, '_');

/** Color de una capacidad. Los colores se usan en todas las versiones de reglas. */
export function getAbilityColor(claveGeneral) {
  const key = normalizeAbility(claveGeneral);
  if (key === 'ESCUDO' || /^ESCUDO_(\d+|X([+-]\d+)?)$/.test(key)) return 'text-pink-500 font-semibold';
  if (PINK_ABILITIES.includes(key)) return 'text-pink-500 font-semibold';
  if (BLUE_ABILITIES.includes(key)) return 'text-blue-500 font-semibold';
  if (GREEN_ABILITIES.includes(key)) return 'text-emerald-500 font-semibold';
  if (VIOLET_ABILITIES.includes(key)) return 'text-violet-500 font-semibold';
  return '';
}

const ENEMY_TONES = {
  blanco: '#f8fafc',
  gris: '#64748b',
  negro: '#1f2937',
  comandante: '#d97706',
  dorado: '#f59e0b',
  overlord: '#8b5cf6',
  jefe: '#a21caf',
  morado: '#9333ea',
  escenario: '#9333ea',
  esbirro: '#22d3ee',
  hero: '#fb923c',
};

/** Tono de fondo de una carta de enemigo según su color o categoría. */
export function getEnemyTone(color, categoria) {
  return ENEMY_TONES[color] || ENEMY_TONES[categoria] || '#475569';
}
