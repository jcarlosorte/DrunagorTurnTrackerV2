/** Cura a los monstruos que siguen en el tablero, sin superar su vida máxima. */
export function healSurvivors(entries, removedUuid, heal) {
  if (!Array.isArray(entries) || !heal || heal <= 0) return entries;
  return entries.map((entry) => {
    const enemy = entry.enemy;
    if (!enemy || enemy.uuid === removedUuid || enemy.tipo === 'especial') return entry;
    if (typeof enemy.vida !== 'number' || typeof enemy.vidaMax !== 'number') return entry;
    return {
      ...entry,
      enemy: { ...enemy, vida: Math.min(enemy.vidaMax, enemy.vida + heal) },
    };
  });
}
