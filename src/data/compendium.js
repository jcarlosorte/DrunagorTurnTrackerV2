import glosarioEs from '@/i18n/glosario2.es.json';
import glosarioEn from '@/i18n/glosario2.en.json';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';

export const COMPENDIUM_CATEGORIES = [
  { id: 'general', label: { es: 'Reglas generales', en: 'General rules' }, icon: 'book' },
  { id: 'combat', label: { es: 'Combate', en: 'Combat' }, icon: 'swords' },
  { id: 'movement', label: { es: 'Movimiento', en: 'Movement' }, icon: 'footprint' },
  { id: 'conditions', label: { es: 'Condiciones', en: 'Conditions' }, icon: 'skull' },
  { id: 'resources', label: { es: 'Recursos', en: 'Resources' }, icon: 'gems' },
  { id: 'turn', label: { es: 'Turno e iniciativa', en: 'Turn and initiative' }, icon: 'clock' },
  { id: 'campaign', label: { es: 'Campaña', en: 'Campaign' }, icon: 'scroll' },
];

const TERM_OVERRIDES = {
  AC_ALCANCE_DE_CUBO: { es: 'Alcance de cubo', en: 'Cube Range' },
  ACECHADOR: { es: 'Acechador', en: 'Stalker' },
  ACTIVAR: { es: 'Activar', en: 'Activate' },
  AMENAZA: { es: 'Amenaza', en: 'Threat' },
  APORREAR: { es: 'Aporrear', en: 'Smash' },
  EVITAR: { es: 'Evitar', en: 'Avoid' },
  BOT: { es: 'BOT (inicio del turno)', en: 'BOT (beginning of turn)' },
  BOTIN: { es: 'Botín', en: 'Loot' },
  BRUJO: { es: 'Brujo', en: 'Warlock' },
  CANALIZAR: { es: 'Canalizar', en: 'Channel' },
  CANCELAR: { es: 'Cancelar', en: 'Cancel' },
  CATALIZAR: { es: 'Catalizar', en: 'Catalyze' },
  CEGUERA: { es: 'Ceguera', en: 'Blindness' },
  CONTROL_MENTAL: { es: 'Control mental', en: 'Mind Control' },
  CONTROLAR_UN_DRAUGR: { es: 'Controlar un Draugr', en: 'Control a Draugr' },
  CONTROLAR_UNA_MASCOTA: { es: 'Controlar una mascota', en: 'Control a Pet' },
  COBERTURA: { es: 'Cobertura', en: 'Cover' },
  SAGAZ: { es: 'Sagaz', en: 'Keen' },
  DEVORAR: { es: 'Devorar', en: 'Devour' },
  EFECTO_DE_COPIA_COMODIN: { es: 'Efecto de copia comodín', en: 'Wild Copy Effect' },
  EMPUÑADURA_PESADA: { es: 'Empuñadura pesada', en: 'Heavy Grip' },
  ENERGETICO: { es: 'Enérgico', en: 'Energetic' },
  ENTROPIA: { es: 'Entropía', en: 'Entropy' },
  EOT: { es: 'EOT (final del turno)', en: 'EOT (end of turn)' },
  FRAGMENTO_DE_ALMA: { es: 'Fragmento de alma', en: 'Soul Fragment' },
  GASTADO: { es: 'Gastado', en: 'Spent' },
  GOLPE_DE_GRACIA: { es: 'Golpe de gracia', en: 'Coup de Grace' },
  GUARDIAN: { es: 'Guardián', en: 'Guardian' },
  HECHIZAR: { es: 'Hechizar', en: 'Bewitch' },
  HERIDO: { es: 'Herido', en: 'Wounded' },
  IDOLOS: { es: 'Ídolos', en: 'Idols' },
  IDOLO_DE_FURIA: { es: 'Ídolo de Furia', en: 'Idol of Fury' },
  IDOLO_DE_RESISTENCIA: { es: 'Ídolo de Resistencia', en: 'Idol of Resistance' },
  IDOLO_DE_TORMENTA: { es: 'Ídolo de Tormenta', en: 'Idol of Storm' },
  IDOLO_DE_TRANQUILIDAD: { es: 'Ídolo de Tranquilidad', en: 'Idol of Tranquility' },
  IDT: { es: 'IDT (inicio del turno)', en: 'IDT (start of turn)' },
  INFLIGIR: { es: 'Infligir', en: 'Inflict' },
  INSPIRAR: { es: 'Inspirar', en: 'Inspire' },
  LEVANTAR_UN_DRAUGR: { es: 'Levantar un Draugr', en: 'Raise a Draugr' },
  MONSTRUO_GRANDE: { es: 'Monstruo grande', en: 'Large Monster' },
  NO_DISPONIBLE: { es: 'No disponible', en: 'Unavailable' },
  NOQUEAR: { es: 'Noquear', en: 'Knock Out' },
  POLIMORFISMO_SIMPLIFICADO: { es: 'Polimorfismo simplificado', en: 'Simplified Polymorph' },
  POTENCIAR: { es: 'Potenciar', en: 'Empower' },
  REAPRENDER: { es: 'Reaprender', en: 'Relearn' },
  RECIBIR: { es: 'Recibir', en: 'Receive' },
  RECOMPENSA: { es: 'Recompensa', en: 'Reward' },
  RECUPERAR_X_SALUD: { es: 'Recuperar X de Salud', en: 'Recover X Health' },
  REDIRECCION: { es: 'Redirección', en: 'Redirection' },
  RESUELTO: { es: 'Resuelto', en: 'Resolved' },
  ROMPECRANEOS: { es: 'Rompecráneos', en: 'Skullcrusher' },
  RONDA: { es: 'Ronda', en: 'Round' },
  SUFRIR: { es: 'Sufrir', en: 'Suffer' },
  TURNO: { es: 'Turno', en: 'Turn' },
  USAR: { es: 'Usar', en: 'Use' },
  VERSATIL: { es: 'Versátil', en: 'Versatile' },
  SEMILLA_DEL_CAOS: { es: 'Semilla del Caos', en: 'Seed of Chaos' },
};

