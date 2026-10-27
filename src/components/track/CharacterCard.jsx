import FitText from '@/components/track/FitText';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import { ESTADOS_HEROE } from '@/data/heroes/index';

/**
 * Carta de héroe dentro del track.
 *
 * Muestra la barra de vida y los iconos de estado cuando la gestión de héroes
 * está activa; en ese caso la carta además abre la vista ampliada.
 */
export default function CharacterCard({
  name,
  image,
  prof,
  heroId,
  onOpen,
  clickable = false,
  extras = null,
  estadosLabels = {},
}) {
  const estadosAlterados = extras?.estadosAlterados || [];
  const condiciones = extras?.estados || [];
  const tieneEstados = estadosAlterados.length > 0 || condiciones.length > 0;

  return (
    <div className="flex flex-col items-center mx-1">
      <div
        className={`relative w-full max-w-[140px] hover:scale-105 ${clickable ? 'cursor-pointer' : ''}`}
        onClick={clickable ? onOpen : undefined}
        onKeyDown={clickable ? (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen?.();
          }
        } : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-label={clickable ? `${name} · ${prof}` : undefined}
        data-hero-id={heroId}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-auto object-cover rounded-lg border-2 border-[#800020]/70"
          loading="lazy"
          decoding="async"
        />

        {/* Estados alterados del héroe sobre la imagen (iconos, como en enemigos) */}
        {clickable && tieneEstados && (
          <div className="absolute left-0.5 top-0.5 grid grid-rows-3 grid-flow-col gap-0.5">
            {estadosAlterados.slice(0, 5).map((estado) => {
              const meta = ESTADOS_ALTERADOS.find((item) => item.id === estado.id);
              if (!meta) return null;
              return (
                <span key={estado.id} className="relative" title={`${estadosLabels[meta.texto] || meta.texto} ×${estado.count}`}>
                  <img
                    src={meta.imagen}
                    alt=""
                    className="h-4 w-4 rounded-full border border-white/80 bg-slate-950/60"
                    loading="lazy"
                    decoding="async"
                  />
                  {estado.count > 1 && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-0.5 text-[0.45rem] font-bold leading-none text-white">
                      {estado.count}
                    </span>
                  )}
                </span>
              );
            })}
            {condiciones.slice(0, 4).map((estado) => {
              const meta = ESTADOS_HEROE.find((item) => item.id === estado.id);
              if (!meta) return null;
              return (
                <span
                  key={`cond-${estado.id}`}
                  title={`${meta.name?.es} ×${estado.count}`}
                  className="flex h-4 w-4 items-center justify-center rounded-full border border-white/80 bg-amber-600/80 text-[0.45rem] font-bold leading-none text-white"
                >
                  {estado.count > 1 ? estado.count : '•'}
                </span>
              );
            })}
          </div>
        )}

        <div
          className="absolute bottom-0 left-1/2 w-[94%] -translate-x-1/2 rounded-lg bg-[#800020] px-1 text-center text-white leading-tight"
          style={{ textShadow: '0 0 4px #b87333aa' }}
        >
          <FitText text={name} max={12} min={6.5} className="w-full text-center font-semibold" />
          <span className="block text-[0.50rem] italic opacity-90 mb-1">{prof}</span>

          {/* Vida del héroe, como en las cartas de enemigo */}
          {clickable && extras && (
            <span className="relative mb-0.5 mt-0.5 block h-1.5 w-full">
              <span className="absolute inset-0 z-10 flex items-center justify-center text-[0.5rem] font-bold leading-none text-white">
                {extras.vida}/{extras.vidaMax}
              </span>
              <span className="block h-full w-full rounded bg-red-900">
                <span
                  className={`block h-full rounded ${extras.vida > extras.vidaMax ? 'bg-amber-400' : 'bg-red-500'}`}
                  style={{ width: `${Math.max(0, Math.min(100, (extras.vida / Math.max(extras.vidaMax, 1)) * 100))}%` }}
                />
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
