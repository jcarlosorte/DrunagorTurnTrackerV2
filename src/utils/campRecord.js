/**
 * Campos de historia del campamento.
 * Se guardan dentro de trackerData.campRecord para que viajen con la partida.
 */
import { CONSECUENCIAS } from '@/data/heroes/index';

const CONSECUENCIA_IDS = new Set(CONSECUENCIAS.map(({ id }) => id));

export const LEGACY_TRAILS = [
  { id: 'perseverancia', label: { es: 'Perseverancia', en: 'Perseverance' } },
  { id: 'desastre', label: { es: 'Desastre', en: 'Doom' } },
  { id: 'tragedia', label: { es: 'Tragedia', en: 'Tragedy' } },
  { id: 'heroismo', label: { es: 'Heroísmo', en: 'Heroism' } },
];

export const DAREN_TRAITS = [
  { id: 'folkHero', label: { es: 'Héroe Popular', en: 'Folk Hero' } },
  { id: 'redeemer', label: { es: 'Redentor', en: 'Redeemer' } },
  { id: 'knightOfAmira', label: { es: 'Caballero de Amira', en: 'Knight of Amira' } },
  { id: 'passionate', label: { es: 'Vehemente', en: 'Passionate' } },
];

// Los dos orígenes del Héroe de Darem son alternativas: solo puede haber uno.
export const DAREN_EXCLUSIVE_GROUPS = [['folkHero', 'knightOfAmira']];

export const CAMP_ACTS = [
  { id: 'first', label: { es: 'Primer Acto', en: 'First Act' } },
  { id: 'second', label: { es: 'Segundo Acto', en: 'Second Act' } },
  { id: 'third', label: { es: 'Tercer Acto', en: 'Third Act' } },
  { id: 'fourth', label: { es: 'Cuarto Acto', en: 'Fourth Act' } },
];

const MAX_LEVEL = 3;
const MAX_LINES = 8;
const MAX_LINE_LENGTH = 100;

function clampLevel(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(MAX_LEVEL, Math.trunc(number)));
}

function normalizeLines(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((line) => String(line ?? '').trim().slice(0, MAX_LINE_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_LINES);
}

function normalizeConsecuencias(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((id) => String(id ?? '')).filter((id) => CONSECUENCIA_IDS.has(id)))];
}

export function createCampRecord() {
  return {
    legacyTrail: Object.fromEntries(LEGACY_TRAILS.map(({ id }) => [id, 0])),
    darenTraits: Object.fromEntries(DAREN_TRAITS.map(({ id }) => [id, false])),
    unfoldings: Object.fromEntries(CAMP_ACTS.map(({ id }) => [id, []])),
    consecuencias: [],
  };
}

export function normalizeCampRecord(raw) {
  const record = createCampRecord();
  if (!raw || typeof raw !== 'object') return record;

  LEGACY_TRAILS.forEach(({ id }) => {
    record.legacyTrail[id] = clampLevel(raw.legacyTrail?.[id]);
  });
  DAREN_TRAITS.forEach(({ id }) => {
    record.darenTraits[id] = raw.darenTraits?.[id] === true;
  });
  DAREN_EXCLUSIVE_GROUPS.forEach((group) => {
    const selected = group.find((id) => record.darenTraits[id] === true);
    group.forEach((id) => {
      if (id !== selected) record.darenTraits[id] = false;
    });
  });
  CAMP_ACTS.forEach(({ id }) => {
    record.unfoldings[id] = normalizeLines(raw.unfoldings?.[id]);
  });
  record.consecuencias = normalizeConsecuencias(raw.consecuencias);

  return record;
}

export function withLegacyLevel(record, traitId, level) {
  const next = normalizeCampRecord(record);
  if (!LEGACY_TRAILS.some(({ id }) => id === traitId)) return next;
  next.legacyTrail[traitId] = clampLevel(level);
  return next;
}

export function withDarenTrait(record, traitId, enabled) {
  const next = normalizeCampRecord(record);
  if (!DAREN_TRAITS.some(({ id }) => id === traitId)) return next;
  next.darenTraits[traitId] = enabled === true;
  if (enabled === true) {
    DAREN_EXCLUSIVE_GROUPS
      .filter((group) => group.includes(traitId))
      .flat()
      .forEach((id) => {
        if (id !== traitId) next.darenTraits[id] = false;
      });
  }
  return next;
}

export function withUnfoldingLine(record, actId, line) {
  const next = normalizeCampRecord(record);
  if (!CAMP_ACTS.some(({ id }) => id === actId)) return next;
  const text = String(line ?? '').trim().slice(0, MAX_LINE_LENGTH);
  if (!text || next.unfoldings[actId].length >= MAX_LINES) return next;
  next.unfoldings[actId] = [...next.unfoldings[actId], text];
  return next;
}

export function withoutUnfoldingLine(record, actId, index) {
  const next = normalizeCampRecord(record);
  if (!CAMP_ACTS.some(({ id }) => id === actId)) return next;
  next.unfoldings[actId] = next.unfoldings[actId].filter((_, itemIndex) => itemIndex !== index);
  return next;
}

/**
 * Añade o quita una consecuencia compartida. No hay límite: pueden estar todas.
 */
export function withConsecuencia(record, consecuenciaId, enabled = true) {
  const next = normalizeCampRecord(record);
  if (!CONSECUENCIA_IDS.has(consecuenciaId)) return next;
  if (enabled === false) {
    next.consecuencias = next.consecuencias.filter((id) => id !== consecuenciaId);
    return next;
  }
  if (!next.consecuencias.includes(consecuenciaId)) {
    next.consecuencias = [...next.consecuencias, consecuenciaId];
  }
  return next;
}

export { MAX_LEVEL, MAX_LINES, MAX_LINE_LENGTH };
