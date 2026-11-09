export default function EventCardModal({ card, onClose, onSummon, onAction, actionLabel, summonLabel }) {
  if (!card) return null;

  return (
    <div className="layer-modal fixed inset-0 z-[95] flex items-center justify-center bg-black/80 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={card.title}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border-2 border-fuchsia-700/70 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <img
          src={card.background}
          alt=""
          draggable="false"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" aria-hidden="true" />

        <div className="relative p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 className="text-xl font-black uppercase tracking-wide text-fuchsia-200">{card.title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={summonLabel?.close || 'Cerrar'}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
            >
              ✕
            </button>
          </div>

          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-100">
            {card.text}
          </p>

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {card.action && (
              <button
                type="button"
                onClick={() => onAction?.(card)}
                className="min-h-10 rounded-xl bg-fuchsia-600 px-4 text-sm font-bold text-white hover:bg-fuchsia-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
              >
                {actionLabel || card.actionLabel || 'Resolver'}
              </button>
            )}
            {card.summon && (
              <button
                type="button"
                onClick={() => onSummon?.(card)}
                className="min-h-10 rounded-xl bg-fuchsia-600 px-4 text-sm font-bold text-white hover:bg-fuchsia-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
              >
                {summonLabel?.invoke || 'Invocar'} {card.summon.label}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 rounded-xl bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
            >
              {summonLabel?.close || 'Cerrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
