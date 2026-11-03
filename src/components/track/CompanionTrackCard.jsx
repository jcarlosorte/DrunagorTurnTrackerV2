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
        <div className="rounded-lg border-2 border-amber-400/80 bg-slate-900/90 p-0.5 shadow-lg shadow-amber-950/40">
          <div className="flex h-16 items-center justify-center rounded bg-slate-950/60">
            {image && (
              <img
                src={image}
                alt=""
                className="h-full w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <div className="mt-0.5 rounded bg-amber-700/90 px-1 text-center text-white">
            <span className="block truncate text-[0.55rem] font-bold">🐾 {name}</span>
            <span className="block text-[0.5rem] tabular-nums">{entry.vida}/{entry.vidaMax}</span>
          </div>
        </div>

        {estados.length > 0 && (
          <div className="absolute left-0.5 top-0.5 flex flex-col gap-0.5">
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
