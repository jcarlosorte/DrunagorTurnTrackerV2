import siegeBackground from '@/assets/interactions/portal.avif';

export default function SiegeCardModal({ card, labels = {}, onResolve, resolving = false }) {
  if (!card) return null;
  const rawText = String(labels[card.textKey] || '');
  const text = rawText.includes('\n')
    ? rawText
    : rawText.replace(/\.\s+/g, '.\n').replace(/:\s+/g, ':\n').replace(/;\s+/g, ';\n');

  return (
    <div className="layer-modal fixed inset-0 z-[98] flex items-center justify-center bg-black/80 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels[card.titleKey] || `Asedio ${card.number}`}
        className="siege-draw relative w-full max-w-xl overflow-hidden rounded-2xl border-2 border-amber-600/80 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <img src={siegeBackground} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/85 to-slate-950" aria-hidden="true" />
        <div className="relative p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-300">
              {labels.siegeTitle || 'Asedio de Limiternia'} · {card.number}/10
            </p>
          </div>
          <h2 className="mt-1 text-xl font-black uppercase tracking-wide text-amber-100">
            {labels[card.titleKey] || `Carta ${card.number}`}
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-100">
            {text}
          </p>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={resolving}
              onClick={onResolve}
              className="min-h-10 rounded-xl bg-amber-600 px-4 text-sm font-bold text-white hover:bg-amber-500 disabled:opacity-60"
            >
              {resolving ? '...' : (labels.siegeResolve || 'Resolver asedio')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
