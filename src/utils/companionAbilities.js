/**
 * Capacidades de compañeros y mascotas.
 *
 * Se interpretan con los mismos separadores que las cartas de enemigo (`;`,
 * `,` y `:`), y se buscan sus textos y descripciones en el diccionario de
 * condiciones (`condiciones_t` / `condiciones_d`).
 */
const normalize = (value) => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase()
  .trim();

const KEYWORD_KEYS = [
  ['SANAR', 'SANAR_X'],
  ['RECOBRAR', 'RECOBRAR_X'],
  ['PERMUT', 'PERMUTAR'],
];

export function parseCompanionAbilities(text, { labels = {}, descriptions = {} } = {}) {
  const raw = String(text || '').trim();
  if (!raw || raw === '-') return [];

  return raw
    .split(/[;,]/)
    .flatMap((part) => part.split(':'))
    .map((part) => part.trim())
    .filter(Boolean)
    .map((token) => {
      const numberMatch = token.match(/^(.+?)\s+(\d+)$/);
      const base = numberMatch ? numberMatch[1] : token;
      const number = numberMatch ? numberMatch[2] : '';
      const normalized = normalize(base).replace(/\s+/g, '_');
      const candidates = [normalized, `${normalized}_X`];

      let key = candidates.find((candidate) => labels[candidate] || descriptions[candidate]) || null;
      let keywordKey = null;
      if (!key) {
        const keyword = KEYWORD_KEYS.find(([word]) => normalize(token).includes(word));
        if (keyword) {
          keywordKey = keyword[1];
          key = keywordKey;
        }
      }

      const value = number || (key?.endsWith('_X') ? '2' : '');
      const label = keywordKey
        ? token
        : (key ? (labels[key] || token).replaceAll('{x}', value) : token);
      const description = key ? (descriptions[key] || '').replaceAll('{x}', value) : '';

      return { token, key, label, description, pending: !description };
    });
}
