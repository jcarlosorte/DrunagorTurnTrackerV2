const RUNE_IMMUNITY = {
  amarillo: 'QUEMADURA_I',
  rojo: 'HEMORRAGIA_I',
  verde: 'VENENO_I',
  azul: 'ATURDIMIENTO_I',
};

/**
 * Aplica la runa de jefe seleccionada al Cosechador.
 * La runa gris restaura ARMADURA y todas las inmunidades perdidas; las demás
 * van acumulando las inmunidades que se pierden.
 */
export function applyBossRuneEffect(enemy, runeId) {
  if (!enemy) return enemy;
  const selectedRune = runeId === 'naranja' ? 'amarillo' : runeId;

  const baseCapabilities = enemy.capacidadesOriginales || enemy.capacidades || [];
  const baseImmunities = enemy.bossBaseImmunities || enemy.inmunidad || [];
  const lost = new Set(enemy.bossRuneLostImmunities || []);
  let estados = [...(enemy.estadosAlterados || [])];

  if (selectedRune === 'gris') {
    lost.clear();
    // Al restaurar ARMADURA se limpian los estados, salvo la Ficha de Tiempo.
    estados = estados.filter((estado) => estado.id === 'TIEMPO');
  } else {
    if (RUNE_IMMUNITY[selectedRune]) lost.add(RUNE_IMMUNITY[selectedRune]);
  }

  const capacities = selectedRune === 'gris'
    ? [...baseCapabilities]
    : baseCapabilities.filter((capability) => capability !== 'ARMADURA');

  return {
    ...enemy,
    bossRune: selectedRune,
    bossBaseImmunities: baseImmunities,
    bossRuneLostImmunities: [...lost],
    capacidades: capacities,
    inmunidad: baseImmunities.filter((immunity) => !lost.has(immunity)),
    estadosAlterados: estados,
  };
}
