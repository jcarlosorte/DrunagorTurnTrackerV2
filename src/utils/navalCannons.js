/**
 * Planifica la carga de cañones de Batalla Naval (cara B).
 *
 * - Los cañones del color de la runa se cargan automáticamente si están
 *   descargados.
 * - Si el cañón de ese color ya está cargado, se ofrece elegir otro cañón
 *   descargado.
 * - La runa azul no tiene cañón propio: se elige cualquier cañón descargado.
 */
export function planNavalCannonLoads(cannons = [], runes = []) {
  const simulated = cannons.map((cannon) => ({ ...cannon }));
  const autoLoadedIds = [];
  const pending = [];
  const failures = [];

  const load = (cannon) => {
    cannon.loaded = true;
    autoLoadedIds.push(cannon.id);
  };

  runes.forEach((tile) => {
    const color = tile?.runa;
    if (!color) return;

    if (color === 'azul') {
      if (simulated.some((cannon) => !cannon.loaded)) {
        pending.push({ rune: color, reason: 'blue' });
      } else {
        failures.push({ rune: color, reason: 'no-unloaded' });
      }
      return;
    }

    const matching = simulated.find((cannon) => cannon.color === color);
    if (!matching) {
      failures.push({ rune: color, reason: 'no-cannon' });
      return;
    }
    if (!matching.loaded) {
      load(matching);
      return;
    }
    if (simulated.some((cannon) => !cannon.loaded)) {
      pending.push({ rune: color, reason: 'loaded' });
    } else {
      failures.push({ rune: color, reason: 'no-unloaded' });
    }
  });

  return { autoLoadedIds, pending, failures };
}
