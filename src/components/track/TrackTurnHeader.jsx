export default function TrackTurnHeader({ roundLabel, round, turnLabel, turn, entityLabel, className = '' }) {
  return (
    <div
      className={`mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm shadow-lg ${className}`}
      aria-live="polite"
    >
      <span className="font-semibold text-emerald-200">
        {roundLabel || 'Ronda'}: <b className="text-white">{round ?? 0}</b>
      </span>
      <span className="text-slate-300">
        {turnLabel || 'Turno'}: <b className="text-white">{turn}</b>
      </span>
      {entityLabel && (
        <span className="min-w-0 flex-1 truncate text-right text-sky-200" title={entityLabel}>
          {entityLabel}
        </span>
      )}
    </div>
  );
}
