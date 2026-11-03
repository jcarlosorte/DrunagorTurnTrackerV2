import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import { getCompanion, getCompanionImage } from '@/data/companions';

/**
 * Tarjeta pequeña de un compañero o mascota en el track.
 *
 * Se pinta detrás de su héroe, con borde ámbar y la pata para distinguirla.
 */
export default function CompanionTrackCard({ entry, onOpen, estadosLabels = {} }) {
  const companion = getCompanion(entry.id);
  const image = getCompanionImage(entry.id);
  const estados = entry.estadosAlterados || [];
  const name = companion?.name || entry.id;
  const typeLabel = companion?.type === 'mascota' ? 'Mascota' : 'Compañero';

  return (
    <div className="mx-1 flex flex-col items-center">
      <div
        className="relative w-full max-w-[100px] cursor-pointer hover:scale-105"
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
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 shadow-lg shadow-amber-950/40">
          {image && (
            <img
              src={image}
              alt=""
              className="h-full w-full object-contain p-1"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>

        <div className="mt-0.5 w-24 rounded-md bg-amber-800/95 px-1 py-0.5 text-center text-white">
          <span className="block truncate text-[0.55rem] font-bold">{name}</span>
          <span className="relative mt-0.5 block h-1.5 w-full">
            <span className="absolute inset-0 z-10 flex items-center justify-center text-[0.45rem] font-bold leading-none">
              {entry.vida}/{entry.vidaMax}
            </span>
            <span className="block h-full w-full rounded bg-red-950">
              <span
                className="block h-full rounded bg-red-500"
                style={{ width: `${Math.max(0, Math.min(100, (entry.vida / Math.max(entry.vidaMax, 1)) * 100))}%` }}
              />
            </span>
          </span>
        </div>

        {estados.length > 0 && (
          <div className="absolute -left-1 -top-1 flex flex-col gap-0.5">
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
