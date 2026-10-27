// src/components/TopMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMenu } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { languages as availableLanguages, languageNames } from '@/i18n/languageData';
import { useSavesUi } from '@/context/SavesUiContext';
import { GiArchiveRegister, GiSwordClash, GiSpikedDragonHead, GiCrownedSkull, GiDiceTarget, GiShield, GiDaemonSkull, GiBullyMinion, GiRuneStone, GiMinions, GiBrickWall, GiCardPlay, GiVillage, GiUprising, GiStoneTower, GiCardDraw, GiCardPick, GiSwapBag, GiTrashCan, GiLeechingWorm, GiReaperScythe, GiGearHammer } from 'react-icons/gi';
import { MdAddCircleOutline } from 'react-icons/md';
import { RUNAS, RUNAS_F, ASALTO } from '@/data/runas';
import { ENEMIES } from '@/data/enemies';
import { INCURSION } from '@/data/incursion';
import { DEFENSA } from '@/data/defensa';
import { OTROS } from '@/data/estadosAlterados';
import { useInitEnemies } from "@/context/InitEnemiesContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGame } from '@/context/GameContext';
import { useInitRunes } from "@/context/initRunesContext";
import { useExpansions } from '@/context/ExpansionContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { v4 as uuidv4 } from 'uuid';

