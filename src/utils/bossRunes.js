const RUNE_IMMUNITY = {
  naranja: 'QUEMADURA_I',
  rojo: 'HEMORRAGIA_I',
  verde: 'VENENO_I',
};

/**
 * Aplica la runa de jefe seleccionada al Cosechador.
 * La runa gris restaura ARMADURA y todas las inmunidades perdidas; las demás
 * van acumulando las inmunidades que se pierden.
 */
export function applyBossRuneEffect(enemy, runeId) {
  if (!enemy) return enemy;

  const baseCapabilities = enemy.capacidadesOriginales || enemy.capacidades || [];
  const baseImmunities = enemy.bossBaseImmunities || enemy.inmunidad || [];
  const lost = new Set(enemy.bossRuneLostImmunities || []);
  let estados = [...(enemy.estadosAlterados || [])];

  if (runeId === 'gris') {
    lost.clear();
    // Al restaurar ARMADURA se limpian los estados, salvo la Ficha de Tiempo.
    estados = estados.filter((estado) => estado.id === 'TIEMPO');
  } else {
    if (RUNE_IMMUNITY[runeId]) lost.add(RUNE_IMMUNITY[runeId]);
    if (runeId === 'azul') {
      const index = estados.findIndex((estado) => estado.id === 'ATURDIMIENTO_I');
      if (index === -1) estados.push({ id: 'ATURDIMIENTO_I', count: 1 });
      else estados[index] = { ...estados[index], count: (estados[index].count || 0) + 1 };
    }
  }

  const capacities = runeId === 'gris'
    ? [...baseCapabilities]
    : baseCapabilities.filter((capability) => capability !== 'ARMADURA');

  return {
    ...enemy,
    bossRune: runeId,
    bossBaseImmunities: baseImmunities,
    bossRuneLostImmunities: [...lost],
    capacidades: capacities,
    inmunidad: baseImmunities.filter((immunity) => !lost.has(immunity)),
    estadosAlterados: estados,
  };
}