const CATEGORY_PATTERNS = [
  ['conditions', /^(ATURDIMIENTO|CEGUERA|DERRIBO|FRAGIL|HEMORRAGIA_X|INTIMIDAR_X|LENTITUD|MARCA_DE_MONTARAZ|POLIMORFISMO|POLIMORFISMO_SIMPLIFICADO|QUEMADURA_X|RESTRICCION|SIGILO|VENENO_X|PIEL_GRUESA|INMUNIDAD)$/],
  ['resources', /^(ESCUDO_X|CONCENTRACION_X|KI|FURIA|FRUTO_DE_VIDA|ENTROPIA|CUBO_COMODIN|CUBOS_DE_|SEMILLA_DEL_CAOS|FRAGMENTO_DE_ALMA|GASTADO|FATIGA_X|MALDICION_X|BOTIN|RECOMPENSA|RECIBIR|RECUPERAR_X_SALUD|SANAR_X|PREVENIR_X|NO_PREVENIBLE|SUFRIR|DANO_X|IMPACTAR_X|INFLIGIR|PAGA_X_SALUD|PURIFICACION_X|REGENERACION_X)/],
  ['turn', /^(BOT|IDT|EOT|ACTIVAR|RONDA|TURNO|NO_DISPONIBLE|RESUELTO|REACCION|PASIVA|USAR|CONSUMIR)$/],
  ['movement', /^(ADYACENTE|ALCANCE_X|APARTAR|ARROLLAR_X|EMBATE_X|EMPUJON_X|MOVER_X|MOVER_MAS_X|RETROCEDER|SALTO|TERRENO_DIFICIL|COBERTURA|GIGANTE|MONSTRUO_GRANDE|ELEMENTO|ELEMENTOS_SOLIDOS)$/],
  ['combat', /^(ATAQUE_|ANDANADA_X|BRUTAL|CONTRAATAQUE_X|CRITICO_X|SAGAZ|HENDEDURA_X|GOLPE_DE_GRACIA|IMPLACABLE|NOQUEAR|REPRESALIA_X|TIRADA_X|REPETIR_TIRADA|VENGATIVO|VORAGINE)/],
  ['campaign', /^(AURA|COMPANEROS|CONSECUENCIA|DRAUGR|ESTADO|MASCOTA|PNJ_FICHA|REAPRENDER|RECUPERAR_EL_ALIENTO|TRUCO_O_TRATO|VUDU|IDOLOS|IDOLO_DE_)/],
];

const KEEP_UPPERCASE = new Set(['BOT', 'EOT', 'IDT', 'KI', 'PNJ', 'PC', 'X']);
const DIACRITICS = /[\u0300-\u036f]/g;

