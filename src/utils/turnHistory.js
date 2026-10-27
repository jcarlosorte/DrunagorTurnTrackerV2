/** Historial acotado de turnos para deshacer (LIFO con límite). */

/**
 * Añade una entrada y descarta la más antigua si se supera el límite.
 * @returns {number} longitud resultante
 */
export function pushEntry(stack, entry, limit = 10) {
  if (!Array.isArray(stack)) return 0;
  stack.push(entry);
  while (stack.length > limit) stack.shift();
  return stack.length;
}

/** Extrae la última entrada o `null` si no hay ninguna. */
export function popEntry(stack) {
  if (!Array.isArray(stack) || stack.length === 0) return null;
  return stack.pop() ?? null;
}
