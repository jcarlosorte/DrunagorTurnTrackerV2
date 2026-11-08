import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';

const COLOR_BRICKS = {
  naranja: 'bg-orange-500 border-orange-300',
  verde: 'bg-emerald-500 border-emerald-300',
  azul: 'bg-blue-500 border-blue-300',
  rojo: 'bg-red-500 border-red-300',
  gris: 'bg-slate-400 border-slate-300',
};

export default function PilaStatusPanel() {
  const {
    pilas,
    pilasConcentrada,
    activarPila,
    activarPilaConcentrada,
    addTileToPila,
    addTileToPilaConcentrada,
    removeSingleTileFromPila,
    removeSingleTileFromPilaConcentrada,
    removeTileFromPila,
    removeTileFromPilaConcentrada,
    placeTilesFromPilaToTrack,
    placeTilesFromPilaConcentradaToTrack,
    codigosPilas,
    handleCodigoChange,
    showTileToast,
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
      <div className="space-y-2">
        {entries.map((pila) => {
          const isNodo = pila.kind === 'nodo';
          const tiles = Array.isArray(pila.tiles) ? pila.tiles : [];
          const removeOne = (tile) => {
            const removed = isNodo
              ? removeSingleTileFromPilaConcentrada(pila.id, tile.runa)
              : removeSingleTileFromPila(pila.id, tile.runa);
            if (removed) showTileToast(removed, 'retira');
          };
          const removeAll = () => {
            const removed = isNodo
              ? removeTileFromPilaConcentrada(pila.id)
              : removeTileFromPila(pila.id);
            if (Array.isArray(removed)) removed.forEach((tile) => showTileToast(tile, 'retira'));
            else if (removed) showTileToast(removed, 'retira');
          };
          const combat = () => {
            const placed = isNodo
              ? placeTilesFromPilaConcentradaToTrack(pila.id)
              : placeTilesFromPilaToTrack(pila.id);
            if (!placed || placed.length === 0) alert(t.emptyPila || 'Pila vacía');
          };

          return (
            <div key={`${pila.kind}-${pila.id}`} className="rounded-lg border border-slate-700 bg-slate-950/60 p-1.5">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[0.65rem] font-bold text-slate-100">
                  {isNodo ? (t.nodo || 'Nodo') : (t.pila || 'Pila')} {pila.numPila}
                </span>
                <span className={`rounded px-1 text-[0.5rem] font-bold ${pila.estado === 'activa' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-700 text-slate-200'}`}>
                  {pila.estado}
                </span>
              </div>

              <label className="mt-1 block text-[0.55rem] text-slate-400">
                {t.codigoPila || 'Código'}
                <input
                  type="text"
                  maxLength={5}
                  value={codigosPilas[pila.id] || ''}
                  onChange={(event) => handleCodigoChange(pila.id, event.target.value)}
                  className="ml-1 w-[52px] rounded bg-slate-800 px-1 py-0.5 text-center text-[0.6rem] text-white"
                  placeholder="ABC12"
                />
              </label>

              {/* Columna de ladrillos: cada ficha es un ladrillo del color de su runa. */}
              <div className="mt-1 flex max-h-24 flex-col gap-0.5 overflow-y-auto">
                {tiles.length === 0 && (
                  <span className="text-[0.55rem] text-slate-500">{t.emptyPila || 'Sin runas'}</span>
                )}
                {tiles.map((tile, index) => (
                  <button
                    key={tile.uuid || `${pila.id}-${index}`}
                    type="button"
                    onClick={() => removeOne(tile)}
                    title={`${t.colores?.[tile.runa] || tile.runa} · ${t.remove || 'Quitar'}`}
                    className={`h-3 w-full rounded-sm border ${COLOR_BRICKS[tile.runa] || 'bg-slate-500 border-slate-300'}`}
                  />
                ))}
              </div>

              <div className="mt-1 flex flex-wrap gap-1">
                {pila.estado === 'reserva' ? (
                  <button
                    type="button"
                    onClick={() => (isNodo ? activarPilaConcentrada(pila.id) : activarPila(pila.id))}
                    className="rounded bg-emerald-700 px-1.5 py-0.5 text-[0.55rem] font-bold text-white"
                  >
                    {isNodo ? (t.activaNodo || 'Activar') : (t.activaPila || 'Activar')}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => (isNodo ? addTileToPilaConcentrada(pila.id) : addTileToPila(pila.id))}
                      className="rounded bg-sky-700 px-1.5 py-0.5 text-[0.55rem] font-bold text-white"
                    >
                      + {t.addRunaToPila || 'Runa'}
                    </button>
                    <button
                      type="button"
                      onClick={removeAll}
                      className="rounded bg-slate-700 px-1.5 py-0.5 text-[0.55rem] font-bold text-white"
                    >
                      {t.devolver || 'Devolver'}
                    </button>
                    <button
                      type="button"
                      onClick={combat}
                      className="rounded bg-red-900 px-1.5 py-0.5 text-[0.55rem] font-bold text-white"
                    >
                      {t.combateEstrecho || 'Combate'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