export function normalizeCompendiumText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function displayLabel(value, fallbackKey) {
  const raw = String(value || fallbackKey || '')
    .replace(/^[\s•*\-–—]+/, '')
    .replace(/_+/g, ' ')
    .trim();
  if (!raw) return '';
  const letters = raw
    .replace(/\{[^}]*\}/g, '')
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '');
  if (letters !== letters.toUpperCase()) {
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return raw
    .split(/\s+/)
    .map((word, index) => {
      const upper = word.toUpperCase();
      if (KEEP_UPPERCASE.has(upper)) return upper;
      if (/^\d+[a-z]?$/.test(word)) return upper;
      const lower = word.toLowerCase();
      return index === 0 ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
    })
    .join(' ');
}

function categoryFor(key) {
  return CATEGORY_PATTERNS.find(([, pattern]) => pattern.test(key))?.[0] || 'general';
}

const stateIcons = new Map();
for (const state of ESTADOS_ALTERADOS) {
  if (!state.imagen) continue;
  for (const candidate of [state.id, state.texto, state.accion]) {
    if (candidate) stateIcons.set(normalizeCompendiumText(candidate), state.imagen);
  }
}

function iconFor(key) {
  const base = key.replace(/_X$/, '');
  const candidates = [
    key,
    base,
    `${base}_I`,
    base.replace(/_/g, ' '),
  ];
  for (const candidate of candidates) {
    const icon = stateIcons.get(normalizeCompendiumText(candidate));
    if (icon) return icon;
  }
  return null;
}

function aliasesFor(key, esLabel, enLabel) {
  const values = [
    key,
    key.replace(/_/g, ' '),
    esLabel,
    enLabel,
    ...(TERM_OVERRIDES[key] ? [TERM_OVERRIDES[key].es, TERM_OVERRIDES[key].en] : []),
  ];
  const seen = new Set();
  return values
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter((value) => {
      const normalized = normalizeCompendiumText(value);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
}

function idFor(key) {
  return normalizeCompendiumText(key).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export const COMPENDIUM_ENTRIES = Object.keys(glosarioEs)
  .map((key) => {
    const override = TERM_OVERRIDES[key];
    const esLabel = displayLabel(override?.es || es.condiciones_t?.[key], key);
    const enLabel = displayLabel(override?.en || override?.es || en.condiciones_t?.[key], key);
    const descriptionEs = String(glosarioEs[key] || '').trim();
    const descriptionEn = String(glosarioEn[key] || descriptionEs).trim();

    return {
      id: idFor(key),
      key,
      term: { es: esLabel, en: enLabel },
      description: { es: descriptionEs, en: descriptionEn },
      aliases: { es: aliasesFor(key, esLabel, enLabel), en: aliasesFor(key, esLabel, enLabel) },
      category: categoryFor(key),
      icon: iconFor(key),
    };
  })
  .sort((a, b) => a.term.es.localeCompare(b.term.es, 'es'));

export function compendiumCategoryLabel(categoryId, language = 'es') {
  const category = COMPENDIUM_CATEGORIES.find((item) => item.id === categoryId);
  return category?.label?.[language] || category?.label?.es || categoryId;
}

export function searchCompendium(entries, { query = '', category = 'all', language = 'es', onlyWithIcon = false } = {}) {
  const normalizedQuery = normalizeCompendiumText(query);
  const tokens = normalizedQuery.split(' ').filter(Boolean);

  return entries
    .filter((entry) => category === 'all' || entry.category === category)
    .filter((entry) => !onlyWithIcon || Boolean(entry.icon))
    .map((entry) => {
      const term = normalizeCompendiumText(entry.term[language]);
      const aliases = entry.aliases[language].map(normalizeCompendiumText);
      const description = normalizeCompendiumText(entry.description[language]);
      if (tokens.length === 0) return { entry, score: 0 };

      const aliasMatch = aliases.some((alias) => tokens.every((token) => alias.includes(token)));
      const termMatch = tokens.every((token) => term.includes(token));
      const descriptionMatch = tokens.every((token) => description.includes(token));
      if (!termMatch && !aliasMatch && !descriptionMatch) return null;

      let score = 0;
      if (term === normalizedQuery) score += 120;
      else if (term.startsWith(normalizedQuery)) score += 80;
      else if (termMatch) score += 55;
      if (aliasMatch) score += 40;
      if (descriptionMatch) score += 15;
      score -= Math.min(term.length, 40) / 100;
      return { entry, score };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return a.entry.term[language].localeCompare(b.entry.term[language], language);
    })
    .map(({ entry }) => entry);
}
