/**
 * Clasifica un aviso de escenario para darle icono y color en la interfaz.
 * El texto es libre, así que se combinan emojis conocidos y palabras clave.
 */
const RULES = [
  { kind: 'death', test: /☠|muere|cae\b|derrotad/i, icon: '☠', tone: 'border-slate-400 bg-slate-900/95' },
  { kind: 'damage', test: /inflige|daño|damage|herida/i, icon: '🗡', tone: 'border-red-500 bg-red-950/95' },
  { kind: 'status', test: /🌀|veneno|quemadura|hemorragia|lentitud|aturd|estado/i, icon: '🌀', tone: 'border-fuchsia-500 bg-fuchsia-950/95' },
  { kind: 'summon', test: /aparece|invoca|invocad|refuerzo/i, icon: '👹', tone: 'border-purple-500 bg-purple-950/95' },
  { kind: 'rune', test: /runa|manifiest|roba|color/i, icon: '🔮', tone: 'border-emerald-500 bg-emerald-950/95' },
  { kind: 'round', test: /ronda|turno/i, icon: '🔁', tone: 'border-sky-500 bg-sky-950/95' },
];

const DEFAULT = { kind: 'event', icon: '✦', tone: 'border-slate-500 bg-slate-900/95' };

export function classifyScenarioToast(message = '') {
  const text = String(message);
  return RULES.find((rule) => rule.test.test(text)) || DEFAULT;
}
