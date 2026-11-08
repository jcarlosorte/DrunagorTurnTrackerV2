import { MAGIC_CANNON_IMAGES } from '@/components/track/MagicCannonsBar';

export default function CannonLoadDialog({
  open,
  runeColor,
  reason,
  options = [],
  onSelect,
  onSkip,
  labels = {},
}) {
  if (!open) return null;

  const description = reason === 'blue'
    ? (labels.bluePrompt || 'La runa azul no tiene cañón propio. Elige un cañón descargado para cargarlo.')
    : (labels.loadedPrompt || 'El cañón de ese color ya está cargado. Elige otro cañón descargado o no cargues ninguno.');

  return (
    <div className="layer-modal fixed inset-0 z-[95] flex items-center justify-center bg-black/75 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.title || 'Cargar cañón mágico'}
        className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-orange-700/70 bg-slate-900 p-4 text-slate-100 shadow-2xl"
      >
        <h2 className="text-lg font-black text-orange-200">{labels.title || 'Cargar cañón mágico'}</h2>
        <p className="mt-1 text-xs text-slate-300">
          {labels.rune || 'Runa'}: <b>{labels.colors?.[runeColor] || runeColor}</b>
        </p>
        <p className="mt-2 text-sm text-slate-200">{description}</p>

        {options.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {options.map((cannon) => (
              <button
                key={cannon.id}
                type="button"
                onClick={() => onSelect(cannon.id)}
                className="flex min-h-12 items-center gap-2 rounded-xl border border-orange-700/60 bg-slate-950/70 px-2 text-left text-xs font-bold text-orange-100 hover:border-orange-400 hover:bg-orange-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
              >
                <img src={MAGIC_CANNON_IMAGES[cannon.color]} alt="" className="h-7 w-7 rounded-full" />
                {labels.colors?.[cannon.color] || cannon.color}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-amber-700/60 bg-amber-950/30 p-2 text-xs text-amber-100">
            {labels.none || 'No hay cañones descargados disponibles.'}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onSkip}
            className="min-h-9 rounded-lg bg-slate-700 px-3 text-xs font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {labels.skip || 'No cargar'}
          </button>
        </div>
      </div>
    </div>
  );
}
