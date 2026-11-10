export default function SceneFollowerSelectionDialog({
  open,
  count = 0,
  options = [],
  selected = [],
  onToggle,
  onConfirm,
  onClose,
  labels = {},
}) {
  if (!open) return null;

  return (
    <div className="layer-modal fixed inset-0 z-[96] flex items-center justify-center bg-black/75 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.title || 'Elegir seguidores'}
        className="w-full max-w-lg rounded-2xl border-2 border-amber-700/70 bg-slate-900 p-4 text-slate-100 shadow-2xl"
      >
        <h2 className="text-lg font-black text-amber-200">{labels.title || 'Elegir seguidores'}</h2>
        <p className="mt-1 text-xs text-slate-300">
          {labels.description || `Elige ${count} seguidores de la escena.`}
        </p>
        <p className="mt-1 text-xs font-bold text-amber-100">{selected.length}/{count}</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selected.includes(option.id);
            const disabled = !isSelected && selected.length >= count;
            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggle?.(option.id)}
                className={`rounded-xl border px-3 py-2 text-left text-sm font-bold ${
                  isSelected
                    ? 'border-amber-400 bg-amber-900/50 text-amber-100'
                    : 'border-slate-600 bg-slate-950/60 text-slate-200 hover:border-amber-500'
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <span className="block">{option.name}</span>
                <span className="block text-[0.65rem] font-normal text-slate-300">{option.stateName}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="min-h-9 rounded-lg bg-slate-700 px-3 text-xs font-bold text-white hover:bg-slate-600">
            {labels.cancel || 'Cancelar'}
          </button>
          <button
            type="button"
            disabled={selected.length !== count}
            onClick={onConfirm}
            className="min-h-9 rounded-lg bg-amber-700 px-3 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-40"
          >
            {labels.confirm || 'Añadir seguidores'}
          </button>
        </div>
      </div>
    </div>
  );
}
