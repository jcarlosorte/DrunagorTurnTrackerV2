const VORN_OPTIONS = [
  { id: 'animado', label: 'Animado' },
  { id: 'sediento', label: 'Sediento' },
];

const ELROS_OPTIONS = [
  { id: 'desanimado', label: 'Desanimado' },
  { id: 'energico', label: 'Enérgico' },
];

export default function SceneFollowerDialog({
  open,
  missing = { vorn: false, elros: false },
  values = { vorn: 'animado', elros: 'energico' },
  onChange,
  onConfirm,
  onCancel,
  labels = {},
}) {
  if (!open) return null;
  const showVorn = missing.vorn;
  const showElros = missing.elros;
  if (!showVorn && !showElros) return null;

  return (
    <div className="layer-modal fixed inset-0 z-[96] flex items-center justify-center bg-black/75 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.title || 'Seguidores de la escena'}
        className="w-full max-w-md rounded-2xl border-2 border-amber-700/70 bg-slate-900 p-4 text-slate-100 shadow-2xl"
      >
        <h2 className="text-lg font-black text-amber-200">{labels.title || 'Seguidores de la escena'}</h2>
        <p className="mt-1 text-xs text-slate-300">{labels.description || 'Elige el estado con el que se añaden los seguidores.'}</p>

        {showVorn && (
          <label className="mt-4 block text-sm font-semibold text-slate-200">
            Vorn
            <select
              value={values.vorn}
              onChange={(event) => onChange?.('vorn', event.target.value)}
              className="mt-1 min-h-10 w-full rounded-lg border border-slate-600 bg-slate-950 px-2 text-sm text-white"
            >
              {VORN_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
        )}

        {showElros && (
          <label className="mt-3 block text-sm font-semibold text-slate-200">
            Elros
            <select
              value={values.elros}
              onChange={(event) => onChange?.('elros', event.target.value)}
              className="mt-1 min-h-10 w-full rounded-lg border border-slate-600 bg-slate-950 px-2 text-sm text-white"
            >
              {ELROS_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-9 rounded-lg bg-slate-700 px-3 text-xs font-bold text-white hover:bg-slate-600"
          >
            {labels.cancel || 'Cancelar'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-9 rounded-lg bg-amber-700 px-3 text-xs font-bold text-white hover:bg-amber-600"
          >
            {labels.confirm || 'Añadir seguidores'}
          </button>
        </div>
      </div>
    </div>
  );
}
