import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import { getCompanion, getCompanionBackground, getCompanionImage } from '@/data/companions';

/**
 * Tarjeta pequeña de un compañero o mascota en el track.
 *
 * Círculo centrado con el retrato sobre un fondo de interacción; el nombre va
 * superpuesto abajo y la barra de vida queda debajo.
 */
export default function CompanionTrackCard({ entry, onOpen, estadosLabels = {} }) {
  const companion = getCompanion(entry.id);
  const image = getCompanionImage(entry.id);
  const background = getCompanionBackground(entry.id);
  const estados = entry.estadosAlterados || [];
  const name = companion?.name || entry.id;
  const typeLabel = companion?.type === 'mascota' ? 'Mascota' : 'Compañero';
  const lifePercent = Math.max(0, Math.min(100, (entry.vida / Math.max(entry.vidaMax, 1)) * 100));

  return (
    <div className="mx-1 flex w-full flex-col items-center">
      <div
        className="relative mx-auto w-20 cursor-pointer hover:scale-105"
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen?.();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${name} · ${typeLabel}`}
        data-companion-id={entry.id}
        data-companion-uid={entry.uid}
      >
        <div
          data-companion-avatar
          className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-amber-400 shadow-lg shadow-amber-950/40"
          style={background ? {
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        >
          <div className="absolute inset-0 bg-slate-950/35" aria-hidden="true" />
          {image && (
            <img
              src={image}
              alt=""
              className="relative h-full w-full object-contain p-1"
              loading="lazy"
              decoding="async"
            />
          )}
          <div
            data-companion-name
            className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-0.5 text-center"
          >
            <span className="block truncate text-[0.5rem] font-bold text-white">{name}</span>
          </div>
        </div>

        <div className="mt-0.5 w-20 rounded bg-slate-950/80 px-1 py-0.5">
          <span className="relative block h-1.5 w-full">
            <span className="absolute inset-0 z-10 flex items-center justify-center text-[0.45rem] font-bold leading-none text-white">
              {entry.vida}/{entry.vidaMax}
            </span>
            <span className="block h-full w-full rounded bg-red-950">
              <span className="block h-full rounded bg-red-500" style={{ width: `${lifePercent}%` }} />
            </span>
          </span>
        </div>

        {estados.length > 0 && (
          <div className="absolute -left-1 top-0 flex flex-col gap-0.5">
            {estados.slice(0, 3).map((estado) => {
              const meta = ESTADOS_ALTERADOS.find((item) => item.id === estado.id);
              if (!meta) return null;
              return (
                <span
                  key={estado.id}
                  className="relative"
                  title={`${estadosLabels[meta.texto] || meta.texto} ×${estado.count}`}
                >
                  <img
                    src={meta.imagen}
                    alt=""
                    className="h-3.5 w-3.5 rounded-full border border-white/80 bg-slate-950/60"
                    loading="lazy"
                    decoding="async"
                  />
                  {estado.count > 1 && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-0.5 text-[0.4rem] font-bold leading-none text-white">
                      {estado.count}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