const TopMenu = ({
  onAddEnemy,
  onSelectCommander,
  onSelectBoss,
  onAddManual,
  behaviors,
  onSelectRuneCard,
  onTileDraw
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { translations, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { openSaves } = useSavesUi() || {};
  const savesT = translations?.saves || {};
  const t = translations?.trackerInit || {};
  const { resetPlacedEnemies, activaHuesped, desactivaHuesped, huespedActivo, activaAcecho, desactivaAcecho, acechoActivo, activaInvadidos, desactivaInvadidos, invadidosActivo, oscuridadActivo, activaOscuridad, desactivaOscuridad,
                                         asaltoActivo, activaAsalto, desactivaAsalto } = useInitEnemies();
  const [enemySelect, setEnemySelect] = useState('');
  const [manualSelect, setManualSelect] = useState('');
  const [showRuneFaceOptions, setShowRuneFaceOptions] = useState(false);
  const [showAssaultFaceOptions, setshowAssaultFaceOptions] = useState(false);
  const [isRunesOpen, setIsRunesOpen] = useState(false);
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [showEmbrujoOptions, setShowEmbrujoOptions] = useState(false);
  const [showScenarioFaceOptions, setShowScenarioFaceOptions] = useState(false);
  const [pilaConcentradaEliminarAbierta, setPilaConcentradaEliminarAbierta] = useState(null);
  const [confirmResetRunes, setConfirmResetRunes] = useState(false);
  const { runes, addRune, removeRune, getRuneCount, clearRunes, availableTiles, usedTiles, showTileToast, setTileToasts, tileToasts,
         drawTileByColor, drawTilePreviewByColor, drawMultipleTiles, discardedTiles, discardTileByColor, discardTileRandom, restoreDiscardedTile, 
         pilas, setPilas, addNewPila, activarPila, removeTileFromPila, addRunesCascade, addTileToPilaConcentrada, addTileToPila,
         pilasConcentrada, setPilasConcentrada, addNewPilaConcentrada, activarPilaConcentrada, removeTileFromPilaConcentrada, removeSingleTileFromPilaConcentrada, codigosPilas, setCodigosPilas, handleCodigoChange,
         resetTiles, tileWarning, setTileWarning, deleteAvailableTileByColor, deleteAvailableTileRandom, scenarioMonster, placeTilesFromPilaConcentradaToTrack, placeTilesFromPilaToTrack,
         setScenarioMonster, setSpawnPoints, spawnPoints, initializeSpawnPoints, removeSpawnPoint, controlPoints, setControlPoints, initializeControlPoints, removeControlPoint, 
         setRuneKeys, runeKeys, initializeRuneKeys, removeRuneKey, setRescue, rescue, initializeRescue, removeRescue,
         initializeDecks, drawCardFromDeck, showCardToast, manifestTile } = useGame();
  const { placedRunes, resetPlacedRunes } = useInitRunes();
  const [activeMenu, setActiveMenu] = useState(null); // 'runes' | 'enemies' | 'scenario' | null
  const containerRef = useRef(null);
  const menuRefEnemies = useRef(null);
  const menuRefRunes = useRef(null);
  const menuRefScenario = useRef(null);
  const { selectedExpansions } = useExpansions();
  
  const colorMap = {
    rojo: 'bg-red-700 hover:bg-red-600',
    azul: 'bg-blue-700 hover:bg-blue-600',
    verde: 'bg-green-700 hover:bg-green-600',
    naranja: 'bg-orange-700 hover:bg-orange-600',
    gris: 'bg-slate-600 hover:bg-slate-500',
  };

  const toggleMenu = (name) => {
    setActiveMenu(prev => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  
  const handleEnemySelect = (e) => {
    const value = e.target.value;
    if (!value) return;
  
    if (value === 'comandante') {
      onSelectCommander(); 
    } else {
      onAddEnemy(value);
    }
  
    setEnemySelect(''); // resetear
  };


  const handleManualSelect = (e) => {
    const value = e.target.value;
    if (!value) return;
    onAddManual(value);
    setManualSelect(value);
  };

  const monstruosUnicos = Array.from(
    new Map(
      ENEMIES
        .filter(e => e.scenario === "escenario")
        .map(m => [m.id, m])
    ).values()
  );

  const handleSelectUniqueCard = (card, timeToken = false) => {
    const tipo = card.tipo;
    // ✅ Comprobar si ya existe una carta de este tipo
    const yaEx = placedRunes.some(r => r.rune.tipo === tipo);
  
    if (yaEx) {
      alert(t.yaExiste);
      return;
    }
  
    // ✅ Si no existe, la añadimos
    onSelectRuneCard(card, timeToken);
  };
    
  return (
    <>
    <div ref={containerRef} className="layer-track-bar fixed inset-x-0 top-0 border-b border-slate-700/70 bg-slate-900/95 shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <span className="mr-1 hidden items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white lg:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Drunagor
          </span>
          <div
            className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/70 p-0.5"
            role="group"
            aria-label={t.menuGroup || 'Menús del tablero'}
          >
            {[
              { id: 'enemies', icon: GiMinions, label: t.enemiesMenu || 'Enemigos', tone: 'sky' },
              { id: 'runes', icon: GiRuneStone, label: t.runesMenu || 'Runas', tone: 'emerald' },
              { id: 'scenario', icon: GiVillage, label: t.scenarioMenu || 'Escenario', tone: 'amber' },
            ].map(({ id, icon: Icon, label, tone }) => {
              const isActive = activeMenu === id;
              const activeTone = tone === 'sky'
                ? 'border-sky-400/80 bg-sky-700 text-white shadow-inner shadow-sky-950/40'
                : tone === 'emerald'
                  ? 'border-emerald-400/80 bg-emerald-700 text-white shadow-inner shadow-emerald-950/40'
                  : 'border-amber-400/80 bg-amber-700 text-white shadow-inner shadow-amber-950/40';
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleMenu(id)}
                  aria-expanded={isActive}
                  aria-controls={`track-menu-${id}`}
                  aria-label={label}
                  title={label}
                  className={`flex h-10 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                    isActive
                      ? activeTone
                      : 'border-transparent text-slate-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span className="hidden md:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openSaves?.()}
            className="flex min-h-11 items-center gap-2 rounded-full bg-emerald-700 px-3 text-sm font-bold text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            aria-label={savesT.title || 'Partidas'}
            title={savesT.title || 'Partidas'}
          >
            <GiArchiveRegister aria-hidden="true" size={20} />
            <span className="hidden md:inline">{savesT.title || 'Partidas'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label={t.goHome || 'Ir al inicio'}
            title={t.goHome || 'Ir al inicio'}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <AiOutlineMenu size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/tracker')}
            aria-label={t.backToConfig || 'Volver a configuración'}
            title={t.backToConfig || 'Volver a configuración'}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <GiGearHammer size={20} aria-hidden="true" />
          </button>
          <label htmlFor="track-lang" className="sr-only">{savesT.language || 'Idioma'}</label>
          <select
            id="track-lang"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="min-h-11 rounded-lg border border-slate-600 bg-slate-800 px-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>{languageNames[lang]}</option>
            ))}
          </select>
          {activeMenu && (
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={t.close || 'Cerrar menú'}
              className="flex h-11 items-center gap-1 rounded-full bg-slate-700 px-3 text-sm font-semibold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <span aria-hidden="true">✕</span>
              <span className="hidden sm:inline">{t.close || 'Cerrar'}</span>
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeMenu === 'enemies' && (
          <motion.div
            ref={menuRefEnemies}
            id="track-menu-enemies"
            role="region"
            aria-label={t.enemiesMenu || 'Enemigos'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="layer-menu flex max-h-[70dvh] flex-col gap-3 overflow-y-auto px-3 pb-4 pt-2 text-white sm:px-4"
          >
            {/* Aleatorios */}
            <div className="track-surface-raised p-3 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <GiSwordClash className="text-blue-400 text-xl" />
                <span className="font-semibold">{t.addEnemies || 'Enemigos aleatorios'}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { key: 'blanco', label: t.addWhiteEnemies, color: 'text-white' },
                  { key: 'gris', label: t.addGrayEnemies, color: 'text-slate-400' },
                  { key: 'negro', label: t.addBlackEnemies, color: 'text-black bg-white rounded' },
                  { key: 'comandante', label: t.addCommanders, color: 'text-yellow-500' },
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setEnemySelect(key);
                      handleEnemySelect({ target: { value: key } });
                    }}
                    className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-sm font-semibold transition ${
                      enemySelect === key ? 'border-sky-400 bg-sky-700 text-white shadow-lg' : 'border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <GiBullyMinion className={`text-2xl ${color}`} />
                    <span className="text-xs text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manuales */}
            <div className="bg-slate-800 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <MdAddCircleOutline className="text-purple-400 text-xl" />
                <span className="font-semibold">{t.addManualEnemy || 'Enemigos manuales'}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {[
                  { key: 'esbirro', label: t.addMinionEnemies, color: 'text-cyan-300' },
                  { key: 'blanco', label: t.addWhiteEnemies, color: 'text-white' },
                  { key: 'gris', label: t.addGrayEnemies, color: 'text-slate-400' },
                  { key: 'negro', label: t.addBlackEnemies, color: 'text-black bg-white rounded' },
                  { key: 'comandante', label: t.addCommanders, color: 'text-yellow-500' },
                  { key: 'overlord', label: t.selectOverlord, color: 'text-red-400' },
                  { key: 'jefe', label: t.selectBosses, color: 'text-purple-400' },
                  { key: 'hero', label: t.selectHeroFall, color: 'text-orange-400' },
                  { key: 'escenario', label: t.selectScenario, color: 'text-cyan-600' },
                ].map(({ key, label, color }) => (
                  <React.Fragment key={key}>
                    <button
                      onClick={() => {
                        setManualSelect(key);
                        handleManualSelect({ target: { value: key } });
                      }}
                      className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-sm font-semibold transition ${
                        manualSelect === key ? 'border-purple-400 bg-purple-700 text-white shadow-lg' : 'border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <GiBullyMinion className={`text-2xl ${color}`} />
                      <span className="text-xs text-center">{label}</span>
                    </button>
    
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={resetPlacedEnemies}
                className="min-h-11 rounded-full bg-yellow-600 px-4 text-sm font-semibold text-slate-950 hover:bg-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200"
              >
                {t.resetEnemies || 'Resetear enemigos'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {activeMenu === 'runes' && (
          <motion.div
            ref={menuRefRunes}
            id="track-menu-runes"
            role="region"
            aria-label={t.runesMenu || 'Runas'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="layer-menu flex max-h-[70dvh] flex-col gap-3 overflow-y-auto px-3 pb-4 pt-2 text-white sm:px-4"
          >
            <div className="flex flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
             
              <div className="flex flex-col md:flex-row gap-4">
                {/* Añadir Cartas de Runa */}
                <div className="track-surface-raised flex-1 p-3 shadow-md ">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiCardPlay className="text-indigo-400 text-xl" />
                    <span className="font-semibold">{t.cartas}</span>
                  </div>

                  {/* --- Bloque 1: OSCURIDAD DE CAZA --- */}
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                      <GiRuneStone className="text-indigo-300 text-xl" />
                      {!oscuridadActivo ? (
                        <>
                          <button
                            onClick={() => {
                              activaOscuridad();
                              const defaultRunes = RUNAS.filter(r => r.cara === 'A');
                              defaultRunes.forEach(r => handleSelectUniqueCard(r));
                            }}
                            className="bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                          >
                            {t.addRunes}
                          </button>
                      
                          <button
                            onClick={() => setShowRuneFaceOptions(prev => !prev)} 
                            className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                          >
                            {t.addRunesCara}
                          </button>
                      
                          {showRuneFaceOptions && (
                            <div className="flex gap-2 flex-wrap mt-2 justify-center">
                              {RUNAS.map((card, index) => (
                                <button
                                  key={`${card.id}-${card.cara}-${index}`}
                                  onClick={() => { 
                                    activaOscuridad();
                                    handleSelectUniqueCard(card);
                                  }}
                                  className="bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                                >
                                  {t.cara} ({card.cara})
                                </button>
                              ))}
                      
                              <button
                                onClick={() => {
                                  activaOscuridad();
                                  const defaultRunes = RUNAS_F.filter(r => r.cara === 'B');
                                  defaultRunes.forEach(r => handleSelectUniqueCard(r));
                                }}
                                className="bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                              >
                                {t.addRunes2} (B)
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            desactivaOscuridad();
                            resetPlacedRunes();
                            setShowRuneFaceOptions(false);
                          }}
                          className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                        >
                          {t.delRunes}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* --- Bloque 2: ASALTO (solo si expansión activa) --- */}
                  {selectedExpansions.includes("infernal_desert") && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <GiLeechingWorm className="text-indigo-300 text-xl" />
                  
                        {!asaltoActivo ? (
                          <>
                            <button
                              onClick={() => {
                                activaAsalto();
                                const defaultRunes = ASALTO.filter(r => r.cara === 'A');
                                defaultRunes.forEach(r => handleSelectUniqueCard(r));
                              }}
                              className="bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                            >
                              {t.addRunes_w}
                            </button>
                  
                            <button
                              onClick={() => setshowAssaultFaceOptions(prev => !prev)}
                              className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                            >
                              {t.addRunesCara_w}
                            </button>
                  
                            {showAssaultFaceOptions && (
                              <div className="flex gap-2 flex-wrap mt-2 justify-center">
                                {ASALTO.map((card, index) => (
                                  <button
                                    key={`${card.id}-${card.cara}-${index}`}
                                    onClick={() => { 
                                      activaAsalto();
                                      handleSelectUniqueCard(card);
                                    }}
                                    className="bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                                  >
                                    {t.cara} ({card.cara})
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              desactivaAsalto();
                              resetPlacedRunes();
                              setshowAssaultFaceOptions(false);
                              // Aquí podrías limpiar las runas si es necesario
                            }}
                            className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                          >
                            {t.delRunes_w}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- Bloque 3: ACECHO --- */}
                  <div className="mb-2"> 
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex flex-wrap gap-2 justify-center items-center">
                        <GiCrownedSkull className="text-indigo-300 text-xl" />
                  
                        {!acechoActivo ? (
                          <button
                            onClick={() => setShowEmbrujoOptions(prev => !prev)}
                            className="bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                          >
                            {t.activaAcecho}
                          </button>
                        ) : (
                          <button
                            onClick={desactivaAcecho}
                            className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                          >
                            {t.desactivaAcecho}
                          </button>
                        )}
                      </div>
                  
                      {/* Opciones de embrujo */}
                      {!acechoActivo && showEmbrujoOptions && (
                        <div className="flex gap-2 flex-wrap justify-center">
                          <button
                            onClick={() => {
                              activaAcecho();
                              onSelectBoss("undead_king_boss_Acecho_1");
                              setShowEmbrujoOptions(false);
                            }}
                            className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Embrujo 0
                          </button>
                          
                          <button
                            onClick={() => {
                              activaAcecho();
                              onSelectBoss("undead_king_boss_Acecho_1");
                              setShowEmbrujoOptions(false);
                            }}
                            className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Embrujo I
                          </button>
                  
                          <button
                            onClick={() => {
                              activaAcecho();
                              onSelectBoss("undead_king_boss_Acecho_1");
                              setShowEmbrujoOptions(false);
                            }}
                            className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Embrujo II
                          </button>
                  
                          <button
                            onClick={() => {
                              activaAcecho();
                              onSelectBoss("undead_king_boss_Acecho_2");
                              setShowEmbrujoOptions(false);
                            }}
                            className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Embrujo III
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                 {/* --- Bloque 4: MONSTRUO HUESPED (solo si expansión activa) --- */}
                 {selectedExpansions.includes("undead_dragon") && (
                  <div className="mb-2"> 
                    <div className="flex flex-wrap gap-2 justify-center">
                      <GiSpikedDragonHead className="text-indigo-300 text-xl" />
                      
                      {!huespedActivo ? (
                        <button
                          onClick={activaHuesped}
                          className="bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                        >
                          {t.activaHuesped}
                        </button>
                      ) : (
                        <button
                          onClick={desactivaHuesped}
                          className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                        >
                          {t.desactivaHuesped}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* --- Bloque 5: INVADIDOS --- */}
                <div className="mb-2"> 
                  <div className="flex flex-wrap gap-2 justify-center">
                    <GiReaperScythe className="text-indigo-300 text-xl" />
                    
                    {!invadidosActivo ? (
                      <button
                        onClick={() => {
                          activaInvadidos();
                          setScenarioMonster(prev => prev?.id === "dark_vampire" ? null : "dark_vampire");
                        }}
                        className="bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                      >
                        {t.activaInvadidos}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          desactivaInvadidos();
                          setScenarioMonster(prev => prev?.id === "dark_vampire" ? null : "dark_vampire");
                        }}
                        className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                      >
                        {t.desactivaInvadidos}
                      </button>
                    )}
                  </div>
                </div>

                  
                </div>

                {/* 📦 Estado de la bolsa */}
                <div className="track-surface-raised flex-1 p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiSwapBag className="text-yellow-300 text-xl" />
                    <span className="font-semibold text-white">
                      {t.estadoBolsa || 'Estado de la Bolsa de Runas'}
                    </span>
                  </div>
                  {/* Estado general */}
                  <div className="text-sm text-white justify-center">
                    {t.extraidas}: <b>{usedTiles.length}</b><br />
                    {t.total}: <b>{availableTiles.length + usedTiles.length}</b>
                  </div>
                  {/* Estado por colores en línea */}
                  <div className="flex items-center gap-2 text-xs justify-center">
                    {[
                      { id: 'naranja', color: '#ff8c00' },
                      { id: 'verde', color: '#00aa00' },
                      { id: 'azul', color: '#0077cc' },
                      { id: 'rojo', color: '#cc0000' },
                      { id: 'gris', color: '#999999' }
                    ].map(({ id, color }) => {
                      const usadasColor = usedTiles.filter(tile => tile.runa === id).length;
                      const disponiblesColor = availableTiles.filter(tile => tile.runa === id).length;
                      return (
                        <div
                          key={id}
                          className="px-2 py-1 rounded font-semibold"
                          style={{ backgroundColor: color, color: 'white' }}
                        >
                          {t.colores[id] || id}: {usadasColor}/{usadasColor + disponiblesColor}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Manifestar Runa */}
                <div className="track-surface-raised flex-1 p-3 shadow-md">
                  <div className="flex flex-row items-center gap-2 mb-2 justify-center">
                    <GiRuneStone className="text-blue-400 text-xl inline-block" />
                    <span className="font-semibold whitespace-nowrap">{t.manifestarTitulo || 'Manifestar Runa'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        manifestTile();
                      }}
                      className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded"
                    >
                      {t.manifestar || 'Manifestar'}
                    </button>
                  </div>
                </div>

              {/* FIN PRIMER BLOQUE */}
              </div>
                
              <div className="flex flex-col md:flex-row gap-4">
                {/* Añadir ficha */}
                <div className="track-surface-raised flex-1 p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiBrickWall className="text-green-300 text-xl" />
                    <span className="font-semibold">{t.fichas}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['naranja', 'verde', 'azul', 'rojo', 'gris'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          const tile = drawTileByColor(color);
                          if (tile && onTileDraw) {
                            //addRune(color); // del GameContext
                            onTileDraw(tile);
                          } else {
                            alert(`${t.aviso2} ${t.colores[color]}`);
                          }
                        }}
                        className={`${colorMap[color]} text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {t.colores[color]}
                      </button>
                    ))}
    
                    {/* 🟣 Botón de ficha aleatoria */}
                    <button
                      onClick={() => {
                        const allColors = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
                        const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
                        const tile = drawTileByColor(randomColor);
                        if (tile && onTileDraw) {
                          onTileDraw(tile);
                        } else {
                          alert(`${t.aviso2} ${t.colores[randomColor]}`);
                        }
                      }}
                      className="bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      🎲 {t.fichaAleatoria || 'Aleatoria'}
                    </button>
                  </div>
                </div>

                {/* Añadir oscuridad en cascada */}
                <div className="track-surface-raised flex-1 p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiRuneStone className="text-purple-400 text-xl" />
                    <span className="font-semibold">{t.oscuridadCascada}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[1,2,3,4].map(num => (
                      <button
                        key={num}
                        onClick={() => addRunesCascade(num)}
                        className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded-full"
                      >
                        ➕ {num}
                      </button>
                    ))}
                  </div>
                </div>
        
                
                {/* Eliminar ficha */}
                <div className="track-surface-raised flex-1 p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiBrickWall className="text-red-400 text-xl" />
                    <span className="font-semibold">{t.removeTiles || 'Eliminar fichas de runa'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['naranja', 'verde', 'azul', 'rojo', 'gris'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                            const removed = removeRune(color);
                            if (removed) showTileToast(removed, 'remove');
                            else alert(`${t.noTilesToRemove}`);
                          }}
                        className={`${colorMap[color]} text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {t.colores[color]}
                      </button>
                    ))}
                
                    {/* ❌ Botón para eliminar una ficha de runa aleatoria */}
                    <button
                      onClick={() => {
                        const colors = ['naranja', 'verde', 'azul', 'rojo', 'gris'].filter(c => runes[c] > 0);
                        if (colors.length === 0) {
                          alert(t.noTilesToRemove || "No hay fichas para eliminar.");
                          return;
                        }
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        const removed = removeRune(randomColor);
                        if (removed && removed.runa) {
                          showTileToast(removed, 'remove');
                        }
                        else {alert(t.noTilesToRemove);}
                        //alert(`${t.removeOneRandom || "Eliminada una ficha de"} ${t.colores[randomColor]}`);
                      }}
                      className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      🎲 {t.removeRandom || 'Aleatoria'}
                    </button>
                  </div>
                </div>

                {/* ❌ Eliminación directa */}
                <div className="track-surface-raised flex-1 p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiTrashCan className="text-red-400 text-xl" />
                    <span className="font-semibold text-white">
                      {t.eliminarDirecto}
                    </span>
                  </div>
              
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['naranja', 'verde', 'azul', 'rojo', 'gris'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          const tile = deleteAvailableTileByColor(color);
                          if (tile) showTileToast(tile, 'remove');
                          else alert(`${t.noTilesToRemove} ${t.colores[color]}`);
                        }}
                        className={`${colorMap[color]} text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {t.colores[color]}
                      </button>
                    ))}
              
                     <button
                      onClick={() => {
                        const tile = deleteAvailableTileRandom();
                        if (tile) showTileToast(tile, 'remove');
                        else alert(t.noTilesToRemove || "No hay fichas para eliminar.");
                      }}
                      className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      🎲 {t.removeRandom || 'Aleatoria'}
                    </button>
                  </div>
                </div>
                
              {/* FIN SEGUNDO BLOQUE */}
              </div>

              
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
                                        className="h-6 w-6 object-contain"
                                      />
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
              
              <div className="flex justify-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setConfirmResetRunes(true)}
                  className="min-h-11 rounded-full bg-yellow-500 px-4 text-sm font-semibold text-slate-900 hover:bg-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200"
                >
                  {t.resetRunes}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {activeMenu === 'scenario' && (
          <motion.div
            ref={menuRefScenario}
            id="track-menu-scenario"
            role="region"
            aria-label={t.scenarioMenu || 'Escenario'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="layer-menu flex max-h-[70dvh] flex-col gap-3 overflow-y-auto px-3 pb-4 pt-2 text-white sm:px-4"
          >
            <div className="flex flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">

              
              <div className="bg-slate-800 rounded-lg p-3 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <GiDaemonSkull className="text-red-400 text-xl" />
                  <span className="font-semibold">{t.monstruoEscenario}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-start">
                  {monstruosUnicos.map(monstruo => {
                    const selected = scenarioMonster?.id === monstruo.id;
                    return (
                      <div
                        key={monstruo.id}
                        onClick={() => setScenarioMonster(prev => prev?.id === monstruo.id ? null : monstruo)}
                        className={`relative w-24 h-24 rounded border-2 cursor-pointer transition-transform transform hover:scale-105
                          ${selected ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-600'}
                        `}
                      >
                        <img
                          src={monstruo.imagen}
                          alt={monstruo.id}
                          className="object-cover w-full h-full rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-white text-center px-1 py-0.5">
                          {translations.enemies.escenario?.[monstruo.id] || monstruo.id}
                        </div>
                      </div>
                    );
                  })}
                </div>
              
                {scenarioMonster && (
                  <div className="mt-2 text-xs text-slate-300">
                    ✅ {t.monstruoSeleccionado}: <strong>{translations.enemies.escenario?.[scenarioMonster.id] || scenarioMonster.id}</strong>
                  </div>
                )}
              </div>
  
              
                  
              <div className="bg-slate-800 rounded-lg p-3 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <GiVillage className="text-yellow-300 text-xl" />
                  <span className="font-semibold">{t.escenario || 'Cartas de Escenario'}</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  {/* Incursión */}
                  <div className="track-surface-raised flex-1 p-3 shadow-md">
                    <div className="flex text-orange font-semibold p-2 mb-2">
                      <GiUprising className="text-blue text-xl" />
                       <span className="font-semibold"> {t.incru1}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={!scenarioMonster}
                        onClick={() => {
                          const carta = INCURSION.find(c => c.cara === 'A');
                          if (carta) handleSelectUniqueCard(carta);
                        }}
                        className={`bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded 
                          ${!scenarioMonster ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {t.addScenario} ({t.caraA})
                      </button>
          
                      <button
                        disabled={!scenarioMonster}
                        onClick={() => setShowScenarioFaceOptions(prev => ({ ...prev, incursion: !prev.incursion }))}
                        className={`bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded 
                          ${!scenarioMonster ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {t.addScenarioCara}
                      </button>
                    </div>
                    {showScenarioFaceOptions.incursion && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {INCURSION.map((card, index) => (
                          <button
                            key={`${card.id}-${card.cara}-${index}`}
                            onClick={() => handleSelectUniqueCard(card)}
                            className="bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                          >
                           {t.cara} ({card.cara})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
    
          
                  {/* Defensa */}
                  <div className="track-surface-raised flex-1 p-3 shadow-md">
                    <div className="flex text-white font-semibold p-2 mb-2">
                      <GiStoneTower className="text-blue text-xl" />
                       <span className="font-semibold"> {t.defen1}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const carta = DEFENSA.find(c => c.cara === 'A');
                          if (carta) handleSelectUniqueCard(carta, true);
                        }}
                        className={`bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded`}
                      >
                        {t.addScenario} ({t.caraT})
                      </button>
          
                      <button
                        onClick={() => setShowScenarioFaceOptions(prev => ({ ...prev, defensa: !prev.defensa }))}
                        className={`bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded`}
                      >
                        {t.addScenarioCara}
                      </button>
                    </div>
                    {showScenarioFaceOptions.defensa && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {DEFENSA.map((card, index) => (
                          <button
                            key={`${card.id}-${card.cara}-${index}`}
                            onClick={() => handleSelectUniqueCard(card)}
                            className="bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                          >
                            {t.cara} ({card.cara})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                </div>
                
              </div>

              
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

    </div>

      {/* Los avisos de fichas se muestran una sola vez desde InitTracker,
          que ya incluye la región aria-live y el cierre funcional. */}

      <ConfirmDialog
        open={confirmResetRunes}
        title={t.resetRunesConfirmTitle || 'Borrar runas y fichas'}
        description={t.resetRunesConfirm || 'Se eliminarán las cartas de runa colocadas, todas las fichas de la bolsa y los estados activos de la escena.'}
        confirmLabel={t.resetRunes || 'Borrar runas'}
        cancelLabel={translations.trackerSelect?.cancel || 'Cancelar'}
        onCancel={() => setConfirmResetRunes(false)}
        onConfirm={() => {
          resetPlacedRunes();
          resetTiles();
          desactivaAcecho();
          desactivaHuesped();
          desactivaOscuridad();
          desactivaAsalto();
          setConfirmResetRunes(false);
        }}
      />
    </>
  );
};

export default TopMenu;
