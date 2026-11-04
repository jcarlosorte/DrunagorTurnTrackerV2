import { getFollower, getFollowerState } from '@/data/followers';
import { getCompanionBackground } from '@/data/companions';
import { getEstadoMeta } from '@/data/estadosAlterados';

const ROLE_COLORS = {
  lider: '#b45309',
  defensor: '#0369a1',
  apoyo: '#047857',
  agresor: '#be123c',
  controlador: '#6d28d9',
};

/**
 * Tarjeta del seguidor en el track: mismo ancho que los héroes, fondo de
 * interacción, retrato, nombre y vida dentro del marco.
 */
export default function FollowerCard({ entry, onOpen }) {
  const follower = getFollower(entry.id);
  if (!follower) return null;

  const state = getFollowerState(entry.id, entry.stateId);
  const life = entry.vida ?? state?.vida ?? 0;
  const lifeMax = entry.vidaMax ?? state?.vida ?? 1;
  const lifePercent = Math.max(0, Math.min(100, (life / Math.max(lifeMax, 1)) * 100));
  const color = ROLE_COLORS[follower.role] || '#334155';
  const background = entry.background || getCompanionBackground(entry.id);
  const estados = entry.estadosAlterados || [];

  return (
    <div className="mx-1 flex w-full flex-col items-center">
      <div
        className="w-full max-w-[90px] cursor-pointer transition hover:scale-105"
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen?.();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={follower.name}
        data-follower-id={entry.id}
        data-follower-uid={entry.uid}
      >
        <div
          className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border-2 shadow-lg shadow-black/40"
          style={{ borderColor: color }}
        >
          {background && (
            <img
              src={background}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-slate-950/35" aria-hidden="true" />
          {follower.image && (
            <img
              src={follower.image}
              alt=""
              className="relative h-full w-full object-contain object-bottom p-1"
              loading="lazy"
              decoding="async"
            />
          )}

          {estados.length > 0 && (
            <div className="absolute left-0.5 top-0.5 z-10 flex flex-col gap-0.5">
              {estados.slice(0, 3).map((estado) => {
                const meta = getEstadoMeta(estado.id);
                if (!meta) return null;
                return (
                  <span key={estado.id} className="relative" title={`${meta.texto} ×${estado.count}`}>
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

          <div className="absolute inset-x-0 bottom-0">
            <div className="bg-slate-950/85 px-1 py-0.5">
              <span className="relative block h-1.5 w-full">
                <span className="absolute inset-0 z-10 flex items-center justify-center text-[0.45rem] font-bold leading-none text-white">
                  {life}/{lifeMax}
                </span>
                <span className="block h-full w-full rounded bg-red-950">
                  <span className="block h-full rounded bg-red-500" style={{ width: `${lifePercent}%` }} />
                </span>
              </span>
            </div>
            <div
              className="px-1 py-0.5 text-center"
              style={{ backgroundColor: color }}
            >
              <span className="block truncate text-[0.55rem] font-bold text-white">{follower.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
