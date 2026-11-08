import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { useExpansions } from '@/context/ExpansionContext';
import pilaRunasIcon from '@/assets/assets_logo/pila-runas.webp';

const COLOR_BRICKS = {
  naranja: 'bg-orange-500 border-orange-300',
  verde: 'bg-emerald-500 border-emerald-300',
  azul: 'bg-blue-500 border-blue-300',
  rojo: 'bg-red-500 border-red-300',
  gris: 'bg-slate-400 border-slate-300',
};

const COLOR_ORDER = { naranja: 0, verde: 1, azul: 2, rojo: 3, gris: 4 };

export default function PilaStatusPanel() {
  const {
    pilas,
    pilasConcentrada,
    nodosOscuridad,
    activarPila,
    activarPilaConcentrada,
    activarNodoOscuridad,
    addTileToPila,
    addTileToPilaConcentrada,
    addTileToNodoOscuridad,
    removeSingleTileFromPila,
    removeSingleTileFromPilaConcentrada,
    removeSingleTileFromNodoOscuridad,
    removeTileFromPila,
    removeTileFromPilaConcentrada,
    removeTileFromNodoOscuridad,
    codigosPilas,
    handleCodigoChange,
    showTileToast,
    notifyRompenodo,
  } = useGame();
  const { mainBox, previewOtherBoxes } = useExpansions();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  const showCoreContent = mainBox === 'core' || previewOtherBoxes;
  const showAwakeningsContent = mainBox === 'awakenings' || previewOtherBoxes;

  const entries = [
    ...(showCoreContent ? pilas.map((pila) => ({ ...pila, kind: 'pila' })) : []),
    ...(showCoreContent ? pilasConcentrada.map((pila) => ({ ...pila, kind: 'niebla' })) : []),
    ...(showAwakeningsContent ? nodosOscuridad.map((pila) => ({ ...pila, kind: 'oscuridad' })) : []),
  ];
  if (!entries.length) return null;

  return (
    <section className="track-surface-raised min-h-0 overflow-auto p-2">
      <div className="mb-2 flex items-center gap-1.5">
        <img src={pilaRunasIcon} alt="" className="h-5 w-5 rounded-full" />
        <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-yellow-300">
          {t.gestionPila || 'Pilas y nodos'}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {entries.map((pila) => {
          const tiles = Array.isArray(pila.tiles) ? pila.tiles : [];
          const sortedTiles = [...tiles].sort((a, b) => (
            (COLOR_ORDER[a.runa] ?? 9) - (COLOR_ORDER[b.runa] ?? 9)
          ));
          const isActive = pila.estado !== 'reserva';
          const label = pila.kind === 'pila'
            ? (t.pila || 'Pila')
            : pila.kind === 'niebla'
              ? (t.nodo || 'Nodo')
              : (t.nodoOscuridad || 'Nodo de Oscuridad');

          const activate = () => {
            if (pila.kind === 'pila') activarPila(pila.id);
            else if (pila.kind === 'niebla') activarPilaConcentrada(pila.id);
            else activarNodoOscuridad(pila.id);
          };
          const addTile = () => {
            if (pila.kind === 'pila') addTileToPila(pila.id);
            else if (pila.kind === 'niebla') addTileToPilaConcentrada(pila.id);
            else addTileToNodoOscuridad(pila.id);
          };
          const removeOne = (tile) => {
            const removed = pila.kind === 'pila'
              ? removeSingleTileFromPila(pila.id, tile.runa)
              : pila.kind === 'niebla'
                ? removeSingleTileFromPilaConcentrada(pila.id, tile.runa)
                : removeSingleTileFromNodoOscuridad(pila.id, tile.runa);
            if (removed) showTileToast(removed, 'retira');
          };
          const romper = () => {
            const removed = pila.kind === 'pila'
              ? removeTileFromPila(pila.id)
              : pila.kind === 'niebla'
                ? removeTileFromPilaConcentrada(pila.id)
                : removeTileFromNodoOscuridad(pila.id);
            if (Array.isArray(removed) && removed.length > 0) {
              removed.forEach((tile) => showTileToast(tile, 'retira'));
              notifyRompenodo();
            } else {
              alert(t.emptyPila || 'Pila vacía');
            }
          };

          return (
            <div key={`${pila.kind}-${pila.id}`} className="rounded-lg border border-slate-700 bg-slate-950/60 p-1.5">
              {!isActive ? (
                <button
                  type="button"
                  onClick={activate}
                  className="w-full rounded bg-emerald-700 px-1.5 py-1 text-[0.55rem] font-bold text-white"
                >
                  {t.activar || 'Activar'} {label} {pila.numPila}
                </button>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[0.6rem] font-bold text-slate-100">
                      {label} {pila.numPila}
                    </span>
                    <span className="rounded bg-emerald-800 px-1 text-[0.5rem] font-bold text-emerald-100">
                      {pila.estado}
                    </span>
                  </div>

                  <label className="mt-1 block text-[0.5rem] text-slate-400">
                    {t.codigoPila || 'Código'}
                    <input
                      type="text"
                      maxLength={5}
                      value={codigosPilas[pila.id] || ''}
                      onChange={(event) => handleCodigoChange(pila.id, event.target.value)}
                      className="ml-1 w-[44px] rounded bg-slate-800 px-1 py-0.5 text-center text-[0.55rem] text-white"
                      placeholder="ABC12"
                    />
                  </label>

                  {/* Columna de ladrillos ordenada por color. */}
                  <div className="mt-1 flex max-h-24 flex-col gap-0.5 overflow-y-auto">
                    {sortedTiles.length === 0 && (
                      <span className="text-[0.5rem] text-slate-500">{t.emptyPila || 'Sin runas'}</span>
                    )}
                    {sortedTiles.map((tile, index) => (
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
                    <button
                      type="button"
                      onClick={addTile}
                      className="rounded bg-sky-700 px-1.5 py-0.5 text-[0.5rem] font-bold text-white"
                    >
                      + {t.addRunaToPila || 'Runa'}
                    </button>
                    <button
                      type="button"
                      onClick={romper}
                      className="rounded bg-slate-700 px-1.5 py-0.5 text-[0.5rem] font-bold text-white"
                    >
                      {t.rompenodo || 'Rompenodo'}
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
