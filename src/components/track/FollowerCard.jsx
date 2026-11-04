import { useLanguage } from '@/context/LanguageContext';
import { getFollower, getFollowerState } from '@/data/followers';

const ROLE_TONES = {
  lider: 'border-amber-500/60 from-amber-900/50',
  defensor: 'border-sky-500/60 from-sky-900/50',
  apoyo: 'border-emerald-500/60 from-emerald-900/50',
  agresor: 'border-rose-500/60 from-rose-900/50',
  controlador: 'border-violet-500/60 from-violet-900/50',
};

export default function FollowerCard({ entry, onChangeState, onRemove }) {
  const { translations } = useLanguage();
  const rolesT = translations.roles || {};
  const follower = getFollower(entry.id);
  const state = getFollowerState(entry.id, entry.stateId);
  if (!follower) return null;

  const tone = ROLE_TONES[follower.role] || 'border-slate-500/60 from-slate-800/60';

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border bg-gradient-to-b to-slate-950 text-slate-100 shadow-lg ${tone}`}>
      <button
        type="button"
        onClick={() => onRemove?.(entry.uid)}
        aria-label={`${follower.name}: quitar`}
        className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded bg-black/40 text-[0.6rem] font-bold text-white hover:bg-red-700"
      >
        ✕
      </button>

      <div className="flex items-center gap-1.5 border-b border-white/10 p-1 pr-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950/60 text-base font-black text-white">
          {follower.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.62rem] font-black leading-tight">{follower.name}</p>
          <p className="truncate text-[0.5rem] leading-tight text-slate-300">{follower.epithet}</p>
        </div>
      </div>

      <div className="space-y-0.5 p-1">
        <p className="truncate text-[0.5rem] font-bold uppercase tracking-wide text-slate-300">
          {rolesT[follower.role] || follower.role}
        </p>
        <select
          value={entry.stateId}
          onChange={(event) => onChangeState?.(entry.uid, event.target.value)}
          aria-label={`${follower.name}: estado`}
          className="w-full rounded border border-slate-600 bg-slate-900 px-1 py-0.5 text-[0.55rem] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          {follower.states.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <div className="flex items-center justify-between text-[0.55rem] tabular-nums">
          <span title="Vida">❤ {state?.vida}</span>
          <span title="Ataque">⚔ {state?.ataque}</span>
          <span title="Movimiento">👣 {state?.movimiento}</span>
        </div>
        {follower.capabilities?.length > 0 && (
          <p className="text-[0.5rem] leading-tight text-slate-300">{follower.capabilities.join(' · ')}</p>
        )}
      </div>
    </div>
  );
}
