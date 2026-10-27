import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';

export const MAX_STATUS_TOKENS_DEFAULT = 4;

/**
 * Motor único de estados alterados (héroes y enemigos).
 *
 * Reglas:
 *  - `turno: "principio"` actúa al empezar el turno; `turno: "final"` al terminar.
 *  - `daño` resta vida; si `prevenir === "si"` los ESCUDO absorben primero.
 *  - `reduce === "si"` descuenta `numReduce` fichas (se elimina el estado a 0).
 *  - Nunca se superan las fichas de `max` (4 por defecto).
 *  - TIEMPO se gestiona aparte (`checkTiempoSkip`).
 *
 * @returns {{ vida: number, estados: Array<{id: string, count: number}>, logs: string[] }}
 */
export function applyStatusEffects({
  vida,
  estados = [],
  fase,
  catalogo = ESTADOS_ALTERADOS,
  labels = {},
  texts = {},
  maxPorDefecto = MAX_STATUS_TOKENS_DEFAULT,
}) {
  const resultado = { vida, estados: [...estados], logs: [] };
  if (!Array.isArray(estados) || estados.length === 0) return resultado;
  if (vida <= 0) return resultado;

  let vidaRestante = vida;
  const escudo = estados.find((item) => item.id === 'ESCUDO');
  let escudosDisponibles = escudo ? escudo.count : 0;
  const logs = [];

  const siguientes = estados.map((estado) => {
    const config = catalogo.find((item) => item.id === estado.id);
    if (!config || estado.count <= 0) return estado;
    if (estado.id === 'TIEMPO') return estado;

    const tocaInicio = fase === 'inicio' && config.turno === 'principio';
    const tocaFin = fase === 'fin' && config.turno === 'final';
    if (!tocaInicio && !tocaFin) return estado;

    let mensaje = '';
    let consumidos = 0;
    let dano = 0;

    if (config.daño > 0) {
      dano = config.daño * estado.count;

      if (config.prevenir === 'si' && escudosDisponibles > 0) {
        consumidos = Math.min(dano, escudosDisponibles);
        escudosDisponibles -= consumidos;
        dano -= consumidos;
      }

      if (consumidos > 0) {
        mensaje += ` ${texts.consume || 'consume'} ${consumidos} ${texts.shields || 'escudos'}`;
      }

      if (dano > 0) {
        vidaRestante -= dano;
        mensaje += ` ${texts.inflicts || 'inflige'} ${dano} ${texts.damage || 'de daño'}`;
        if (config.prevenir === 'no') {
          mensaje += ` (${texts.ignoresShields || 'ignora escudos'})`;
        }
      }
    }

    let nuevoCount = estado.count;
    if (config.reduce === 'si') {
      nuevoCount = Math.max(0, estado.count - (config.numReduce || 1));
      const reducidos = estado.count - nuevoCount;
      if (reducidos > 0) mensaje += ` (${texts.reduce || 'reduce'} ${reducidos})`;
    }

    const maxFichas = config.max || maxPorDefecto;
    if (nuevoCount > maxFichas) nuevoCount = maxFichas;

    if (mensaje.trim()) {
      logs.push(`${labels[config.texto] || config.texto}${mensaje}`);
    }

    return { ...estado, count: nuevoCount };
  });

  if (escudo) {
    siguientes.forEach((estado) => {
      if (estado.id === 'ESCUDO') estado.count = escudosDisponibles;
    });
  }

  return {
    vida: Math.max(0, vidaRestante),
    estados: siguientes.filter((estado) => estado.count > 0),
    logs,
  };
}
