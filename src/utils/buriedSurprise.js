/**
 * Enemigos que invoca la carta «Incursión de Monstruos» de Sorpresa Enterrada.
 * Los grupos son acumulativos según el número de jugadores.
 */
export function getBuriedSurpriseSummons(numPlayers) {
  const players = Math.max(1, Number(numPlayers) || 1);
  const groups = [{ color: 'gris', categoria: 'soldado', label: 'MG – Soldado' }];
  if (players >= 3) groups.push({ color: 'blanco', categoria: 'soldado', label: 'MB – Soldado' });
  if (players >= 5) groups.push({ color: 'gris', categoria: 'soldado', label: 'MG – Soldado' });
  return groups;
}
