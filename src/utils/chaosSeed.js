export const CHAOS_SEED_ID = 'SEMILLA_DEL_CAOS';
export const CHAOS_SEED_DAMAGE = 4;

/**
 * La cuarta Semilla del Caos hace estallar todas las semillas y provoca 4 de
 * daño no prevenible. Solo existe en el reglamento 2.0.
 */
export function isChaosSeedBurst(estadoId, nextCount, rulesVersion) {
  return rulesVersion === '2.0'
    && estadoId === CHAOS_SEED_ID
    && Number(nextCount) >= 4;
}
