export default function RompenodoDialog({
  target,
  onPickColor,
  onRandom,
  onClose,
  labels = {},
}) {
  if (!target) return null;
  const entries = Object.entries(target.counts || {}).filter(([, count]) => count > 0);

  return (
    <div className="layer-modal fixed inset-0 z-[96] flex items-center justify-center bg-black/75 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${labels.title || 'Rompenodo'} · ${target.name}`}
        className="w-full max-w-md rounded-2xl border-2 border-purple-700/70 bg-slate-900 p-4 text-slate-100 shadow-2xl"
      >
        <h2 className="text-lg font-black text-purple-200">{labels.title || 'Rompenodo'}</h2>
        <p className="mt-1 text-sm text-slate-300">
          {target.name} · {labels.remaining || 'Runas por retirar'}: <b>{target.remaining}</b>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {labels.help || 'Elige el color de la runa que se retira o deja que sea aleatoria.'}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {entries.map(([color, count]) => (
            <button
              key={color}
              type="button"
              onClick={() => onPickColor?.(color)}
              className="flex min-h-12 items-center justify-between gap-2 rounded-xl border border-slate-600 bg-slate-950/70 px-3 text-sm font-bold text-white hover:border-purple-400 hover:bg-purple-950/40"
            >
              <span>{labels.colors?.[color] || color}</span>
              <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs">{count}</span>
            </button>
          ))}
        </div>

        {entries.length === 0 && (
          <p className="mt-4 rounded-lg border border-amber-700/60 bg-amber-950/30 p-2 text-xs text-amber-100">
            {labels.empty || 'No quedan runas en la pila.'}
          </p>
        )}

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {entries.length > 0 && (
            <button
              type="button"
              onClick={onRandom}
              className="min-h-9 rounded-lg bg-indigo-700 px-3 text-xs font-bold text-white hover:bg-indigo-600"
            >
              🎲 {labels.random || 'Aleatoria'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 rounded-lg bg-slate-700 px-3 text-xs font-bold text-white hover:bg-slate-600"
          >
            {labels.close || 'Dejar de romper'}
          </button>
        </div>
      </div>
    </div>
  );
}
