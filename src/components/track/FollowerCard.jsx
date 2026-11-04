import { useLanguage } from '@/context/LanguageContext';
import { getFollower, getFollowerState } from '@/data/followers';

/**
 * Tarjeta pequeña del seguidor en el track: retrato sobre su fondo y nombre.
 * La ficha ampliada se abre al pulsar.
 */
export default function FollowerCard({ entry, onOpen }) {
  const { translations } = useLanguage();
  const rolesT = translations.roles || {};
  const follower = getFollower(entry.id);
  if (!follower) return null;
  const state = getFollowerState(entry.id, entry.stateId);
  const name = follower.name;

  return (
    <div className="mx-1 flex w-full flex-col items-center">
      <div
        className="relative mx-auto w-20 cursor-pointer transition hover:scale-105"
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen?.();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${name} · ${rolesT[follower.role] || follower.role}`}
        data-follower-id={entry.id}
        data-follower-uid={entry.uid}
      >
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-emerald-400 shadow-lg shadow-emerald-950/40">
          {follower.image ? (
            <img
              src={follower.image}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-[1px]"
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div className="absolute inset-0 bg-slate-950/25" aria-hidden="true" />
          {follower.image ? (
            <img
              src={follower.image}
              alt=""
              className="relative h-full w-full object-contain p-0.5"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="relative flex h-full w-full items-center justify-center text-2xl font-black text-white/80">
              {name.charAt(0)}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-0.5 text-center">
            <span className="block truncate text-[0.5rem] font-bold text-white">{name}</span>
          </div>
        </div>

        <div className="mt-0.5 w-20 rounded bg-slate-950/80 px-1 py-0.5 text-center">
          <span className="block truncate text-[0.45rem] font-semibold text-slate-300">
            {rolesT[follower.role] || follower.role}{state ? ` · ${state.name}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
