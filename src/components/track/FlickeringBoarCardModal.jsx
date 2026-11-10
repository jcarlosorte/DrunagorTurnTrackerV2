import boarBackground from '@/assets/interactions/runic.avif';

export default function FlickeringBoarCardModal({
  open,
  card,
  movement = 3,
  labels = {},
  onResolve,
}) {
  if (!open || !card) return null;
  const text = String(labels[card.textKey] || '').replace(/3 casillas/g, `${movement} casillas`);

  return (
    <div className="layer-modal fixed inset-0 z-[97] flex items-center justify-center bg-black/80 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels[card.titleKey] || 'Carta del Jabalí Parpadeante'}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border-2 border-amber-600/80 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <img src={boarBackground} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" draggable="false" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" aria-hidden="true" />
        <div className="relative p-5">
          <h2 className="text-xl font-black uppercase tracking-wide text-amber-200">
            {labels[card.titleKey] || card.kind}
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-100">{text}</p>
          {card.fury && (
            <div className="mt-3 rounded-xl border border-orange-500/60 bg-orange-950/60 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-orange-200">
                {labels.boarFury || '¡FURIA!'}
              </p>
              <p className="mt-1 text-sm text-orange-50">
                {labels.boarEvolution || 'EVOLUCIÓN: +2 Ataque y +1 Movimiento'}
              </p>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onResolve}
              className="min-h-10 rounded-xl bg-amber-600 px-4 text-sm font-bold text-white hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              {labels.boarResolve || 'Aplicar y activar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
