const PLACEHOLDER = /\{([^}]+)\}/g;

/**
 * Sustituye los valores dinámicos y las palabras del glosario de una carta de
 * comandante para que el texto pueda mostrarse sin corchetes.
 */
export function formatCardText(text, { x = 0, heroes = 0, ttr = {} } = {}) {
  return String(text ?? '')
    .replaceAll('{X_H}', String(heroes))
    .replaceAll('{X+2}', String(Number(x) + 2))
    .replaceAll('{X}', String(x))
    .replaceAll('{2*X}', String(Number(x) * 2))
    .replaceAll('{3*X}', String(Number(x) * 3))
    .replaceAll('{4*X}', String(Number(x) * 4))
    .replace(PLACEHOLDER, (_, key) => ttr[key] || key);
}
