import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';

const COLORS = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
const COLOR_BARS = {
  naranja: 'bg-orange-500',
  verde: 'bg-emerald-500',
  azul: 'bg-blue-500',
  rojo: 'bg-red-500',
  gris: 'bg-slate-400',
};

export default function PilaStatusPanel() {
  const {
    pilas,
    pilasConcentrada,
    activarPila,
    activarPilaConcentrada,
    addTileToPila,
    addTileToPilaConcentrada,
  } = useGame();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  const entries = [
    ...pilas.map((pila) => ({ ...pila, kind: 'pila' })),
    ...pilasConcentrada.map((pila) => ({ ...pila, kind: 'nodo' })),
  ];
  if (!entries.length) return null;

  return (
    <section className="track-surface-raised min-h-0 overflow-auto p-2">
      <h3 className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-yellow-300">
        {t.gestionPila || 'Pilas y nodos'}
      </h3>
      <div className="space-y-1.5">
        {entries.map((pila) => {
          const counts = COLORS.reduce((acc, color) => {
            const count = pila.tiles.filter((tile) => tile.runa === color).length;
            if (count > 0) acc[color] = count;
            return acc;
          }, {});
          return (
            <div key={`${pila.kind}-${pila.id}`} className="rounded-lg border border-slate-700 bg-slate-950/60 p-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.65rem] font-bold text-slate-100">
                  {pila.kind === 'nodo' ? (t.nodo || 'Nodo') : (t.pila || 'Pila')} {pila.numPila}
                </span>
                <span className={`rounded px-1 text-[0.55rem] font-bold ${pila.estado === 'activa' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-700 text-slate-200'}`}>
                  {pila.estado}
                </span>
              </div>
              <div className="mt-1 flex flex-col gap-0.5">
                {Object.entries(counts).map(([color, count]) => (
                  <div key={color} className="flex items-center gap-1">
                    <span className={`h-2 flex-1 rounded ${COLOR_BARS[color]}`} />
                    <span className="w-4 text-right text-[0.55rem] text-slate-300">{count}</span>
                  </div>
                ))}
                {Object.keys(counts).length === 0 && (
                  <span className="text-[0.55rem] text-slate-500">—</span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {pila.estado === 'reserva' ? (
                  <button
                    type="button"
                    onClick={() => (pila.kind === 'nodo' ? activarPilaConcentrada(pila.id) : activarPila(pila.id))}
                    className="rounded bg-emerald-700 px-1.5 py-0.5 text-[0.55rem] font-bold text-white"
                  >
                    {pila.kind === 'nodo' ? (t.activaNodo || 'Activar') : (t.activaPila || 'Activar')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => (pila.kind === 'nodo' ? addTileToPilaConcentrada(pila.id) : addTileToPila(pila.id))}
                    className="rounded bg-sky-700 px-1.5 py-0.5 text-[0.55rem] font-bold text-white"
                  >
                    + {t.addRunaToPila || 'Runa'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
