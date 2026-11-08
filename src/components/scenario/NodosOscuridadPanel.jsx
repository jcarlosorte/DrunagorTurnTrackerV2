import { GiCardDraw } from 'react-icons/gi';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Nodos de Oscuridad (Despertar): misma mecánica que las Nieblas del juego
 * base, pero con estado y contador propios.
 */
export default function NodosOscuridadPanel() {
  const {
    nodosOscuridad,
    addNewNodoOscuridad,
    activarNodoOscuridad,
    addTileToNodoOscuridad,
    removeTileFromNodoOscuridad,
    placeTilesFromNodoOscuridadToTrack,
    codigosPilas,
    handleCodigoChange,
    showTileToast,
    notifyRompenodo,
  } = useGame();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};

  const romperNodo = (nodo) => {
    const removed = removeTileFromNodoOscuridad(nodo.id);
    if (!Array.isArray(removed) || removed.length === 0) {
      alert(t.emptyPila || 'Pila vacía');
      return;
    }
    removed.forEach((tile) => showTileToast(tile, 'retira'));
    notifyRompenodo();
  };

  return (
    <div className="track-surface-raised min-w-0 p-3 shadow-md">
      <div className="mb-2 flex items-center justify-center gap-2">
        <GiCardDraw className="text-purple-400 text-xl" />
        <span className="font-semibold text-white">{t.nodosOscuridad || 'Nodos de Oscuridad'}</span>
      </div>

      <button
        type="button"
        onClick={addNewNodoOscuridad}
        className="mb-2 rounded bg-purple-700 px-3 py-1 text-xs text-white hover:bg-purple-600"
      >
        ➕ {t.addNodoOscuridad || 'Añadir Nodo de Oscuridad'}
      </button>

      <div className="grid grid-cols-2 justify-center gap-2 md:grid-cols-3">
        {nodosOscuridad.map((nodo) => (
          <div key={nodo.id} className="track-surface-raised p-2 text-center text-white">
            {nodo.estado === 'reserva' ? (
              <>
                <div className="mb-2 font-bold">{t.nodoOscuridad || 'Nodo de Oscuridad'} 🗃️</div>
                <button
                  type="button"
                  className="state-btn-add rounded px-3 py-1 text-xs text-white"
                  onClick={() => activarNodoOscuridad(nodo.id)}
                >
                  ✅ {t.activaNodoOscuridad || 'Activar Nodo de Oscuridad'}
                </button>
              </>
            ) : (
              <>
                <div className="mb-1 font-bold">
                  <span>{t.nodoOscuridad || 'Nodo de Oscuridad'} 🗃️</span>
                  <input
                    type="text"
                    maxLength={5}
                    value={codigosPilas[nodo.id] || ''}
                    onChange={(event) => handleCodigoChange(nodo.id, event.target.value)}
                    className="min-h-11 w-[80px] rounded-lg border border-slate-600 bg-slate-900 px-2 text-center text-xs text-white"
                    placeholder="ABC12"
                    title={t.codigoPila}
                  />
                </div>
                <div className="mb-2 text-xs text-slate-300">
                  {t.tamano}: {nodo.tiles.length}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    className="state-btn-add rounded px-3 py-1 text-xs text-white"
                    onClick={() => addTileToNodoOscuridad(nodo.id)}
                  >
                    {t.addRunaToPila}
                  </button>
                  <button
                    type="button"
                    className="state-btn-remove rounded px-3 py-1 text-xs text-white"
                    onClick={() => romperNodo(nodo)}
                  >
                    {t.rompenodo || 'Rompenodo'}
                  </button>
                  <button
                    type="button"
                    className="rounded bg-red-900 px-3 py-1 text-xs text-white hover:bg-red-800"
                    onClick={() => {
                      const tiles = placeTilesFromNodoOscuridadToTrack(nodo.id);
                      if (!tiles || tiles.length === 0) alert(t.emptyPila || 'Pila vacía');
                    }}
                  >
                    {t.combateEstrecho || 'Combate estrecho'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
