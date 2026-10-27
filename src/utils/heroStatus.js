import { applyStatusEffects } from '@/utils/statusEngine';

/**
 * Adaptador para héroes: aplica el motor común sobre `heroExtras`.
 * Devuelve `{ extras, logs }` conservando el resto de campos del héroe.
 */
export function aplicarEfectosEstadosHeroe(extras, faseTurno, { labels = {}, texts = {}, catalogo } = {}) {
  const resultado = applyStatusEffects({
    vida: extras.vida,
    estados: extras.estadosAlterados || [],
    fase: faseTurno,
    catalogo,
    labels,
    texts,
  });

  if (resultado.logs.length === 0 && resultado.vida === extras.vida
    && (resultado.estados || []).length === (extras.estadosAlterados || []).length) {
    return { extras, logs: [] };
  }

  return {
    extras: {
      ...extras,
      vida: resultado.vida,
      estadosAlterados: resultado.estados,
    },
    logs: resultado.logs,
  };
}
