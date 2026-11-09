export default function VisionClaraModal({ open, onClose, labels = {} }) {
  if (!open) return null;

  return (
    <div className="layer-modal fixed inset-0 z-[96] flex items-center justify-center bg-black/75 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.title || 'Visión Clara'}
        className="w-full max-w-md rounded-2xl border-2 border-cyan-700/70 bg-slate-900 p-4 text-slate-100 shadow-2xl"
      >
        <h2 className="text-lg font-black text-cyan-200">{labels.title || 'Visión Clara'}</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-200">
          {labels.text || 'La regla especial de Visión Reducida está suspendida mientras esta ficha permanezca en la carta de escenario del Artillero Infame. Se retira cuando el medidor de iniciativa vuelva a alcanzar esa carta en la siguiente ronda.'}
        </p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 rounded-lg bg-cyan-700 px-4 text-xs font-bold text-white hover:bg-cyan-600"
          >
            {labels.close || 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
