import canonTerrorifico from '@/assets/assets_logo/canon_terrorifico.png';

export default function TerribleCannonDialog({ open, cannons = [], onSelect, onCancel, labels = {} }) {
  if (!open) return null;

  return (
    <div className="layer-modal fixed inset-0 z-[96] flex items-center justify-center bg-black/75 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.title || 'Elegir Cañón Terrorífico'}
        className="w-full max-w-md rounded-2xl border-2 border-red-700/70 bg-slate-900 p-4 text-slate-100 shadow-2xl"
      >
        <h2 className="text-lg font-black text-red-200">{labels.title || 'Elegir Cañón Terrorífico'}</h2>
        <p className="mt-1 text-sm text-slate-300">{labels.description || 'Elige a qué cañón se le añade la ficha de tiempo.'}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {cannons.map((cannon, index) => (
            <button
              key={cannon.id}
              type="button"
              onClick={() => onSelect(cannon.id)}
              className="flex min-h-16 flex-col items-center gap-1 rounded-xl border border-red-700/60 bg-slate-950/70 p-2 text-xs font-bold text-red-100 hover:border-red-400 hover:bg-red-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              <img src={canonTerrorifico} alt="" className="h-9 w-9 rounded-full" />
              {labels.cannon || 'Cañón'} {index + 1}
              {cannon.time > 0 && <span className="text-[0.6rem] font-normal opacity-80">{labels.damaged || 'Dañado'}: {cannon.time}</span>}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-9 rounded-lg bg-slate-700 px-3 text-xs font-bold text-white hover:bg-slate-600"
          >
            {labels.cancel || 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
}
