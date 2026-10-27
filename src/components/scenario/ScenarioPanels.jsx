import { GiCardDraw, GiRuneStone } from 'react-icons/gi';
import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { OTROS } from '@/data/estadosAlterados';

/**
 * Paneles de escenario: pilas de runas, pila concentrada y control de áreas
 * (barricadas, puntos de aparición, claves de runa y rescate).
 *
 * Extraído de `TopMenu` (H8 3/3): consume los mismos contextos, así que no
 * necesita props.
 */
export default function ScenarioPanels() {
  const { translations } = useLanguage();
  const t = translations?.trackerInit || {};
  const [pilaConcentradaEliminarAbierta, setPilaConcentradaEliminarAbierta] = useState(null);

  const {
    availableTiles,
    showTileToast,
    pilas,
    addNewPila,
    activarPila,
    removeTileFromPila,
    addTileToPilaConcentrada,
    addTileToPila,
    pilasConcentrada,
    addNewPilaConcentrada,
    activarPilaConcentrada,
    removeSingleTileFromPilaConcentrada,
    codigosPilas,
    handleCodigoChange,
    placeTilesFromPilaConcentradaToTrack,
    placeTilesFromPilaToTrack,
    setSpawnPoints,
    spawnPoints,
    initializeSpawnPoints,
    removeSpawnPoint,
    controlPoints,
    setControlPoints,
    initializeControlPoints,
    removeControlPoint,
    setRuneKeys,
    runeKeys,
    initializeRuneKeys,
    removeRuneKey,
    setRescue,
    rescue,
    initializeRescue,
    removeRescue,
  } = useGame();

  const colorMap = {
    rojo: 'bg-red-700 hover:bg-red-600',
    azul: 'bg-blue-700 hover:bg-blue-600',
    verde: 'bg-green-700 hover:bg-green-600',
    naranja: 'bg-orange-700 hover:bg-orange-600',
    gris: 'bg-slate-600 hover:bg-slate-500',
  };

  return (
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  {/* Sub-bloque: Pilas */}
                  <div className="track-surface-raised flex-1 p-3 shadow-md">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                      <GiCardDraw className="text-purple-500 text-xl" />
                      <span className="font-semibold text-white">{t.gestionPila}</span>
                    </div>
  
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                      {/* Sub-bloque: Pila Oscuridad Inquieta */}
                      <div className="track-surface-raised flex-1 p-3 shadow-md">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <GiCardDraw className="text-purple-400 text-xl" />
                          <span className="font-semibold text-white">{t.gestionPilas}</span>
                        </div>
          
                        <button
                          disabled={!['rojo', 'azul', 'verde', 'naranja', 'gris'].every(c => availableTiles.some(t => t.runa === c))}
                          onClick={addNewPila}
                          className="mb-2 text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          ➕ {t.addPila}
                        </button>
                    
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 justify-center">
                          {pilas.map(pila => (
                            <div key={pila.id} className="track-surface-raised p-2 text-center text-white">
                              
                              {pila.estado === 'reserva' ? (
                                <>
                                  <div className="font-bold mb-2">{t.pila} 🗃️</div>
                                  <button
                                    className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                    onClick={() => activarPila(pila.id)}
                                  >
                                    ✅ {t.activaPila || 'Activar Pila'}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <div className="font-bold mb-1">
                                    <span>{t.pila} 🗃️</span>
                                    <input
                                      type="text"
                                      maxLength={5}
                                      value={codigosPilas[pila.id] || ''}
                                      onChange={(e) => handleCodigoChange(pila.id, e.target.value)}
                                      className="min-h-11 w-[80px] rounded-lg border border-slate-600 bg-slate-900 px-2 text-center text-xs text-white"
                                      placeholder="ABC12"
                                      title={t.codigoPila}
                                    />
                                  </div>
                                  <div className="text-xs text-slate-300 mb-2">
                                    {t.tamano}: {pila.tiles.length}
                                  </div>
                                  <div className="flex flex-col items-center gap-1">
                                    <button
                                      className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                      onClick={() => {addTileToPila(pila.id);}}
                                    >
                                      {t.addRunaToPila}
                                    </button>
                                    <button
                                      className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                      onClick={() => {
                                        const tilesRemoved = removeTileFromPila(pila.id);
                                        if (tilesRemoved && tilesRemoved.length > 0) {
                                          tilesRemoved.forEach(tile => showTileToast(tile, 'retira'));
                                        } else {
                                          alert(t.emptyPila);
                                        }
                                      }}
                                    >
                                      {t.devolver}
                                    </button>
                                    {/* Botón combate estrecho */}
                                    <button
                                      className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-xs relative group"
                                      onClick={() => {
                                        const tiles = placeTilesFromPilaToTrack(pila.id);
                                        if (!tiles || tiles.length === 0) {
                                          alert(t.emptyPila);
                                          return;
                                        }
                                      }}
                                    >
                                      {t.combateEstrecho_pila}
                                      {/* Helper */}
                                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 bg-black text-white text-[0.65rem] rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                        {t.helperCombateEstrecho || "Los Token sobrantes irán al medidor de iniciativa"}
                                      </span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                
                      {/* Sub-bloque: Pila Oscuridad Concentrada */}
                      <div className="track-surface-raised flex-1 p-3 shadow-md">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <GiCardDraw className="text-purple-400 text-xl" />
                          <span className="font-semibold text-white">{t.gestionPilas2}</span>
                        </div>
                  
                        <button
                          onClick={addNewPilaConcentrada}
                          className="mb-2 text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          ➕ {t.addNodo}
                        </button>
                  
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 justify-center">
                          {pilasConcentrada.map(pila => (
                            <div key={pila.id} className="track-surface-raised p-2 text-center text-white">
                              {pila.estado === 'reserva' ? (
                                <>
                                  <div className="font-bold mb-2">{t.nodo || 'Nodo'} 🗃️</div>
                                  <button
                                    className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                    onClick={() => activarPilaConcentrada(pila.id)}
                                  >
                                    ✅ {t.activaNodo || 'Activar Nodo'}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <div className="font-bold mb-1">
                                    <span>{t.nodo || 'Nodo'} 🗃️</span>
                                    <input
                                      type="text"
                                      maxLength={5}
                                      value={codigosPilas[pila.id] || ''}
                                      onChange={(e) => handleCodigoChange(pila.id, e.target.value)}
                                      className="min-h-11 w-[80px] rounded-lg border border-slate-600 bg-slate-900 px-2 text-center text-xs text-white"
                                      placeholder="ABC12"
                                      title={t.codigoPila}
                                    />
                                  </div>
                                  <div className="text-xs text-slate-300 mb-2">
                                    {t.tamano}: {pila.tiles.length}
                                  </div>
                                  <div className="flex flex-col items-center gap-1">
                                    <button
                                      className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                      onClick={() => {addTileToPilaConcentrada(pila.id);}}
                                    >
                                      {t.addRunaToPila}
                                    </button>
                                    <button
                                      className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                      aria-expanded={pilaConcentradaEliminarAbierta === pila.id}
                                      onClick={() =>
                                        setPilaConcentradaEliminarAbierta(prev =>
                                          prev === pila.id ? null : pila.id
                                        )
                                      }
                                    >
                                      {t.devolverNodo}
                                    </button>
                                    
                                    {pilaConcentradaEliminarAbierta === pila.id && (
                                      <div className="mt-1 p-2 rounded bg-slate-900 border border-red-700 flex flex-wrap justify-center gap-1">
                                        <div className="w-full text-[11px] text-slate-300 mb-1">
                                          {t.eliminarPorColor || 'Eliminar una runa:'}
                                        </div>
                                    
                                        {['naranja', 'verde', 'azul', 'rojo', 'gris']
                                          .filter(color =>
                                            pila.tiles.some(tile => tile.runa === color)
                                          )
                                          .map(color => (
                                            <button
                                              key={color}
                                              className={`${colorMap[color]} text-white px-2 py-1 rounded text-xs`}
                                              onClick={() => {
                                                const removed =
                                                  removeSingleTileFromPilaConcentrada(pila.id, color);
                                    
                                                if (removed) {
                                                  showTileToast(removed, 'retira');
                                                } else {
                                                  alert(t.emptyPila);
                                                }
                                    
                                                setPilaConcentradaEliminarAbierta(null);
                                              }}
                                            >
                                              {t.colores?.[color] || color}
                                            </button>
                                          ))}
                                    
                                        <button
                                          className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white px-2 py-1 rounded text-xs"
                                          onClick={() => {
                                            const removed =
                                              removeSingleTileFromPilaConcentrada(pila.id);
                                    
                                            if (removed) {
                                              showTileToast(removed, 'retira');
                                            } else {
                                              alert(t.emptyPila);
                                            }
                                    
                                            setPilaConcentradaEliminarAbierta(null);
                                          }}
                                        >
                                          🎲 {t.removeRandom || 'Aleatoria'}
                                        </button>
                                      </div>
                                    )}
                                    {/* Botón combate estrecho */}
                                    <button
                                      className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-xs relative group"
                                      onClick={() => {
                                        const tiles = placeTilesFromPilaConcentradaToTrack(pila.id);
                                        if (!tiles || tiles.length === 0) {
                                          alert(t.emptyPila);
                                          return;
                                        }
                                      }}
                                    >
                                      {t.combateEstrecho}
                                      {/* Helper */}
                                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 bg-black text-white text-[0.65rem] rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                        {t.helperCombateEstrecho || "Los Token sobrantes irán al medidor de iniciativa"}
                                      </span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                
                  {/* Bloque 2: Control de áreas y puntos de aparición */}
                  <div className="track-surface-raised flex-1 p-3 shadow-md">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                      <GiRuneStone className="text-cyan-500 text-xl" />
                      <span className="font-semibold">{t.controlAreas}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sub-bloque: Barricadas */}
                      <div className="track-surface-raised p-3 shadow-md">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <GiRuneStone className="text-cyan-400 text-xl" />
                          <span className="font-semibold">{t.barricadas}</span>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap justify-center">
                          <button
                            onClick={() => initializeControlPoints()}
                            className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded"
                          >
                            ➕ {t.addControlAreas}
                          </button>
                          <button
                            onClick={() => setControlPoints([])}
                            className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                          >
                            ✕ {t.removeCA}
                          </button>
                        </div>
                      </div>
                
                      {/* Sub-bloque: Puntos de aparición */}
                      <div className="track-surface-raised p-3 shadow-md">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <GiRuneStone className="text-cyan-400 text-xl" />
                          <span className="font-semibold">{t.spawnPoints}</span>
                        </div>
                  
                        <div className="flex gap-2 flex-wrap justify-center">
                          {/* Botón runas */}
                          <button
                            onClick={() => initializeSpawnPoints("runa")}
                            className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded"
                          >
                            ➕ {t.addSpawnPoints} {t.runes}
                          </button>
                      
                          {/* Botón evento */}
                          <button
                            onClick={() => initializeSpawnPoints("evento")}
                            className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                          >
                            ➕ {t.addSpawnPoints} {t.PAevento}
                          </button>
                      
                          {/* Botón eliminar */}
                          <button
                            onClick={() => setSpawnPoints([])}
                            className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                          >
                            ✕ {t.removeSP}
                          </button>
                        </div>  
                      </div>
  
                      {/* Sub-bloque: LLaves Rúnicas */}
                      <div className="track-surface-raised p-3 shadow-md">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <GiRuneStone className="text-cyan-400 text-xl" />
                          <span className="font-semibold">{t.runeKey}</span>
                        </div>
                  
                        <div className="flex gap-2 flex-wrap justify-center">
                          <button
                            onClick={() => initializeRuneKeys()}
                            className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded"
                          >
                            ➕ {t.addRuneKeys}
                          </button>
                          <button
                            onClick={() => setRuneKeys([])}
                            className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                          >
                            ✕ {t.removeRK}
                          </button>
                        </div>  
                      </div>
  
                      {/* Sub-bloque: Rescate de Aldeanos */}
                      <div className="track-surface-raised p-3 shadow-md">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <GiRuneStone className="text-cyan-400 text-xl" />
                          <span className="font-semibold">{t.rescue}</span>
                        </div>
                  
                        <div className="flex gap-2 flex-wrap justify-center">
                          <button
                            onClick={() => initializeRescue()}
                            className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded"
                          >
                            ➕ {t.addRescue}
                          </button>
                          <button
                            onClick={() => setRescue([])}
                            className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                          >
                            ✕ {t.removeRV}
                          </button>
                        </div>  
                      </div>
  
                      {/* Sub-bloque: mostrar botones */}
                      <div className="track-surface-raised p-3 shadow-md col-span-1 md:col-span-2">
                      <div className="flex items-center gap-2 mb-2 justify-center flex-wrap">
                        {controlPoints.length > 0 && (
                          <div className="track-surface-raised mt-3 p-2">
                            <div className="text-xs text-yellow-300 mb-2">{t.activeBarricade}</div>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {controlPoints.map(point => (
                                <div
                                  key={point.uuid}
                                  className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                                >
                                  <span>{t.colores[point.runa]}</span>
                                  <button
                                    onClick={() => removeControlPoint(point.uuid)}
                                    className="bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {spawnPoints.length > 0 && (
                          <div className="track-surface-raised mt-3 p-2">
                            <div className="text-xs text-yellow-300 mb-2">{t.activeSpawnPoints}</div>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {spawnPoints.map(point => {
                                if (point.runa === "evento") {
                                  // Buscar en OTROS la imagen
                                  const evento = OTROS.find(o => o.id === "evento");
                                  return (
                                    <div
                                      key={point.uuid}
                                      className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1 text-white"
                                    >
                                      {evento?.imagen && (
                                        <img 
                                          src={evento.imagen}
                                          alt=""
                                          className="h-6 w-6 object-contain" loading="lazy" decoding="async" />
                                      )}
                                      <span>{t.evento || 'Evento'}</span>
                                      <button
                                        onClick={() => removeSpawnPoint(point.uuid)}
                                        className="bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  );
                                }
                        
                                // 🔹 Render normal para runas
                                return (
                                  <div
                                    key={point.uuid}
                                    className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                                  >
                                    <span>{t.colores[point.runa]}</span>
                                    <button
                                      onClick={() => removeSpawnPoint(point.uuid)}
                                      className="bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
  
                        {runeKeys.length > 0 && (
                          <div className="track-surface-raised mt-3 p-2">
                            <div className="text-xs text-yellow-300 mb-2">{t.activeRuneKeys}</div>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {runeKeys.map(point => (
                                <div
                                  key={point.uuid}
                                  className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                                >
                                  <span>{t.colores[point.runa]}</span>
                                  <button
                                    onClick={() => removeRuneKey(point.uuid)}
                                    className="bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {rescue.length > 0 && (
                          <div className="track-surface-raised mt-3 p-2">
                            <div className="text-xs text-yellow-300 mb-2">{t.activeRescue}</div>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {rescue.map(point => (
                                <div
                                  key={point.uuid}
                                  className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                                >
                                  <span>{t.colores[point.runa]}</span>
                                  <button
                                    onClick={() => removeRescue(point.uuid)}
                                    className="bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      </div>
                      
                    </div>
  
                  </div>
                {/* FIN BLOQUE */}
                </div>
  );
}
