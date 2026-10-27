import { aplicarEfectosEstadosHeroe } from '@/utils/heroStatus';
import { applyStatusEffects } from '@/utils/statusEngine';

/**
 * Efectos de estados alterados de enemigos y héroes.
 *
 * Unifica el acceso a `applyStatusEffects` y a los avisos de escenario para
 * que ambas fichas se comporten igual. Devuelve funciones puras sobre la
 * entidad: quien llama decide cómo persistir el resultado.
 */
export default function useStatusEffects({
  labels = {},
  texts = {},
  getHeroExtras,
  updateHeroExtras,
  showScenarioToast,
  getHeroLabel,
}) {
  /** Enemigo: aplica daño/escudos/reducción en la fase indicada. */
  const applyEnemyStatus = (enemy, faseTurno) => {
    if (!enemy.estadosAlterados || enemy.estadosAlterados.length === 0) {
      return { enemy, logs: [] };
    }

    const resultado = applyStatusEffects({
      vida: enemy.vida,
      estados: enemy.estadosAlterados,
      fase: faseTurno,
      labels,
      texts,
    });

    if (resultado.logs.length === 0 && resultado.vida === enemy.vida) {
      return { enemy, logs: [] };
    }

    return {
      enemy: {
        ...enemy,
        vida: resultado.vida,
        estadosAlterados: resultado.estados,
      },
      logs: resultado.logs,
    };
  };

  /** Héroe: aplica los mismos efectos sobre `heroExtras` y avisa por toast. */
  const applyHeroStatus = (heroId, fase) => {
    const extras = getHeroExtras(heroId);
    if (!extras.estadosAlterados || extras.estadosAlterados.length === 0) return;

    const { extras: siguiente, logs } = aplicarEfectosEstadosHeroe(extras, fase, {
      labels,
      texts,
    });

    if (logs.length === 0 && siguiente.vida === extras.vida) return;

    updateHeroExtras(heroId, {
      vida: siguiente.vida,
      estadosAlterados: siguiente.estadosAlterados,
    });

    const nombre = getHeroLabel ? getHeroLabel(heroId) : heroId;
    logs.forEach((log) => showScenarioToast(`🌀 ${nombre}: ${log}`));
    if (siguiente.vida <= 0) {
      showScenarioToast(`☠ ${nombre} ${texts.death || 'cae'}`);
    }
  };

  return { applyEnemyStatus, applyHeroStatus };
}
