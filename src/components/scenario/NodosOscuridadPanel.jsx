import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import pilaRunasIcon from '@/assets/assets_logo/pila-runas.webp';
import useRompenodo from '@/hooks/useRompenodo';

/**
 * Nodos de Oscuridad (Despertar): misma mecánica que las Nieblas del juego
 * base, pero con estado y contador propios.
 */
export default function NodosOscuridadPanel() {
  const {
    nodosOscuridad,
    addNewNodoOscuridad,
    activarNodoOscuridad,
    placeTilesFromNodoOscuridadToTrack,
    codigosPilas,
    handleCodigoChange,
  } = useGame();
  const { openRompenodo, rompenodoDialog } = useRompenodo();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};

  return (
    <div className="track-surface-raised min-w-0 p-2 shadow-md">
      <div className="mb-2 flex items-center justify-center gap-2">
        <img src={pilaRunasIcon} alt="" className="h-7 w-7 rounded-full" />
        <span className="font-semibold text-white">{t.nodosOscuridad || 'Nodos de Oscuridad'}</span>
      </div>

      <button
        type="button"
        onClick={addNewNodoOscuridad}
        className="mb-2 rounded bg-purple-700 px-3 py-1 text-xs text-white hover:bg-purple-600"
      >
        ➕ {t.addNodoOscuridad || 'Añadir Nodo de Oscuridad'}
      </button>

      <div className="grid grid-cols-3 justify-center gap-1">
        {nodosOscuridad.map((nodo, index) => {
          const numero = nodo.numPila || index + 1;
          const titulo = (t.nodoNumero || 'Nodo {n}').replace('{n}', numero);
          return (
          <div key={nodo.id} className="track-surface-raised min-w-0 p-1.5 text-center text-white">
            {nodo.estado === 'reserva' ? (
              <>
                <div className="mb-1 truncate text-[0.65rem] font-bold">{titulo} 🗃️</div>
                <button
                  type="button"
                  className="state-btn-add rounded px-1.5 py-0.5 text-[0.6rem] text-white"
                  onClick={() => activarNodoOscuridad(nodo.id)}
                >
                  ✅ {t.activaNodoOscuridad || 'Activar Nodo de Oscuridad'}
                </button>
              </>
            ) : (
              <>
                <div className="mb-1 flex flex-col items-center gap-0.5">
                  <span className="truncate text-[0.65rem] font-bold">{titulo} 🗃️</span>
                  <input
                    type="text"
                    maxLength={5}
                    value={codigosPilas[nodo.id] || ''}
                    onChange={(event) => handleCodigoChange(nodo.id, event.target.value)}
                    className="min-h-8 w-16 rounded border border-slate-600 bg-slate-900 px-1 text-center text-[0.65rem] text-white"
                    placeholder="ABC12"
                    title={t.codigoPila}
                  />
                </div>
                <div className="mb-1 text-[0.6rem] text-slate-300">
                  {t.tamano}: {nodo.tiles.length}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    type="button"
                    className="state-btn-remove rounded px-1.5 py-0.5 text-[0.6rem] text-white"
                    onClick={() => openRompenodo('oscuridad', nodo)}
                  >
                    {t.rompenodo || 'Rompenodo'}
                  </button>
                  <button
                    type="button"
                    className="rounded bg-red-900 px-1.5 py-0.5 text-[0.6rem] text-white hover:bg-red-800"
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
          );
        })}
      </div>
      {rompenodoDialog}
    </div>
  );
}
