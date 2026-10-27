import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';

/**
 * Aplica los efectos de los estados alterados de un héroe en una fase del turno.
 *
 * Misma lógica que los enemigos:
 *  - `turno: "principio"` se ejecuta al empezar su turno.
 *  - `turno: "final"` se ejecuta al terminar.
 *  - `daño` resta vida (los ESCUDO la absorben si `prevenir === "si"`).
 *  - `reduce` baja el número de fichas del estado.
 *
 * Devuelve `{ extras, logs }`; `logs` ya viene con texto legible.
 */
export function aplicarEfectosEstadosHeroe(extras, faseTurno, { labels = {}, texts = {} } = {}) {
  const estados = extras.estadosAlterados || [];
  if (estados.length === 0) return { extras, logs: [] };
  if (extras.vida <= 0) return { extras, logs: [] };

  let vida = extras.vida;
  const escudo = estados.find((item) => item.id === 'ESCUDO');
  let escudosDisponibles = escudo ? escudo.count : 0;
  const logs = [];

  const siguientes = estados.map((estado) => {
    const config = ESTADOS_ALTERADOS.find((item) => item.id === estado.id);
    if (!config || estado.count <= 0) return estado;
    if (estado.id === 'TIEMPO') return estado;

    const tocaInicio = faseTurno === 'inicio' && config.turno === 'principio';
    const tocaFin = faseTurno === 'fin' && config.turno === 'final';
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
        vida -= dano;
        mensaje += ` ${texts.inflicts || 'inflige'} ${dano} ${texts.damage || 'de daño'}`;
        if (config.prevenir === 'no') {
          mensaje += ` (${texts.ignoresShields || 'ignora escudos'})`;
        }
      }
    }

    let nuevoCount = estado.count;
    let reducidos = 0;
    if (config.reduce === 'si') {
      nuevoCount = Math.max(0, estado.count - config.numReduce);
      reducidos = estado.count - nuevoCount;
      if (reducidos > 0) mensaje += ` (${texts.reduce || 'reduce'} ${reducidos})`;
    }

    // Límite de fichas por estado (igual que en enemigos: 4 por defecto).
    const maxFichas = config.max || 4;
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
    extras: {
      ...extras,
      vida: Math.max(0, vida),
      estadosAlterados: siguientes.filter((estado) => estado.count > 0),
    },
    logs,
  };
}
