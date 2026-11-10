import siegeDeckBack from '@/assets/runes/card-indigo.webp';
import { SIEGE_CARDS } from '@/data/siegeOfEveredge';

export default function SiegeDeckModal({
  open,
  event,
  labels = {},
  onRemove,
  onReset,
  onClose,
}) {
  if (!open || !event?.active) return null;
  const drawn = Math.max(0, 10 - (event.deck?.length || 0));
  const current = SIEGE_CARDS.find((card) => card.number === event.current);
  const text = current
    ? String(labels[current.textKey] || '').replace(/\.\s+/g, '.\n').replace(/:\s+/g, ':\n').replace(/;\s+/g, ';\n')
    : '';

  return (
    <div className="layer-modal fixed inset-0 z-[98] flex items-center justify-center bg-black/80 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.siegeTitle || 'Asedio de Limiternia'}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border-2 border-amber-600/80 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <img src={siegeDeckBack} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/85 to-slate-950" aria-hidden="true" />
        <div className="relative p-5">
          <h2 className="text-xl font-black uppercase tracking-wide text-amber-100">
            {labels.siegeTitle || 'Asedio de Limiternia'}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-amber-700 bg-amber-950/50 px-2 py-1 text-amber-100">
              {labels.siegeCounter || 'Contador'}: {drawn}/10
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-950/50 px-2 py-1 text-slate-200">
              {labels.siegeRemaining || 'Cartas restantes'}: {event.deck?.length || 0}
            </span>
          </div>
          {current ? (
            <div className="mt-4 rounded-xl border border-amber-700/50 bg-black/30 p-3">
              <p className="text-sm font-black text-amber-200">{labels[current.titleKey] || `Carta ${current.number}`}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-100">{text}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-300">{labels.siegeNoCurrent || 'Todavía no se ha robado ninguna carta.'}</p>
          )}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={onRemove} className="min-h-9 rounded-lg bg-red-900 px-3 text-xs font-bold text-white hover:bg-red-800">
              {labels.siegeRemove || 'Eliminar'}
            </button>
            <button type="button" onClick={onReset} className="min-h-9 rounded-lg bg-slate-700 px-3 text-xs font-bold text-white hover:bg-slate-600">
              {labels.siegeReset || 'Reiniciar'}
            </button>
            <button type="button" onClick={onClose} className="min-h-9 rounded-lg bg-emerald-700 px-3 text-xs font-bold text-white hover:bg-emerald-600">
              {labels.close || 'Cerrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
