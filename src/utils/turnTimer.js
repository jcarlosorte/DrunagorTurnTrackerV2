/** Utilidades del cronómetro de turno. */

/** A partir de este tiempo (segundos) el turno se resalta como aviso. */
export const TURN_WARNING_SECONDS = 300;

/** Segundos → "mm:ss" (admite más de una hora acumulando minutos). */
export function formatClock(totalSegundos) {
  const total = Math.max(0, Math.floor(Number(totalSegundos) || 0));
  const minutos = Math.floor(total / 60);
  const segundos = total % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

/** ¿El turno supera el umbral de aviso? */
export function isOverWarning(totalSegundos) {
  return Math.max(0, Number(totalSegundos) || 0) >= TURN_WARNING_SECONDS;
}
