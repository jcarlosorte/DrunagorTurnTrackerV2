// src/pages/InitTracker.jsx

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState, useRef } from 'react';

import { RiArrowTurnBackLine, RiArrowTurnForwardLine } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { RUNAS, ASALTO } from '@/data/runas';
import { INCURSION } from '@/data/incursion';
import { DEFENSA } from '@/data/defensa';
import { ESTADOS_ALTERADOS, OTROS } from '@/data/estadosAlterados';
import { CARTAS_COMANDANTE, CARTAS_OVERLORD, CARTAS_JEFE, CARTAS_HEROE_CAIDO, ASALTO_GUSANO, ACECHO, IRA } from '@/data/cartasEspeciales';
import { TURN_ORDER } from '@/data/turnOrder';
import { ENEMY_RING_COLORS } from '@/data/enemyRings';
import { ENEMY_RING_COLORS_BIG } from '@/data/enemyRingsBig';
import { COLOR_RUNAS } from '@/data/fichas';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useGame } from '@/context/GameContext';
import { useInitRunes } from '@/context/initRunesContext';
import TopMenu from '@/components/TopMenu';

import AnimatedEnemyToast from '@/components/AnimatedEnemyToast';
import PageTransition from "@/components/PageTransition";
import ModalCommanderPC from '@/components/ModalCommanderPC';
import { ModalEnemyCard } from '@/components/ModalEnemyCard';
import { adjustCapabilitiesByRunes } from '@/components/adjustCapabilitiesByRunes';

import TileWarningModal from '@/components/TileWarningModal';
import TileToast from '@/components/TileToast';
import BagStatusPanel from '@/components/track/BagStatusPanel';

import EnemyCard from '@/components/track/EnemyCard';

import HistoryPanel from '@/components/track/HistoryPanel';
import ModalHeroCard from '@/components/track/ModalHeroCard';
import DiceRoller from '@/components/track/DiceRoller';
import TurnTrackBoard from '@/components/track/TurnTrackBoard';

import { createId } from '@/utils/id';
import { isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';
import { appendGameLog } from '@/utils/gameLog';
import { isHeroManagementEnabled } from '@/utils/heroSettings';
import { addHeroTurnTime, stepHeroEstadoAlterado } from '@/utils/heroExtras';
import { formatClock } from '@/utils/turnTimer';
import { findNextActiveEntity, indexOfEntityInOrder } from '@/utils/turnOrder';
import { useHeroExtras } from '@/context/HeroExtrasContext';
import useStatusEffects from '@/hooks/useStatusEffects';
import useTurnCursor from '@/hooks/useTurnCursor';


import { classifyScenarioToast } from '@/utils/toastKind';

import TrackSlot from '@/components/track/TrackSlot';
import TurnCarousel from '@/components/track/TurnCarousel';
import { boardSlotHeightFrom } from '@/components/track/trackLayout';


const rolesPositionMap = {
  defensor: 0,
  apoyo: 2,
  lider: 4,
  agresor: 6,
  controlador: 8
};

const runesColorMap = {
  naranja: 1,
  verde: 3,
  azul: 5,
  rojo: 7,
  gris: 9
};

const allowedCategories = ['campeon', 'veterano', 'soldado', 'bisoño'];
const PROPIEDADES_ACTUALIZABLES = ['movimiento', 'ataque', 'capacidades', 'inmunidad', 'tipo_ataque'];
const EnemiesNoShow = ['undead_king_boss_Acecho_1', 'undead_king_boss_Acecho_2', 'corrupted_worm_esbirro'];
const commanderNoPc = ['dark_vampire_scenario_com'];

const toSet = (value) => new Set(Array.isArray(value) ? value : []);

const InitTracker = () => {
  const { trackerData, setTrackerData } = useTracker();
  const { placedEnemies, setPlacedEnemies, placeEnemy, removeEnemyByUUID, resetPlacedEnemies, assignColorToEnemy, releaseColor, usedColors, usedColorsBig, avisos, removeAviso, huespedActivo, acechoActivo, invadidosActivo } = useInitEnemies();
  const { translations } = useLanguage();
  const { selectedExpansions } = useExpansions();
  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};
  const tc = translations.enemies?.categoria || {};
  const tee = translations.enemies || {};
  const tb = translations.trackerSelect?.comportamientos || {};
  const ta = translations.cartas_ataque || {};
  const ts = translations.scenarioCard || {};
  const td = translations.defensaCard || {};
  const tea = translations.estadosAlterados || {};
  const ttr = translations.defensaCard.cartas_trad || {};
  const tw = translations.asalto_gusano || {};
  const t_acecho = translations.acecho || {};
  const t_ira = translations.ira || {};
  const persistedSession = readJsonStorage('trackerSession', {}, isPlainObject);
  const behaviors = trackerData.behaviors;
  const enemies = trackerData.enemies;
  const selectedHeroes = trackerData.heroes;
  const numHeroes = selectedHeroes.length;
  const [categorySelector, setCategorySelector] = useState({ open: false, color: null });
  const [manualSelector, setManualSelector] = useState({ open: false, color: null });

  const [selectedEnemyUuid, setSelectedEnemyUuid] = useState(null);
  const [pilaConcentradaEliminarAbierta, setPilaConcentradaEliminarAbierta] = useState(null);
  const specialCategories = ['comandante', 'jefe', 'overlord', 'hero', 'esbirro', 'escenario'];
  const { availableTiles, usedTiles, manifestTile, tileToasts, setTileToasts, showTileToast, discardTileByColor, runes, getRuneCount, drawMultipleTiles, tileWarning, setTileWarning, scenarioMonster, spawnPoints, removeSpawnPoint, controlPoints, removeControlPoint, runeKeys, removeRuneKey, rescue, removeRescue, pilas, pilasConcentrada, activarPilaConcentrada, activarPila, codigosPilas, handleCodigoChange, addTileToPila, addTileToPilaConcentrada, initializeDecks, drawCardFromDeck, removeTileFromPila, removeSingleTileFromPilaConcentrada, placeTilesFromPilaConcentradaToTrack, placeTilesFromPilaToTrack } = useGame();

  const { placedRunes, placeRune, removeRuneByUUID, resetPlacedRunes, setPlacedRunes } = useInitRunes();
  const { executedRunes, setExecutedRunes } = useInitRunes();
  const [warningMessage, setWarningMessage] = useState(null);
  const [overhealedEnemies, setOverhealedEnemies] = useState(() => new Set(persistedSession.overhealedEnemies || []));

  const [flippedCards, setFlippedCards] = useState([]);
  const [scenarioToasts, setScenarioToasts] = useState([]);
  const [showPCModal, setShowPCModal] = useState(false);
  const [onPCConfirm, setOnPCConfirm] = useState(null);
  const [enemyEvolutions, setEnemyEvolutions] = useState(() => persistedSession.enemyEvolutions || []);
  const [selectedHeroId, setSelectedHeroId] = useState(null);
  const [diceOpen, setDiceOpen] = useState(false);
  const { getExtras: getHeroExtras, updateExtras: updateHeroExtras, refresh: refreshHeroExtras } = useHeroExtras();
  const [heroManagementEnabled] = useState(() => isHeroManagementEnabled());
  const getHeroName = (id) => translations.heroes?.[id] || id;
  const getEnemyName = (id, color = null) => {
    if (color === 'escenario') {
      return translations.enemies?.escenario?.[id] || id;
    }
    return translations.enemies?.[id] || id;
  };

  const getHeroProf = (id) => {
    const heroe = HEROES.find(e => e.id === id);
    if (!heroe) {
      console.warn(`Héroe desconocido en el tablero: ${id}`);
      return '';
    }
    return translations.heroes?.profession?.[heroe.profession] || heroe.profession || '';
  };
  const openCategorySelector = (color) => setCategorySelector({ open: true, color });
  const openManualSelector = (color) => setManualSelector({ open: true, color });
  const openManualBoss = (id) => handleManualEnemyAdd(id, "jefe", "jefe");

  const getRuneColorFromIndex = (index) => {
    return Object.entries(runesColorMap).find(([color, idx]) => idx === index)?.[0];
  };

  const handleTileDraw = (tile) => {
    if (!tile) return;
    showTileToast(tile, 'add');
  };

  const handleCloseToast = (tile) => {
    const uuid = tile?.uuid ?? tile;
    setTileToasts(prev => prev.filter(t => t.uuid !== uuid));
  };

  const formatTextWithBraces = (text) => {
    const parts = text.split(/(\{.*?\})/g);
    let manifestedTile = null;
  
    const content = parts.map((part, idx) => {
      const match = part.match(/^\{(.*?)\}$/);
  
      if (match) {
        const key = match[1];
        const translated = td.cartas_trad?.[key] || key;
  
        if (key === "MANIFIESTA") {
          manifestedTile = manifestTile(); // ejecuta manifiesta
        }
  
        return (
          <span key={`brace-${idx}`} className="text-blue-400 font-semibold">
            {translated}
          </span>
        );
      }
  
      return <span key={`text-${idx}`}>{part}</span>;
    });
  
    // Añadir al final si hubo MANIFIESTA y una runa válida
    if (manifestedTile?.runa) {
      const label = ti.runaManifestada || "Runa manifestada";
      const colorName = ti.colores[manifestedTile.runa];
  
      content.push(
        <span key="manifested-color" className="block text-blue-400 mt-2">
          {label} {colorName}
        </span>
      );
    }
  
    return content;
  };

  const getNextAvailableColorSimulated = (isBig, simulatedSmall, simulatedBig) => {
    const used = new Set(isBig ? simulatedBig : simulatedSmall);
    const source = isBig ? ENEMY_RING_COLORS_BIG : ENEMY_RING_COLORS;
    const next = source.find(c => !used.has(c.id));
    return next ? next.id : null;
  };
  
  const showCardToast = (card, deckType) => {
    const id = createId();
    const translationsDeck = td[`cartas_${deckType}`];
    const message = translationsDeck.nombre?.[card.id] || card.id;
    const action_ori = translationsDeck.accion?.[card.id] || '';
    const action2_ori = translationsDeck.accion2?.[card.id] || '';
    let extra_ori = '\n';
    let simulatedUsedSmall = [...usedColors];
    let simulatedUsedBig = [...usedColorsBig];
    const generatedColors = [];
    let warnedNoColors = false;
    
    if (deckType === 'errantes') {
      for (let i = 1; i <= numHeroes; i++) {
        const line = translationsDeck.texto?.[`${card.id}${i}`];
        if (line) extra_ori += `${line}\n`;
        const enemyData = translationsDeck.texto2?.[`${card.id}${i}`];
        if (enemyData) {
          const [count, color, category] = enemyData;
          for (let j = 0; j < count; j++) {
            // 1️⃣ Filtrar enemigos disponibles según expansiones, color y categoría
            const candidates = ENEMIES.filter(
              e =>
                enemies.includes(e.id) &&   // está en expansiones activas
                e.color === color &&
                e.categoria === category &&
                e.cara !== 'B'
            );
    
            if (candidates.length === 0) {
              console.warn(`${ti.noEnemyAvailableTo} ${color} - ${category}`);
              continue;
            }
    
            // 2️⃣ Elegir uno aleatorio
            const selectedEnemy = candidates[Math.floor(Math.random() * candidates.length)];
            const isBig = selectedEnemy.size === 'grande';
            let nextColorId = getNextAvailableColorSimulated(isBig, simulatedUsedSmall, simulatedUsedBig);
            
            // 3️⃣ Elegir comportamiento aleatorio de entre los que tenga definidos
            let behaviorType = 'estandar';
            if (Array.isArray(selectedEnemy.comportamientos)) {
              behaviorType = selectedEnemy.comportamientos[
                Math.floor(Math.random() * selectedEnemy.comportamientos.length)
              ];
            } else if (selectedEnemy.comportamiento) {
              behaviorType = selectedEnemy.comportamiento;
            }

            if (!nextColorId) {
              if (!warnedNoColors){
                alert(ti.noColorsAvailable);
                warnedNoColors = true;    
              }
              nextColorId = 'noColor';
            } else {
              // guardamos el color en la simulación
              if (isBig) simulatedUsedBig.push(nextColorId);
              else simulatedUsedSmall.push(nextColorId);
              generatedColors.push(nextColorId);    
            }
            // 4️⃣ Llamar a handleManualEnemyAdd con el id y datos encontrados
            handleManualEnemyAdd(selectedEnemy.id, behaviorType, category, 'NoShow', nextColorId, null, 2);
          }
        }
      }
    } else {
      extra_ori = translationsDeck.texto?.[card.id] || '';
    }
    
    const action = formatTextWithBraces(action_ori);
    const action2 = formatTextWithBraces(action2_ori);
    const extra = formatTextWithBraces(extra_ori);
    setScenarioToasts(prev => [...prev, { id, message, action, action2, extra }]);
  };

  
  const openCommanderPCModal = (callback) => {
    setOnPCConfirm(() => callback);
    setShowPCModal(true);
  };

  const closePCModal = () => {
    setShowPCModal(false);
    setOnPCConfirm(null);
  };

  const enemiesInSelectedExpansions = ENEMIES.filter(e => selectedExpansions.includes(e.expansionId) );

  const clearCardHighlight = (uuid) => {
    setPlacedEnemies(prev =>
      prev.map(item =>
        item.enemy.uuid === uuid
          ? { ...item, enemy: { ...item.enemy, highlight: false } }
          : item
      )
    );
  };
    
  const spawnBatchEnemies = (count, scenarioMonster) => {
    if (!scenarioMonster) return;
  
    const isBig = scenarioMonster?.size === 'grande';
  
    let simulatedUsedSmall = [...usedColors];
    let simulatedUsedBig = [...usedColorsBig];
    const generatedColors = [];
    let warnedNoColors = false;
    
    for (let i = 0; i < count; i++) {
      // obtenemos el siguiente color disponible
      let nextColorId = getNextAvailableColorSimulated(isBig, simulatedUsedSmall, simulatedUsedBig);
      
      if (!nextColorId) {
        if (!warnedNoColors){
          alert(ti.noColorsAvailable);
          warnedNoColors = true;    
        }
        nextColorId = 'noColor';
      } else {
        // guardamos el color en la simulación
        if (isBig) simulatedUsedBig.push(nextColorId);
        else simulatedUsedSmall.push(nextColorId);
        generatedColors.push(nextColorId);    
      }
     
      handleManualEnemyAdd(scenarioMonster.id, scenarioMonster.comportamiento, scenarioMonster.categoria, 'NoShow', nextColorId);
      showScenarioToast(`${ti.invoca} ${tee[scenarioMonster.id]}`);
    }

  };

  const spawnBossEnemies = (maxMonstruos, enemiesId, enemiesCat) => {
    if (!enemiesId || maxMonstruos === 0) return;
  
    const candidatos = ENEMIES.filter(
      e => enemies.includes(e.id) && e.id === enemiesId && e.categoria === enemiesCat
    );
    if (candidatos.length === 0) return;
  
    const placedMonsters = placedEnemies.filter(e => e.enemy.id === enemiesId);
    const alreadyPlaced = placedMonsters.length;
    const faltan = Math.max(0, maxMonstruos - alreadyPlaced);
  
    let simulatedUsedSmall = [...usedColors];
    let simulatedUsedBig = [...usedColorsBig];
    const generatedColors = [];
    let warnedNoColors = false;
  
    for (let i = 0; i < faltan; i++) {
      // 👉 Elegir uno aleatorio en cada iteración
      const enemy = candidatos[Math.floor(Math.random() * candidatos.length)];
      const isBig = enemy.size === 'grande';
  
      // obtenemos el siguiente color disponible
      let nextColorId = getNextAvailableColorSimulated(isBig, simulatedUsedSmall, simulatedUsedBig);
  
      if (!nextColorId) {
        if (!warnedNoColors) {
          alert(ti.noColorsAvailable);
          warnedNoColors = true;
        }
        nextColorId = 'noColor';
      } else {
        if (isBig) simulatedUsedBig.push(nextColorId);
        else simulatedUsedSmall.push(nextColorId);
        generatedColors.push(nextColorId);
      }
  
      handleManualEnemyAdd(enemy.id, enemy.comportamiento, enemy.categoria, 'NoShow', nextColorId);
      showScenarioToast(`${ti.invoca} ${tee[enemy.id]}`);
    }
  };

  const handleAcechoEffect = (runas) => {
    if (!acechoActivo || runas.length === 0) return;
    const runa = runas[0];
    if (!runa) return;
    const numRunas = runas.filter(r => r.runa === runa.runa).length;

    // Buscar carta ACECHO por color
    const cartaAcecho = ACECHO.find(a => a.rune === runa.runa || a.rune === runa.color);
    if (!cartaAcecho) return;
    const capacidades = cartaAcecho.lista_capacidad || [];
    const entry = placedEnemies.find(e => e.enemy.categoria === "jefe");
    const enemigo = entry?.enemy;
    if (!enemigo) return;
    const targetUUID = enemigo.uuid;
    let runeCount = getRuneCount(runa.runa) + numRunas;
    let nombreEnemy = tee?.[enemigo.id] || enemigo.nombre || enemigo.id;
    // Texto base traducido
    let textoBase = t_acecho.texto[cartaAcecho.id];
    
    let texto = `${nombreEnemy}: ${textoBase}`;
    if (!texto) return;

    texto = texto.replaceAll('{X}', runeCount);
        
    // Sustituir capacidades por traduccion
    texto = texto.replace(/\{([^}]+)\}/g, (match, id) => {return ttr[id];});
  
    showScenarioToast(texto);

    capacidades.forEach(cap => {

      // ✅ --- ESCUDO ---
      if (cap.startsWith("ESCUDO")) {
        const partes = cap.split("_");
        const puedeSobrepasar = partes.includes("SI");
        const configEscudo = ESTADOS_ALTERADOS.find(e => e.id === "ESCUDO");
        const maxEscudo = configEscudo?.max || Infinity;
  
        let escudosAgregar = 0;
  
        if (partes.includes("X")) {
          escudosAgregar = runeCount;
        }
  
        if (escudosAgregar <= 0) return;
  
        const estados = [...enemigo.estadosAlterados];
        const idx = estados.findIndex(e => e.id === "ESCUDO");
  
        if (idx >= 0) {
          let actual = estados[idx].count;
          let nuevo = actual + escudosAgregar;
          if (!puedeSobrepasar) nuevo = Math.min(nuevo, maxEscudo);
          estados[idx] = { ...estados[idx], count: nuevo };
        } else {
          let nuevo = escudosAgregar;
          if (!puedeSobrepasar) nuevo = Math.min(nuevo, maxEscudo);
          estados.push({ id: "ESCUDO", count: nuevo });
        }
        updateEnemyEstados(targetUUID, estados);
      }
    }); 
                        
  };

  const handleIraEffect = (runas, enemy) => {
    if (runas.length === 0) return;
    const runa = runas[0];
    if (!runa) return;
   
    // Buscar carta ACECHO por color
    const cartaIRA = IRA.find(a => a.rune === runa.runa || a.rune === runa.color);

    if (!cartaIRA) return;
    const capacidades = cartaIRA.lista_capacidad || [];
    let runeCount = getRuneCount(runa.runa);
    
    const nombreEnemy = tee?.[enemy.id] || enemy.nombre || enemy.id;
    // Texto base traducido
    let textoBase = t_ira.texto[cartaIRA.id];
    
    let texto = `${nombreEnemy}: ${textoBase}`;
    if (!texto) return;

    texto = texto.replaceAll('{X}', runeCount);
    texto = texto.replace(/\{([^}]+)\}/g, (match, id) => {return ttr[id];});

    const logs = [texto];
    let estados = [...(enemy.estadosAlterados || [])];
    
    //showScenarioToast(texto);
    capacidades.forEach(cap => {

      // ✅ --- ESCUDO ---
      if (cap.startsWith("ESCUDO")) {
        const partes = cap.split("_");
        const configEscudo = ESTADOS_ALTERADOS.find(e => e.id === "ESCUDO");
        const maxEscudo = configEscudo?.max || Infinity;
  
        let escudosAgregar = 0;
  
        if (partes.includes("X")) {
          escudosAgregar = runeCount;
        }
  
        if (escudosAgregar <= 0) return;
  
        const idx = estados.findIndex(e => e.id === "ESCUDO");
  
        if (idx >= 0) {
          let actual = estados[idx].count;
          let nuevo = actual + escudosAgregar;
          nuevo = Math.min(nuevo, maxEscudo);
          estados[idx] = { ...estados[idx], count: nuevo };
        } else {
          let nuevo = escudosAgregar;
          nuevo = Math.min(nuevo, maxEscudo);
          estados.push({ id: "ESCUDO", count: nuevo });
        }
        
        //updateEnemyEstados(targetUUID, estados);
      
      }
    });
    return { estados, logs };
  };

  const handleInvadidosEffect = () => {
    // 🧩 1. Definir enemigo base de la invasión
    const enemigoId = "dark_vampire";
    const enemigoCat = "bisoño";
  
    // 🧩 2. Calcular cuántos enemigos deben invocarse según el número de héroes
    let numAInvocar = 0;
    if (numHeroes <= 2) numAInvocar = 1;
    else if (numHeroes <= 4) numAInvocar = 2;
    else numAInvocar = 3;
  
    // 🧩 3. Contar cuántos vampiros oscuros ya están en el campo
    const enemigosActuales = placedEnemies.filter(e => e.enemy.id === enemigoId);
    const yaColocados = enemigosActuales.length;
  
    // 🧩 4. Calcular cuántos se pueden añadir sin pasar de 4
    const maxPermitidos = 4;
    const faltan = Math.max(0, maxPermitidos - yaColocados);

    const exceso = numAInvocar - faltan;
      
    if (exceso > 0){
      //showScenarioToast(`${ti.noMasInvocar}`);
      for (let i = 0; i < exceso; i++) {
        showScenarioToast(`${ti.invasionDamage}`);
      }
    }
  
    // 🧩 5. Invocar los que falten
    let simulatedUsedSmall = [...usedColors];
    let simulatedUsedBig = [...usedColorsBig];
    const generatedColors = [];
    let warnedNoColors = false;
    
    const numFinal = Math.min(numAInvocar, faltan);
    for (let i = 0; i < numFinal; i++) {
      const candidatos = ENEMIES.filter(
        e => enemies.includes(e.id) && e.id === enemigoId && e.categoria === enemigoCat
      );
      if (candidatos.length > 0) {
        const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
        const isBig = elegido.size === 'grande';
        let nextColorId = getNextAvailableColorSimulated(isBig, simulatedUsedSmall, simulatedUsedBig);
        if (!nextColorId) {
          if (!warnedNoColors) {
            alert(ti.noColorsAvailable || "No hay más colores disponibles para asignar");
            warnedNoColors = true;
          }
          nextColorId = 'noColor';
        } else {
          if (isBig) simulatedUsedBig.push(nextColorId);
          else simulatedUsedSmall.push(nextColorId);
          generatedColors.push(nextColorId);
        }
        // ✅ Añadir enemigo manualmente
        handleManualEnemyAdd(elegido.id, elegido.comportamiento, elegido.categoria, 'NoShow', nextColorId);
        showScenarioToast(`${ti.invoca} ${tee[elegido.id]}`);
      }
    }

  };

  
  const handleCategorySelect = (categoryKey) => {
    const color = categorySelector.color;
    setCategorySelector({ open: false, color: null });
    const filtered = ENEMIES.filter(e => e.color === color && e.categoria === categoryKey && enemies.includes(e.id) && e.cara !=="B" && e.id !== scenarioMonster?.id);
    if (filtered.length === 0) return;
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
    const uuid = createId();
    const isBig = selected.size === 'grande';
    const colorId = assignColorToEnemy(uuid, isBig);
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    showToast(selected);
    placeEnemy({
      enemy: {
        uuid: uuid,
        name: selected.nombre,
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: selected.categoria,
        comportamiento: selected.comportamiento,
        vida: selected.vida,
        vidaMax: selected.vida,
        movimiento: selected.movimiento, 
        ataque: selected.ataque,
        color: selected.color,
        inmunidad: selected.inmunidad,
        tipo_ataque: selected.tipo_ataque,
        capacidades: adjustedCaps,
        capacidadesOriginales: selected.capacidades,
        ringColor: colorId,
        cara: selected.cara,
        estadosAlterados: initialStates
      }
    });
  };

  
  const handleManualEnemyAdd = (enemyId, behaviorType, category, ver = 'show', forcedColorId = null, forcedUUID = null, forcedPcValue = null ) => {
    setManualSelector({ open: false, color: null });
    const selected = ENEMIES.find(e => {
      if (e.id !== enemyId) return false;
      if (e.categoria !== category) return false;
      if (!enemies.includes(e.id)) return false;
      if (e.cara === 'B') return false;
      if (category === 'comandante' || category === 'jefe') return true;          // ignoramos comportamiento
      return e.comportamiento === behaviorType;            // para el resto sí exigimos match
    });

    if (!selected) return;
    const uuid = forcedUUID || createId();
    const isBig = selected.size === 'grande';
    const colorId = forcedColorId === 'noColor' ? undefined : assignColorToEnemy(uuid, isBig, forcedColorId);
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    if (selected.categoria === 'comandante') {
      const createAndPlaceCommander = (pcValue = null) => {
        const totalVida = commanderNoPc.includes(selected.id)
          ? selected.vida
          : selected.vida * (pcValue + numHeroes);
        const runeIndex = runesColorMap[selected.rune];
        const runePosition = selected.runePosition;
        const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
        const enemy = {
          uuid: uuid,
          name: selected.nombre,
          id: selected.id,
          rune: selected.rune,
          imagen: selected.imagen,
          runePosition,
          position: runeIndex,
          categoria: category,
          comportamiento: behaviorType,
          vida: totalVida,
          vidaMax: totalVida,
          movimiento: selected.movimiento,
          ataque: selected.ataque,
          color: selected.color,
          inmunidad: selected.inmunidad,
          tipo_ataque: selected.tipo_ataque,
          capacidades: adjustedCaps,
          capacidadesOriginales: selected.capacidades,
          ringColor: colorId,
          cara: selected.cara,
          estadosAlterados: initialStates
        };  
        if (ver === 'show') showToast(selected);
        placeEnemy({ enemy });
        // 👉 Añadir cartas de ataque del comandante:
        placeCommanderCards(selected, uuid);
      };
      // ⚙️ Si está en lista de exclusión → saltamos el modal
      if (commanderNoPc.includes(selected.id)) {
        createAndPlaceCommander(); // sin PC
      }
      // ⚙️ Si viene valor forzado → usarlo directamente
      else if (typeof forcedPcValue === 'number') {
        createAndPlaceCommander(forcedPcValue);
      }
      // ⚙️ Si no, abrir modal como antes
      else {
        openCommanderPCModal((pcValue) => createAndPlaceCommander(pcValue));
      }
      return;
    } else if (selected.categoria === 'overlord') {
      
        const totalVida = selected.vida * (numHeroes);
        const runeIndex = runesColorMap[selected.rune];
        const runePosition = selected.runePosition;
        const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
        const colorId = null;
        const enemy = {
          uuid: uuid,
          name: selected.nombre,
          id: selected.id,
          rune: selected.rune,
          imagen: selected.imagen,
          runePosition,
          position: runeIndex,
          categoria: category,
          comportamiento: behaviorType,
          vida: totalVida,
          vidaMax: totalVida,
          movimiento: selected.movimiento,
          ataque: selected.ataque,
          color: selected.color,
          inmunidad: selected.inmunidad,
          tipo_ataque: selected.tipo_ataque,
          capacidades: adjustedCaps,
          capacidadesOriginales: selected.capacidades,
          ringColor: colorId,
          cara: selected.cara,
          estadosAlterados: initialStates
        };
        if (ver === 'show') showToast(selected);
        placeEnemy({ enemy });
        // 👉 Añadir cartas de ataque del señor supremo:
        placeOverlordCards(selected, uuid);
        return;
    } else if (selected.categoria === 'hero') {
      
        const totalVida = selected.vida * (numHeroes);
        const runeIndex = runesColorMap[selected.rune];
        const runePosition = selected.runePosition;
        const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
        const enemy = {
          uuid: uuid,
          name: selected.nombre,
          id: selected.id,
          rune: selected.rune,
          imagen: selected.imagen,
          runePosition,
          position: runeIndex,
          categoria: category,
          comportamiento: behaviorType,
          vida: totalVida,
          vidaMax: totalVida,
          movimiento: selected.movimiento,
          ataque: selected.ataque,
          color: selected.color,
          inmunidad: selected.inmunidad,
          tipo_ataque: selected.tipo_ataque,
          capacidades: adjustedCaps,
          capacidadesOriginales: selected.capacidades,
          ringColor: colorId,
          cara: selected.cara,
          estadosAlterados: initialStates
        };
        if (ver === 'show') showToast(selected);
        placeEnemy({ enemy });
        // 👉 Añadir cartas de ataque del comandante:
        placeCommanderCards(selected, uuid);
        placeFallenHeroCards(selected, uuid);
        return;
    } else if (selected.categoria === 'jefe') {
        const runeIndex = runesColorMap[selected.rune];
        const runePosition = selected.runePosition;
        const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
        if (selected.rune === 'acecho'){
          const totalVida = selected.vida;
          const enemy = {
            uuid: uuid,
            name: selected.nombre,
            id: selected.id,
            rune: selected.rune,
            imagen: selected.imagen,
            runePosition,
            position: runeIndex,
            categoria: category,
            comportamiento: behaviorType,
            vida: totalVida,
            vidaMax: totalVida,
            movimiento: null,
            ataque: selected.ataque,
            color: selected.color,
            inmunidad: selected.inmunidad,
            tipo_ataque: null,
            capacidades: adjustedCaps,
            capacidadesOriginales: selected.capacidades,
            ringColor: null,
            cara: null,
            estadosAlterados: initialStates
          };

          placeEnemy({ enemy });
       
          return;
          
        } else if (selected.rune === 'jefe'){
          const cubosTrauma = parseInt(window.prompt(`${ti.cubosTrauma}`, "0"), 10) || 0;
          const subTotalTrauma = cubosTrauma * selected.cubo_T;
          const cubosMaldicion = parseInt(window.prompt(`${ti.cubosMaldicion}`, "0"), 10) || 0;
          const subTotalMaldicion = cubosMaldicion * selected.cubo_M;
          const subTotalVida = selected.vida * (numHeroes);
          const totalVida = subTotalVida + subTotalTrauma + subTotalMaldicion;

          const enemy = {
            uuid: uuid,
            name: selected.nombre,
            id: selected.id,
            rune: selected.rune,
            imagen: selected.imagen,
            runePosition,
            position: runeIndex,
            categoria: category,
            comportamiento: behaviorType,
            vida: totalVida,
            vidaMax: totalVida,
            movimiento: null,
            ataque: selected.ataque,
            color: selected.color,
            inmunidad: selected.inmunidad,
            tipo_ataque: null,
            capacidades: adjustedCaps,
            capacidadesOriginales: selected.capacidades,
            ringColor: null,
            cara: null,
            estadosAlterados: initialStates
          };
          //if (ver === 'show') showToast(selected);
          // 1- Eliminar cartas de Runa
          resetPlacedRunes();
          // 2- Eliminar monstruos
          resetPlacedEnemies();
          // 3- Colocar carta de Jefe
          placeEnemy({ enemy });
          // 👉 Añadir cartas de ataque del jefe:
          placeBossCards(selected, uuid);
          // 4- Esbirros
          spawnBossEnemies(selected.numInvoca, selected.invoca, selected.catInvoca);
          // 5- Colocar Runas
          if (selected.robaRunas > 0){
            drawMultipleTiles(selected.robaRunas);
            showScenarioToast(`⚡ ${ti.consecuencias}: ${getEnemyName(selected.id)} ${ti.Roba} ${selected.robaRunas} ${ti.runes}`);
          }
          
          // 6- Consecuencias
          if (selected.consecuencias === "SI") {
            let vidaReducida = 0;
          
            // Pregunta 1: Rompereliquias
            const romperReliquias = window.confirm(`${ti.activaRompe}`);
            if (romperReliquias) {
              vidaReducida += 15 * numHeroes;
            }
          
            // Pregunta 2: Amantes reunidos
            const amantesReunidos = window.confirm(`${ti.activaAmantes}`);
            if (amantesReunidos) {
              vidaReducida += 15 * numHeroes;
            }
          
            // Pregunta 3: Dúo Dinámico
            const duoDinamico = window.confirm(`${ti.activaDuo}`);
            if (duoDinamico) {
              showScenarioToast(`${ti.textoDuo}`);
            }
          
            // Aplicar reducción de vida si corresponde
            if (vidaReducida > 0) {
              enemy.vida = Math.max(0, enemy.vida - vidaReducida);
              //enemy.vidaMax = Math.max(0, enemy.vidaMax - vidaReducida);
              showScenarioToast(`⚡ ${ti.consecuencias}: ${getEnemyName(selected.id)} ${ti.pierde} ${vidaReducida} ${ti.pH}`);
            }
          }
          // 7- Iniciar turno
          restartTurnOrder();
          return;
        }
   
    }
    
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
    
    placeEnemy({
      enemy: {
        uuid: uuid,
        name: selected.nombre,
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: category,
        comportamiento: behaviorType,
        vida: selected.vida,
        vidaMax: selected.vida,
        movimiento: selected.movimiento,
        ataque: selected.ataque,
        color: selected.color,
        inmunidad: selected.inmunidad,
        tipo_ataque: selected.tipo_ataque,
        capacidades: adjustedCaps,
        capacidadesOriginales: selected.capacidades,
        ringColor: colorId,
        cara: selected.cara,
        estadosAlterados: initialStates
      }
    });
    if (ver === 'show') showToast(selected);
  };
  
  const handleRandomCommander = () => {
    const filtered = ENEMIES.filter(e => e.categoria === 'comandante');
    if (filtered.length === 0) return;
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    const uuid = createId();
    const isBig = selected.size === 'grande';
    const colorId = assignColorToEnemy(uuid, isBig);
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    openCommanderPCModal((pcValue) => {
      const totalVida = selected.vida * (pcValue + numHeroes);
      const runeIndex = runesColorMap[selected.rune];
      const runePosition = selected.runePosition;
      const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
      const enemy = {
        uuid: uuid,
        name: selected.nombre,
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: selected.categoria,
        comportamiento: selected.comportamiento,
        vida: totalVida,
        vidaMax: totalVida,
        movimiento: selected.movimiento,
        ataque: selected.ataque,
        color: selected.color,
        inmunidad: selected.inmunidad,
        tipo_ataque: selected.tipo_ataque,
        capacidades: adjustedCaps,
        capacidadesOriginales: selected.capacidades,
        ringColor: colorId,
        cara: selected.cara,
        estadosAlterados: initialStates
      };
      showToast(enemy);
      placeEnemy({ enemy });
      // 👉 Añadir cartas de ataque del comandante:
      placeCommanderCards(selected, uuid);
    });
  };

  const placeCommanderCards = (enemy, commanderUUID, isTurnActivation = false) => {
    const enemyId = enemy.id;
    const enemyColor = enemy.color;
    const enemyCat = enemy.categoria;
    const shuffled = [...CARTAS_COMANDANTE].sort(() => 0.5 - Math.random());
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    const selected = shuffled.slice(0, numHeroes);
    const nombreCommander = getEnemyName(enemyId, enemyColor);
    const nuevas = selected.map(carta => ({
      enemy: {
        uuid: createId(),
        id: carta.id,
        nombre: carta.nombre,
        capacidades: carta.capacidades,
        lista_capacidad: carta.lista_capacidad,
        rune: carta.rune,
        runePosition: carta.runePosition,
        categoria: enemyCat,
        position: runesColorMap[carta.rune],
        tipo: 'especial',
        sourceEnemyUUID: commanderUUID,
        nombreEnemy: nombreCommander,
        highlight: true,
        estadosAlterados: initialStates
      },
    }));
    const msgWar = ti.voragineWarning.replace('{name}', nombreCommander);
    if (isTurnActivation) {
      setWarningMessage(msgWar);
      setTimeout(() => setWarningMessage(null), 3000);
    }
    setPlacedEnemies(prev => [...prev, ...nuevas]);
    nuevas.forEach(carta => {
      setTimeout(() => clearCardHighlight(carta.enemy.uuid), 1500);
    });
  };

  const placeOverlordCards = (enemy, overlordUUID, isTurnActivation = false) => {
    const enemyId = enemy.id;
    const enemyColor = enemy.color;
    const enemyCat = enemy.categoria;
    const shuffled = [...CARTAS_OVERLORD].sort(() => 0.5 - Math.random());
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    const selected = shuffled.slice(0, numHeroes);
    const nombreOverlord = getEnemyName(enemyId, enemyColor);
    const nuevas = selected.map(carta => ({
      enemy: {
        uuid: createId(),
        id: carta.id,
        nombre: carta.nombre,
        capacidades: carta.capacidades,
        lista_capacidad: carta.lista_capacidad,
        rune: carta.rune,
        runePosition: carta.runePosition,
        categoria: enemyCat,
        position: runesColorMap[carta.rune],
        tipo: 'especial',
        sourceEnemyUUID: overlordUUID,
        nombreEnemy: nombreOverlord,
        highlight: true,
        estadosAlterados: initialStates
      },
    }));

     // 1. Mostrar mensaje visual temporal
      // ✅ Mostrar mensaje SOLO si viene de un turno (reinvocación)
    const msgWar = ti.voragineWarning.replace('{name}', nombreOverlord);
    if (isTurnActivation) {
      setWarningMessage(msgWar);
      setTimeout(() => setWarningMessage(null), 3000);
    }
    // 2. Añadir nuevas cartas
    setPlacedEnemies(prev => [...prev, ...nuevas]);
    nuevas.forEach(carta => {
      setTimeout(() => clearCardHighlight(carta.enemy.uuid), 1500);
    });
  };

  const placeFallenHeroCards = (enemy, heroUUID, isTurnActivation = false) => {
    const enemyId = enemy.id;
    const enemyColor = enemy.color;
    const enemyCat = enemy.categoria;
    const nombreHeroe = getEnemyName(enemyId, enemyColor);
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    const nuevasCartas = [];
  
    CARTAS_HEROE_CAIDO.forEach(carta => {
      const nombreTraducido = (ta && ta.nombre && ta.nombre[carta.id]) || carta.nombre || carta.id;
      const confirmar = window.confirm(`${ti.cumpleCondiciones} ${nombreTraducido}?`);
      
      if (confirmar) {
        nuevasCartas.push({
          enemy: {
            uuid: createId(),
            id: carta.id,
            nombre: carta.nombre,
            capacidades: carta.capacidades,
            lista_capacidad: carta.lista_capacidad,
            rune: carta.rune,
            runePosition: carta.runePosition,
            categoria: enemyCat,
            position: runesColorMap[carta.rune],
            tipo: 'fallenHero',
            sourceEnemyUUID: heroUUID,
            nombreEnemy: nombreHeroe,
            highlight: true,
            estadosAlterados: initialStates
          },
        });
      }
    });
  
    if (nuevasCartas.length > 0) {
      const msg = ti.voragineWarning.replace('{name}', nombreHeroe);
      if (isTurnActivation) {
        setWarningMessage(msg);
        setTimeout(() => setWarningMessage(null), 3000);
      }

      setPlacedEnemies(prev => [...prev, ...nuevasCartas]);
  
      nuevasCartas.forEach(carta => {
        setTimeout(() => clearCardHighlight(carta.enemy.uuid), 1500);
      });
    }
  };

  const placeBossCards = (enemy, bossUUID, isTurnActivation = false) => {
    const enemyId = enemy.id;
    const enemyColor = enemy.color;
    const enemyCat = enemy.categoria;
  
    // 🔍 Filtrar cartas de este jefe según su id
    const cartasJefe = CARTAS_JEFE.filter(c => c.idJefe === enemyId);
  
    // Estados iniciales
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
  
    const nombreBoss = getEnemyName(enemyId, enemyColor);
  
    const nuevas = cartasJefe.map(carta => ({
      enemy: {
        uuid: createId(),
        id: carta.id,
        nombre: carta.nombre,
        capacidades: carta.capacidades,
        lista_capacidad: carta.lista_capacidad,
        rune: carta.rune,
        runePosition: carta.runePosition,
        categoria: enemyCat,
        position: runesColorMap[carta.rune],
        tipo: "especial",
        sourceEnemyUUID: bossUUID, // 👈 enlace al jefe original
        nombreEnemy: nombreBoss,
        highlight: true,
        estadosAlterados: initialStates,
      },
    }));
    
    // ⚠️ Mensaje especial (similar a comandante, puedes personalizar)
    const msgBoss = ti.bossWarning
      ? ti.bossWarning.replace("{name}", nombreBoss)
      : `${nombreBoss} ha revelado sus cartas de jefe`;
  
    if (isTurnActivation) {
      setWarningMessage(msgBoss);
      setTimeout(() => setWarningMessage(null), 3000);
    }
  
    setPlacedEnemies(prev => [...prev, ...nuevas]);
  
    // 🔦 Quitar highlight tras un rato
    nuevas.forEach(carta => {
      setTimeout(() => clearCardHighlight(carta.enemy.uuid), 1500);
    });
  };


  const handleAddRuneCard = (runeCard, timeToken) => {
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    if (timeToken) {
      const idxTiempo = initialStates.findIndex(e => e.id === "TIEMPO");
      initialStates[idxTiempo].count = 2;
    }
    const newRune = {
      uuid: createId(),
      id: runeCard.id,
      nombre: runeCard.nombre,
      cara: runeCard.cara,
      posicion: runeCard.posicion, // 'arriba' o 'abajo'
      accion: runeCard.accion,
      numRunas: runeCard.numRunas,
      tipo: runeCard.tipo,
      carta: runeCard.carta,
      colorIndex: 10,
      estadosAlterados: initialStates
    };

    // 👉 Solo añadimos accion2 si existe
    if (runeCard.accion2) {
      newRune.accion2 = runeCard.accion2;
    }
    
    placeRune({ rune: newRune });
    if (newRune.tipo === 'defensa'){
      initializeDecks();
    };
    
  };

  const onRemove = (uuid) => {
    removeEnemyByUUID(uuid);
    releaseColor(uuid);
  };
  
  const openEnemyModal = (uuid) => {
    setSelectedEnemyUuid(uuid);
  };

  const updateEnemyVida = (uuid, nuevaVida, nuevoMax) => {
    setPlacedEnemies(prev =>
      prev.map(e => {
        if (e.enemy.uuid === uuid) {
          const actualMax = e.enemy.vidaMax;
          const nuevoVidaMax = nuevoMax !== undefined && nuevoMax !== null
            ? nuevoMax
            : Math.max(nuevaVida, actualMax); // 👈 si nueva vida > actualMax, lo eleva

          return {
            ...e,
            enemy: {
              ...e.enemy,
              vida: nuevaVida,
              vidaMax: nuevoVidaMax
            }
          };
        }
        return e;
      })
    );
  };

  const updateEnemyEstados = (uuid, updatedStates) => {
    setPlacedEnemies(prev =>
      prev.map(e =>
        e.enemy?.uuid === uuid
          ? { ...e, enemy: { ...e.enemy, estadosAlterados: updatedStates } }
          : e
      )
    );
  };

  const getEnemyEffectiveStats = (enemyUUID) => {
    const enemyData = placedEnemies.find(e => e.enemy.uuid === enemyUUID)?.enemy;
    if (!enemyData) return null;
  
    let ataqueModificado = 0;
    const countAtaque = getRuneCount(enemyData.rune); // Obtenemos el valor base una vez
    
    if (enemyData.ataque === "X") {
      ataqueModificado = countAtaque;
    } else if (typeof enemyData.ataque === "string" && enemyData.ataque.startsWith("X+")) {
      const extra = parseInt(enemyData.ataque.slice(2), 10) || 0;
      ataqueModificado = countAtaque + extra;
    } else {
      ataqueModificado = parseInt(enemyData.ataque, 10) || 0;
    }

    let inmunidadesExtra = [];
    let cartaId = null;
    // Buscar cartas especiales asociadas a este enemigo
    const cartasEspeciales = placedEnemies
      //.filter(e => (e.enemy.tipo === 'especial' || e.enemy.tipo === 'fallenHero' ) && e.enemy.sourceEnemyUUID === enemyUUID)
      .filter(e => 
        (e.enemy.tipo === 'especial' || e.enemy.tipo === 'fallenHero') &&
        e.enemy.sourceEnemyUUID === enemyUUID &&
        !(
          Array.isArray(e.enemy.estadosAlterados) &&
          e.enemy.estadosAlterados.some(est => est.id === "TIEMPO" && est.count > 0)
        )
      )
      .map(e => e.enemy);
  
    cartasEspeciales.forEach(carta => {
      if (Array.isArray(carta.lista_capacidad) && carta.lista_capacidad.includes("PASIVA")) {
        cartaId = carta.id;
        const idx = carta.lista_capacidad.indexOf("PASIVA");
        const efecto = carta.lista_capacidad[idx + 2]; // Ej: "DAÑO_BASICO_X" o "CONDICION_I"
        if (efecto?.startsWith("DAÑO_BASICO")) {
          const partes = efecto.split("_");
          const multiplicador = partes[2] === "X" ? getRuneCount(carta.rune) : parseInt(partes[2], 10);
          ataqueModificado += multiplicador;
        } else if (efecto?.endsWith("_I")) {
          inmunidadesExtra.push(efecto);
        }
      }
    });
  
    return {
      ...enemyData,
      idCartaEspecial: cartaId,
      ataqueModificado,
      inmunidades: [...(enemyData.inmunidad || []), ...inmunidadesExtra],
    };
  };

  
  // Estados alterados de enemigos y héroes (motor común en useStatusEffects).
  const { applyEnemyStatus: aplicarEfectosEstados, applyHeroStatus: aplicarEfectosHeroe } = useStatusEffects({
    labels: tea,
    texts: {
      consume: ti.consume,
      shields: ti.escudos,
      inflicts: ti.inflige,
      damage: ti.daño_i,
      ignoresShields: ti.ignoraEscudos,
      reduce: ti.reduce,
      death: ti.muere_2,
    },
    getHeroExtras,
    updateHeroExtras,
    // Se llama en diferido: showScenarioToast se define más abajo.
    showScenarioToast: (...args) => showScenarioToast(...args),
    getHeroLabel: (heroId) => translations.heroes?.[heroId] || heroId,
  });
  const aplicarCapacidadesActivadas = (enemy, placedEnemies) => {
    let vida = enemy.vida;
    let estados = [...(enemy.estadosAlterados || [])];
    const logs = [];
  
    // ⚡ Obtenemos las capacidades ajustadas
    const capacidades = adjustCapabilitiesByRunes(enemy.capacidadesOriginales || [], enemy.rune, getRuneCount);
    capacidades.forEach(cap => {
      // ✅ REGENERACIÓN X
      if (cap.startsWith("REGENERACION")) {
        const partes = cap.split(" ");
        const cantidad = parseInt(partes[1]) || 0;
  
        if (cantidad > 0) {
          const vidaAntes = vida;
          const vidaNueva = Math.min(enemy.vidaMax, vida + cantidad);
  
          if (vidaNueva > vidaAntes) {
            vida = vidaNueva;
            logs.push(`${ti.regenera} ${vidaNueva - vidaAntes} ${ti.vida_i}`);
          }
        }
      }
  
      // ✅ ESCUDO X
      if (cap.startsWith("ESCUDO")) {
        const partes = cap.split(" ");
        const cantidad = parseInt(partes[1]) || 0;
  
        if (cantidad > 0) {
          // buscamos el estado ESCUDO
          let nuevosEstados = [...estados];
          const idx = nuevosEstados.findIndex(e => e.id === "ESCUDO");
          const configEscudo = ESTADOS_ALTERADOS.find(e => e.id === "ESCUDO");
          const maxEscudo = configEscudo?.max || Infinity;
  
          if (idx >= 0) {
            const actual = nuevosEstados[idx].count;
            const nuevo = Math.min(maxEscudo, actual + cantidad);
  
            if (nuevo > actual) {
              nuevosEstados[idx] = { ...nuevosEstados[idx], count: nuevo };
              logs.push(`${ti.gana} ${nuevo - actual} ${ti.escudos}`);
            }
          } else {
            const nuevo = Math.min(maxEscudo, cantidad);
            nuevosEstados.push({ id: "ESCUDO", count: nuevo });
            if (nuevo > 0) logs.push(`${ti.gana} ${nuevo} ${ti.escudos}`);
          }
          estados = nuevosEstados; // ✅ Actualizamos con la copia
        }
      }

      // ✅ EVOLUCIÓN
      if (cap === "EVOLUCION") {
        setEnemyEvolutions(prev => {
          const existing = prev.find(e => e.uuid === enemy.uuid);
          if (existing) {
            // Si ya existe → incrementamos el contador
            return prev.map(e =>
              e.uuid === enemy.uuid ? { ...e, count: e.count + 1 } : e
            );
          } else {
            // Si no existe → lo añadimos con 1 evolución
            return [...prev, { uuid: enemy.uuid, count: 1 }];
          }
        });
      
        logs.push(`${ti.evoluciona}: ${ti.fuerzaAumenta}`);
      }
      
      // ✅ MANIFESTAR
      if (cap === "MANIFESTAR") {
        const tile = manifestTile();
        if (tile) {
          // ✅ IRA
          if (capacidades.includes("IRA")) { 
            const iraResult = handleIraEffect([tile], enemy);
            if (iraResult?.estados) {
              estados = iraResult.estados;
            }
            if (iraResult?.logs) {
              logs.push(...iraResult.logs);
            }
          } else {
            logs.push(`${ti.Manifiesta} ${ti.colores[tile.runa]}`);
          }
        }
      }

      
      // ✅ HASTA + SANAR
      if (cap.startsWith("HASTA")) {
        
        const partes = cap.split(" ");
        const cantidadObjetivos = parseInt(partes[1]) || 0;
      
        // 🔍 Buscamos la siguiente capacidad que empiece por SANAR
        const idxCap = capacidades.indexOf(cap);
        const capSanar = capacidades[idxCap + 2] || "";
        if (capSanar.startsWith("SANAR")) {
          const sanarPartes = capSanar.split(" ");
          const cantidadSanar = parseInt(sanarPartes[1]) || 0;
      
          if (cantidadObjetivos > 0 && cantidadSanar > 0) {
            // ✅ Localizamos TODOS los enemigos (incluyendo al actual)
            const todosEnemigos = placedEnemies
              .map(e => e.enemy)
              .filter(e => e.vida > 0);
           
            // Ordenamos por vida ascendente
            const ordenados = [...todosEnemigos].sort((a, b) => a.vida - b.vida);
      
            // Tomamos los N más débiles
            const objetivos = ordenados.slice(0, cantidadObjetivos);
      
            objetivos.forEach(objetivo => {
              const vidaAntes = objetivo.vida;
              const vidaNueva = Math.min(objetivo.vidaMax, vidaAntes + cantidadSanar);
      
              if (vidaNueva > vidaAntes) {
                logs.push(
                  `${ti.sanaA} ${tee[objetivo.id]} ${vidaNueva - vidaAntes} ${ti.vida_i}`
                );
      
                // ✅ Actualizamos vida del objetivo en placedEnemies
                if (objetivo.uuid != enemy.uuid){
                  updateEnemyVida(objetivo.uuid, vidaNueva, objetivo.vidaMax);
                } else {
                  vida = vidaNueva;
                }

              }
            });
          }
        }
      }

      
    });
    
    return {
      vida,
      estados: Array.isArray(estados) ? [...estados] : [],
      logs: logs.length > 0 ? logs : []
    };
  };

  const aplicarCapacidadesCartaEspecial = (cartaEspecial) => {
    const logs = [];
    const capacidades = cartaEspecial.lista_capacidad || [];
    const runeCount = getRuneCount(cartaEspecial.rune);
    const heroCount = numHeroes;
    let tile = null;
    const targetUUID = cartaEspecial.sourceEnemyUUID;
    const entry = placedEnemies.find(e => e.enemy.uuid === targetUUID);
    const enemigo = entry?.enemy;

    let curacionTotal = 0;
    
    if (!enemigo) return { logs }; // Nada que hacer si no hay enemigo vinculado
  
    capacidades.forEach(cap => {
      // ✅ --- SANA ---
      if (cap.startsWith("SANA")) {
        const partes = cap.split("_");
        const tieneCondicion = partes.includes("?");
        const puedeSobrepasar = partes.includes("SI");
        const condicionCasillas = partes.includes("CASILLAS");
        
        // Multiplicador
        let multiplicador = 1;
        const idxNumero = partes.findIndex(p => !isNaN(p));
        if (idxNumero !== -1) multiplicador = parseInt(partes[idxNumero], 10);

        // 🔹 Determinar valor base
        let baseValor = runeCount;
        if (condicionCasillas) {
          const confirmarCasillas = window.confirm(`${ti.numCasillas1}`);
          if (!confirmarCasillas) return;
          
          const input = parseInt(window.prompt(`${ti.numCasillas2}`, "0"), 10);
          if (!isNaN(input) && input > 0) {
            baseValor = input * heroCount;
          } else {
            baseValor = 0; // si meten algo inválido, no cura nada
          }
        }
        
        const curacion = multiplicador * baseValor;
        if (curacion <= 0) return;
  
        let nuevaVida = enemigo.vida + curacion;
        let nuevoMax = enemigo.vidaMax;
  
        if (puedeSobrepasar && nuevaVida > enemigo.vidaMax) {
          nuevoMax = nuevaVida;
        } else {
          nuevaVida = Math.min(nuevaVida, enemigo.vidaMax);
        }
        
        const curacionReal = nuevaVida - enemigo.vida
        
        if (tieneCondicion && curacion > 0) {
          const confirmar = window.confirm(`${ti.sanaPreg} ${curacionReal} ${ti.preg}`);
          if (!confirmar) return;
        }
        
        updateEnemyVida(targetUUID, nuevaVida, nuevoMax);
        curacionTotal += curacionReal;
        const nombreCarta = ta?.nombre?.[cartaEspecial.id] || cartaEspecial.nombre || cartaEspecial.id;
        logs.push(`💚 ${nombreCarta} ${ti.sana} ${curacionReal}`);
      }
  
      // ✅ --- ESCUDO ---
      else if (cap.startsWith("ESCUDO")) {
        const partes = cap.split("_");
        const tieneCondicion = partes.includes("?");
        const puedeSobrepasar = partes.includes("SI");
        const configEscudo = ESTADOS_ALTERADOS.find(e => e.id === "ESCUDO");
        const maxEscudo = configEscudo?.max || Infinity;
  
        let escudosAgregar = 0;
  
        if (partes.includes("X")) {
          escudosAgregar = runeCount;
        } else if (tieneCondicion) {
          const cantidad = parseInt(prompt(ti.cuantosEscudos), 10);
          if (!isNaN(cantidad) && cantidad > 0) escudosAgregar = cantidad;
        }
  
        if (escudosAgregar <= 0) return;
  
        const estados = [...enemigo.estadosAlterados];
        const idx = estados.findIndex(e => e.id === "ESCUDO");
  
        if (idx >= 0) {
          let actual = estados[idx].count;
          let nuevo = actual + escudosAgregar;
          if (!puedeSobrepasar) nuevo = Math.min(nuevo, maxEscudo);
          estados[idx] = { ...estados[idx], count: nuevo };
        } else {
          let nuevo = escudosAgregar;
          if (!puedeSobrepasar) nuevo = Math.min(nuevo, maxEscudo);
          estados.push({ id: "ESCUDO", count: nuevo });
        }
  
        updateEnemyEstados(targetUUID, estados);
  
        const nombreCarta = ta?.nombre?.[cartaEspecial.id] || cartaEspecial.nombre || cartaEspecial.id;
        logs.push(`🛡 ${nombreCarta} ${ti.gana} ${escudosAgregar} ${ti.escudos}`);
      }
  
      // ✅ --- RECUPERA ---
      else if (cap.startsWith("RECUPERA")) {
        const partes = cap.split("_"); // ["RECUPERA", "2", "MALDICION", "SI"]
        const puedeSobrepasar = partes.includes("SI");
  
        // Multiplicador
        let multiplicador = 1;
        const idxNumero = partes.findIndex(p => !isNaN(p));
        if (idxNumero !== -1) multiplicador = parseInt(partes[idxNumero], 10);
  
        const recurso = partes.find(p => isNaN(p) && p !== "RECUPERA" && p !== "SI");
        if (!recurso) return;
  
        const cantidadRecurso = parseInt(prompt(`${ti.cuantosRecursos} ${ttr[recurso]} ${ti.sonAb}?`), 10);
        if (isNaN(cantidadRecurso) || cantidadRecurso <= 0) return;
  
        const curacion = cantidadRecurso * multiplicador;
        if (curacion <= 0) return;
  
        let nuevaVida = enemigo.vida + curacion;
        let nuevoMax = enemigo.vidaMax;
  
        if (puedeSobrepasar && nuevaVida > enemigo.vidaMax) {
          nuevoMax = nuevaVida;
        } else {
          nuevaVida = Math.min(nuevaVida, enemigo.vidaMax);
        }
  
        const curacionReal = nuevaVida - enemigo.vida;
        updateEnemyVida(targetUUID, nuevaVida, nuevoMax);
        curacionTotal += curacionReal;
        const nombreCarta = ta?.nombre?.[cartaEspecial.id] || cartaEspecial.nombre || cartaEspecial.id;
        logs.push(`💚 ${nombreCarta} ${ti.regenera} ${curacionReal} ${ti.vida_i}`);
      }
  
      // ✅ --- MANIFESTAR ---
      else if (cap.startsWith("MANIFIESTA")) {
        // Aquí invocaríamos manifestTile() o lógica similar
        tile = manifestTile();
        if (tile) {
          logs.push(`🔮 ${ti.runaManifestada} ${ti.colores[tile.runa]}`);
          
        }
      }

      // ✅ --- ROBA RUNA ---
      else if (cap.startsWith("ROBA")) {
        const partes = cap.split("_");
        const cantidad = parseInt(partes[1], 10) || 0;
        if (cantidad <= 0) return;
        const tiles = drawMultipleTiles(cantidad);
        tiles?.forEach(tile_0 => handleTileDraw(tile_0));
      }

      // ✅ --- CONDICIONES ---
      else if (cap.startsWith("CONDICIONES")) {
        const boss = placedEnemies.find(e => e.enemy.uuid === cartaEspecial.sourceEnemyUUID)?.enemy;
        if (!boss) return;
      
        // 🔹 Efectos de estados (fase inicio)
        const { enemy: actualizadoEstados, logs: logsEstados } = aplicarEfectosEstados(boss, "inicio");
      
        // ✅ Aplicar efectos de capacidades activadas
        const { vida, estados, logs: logsCapacidades } = aplicarCapacidadesActivadas(actualizadoEstados, placedEnemies);
      
        // 🔹 Actualizamos enemigo con ambos cambios
        const enemigoFinal = { ...actualizadoEstados, vida, estadosAlterados: estados };
      
        // ☠️ Si ya está muerto aquí → eliminar y cortar
        if (enemigoFinal.vida <= 0) {
          showScenarioToast(`☠ ${tee[enemigoFinal.id]} ${ti.muere_1}`);
          removeEnemyByUUID(enemigoFinal.uuid);
          return;
        }
      
        // 🔹 Efectos de estados (fase fin)
        const { enemy: actualizado, logs } = aplicarEfectosEstados(enemigoFinal, "fin");
      
        // ✅ Mostrar logs (estados + capacidades)
        [...logsEstados, ...logsCapacidades, ...logs].forEach(log =>
          showScenarioToast(`🌀 ${tee[actualizado.id]}: ${log}`)
        );
      
        // Guardar cambios en placedEnemies
        setPlacedEnemies(prev =>
          prev.map(e =>
            e.enemy.uuid === actualizado.uuid ? { ...e, enemy: actualizado } : e
          )
        );
      }
      
      // ✅ --- TIEMPO ---
      else if (cap.startsWith("TIEMPO")) {
        const partes = cap.split("_");
        const cantidad = parseInt(partes[1], 10) || 0;
        if (cantidad <= 0) return;
      
        // 🔍 Necesitamos tile del paso anterior (MANIFIESTA)
        if (!tile) return; 
        
        const runeColor = tile.runa;
      
        // Recorremos todos los enemigos en esa runa
        placedEnemies.forEach(e => {
          const enemigo = e.enemy;
      
          // Excluir la propia carta y el enemigo asociado
          if (enemigo.uuid === cartaEspecial.uuid) return;
          if (enemigo.uuid === cartaEspecial.sourceEnemyUUID) return;
      
          if (enemigo.rune === runeColor) {
            const estados = [...(enemigo.estadosAlterados || [])];
            const idx = estados.findIndex(est => est.id === "TIEMPO");
      
            if (idx >= 0) {
              estados[idx] = { ...estados[idx], count: estados[idx].count + cantidad };
            } else {
              estados.push({ id: "TIEMPO", count: cantidad });
            }
      
            // ✅ Actualizamos el enemigo con updateEnemyEstados
            updateEnemyEstados(enemigo.uuid, estados);
      
            // Log
            logs.push(`⏳ ${tee[enemigo.id] || ta.nombre[enemigo.id]} ${ti.gana} ${cantidad} ${ti.tiempo}`);
          }
        });
      }

        
      // ✅ --- ACTIVA ---
      else if (cap.startsWith("ACTIVA")) {
        const partes = cap.split("_"); // ["ACTIVA", "5", "RUNA"] o ["ACTIVA", "10", "SANA"]
        let activaUUID = cartaEspecial.sourceEnemyUUID;
        const nombreCarta = ta?.nombre?.[cartaEspecial.id] || cartaEspecial.nombre || cartaEspecial.id;
        //const numero = parseInt(partes[1], 10) || 0;
        const numero = partes[1] !== undefined ? parseInt(partes[1], 10) : null;
        const condicion = partes[2] || null;
        let activar = false;
      
        if (numero === 0) {
          activar = true; // ACTIVA_0
        } else if (condicion === "RUNA") {
          const totalRunas = getRuneCount(cartaEspecial.rune);
          if (totalRunas >= numero) activar = true;
        } else if (condicion === "SANA") {
          if (curacionTotal >= numero) activar = true; // Necesitamos acumular curacionTotal
        } else if (condicion === "ESBIRROS") {
          // AÑADIR TURNO DE ESBIRROS
          const esbirros = placedEnemies.filter(e => e.enemy.categoria === "esbirro")
          esbirros.forEach(e => addExtraTurn(e.enemy.uuid));
          logs.push(`⚡ ${nombreCarta} ${ti.activaTurnoEsbirros}`);
        } else if (condicion === "CARTA") {
          // AÑADIR TURNO DE CARTA
          addExtraTurn(cartaEspecial.uuid);
          logs.push(`⚡ ${nombreCarta} ${ti.activaTurnoCarta}`);
        }
      
        if (activar && activaUUID) {
          addExtraTurn(activaUUID);
          const nombreCarta = ta?.nombre?.[cartaEspecial.id] || cartaEspecial.nombre || cartaEspecial.id;
          logs.push(`⚡ ${nombreCarta} ${ti.activaTurno}`);
        }
      }

      // ✅ --- INVOCA ---
      else if (cap.startsWith("INVOCA")) {
        const idxCap = capacidades.indexOf(cap);
        const partes = cap.split("_");
        
        let numRaw = partes[1];
        let numInvocar = 1;
        if (numRaw === "X") {
          numInvocar = heroCount; // número de héroes
        } else {
          numInvocar = parseInt(numRaw, 10) || 1;
        }

        // --- Límite máximo ---
        let maxRaw = partes[3]; // "4" o "NO"
        let maxPermitido = Infinity;
        if (maxRaw !== "NO") {
          maxPermitido = parseInt(maxRaw, 10) || Infinity;
        }

        const enemyId = capacidades[idxCap + 1];
        const categoria = capacidades[idxCap + 2];

        if (enemyId && categoria) {
          // 🔍 Cuántos ya están en juego
          const yaInvocados = placedEnemies.filter(e => e.enemy.id === enemyId && e.enemy.categoria === categoria).length;
      
          // 🔹 Hueco disponible
          const huecoDisponible = maxPermitido === Infinity ? numInvocar : Math.max(0, maxPermitido - yaInvocados);
      
          // 🔹 Cantidad final a invocar
          const cantidadAInvocar = Math.min(numInvocar, huecoDisponible);
      
          if (cantidadAInvocar <= 0) {
            showScenarioToast(`${ti.noMasInvocar}`);
            return;
          }
        
          let simulatedUsedSmall = [...usedColors];
          let simulatedUsedBig = [...usedColorsBig];
          const generatedColors = [];
          let warnedNoColors = false;
      
         for (let i = 0; i < cantidadAInvocar; i++) {
          // 🔍 Buscar candidatos
          const candidatos = ENEMIES.filter(
            e => enemies.includes(e.id) && e.id === enemyId && e.categoria === categoria
          );
    
          if (candidatos.length > 0) {
            const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
            const isBig = elegido.size === 'grande';
            let nextColorId = getNextAvailableColorSimulated(isBig, simulatedUsedSmall, simulatedUsedBig);
    
            if (!nextColorId) {
              if (!warnedNoColors) {
                alert(ti.noColorsAvailable || "No hay más colores disponibles para asignar");
                warnedNoColors = true;
              }
              nextColorId = 'noColor';
            } else {
              if (isBig) simulatedUsedBig.push(nextColorId);
              else simulatedUsedSmall.push(nextColorId);
              generatedColors.push(nextColorId);
            }
    
            // ✅ Añadir enemigo manualmente
            handleManualEnemyAdd(elegido.id, elegido.comportamiento, elegido.categoria, 'NoShow', nextColorId);
            showScenarioToast(`${ti.invoca} ${tee[elegido.id]}`);
          }
        }
      }
    }
      
 
    });
  
    return { logs };
  };


  const checkTiempoSkip = (entity) => {
    if (!entity?.estadosAlterados) return null;
    const idx = entity.estadosAlterados.findIndex(e => e.id === "TIEMPO");
    if (idx === -1) return null;
  
    const estado = entity.estadosAlterados[idx];
    if (estado.count <= 0) return null;
  
    const config = ESTADOS_ALTERADOS.find(e => e.id === "TIEMPO");
    const reduce = config?.numReduce || 1;
    let nuevoCount = estado.count;
    let countOri = estado.count;
    
    if (config?.reduce === "si") {
      nuevoCount = Math.max(0, estado.count - reduce);
    }
  
    const nuevosEstados = [...entity.estadosAlterados];
    nuevosEstados[idx] = { ...estado, count: nuevoCount };
  
    return { skipped: countOri > 0, nuevosEstados };
  };

  const interpretarTexto = (textoOriginal, runeColor, traductor) => {
    const numRunasColor = getRuneCount(runeColor);
    let texto = textoOriginal;
  
    if (texto) {
      texto = texto
        .replaceAll('{X}', numRunasColor)
        .replaceAll('{2*X}', numRunasColor * 2)
        .replaceAll('{3*X}', numRunasColor * 3)
        .replaceAll('{4*X}', numRunasColor * 4);
  
      // 🔹 Reemplazar {clave} por traducción
      texto = texto.replace(/\{([^}]+)\}/g, (_, key) => traductor[key] || key);
  
      // 🔹 Colorear palabras entre [corchetes]
      texto = texto.replace(/\[([^\]]+)\]/g, (_, word) => {
        return `<span style="color: #3B82F6; font-weight: bold;">${traductor[word] || word}</span>`;
      });
  
      return texto;
    }
  
    return '';
  };

  const interpretarCapacidades = (capacidades, runeColor) => {
    if (!Array.isArray(capacidades) || capacidades.length === 0) return;
   
    capacidades.forEach(cap => {
      // 🔹 Caso: INVOCA_X
      if (cap.startsWith("INVOCA_")) {
        const idxCap = capacidades.indexOf(cap);
        let numRaw = cap.split("_")[1]; // puede ser "2" o "X"
        let num = 1;
        
        let simulatedUsedSmall = [...usedColors];
        let simulatedUsedBig = [...usedColorsBig];
        const generatedColors = [];

        if (numRaw === "X") {
          num = getRuneCount(runeColor); // usamos el color de la runa
        } else {
          num = parseInt(numRaw, 10) || 1;
        }
        
        const enemyId = capacidades[idxCap + 1];
        const categoria = capacidades[idxCap + 2];

        let warnedNoColors = false;
        
        if (enemyId && categoria) {
          for (let i = 0; i < num; i++) {
            
            // 🔍 Filtramos enemigos disponibles que coincidan con ID y categoría
            const candidatos = ENEMIES.filter( e => enemies.includes(e.id) && e.id === enemyId && e.categoria === categoria );

            if (candidatos.length > 0) {
              const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
              const isBig = elegido.size === 'grande';
              let nextColorId = getNextAvailableColorSimulated(isBig, simulatedUsedSmall, simulatedUsedBig);
              if (!nextColorId) {
                if (!warnedNoColors) {
                  alert(ti.noColorsAvailable || "No hay más colores disponibles para asignar");
                  warnedNoColors = true;
                }
                nextColorId = 'noColor';
              } else {
                if (isBig) simulatedUsedBig.push(nextColorId);
                else simulatedUsedSmall.push(nextColorId);
                generatedColors.push(nextColorId);
              }
              // ✅ Añadir enemigo manualmente
    
              handleManualEnemyAdd(elegido.id, elegido.comportamiento, elegido.categoria, 'NoShow', nextColorId);
              showScenarioToast(`${ti.invoca} ${tee[elegido.id]}`);
            }
          }
        }
      }
  
      // 🔹 Caso: ROBA_X
      if (cap.startsWith("ROBA_")) {
        const numRune = parseInt(cap.split("_")[1], 10) || 1;
        const tiles = drawMultipleTiles(numRune);
        tiles?.forEach((tile) => handleTileDraw(tile));
        if (!tiles) setTileWarning(ti.aviso);
        showScenarioToast(`${ti.Roba} ${numRune} ${ti.rune}`);
        discardTileByColor(runeColor);
        handleAcechoEffect(tiles);
      }

    });
    
  };

  const getEnemiesByColor = (trackerEnemies, color, behaviorType = null) => {
    const validEnemies = Array.from(new Set(trackerEnemies.map(e => e.id)));
    return ENEMIES.filter(e =>
      validEnemies.includes(e.id) &&
      e.color === color &&
      (behaviorType ? e.comportamiento === behaviorType : true)
    );
  };

  const procesarInicioTurnoEnemy = (enemy) => {
    // ✅ Control de TIEMPO
    if (!processedTiempoRef.current.has(enemy.uuid)) {
      processedTiempoRef.current.add(enemy.uuid);
      const skippedData = checkTiempoSkip(enemy);
      if (skippedData?.skipped) {
        setPlacedEnemies(prev =>
          prev.map(e =>
            e.enemy.uuid === enemy.uuid
              ? { ...e, enemy: { ...e.enemy, estadosAlterados: skippedData.nuevosEstados } }
              : e
          )
        );
        const nombreEnemy = tee?.[enemy.id] || enemy.nombre || enemy.id;
        showScenarioToast(`⏳ ${nombreEnemy} ${ti.saltaTurnoPorTiempo}`);
        return false; // turno saltado
      }
    }
  
    // ✅ Inicio de turno normal
    if (!processedStartEffectsRef.current.has(enemy.uuid)) {
      processedStartEffectsRef.current.add(enemy.uuid);
  
      if (enemy.vida <= 0) {
        showScenarioToast(`☠ ${tee[enemy.id]} ${ti.muere_1}`);
        removeEnemyByUUID(enemy.uuid);
        return false;
      }
  
      // Estados (fase inicio)
      const { enemy: actualizadoEstados, logs: logsEstados } = aplicarEfectosEstados(enemy, "inicio");
  
      // Capacidades
      const { vida, estados, logs: logsCapacidades } = aplicarCapacidadesActivadas(actualizadoEstados, placedEnemies);
  
      const enemigoFinal = { ...actualizadoEstados, vida, estadosAlterados: estados };
  
      [...logsEstados, ...logsCapacidades].forEach(log =>
        showScenarioToast(`🌀 ${tee[enemigoFinal.id]}: ${log}`)
      );
  
      // Guardar
      setPlacedEnemies(prev =>
        prev.map(e =>
          e.enemy.uuid === enemigoFinal.uuid ? { ...e, enemy: enemigoFinal } : e
        )
      );
  
      if (enemigoFinal.vida <= 0) {
        showScenarioToast(`☠ ${tee[enemigoFinal.id]} ${ti.muere_1}`);
        removeEnemyByUUID(enemigoFinal.uuid);
        return false;
      }
    }
  
    return true; // turno válido
  };
  
    

  const colorMap = {
    rojo: 'bg-red-700 hover:bg-red-600',
    azul: 'bg-blue-700 hover:bg-blue-600',
    verde: 'bg-green-700 hover:bg-green-600',
    naranja: 'bg-orange-700 hover:bg-orange-600',
    gris: 'bg-slate-700 hover:bg-slate-600',
  };
  useEffect(() => {
    const initialHeroes = (Array.isArray(trackerData.heroes) ? trackerData.heroes : [])
      .map((id) => {
        const hero = HEROES.find((entry) => entry.id === id);
        if (!hero) return null;
        const role = trackerData.roles?.[id];
        return { id, role, image: hero.image, position: rolesPositionMap[role] };
      })
      .filter(Boolean);
    setTrackerData(prev => ({ ...prev, placedHeroes: initialHeroes }));
    // Solo al montar: inicializa posiciones desde la configuración guardada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Cursor del turno e historial de deshacer (H8 2/3).
  const {
    turnIndex,
    setTurnIndex,
    roundNumber,
    setRoundNumber,
    previousTurnIndex,
    setPreviousTurnIndex,
    groupTurnTracker,
    setGroupTurnTracker,
    extraTurnsQueue,
    setExtraTurnsQueue,
    extraTurnIndex,
    setExtraTurnIndex,
    extraTurnTotal,
    setExtraTurnTotal,
    undoCount,
    pushHistory,
    popHistory,
    restoreCursor,
    resetCursor,
  } = useTurnCursor(persistedSession);
  const [currentTurnEntity, setCurrentTurnEntity] = useState(null);
  const processedVoragineRef = useRef(toSet(persistedSession?.processed?.voragine));
  const processedDefenseTurnRef = useRef(toSet(persistedSession?.processed?.defenseTurn));
  const [lastRealTurnIndex, setLastRealTurnIndex] = useState(() => persistedSession.lastRealTurnIndex ?? null);
  const roundRef = useRef(roundNumber);
  const previousTurnIndexRef = useRef(persistedSession.previousTurnIndex ?? null);
  const processedStartEffectsRef = useRef(toSet(persistedSession?.processed?.start));
  const processedEndEffectsRef = useRef(toSet(persistedSession?.processed?.end));
  const processedHeroEffectsRef = useRef(toSet(persistedSession?.processed?.hero));
  const lastHeroTurnRef = useRef(persistedSession?.processed?.lastHeroTurn || null);
  const processedCardsRef = useRef(toSet(persistedSession?.processed?.cards));
  const processedTiempoRef = useRef(toSet(persistedSession?.processed?.tiempo));
  const [presentation, setPresentation] = useState(false);
  // En móvil la bolsa arranca cerrada: libera altura para el tablero.
  const [bagOpen, setBagOpen] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth >= 1024
  ));
  const [historyOpen, setHistoryOpen] = useState(false);
  // Rastro de los últimos turnos para el carrusel (anterior / actual / siguiente).
  const turnTrailRef = useRef([]);
  // Cronómetro: segundos del turno actual y marca de inicio del turno.
  const [turnSeconds, setTurnSeconds] = useState(0);
  const turnTimerRef = useRef({ entity: null, startedAt: Date.now() });
  // Densidad del tablero, persistida entre sesiones.
  const [density, setDensity] = useState(() => {
    const stored = readJsonStorage('trackDensity', 'normal');
    return stored === 'compact' ? 'compact' : 'normal';
  });
  const toggleDensity = () => {
    setDensity((prev) => {
      const next = prev === 'compact' ? 'normal' : 'compact';
      writeJsonStorage('trackDensity', next);
      return next;
    });
  };

  // Solape de cartas: normal o más superpuestas para compactar las pilas.
  const [overlap, setOverlap] = useState(() => {
    const stored = readJsonStorage('trackOverlap', 'normal');
    return stored === 'compact' ? 'compact' : 'normal';
  });
  const toggleOverlap = () => {
    setOverlap((prev) => {
      const next = prev === 'compact' ? 'normal' : 'compact';
      writeJsonStorage('trackOverlap', next);
      return next;
    });
  };

  // Carrusel de turnos: oculto por defecto en móvil, visible en escritorio.
  const [carouselOpen, setCarouselOpen] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth >= 1024
  ));

  // Guarda los conjuntos de efectos ya procesados para no repetirlos al restaurar la partida.
  const persistProcessed = () => {
    const session = readJsonStorage('trackerSession', {}, isPlainObject) || {};
    writeJsonStorage('trackerSession', {
      ...session,
      schemaVersion: 2,
      processed: {
        voragine: [...processedVoragineRef.current],
        defenseTurn: [...processedDefenseTurnRef.current],
        start: [...processedStartEffectsRef.current],
        end: [...processedEndEffectsRef.current],
        cards: [...processedCardsRef.current],
        tiempo: [...processedTiempoRef.current],
        hero: [...processedHeroEffectsRef.current],
        lastHeroTurn: lastHeroTurnRef.current || null,
      },
    });
  };

  useEffect(() => {
    writeJsonStorage('trackerSession', {
      schemaVersion: 1,
      enemyEvolutions,
      turnIndex,
      lastRealTurnIndex,
      roundNumber,
      previousTurnIndex,
      groupTurnTracker,
      extraTurnsQueue,
      extraTurnIndex,
      extraTurnTotal,
    });
  }, [
    enemyEvolutions, turnIndex, lastRealTurnIndex, roundNumber, previousTurnIndex,
    groupTurnTracker, extraTurnsQueue, extraTurnIndex, extraTurnTotal,
  ]);
  
  useEffect(() => {

    if (turnIndex < 0 || turnIndex >= TURN_ORDER.length) return;
    const step = TURN_ORDER[turnIndex];

    // ✅ Mostrar toast inicial solo una vez
    if (previousTurnIndexRef.current === null && roundRef.current === 0) {
      roundRef.current = 1;
      setRoundNumber(1);
      showScenarioToast(`🔁 ${ti.rondaInicial}`);
    }
    
    // 🔁 Detectar nueva ronda
    if (
      previousTurnIndexRef.current !== null &&
      turnIndex !== -1 &&
      turnIndex < previousTurnIndexRef.current
    ) {
      // Solo cuando damos la vuelta al ciclo completo
      processedVoragineRef.current = new Set();
      processedDefenseTurnRef.current = new Set();
      processedStartEffectsRef.current.clear();
      processedEndEffectsRef.current.clear();
      processedCardsRef.current.clear();
      processedTiempoRef.current = new Set();
      processedHeroEffectsRef.current = new Set();
      lastHeroTurnRef.current = null;
      setExecutedRunes([]);
      roundRef.current += 1;
      setRoundNumber(roundRef.current);
      showScenarioToast(`🔁 ${ti.ronda}: ${roundRef.current}`);
    }

    previousTurnIndexRef.current = turnIndex;
    setPreviousTurnIndex(turnIndex);
    
    let hasEntities = false;
    if (step.type === "enemy") {
      hasEntities = placedEnemies.some(
        e =>
          e.enemy.rune === step.rune &&
          e.enemy.position === step.index &&
          e.enemy.runePosition === step.position
      );
    } else if (step.type === "rune") {
      hasEntities = placedRunes.some(
        r =>
          r.rune.colorIndex === step.index &&
          r.rune.posicion === step.position
      );
    } else if (step.type === "hero") {
      hasEntities = trackerData.placedHeroes?.some(
        h => h.role === step.role && h.position === step.index
      );
    }
    
    if (!hasEntities) {
      //console.log("⚠ No hay entidades en el paso actual, avanzamos...");
      setTimeout(() => {
        handleNextTurn();
      }, 800); 
      return;
    }
    
    // 🔍 ENEMIES
    if (step.type === 'enemy') {
       // 🔹 Cogemos los enemigos de este paso normalmente
      let group = placedEnemies
        .filter(e =>
          e.enemy.rune === step.rune &&
          e.enemy.position === step.index &&
          e.enemy.runePosition === step.position
        )
        .map(e => e.enemy);
    
    
          
      if (group.length > 0) {
        const current = group[groupTurnTracker.index];
        if (!current) {
          setTimeout(() => {
            handleNextTurn();
          }, 1500); 
          return;
        }
        setCurrentTurnEntity({ ...current, type: 'enemy', group });
        setGroupTurnTracker({ group, index: groupTurnTracker.index });
        
        // ✅ Controlar TIEMPO solo si no está procesado este turno
        if (!processedTiempoRef.current.has(current.uuid)) {
          processedTiempoRef.current.add(current.uuid);
          const skippedData = checkTiempoSkip(current);
          if (skippedData?.skipped) {
            setPlacedEnemies(prev => {
              const updated = prev.map(e =>
                e.enemy.uuid === current.uuid
                  ? { ...e, enemy: { ...e.enemy, estadosAlterados: skippedData.nuevosEstados } }
                  : e
              );
              return updated;
            });
            const nombreEnemy =
            current.tipo === "especial" || current.tipo === "fallenHero"
              ? ta.nombre?.[current.id] || current.nombre || current.id
              : tee?.[current.id] || current.nombre || current.id;
            showScenarioToast(`⏳ ${nombreEnemy} ${ti.saltaTurnoPorTiempo}`);
            //setTimeout(() => handleNextTurn(), 1500);
            return;
          }

          // ✅ Si es carta especial → ejecutar lógica y salir
          if (current.tipo === 'especial' || current.tipo === 'fallenHero') {
            if (!processedCardsRef.current.has(current.uuid)) {
              processedCardsRef.current.add(current.uuid);
              const { logs } = aplicarCapacidadesCartaEspecial(current);
        
              logs.forEach(log =>
                showScenarioToast(`🃏 ${current.nombreEnemy || current.nombre}: ${log}`)
              );
        
              return;
            }
          }
              
          // ✅ Aplicar efectos al inicio
          if (!processedStartEffectsRef.current.has(current.uuid)) {
            processedStartEffectsRef.current.add(current.uuid);

            if (current.vida <= 0) {
              showScenarioToast(`☠ ${tee[current.id]} ${ti.muere_1}`);
              //setPlacedEnemies(prev => prev.filter(e => e.enemy.uuid !== current.uuid));
              removeEnemyByUUID(current.uuid);
              setTimeout(() => {
                //handleNextTurn();
              }, 900); 
              return;
            }
            
            // 🔹 Efectos de estados (fase inicio)
            const { enemy: actualizadoEstados, logs: logsEstados } = aplicarEfectosEstados(current, "inicio");
  
            // ✅ Aplicar efectos de capacidades activadas
            const { vida, estados, logs: logsCapacidades } = aplicarCapacidadesActivadas(actualizadoEstados, placedEnemies);
            
            // 🔹 Actualizamos enemigo con ambos cambios
            const enemigoFinal = { ...actualizadoEstados, vida, estadosAlterados: estados };


            // ✅ Mostrar logs (estados + capacidades)
            [...logsEstados, ...logsCapacidades].forEach(log => showScenarioToast(`🌀 ${tee[enemigoFinal.id]}: ${log}`));
          
            // 🔹 Guardar en placedEnemies
            setPlacedEnemies(prev =>
              prev.map(e =>
                e.enemy.uuid === enemigoFinal.uuid ? { ...e, enemy: enemigoFinal } : e
              )
            );
          
            // ❌ Si muere tras aplicar efectos → saltar turno
            if (enemigoFinal.vida <= 0) {
              showScenarioToast(`☠ ${tee[enemigoFinal.id]} ${ti.muere_1}`);
              //setPlacedEnemies(prev => prev.filter(e => e.enemy.uuid !== enemigoFinal.uuid));
              removeEnemyByUUID(enemigoFinal.uuid);
              setTimeout(() => {
                //handleNextTurn();
              }, 900); 
              return;
            }
          }
          
      
          // ✅ Ejecutar VORÁGINE solo si no está ya procesado
          if (
            Array.isArray(current.capacidades) &&
            current.capacidades.includes('VORAGINE') &&
            !processedVoragineRef.current.has(current.uuid)
          ) {
            // 🔁 Marcar como procesado
            processedVoragineRef.current.add(current.uuid);
            if (current.categoria === 'overlord') {
              setPlacedEnemies(prev => prev.filter(e => !(e.enemy.tipo === 'especial' && e.enemy.sourceEnemyUUID === current.uuid)));
              placeOverlordCards(current, current.uuid, true);
            } else if (['comandante', 'hero'].includes(current.categoria)) {
              setPlacedEnemies(prev => prev.filter(e => !(e.enemy.tipo === 'especial' && e.enemy.sourceEnemyUUID === current.uuid)));
              placeCommanderCards(current, current.uuid, true);
            }
          }
        }
    
        return;
      }
    }
  
    // 🔍 RUNES
    if (step.type === 'rune') {
      const runes = placedRunes
        .filter(r => r.rune.colorIndex === step.index && r.rune.posicion === step.position)
        .map(r => r.rune);
  
      if (runes.length > 0) {
        const currentRune = runes[groupTurnTracker.index];
        if (!currentRune) {
          setTimeout(() => {
              handleNextTurn();
          }, 1500); 
          return;
        }

        setCurrentTurnEntity({ ...currentRune, type: 'rune', group: runes });
        setGroupTurnTracker({ group: runes, index: groupTurnTracker.index });
        
        // ✅ Controlar TIEMPO solo si no está procesado este turno
        if (!processedTiempoRef.current.has(currentRune.uuid)) {
          processedTiempoRef.current.add(currentRune.uuid);
          const skippedData = checkTiempoSkip({ ...currentRune, type: step.type });
    
          if (skippedData?.skipped) {
            setPlacedRunes(prev => {
                const updated = prev.map(e =>
                  e.rune.uuid === currentRune.uuid
                    ? { ...e, rune: { ...e.rune, estadosAlterados: skippedData.nuevosEstados } }
                    : e
                );
                return updated;
            });
            showScenarioToast(`⏳ ${ti.saltaTurnoPorTiempo}`);
            //setTimeout(() => handleNextTurn(), 800);
            return;
          }
          
         
          if (currentRune.tipo === "defensa" && !currentRune.applyEffect) {
            if (!processedDefenseTurnRef.current.has(currentRune.uuid)) {
            // esto habra que borrarlo
              processedDefenseTurnRef.current.add(currentRune.uuid);
            }
            //return; // no ejecutamos el efecto todavía
          }
           // ✅ Evitar ejecución duplicada
          if (currentRune.applyEffect !== false && !executedRunes.includes(currentRune.uuid)) {
      
            if (currentRune.tipo === 'runa') {
              // 🔹 Lógica clásica de runa: roba fichas de runa
              if (currentRune.numRunas) {
                const isCaraB = currentRune.cara === 'B';
                const tiles = drawMultipleTiles(currentRune.numRunas);
                tiles?.forEach(tile => handleTileDraw(tile));
                if (!tiles) setTileWarning(ti.aviso);
                handleAcechoEffect(tiles);
                if (invadidosActivo && isCaraB){
                  handleInvadidosEffect();
                }
              }
      
            } else if (currentRune.tipo === 'asalto') {
              if (currentRune.numRunas) {
                const tiles = drawMultipleTiles(currentRune.numRunas);
                
                if (!tiles) {
                  setTileWarning(ti.aviso);
                } else {
                  tiles.forEach(tile => {
                    handleTileDraw(tile);
                    showScenarioToast(`${ti.interpretaRuna}`);
                    // 🎯 Buscar entrada en ASALTO_GUSANO según color de la runa
                    const gusanoData = ASALTO_GUSANO.find(g => g.rune === tile.runa);
                    if (!gusanoData) return;
                    // 🔹 Traducciones
                    const nombreTrad = tw.nombre[gusanoData.nombre];
                    let textoTrad = tw.texto[gusanoData.texto];
                    // 🔹 Interpretar texto (sustituciones dinámicas)
                    textoTrad = interpretarTexto(textoTrad, tile.runa, ttr);
                    // ✅ Mostrar Toast
                    showScenarioToast(`🪱 ${nombreTrad}: ${textoTrad}`);
                    // 🔹 Procesar lista_capacidad
                    interpretarCapacidades(gusanoData.lista_capacidad, tile.runa);

                  });
                  
                }
                handleAcechoEffect(tiles);
              }
            } else if (currentRune.tipo === 'defensa') {
              // 🔹 Defensa → roba cartas de aldeano o errantes
              const numCartas = currentRune.numRunas || 1;
              const mazo = currentRune.carta; // "aldeano" o "errantes"
      
              for (let i = 0; i < numCartas; i++) {
                // TODO: Lógica para robar del mazo correspondiente (cuando tengamos datos)
                const cartaRobada = drawCardFromDeck(mazo);
                if (cartaRobada) {
                  showCardToast(cartaRobada, mazo); 
                } else {
                  console.warn(`${ti.mazo_1} ${mazo}`);
                }
              }
      
            } else if (currentRune.tipo === 'incursion') {
              const isCaraB = currentRune.cara === 'B';
              const noEnemies = placedEnemies.length === 0;
              const totalHeroes = trackerData.placedHeroes?.length || 0;
              const maxMonstruos = totalHeroes <= 2 ? 2 : totalHeroes <= 4 ? 3 : 4;
              const placedScenarioMonsters = placedEnemies.filter(e => e.enemy.id === scenarioMonster?.id);
              const alreadyPlaced = placedScenarioMonsters.length;
              const faltan = Math.max(0, maxMonstruos - alreadyPlaced);
              const totalFinal = alreadyPlaced + maxMonstruos;
              // ✅ Se ejecuta si es cara B o si es cara A y no hay enemigos
              if (isCaraB || (!isCaraB && noEnemies)) {
                const tile = manifestTile();
                if (tile){
                  // ✅ Comprobar spawnPoints
                  const tieneEvento = spawnPoints.some(sp => sp.runa === "evento");
                  const spawnExists = tieneEvento || spawnPoints.some(sp => sp.runa === tile.runa);
                  
                  // ✅ Buscar pilas activas con esa loseta
                  const pilasActivas = [
                    ...pilas.filter(p => p.estado === 'activa'),
                    ...pilasConcentrada.filter(p => p.estado === 'activa')
                  ];
                  
                  const pilasQueContienen = pilasActivas.filter(pila =>
                    pila.tiles.some(t => t.runa === tile.runa)
                  );
                                
                  if (!spawnExists && pilasQueContienen.length === 0) {
                    // ❌ No hay punto de aparición para ese color
                    showScenarioToast(
                      `${ti.incursionFail} ${ti.colores[tile.runa]} ${ti.noExiste}`
                    );
                    return; // No seguimos con la invocación
                  }
    
                  // ✅ Si hay pilas que la contienen → avisar
                  if (pilasQueContienen.length > 0) {
                     const nombresPilas = pilasQueContienen
                        .map(p => `Nº ${p.numPila}  `)
                        .join(', ');
                     showScenarioToast(`${ti.encontradaEn} -> ${ti.colores[tile.runa]}. ${ti.enPilas}: ${nombresPilas}`);
                  }
                  
                  if (faltan > 0 && scenarioMonster) {
                    spawnBatchEnemies(faltan, scenarioMonster);
                    if (tieneEvento) {
                      showScenarioToast(`${ti.added} ${faltan} ${ti.Enemies} ${ti.invocaran}: ${ti.enFichaEvento}`);
                    } else {
                      showScenarioToast(`${ti.added} ${faltan} ${ti.Enemies} ${ti.invocaran}: ${ti.colores[tile.runa]}`);
                    }
                  }
                  if (totalFinal > 4) {
                    const exceso = totalFinal - 4;
                    const damage = 3;
                    showScenarioToast(`${ti.excesoIncursion} ${exceso} ${ti.attackes} ${damage} ${ti.daño}.`);
                  }
                } else {
                  showScenarioToast(`${ti.aviso4}`);
                }
              } else {
                showScenarioToast(`${ti.noManifestamos}`);
              }
            }
      
            // ✅ Marcar como ejecutada
            setExecutedRunes(prev => [...prev, currentRune.uuid]);
          }
        }
        
        //return;
      }
    }

    // 🧩 Fallback
    const entity = getNextActiveEntity(turnIndex);
    setCurrentTurnEntity(entity);
    setGroupTurnTracker({ group: [], index: 0 });
    // Efecto de turno: depende del cursor y de las pilas, no de cada callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnIndex, placedEnemies, placedRunes]);

  // Se declara después del efecto de turno para leer los conjuntos ya actualizados.
  useEffect(() => {
    persistProcessed();
  }, [turnIndex]);

  const addExtraTurn = (enemyUUID) => {
    setExtraTurnsQueue(prev => {
      const updated = [...prev, enemyUUID];
      setExtraTurnTotal(updated.length);
      return updated;
    });
  };
  
  /** Siguiente entidad activa en el orden de iniciativa (utilidad pura). */
  const getNextActiveEntity = (startIndex) => findNextActiveEntity({
    order: TURN_ORDER,
    startIndex,
    heroes: trackerData.placedHeroes || [],
    enemies: placedEnemies,
    runes: placedRunes,
  });
  const handleNextTurn = () => {
    // Guardamos el cursor de turno para poder deshacer el último avance.
    pushHistory({ currentTurnEntity });

    if (extraTurnsQueue.length > 0) {
      const [nextUUID, ...rest] = extraTurnsQueue;
      setExtraTurnsQueue(rest);
      setExtraTurnIndex(extraTurnIndex + 1);
    
      const enemyEntry = placedEnemies.find(e => e.enemy.uuid === nextUUID);
      if (enemyEntry) {
        showScenarioToast(`${ti.activandoTurnoAdicional} ${extraTurnIndex + 1}/${extraTurnTotal}`);
        
        const ok = procesarInicioTurnoEnemy(enemyEntry.enemy);
        if (!ok) {
          setTimeout(() => handleNextTurn(), 800);
          return;
        }
        
        setCurrentTurnEntity({ ...enemyEntry.enemy, type: 'enemy', group: [enemyEntry.enemy] });

        // Si la cola queda vacía, reiniciamos índices
        if (rest.length === 0) {
          setExtraTurnIndex(0);
          setExtraTurnTotal(0);
        }
        return;
      }
    } else if (extraTurnsQueue.length === 0){
        setExtraTurnIndex(0);
        setExtraTurnTotal(0);
    }

    if (turnIndex === -1) {
      const next = getNextActiveEntity(0);
      if (next) {
        const idx = indexOfEntityInOrder(TURN_ORDER, next);
        if (idx !== -1) {
          setTurnIndex(idx);
          setLastRealTurnIndex(idx);
        }
      }
      return;
    }

    // Efectos de fin de turno del héroe (estados alterados), igual que en enemigos.
    // Se aplican al abandonar su turno, una sola vez por turno (firma ronda+índice).
    if (heroManagementEnabled && currentTurnEntity?.type === 'hero' && currentTurnEntity?.id) {
      const heroEndKey = `fin-${roundNumber}-${turnIndex}-${currentTurnEntity.id}`;
      if (!processedHeroEffectsRef.current.has(heroEndKey)) {
        processedHeroEffectsRef.current.add(heroEndKey);
        aplicarEfectosHeroe(currentTurnEntity.id, 'fin');
      }
    }

    if (currentTurnEntity?.type === "enemy" && !processedEndEffectsRef.current.has(currentTurnEntity.uuid)) {
      processedEndEffectsRef.current.add(currentTurnEntity.uuid);
    
      const { enemy: actualizado, logs } = aplicarEfectosEstados(currentTurnEntity, "fin");
    
      if (logs.length > 0) {
        logs.forEach(log => showScenarioToast(`🌀 ${tee[actualizado.id]}: ${log}`));
      }
    
      setPlacedEnemies(prev => prev.map(e =>
        e.enemy.uuid === actualizado.uuid ? { ...e, enemy: actualizado } : e
      ));
    
      if (actualizado.vida <= 0) {
        showScenarioToast(`☠ ${tee[actualizado.id]} ${ti.muere_2}`);
        setPlacedEnemies(prev => prev.filter(e => e.enemy.uuid !== actualizado.uuid));
      }
    }
        
    // 🔄 Si hay carta con cara, rotarla
    if (currentTurnEntity?.cara) {
      if (currentTurnEntity.type === 'enemy') {
        // La cara actual se lee del tablero: la entidad puede venir de un turno
        // anterior y quedarse con la cara antigua.
        const enTablero = placedEnemies.find(e => e.enemy.uuid === currentTurnEntity.uuid)?.enemy;
        const caraActual = enTablero?.cara || currentTurnEntity.cara;
        const caraDestino = caraActual === 'A' ? 'B' : 'A';
        // El catálogo repite id/cara por categoría y comportamiento.
        const candidatos = ENEMIES.filter(e => e.id === currentTurnEntity.id && e.cara === caraDestino);
        const nuevo = candidatos.find(e => (
          e.categoria === (enTablero?.categoria ?? currentTurnEntity.categoria)
          && (e.comportamiento || 'estandar') === (enTablero?.comportamiento ?? currentTurnEntity.comportamiento ?? 'estandar')
        )) || candidatos[0];
        if (nuevo) {
          setPlacedEnemies(prev => prev.map(item => {
            if (item.enemy.uuid !== currentTurnEntity.uuid) return item;

            // Las caras B no repiten vida ni estadísticas: se guarda una copia
            // de la cara A para restaurarla exactamente al volver.
            if (caraDestino === 'B') {
              // Se respalda también cuando el guardado antiguo no traía `cara`.
              const respaldoA = item.enemy.respaldoA || (caraActual === 'A' ? {
                vida: item.enemy.vida,
                vidaMax: item.enemy.vidaMax,
                movimiento: item.enemy.movimiento,
                ataque: item.enemy.ataque,
                capacidades: item.enemy.capacidades,
                capacidadesOriginales: item.enemy.capacidadesOriginales,
                inmunidad: item.enemy.inmunidad,
                tipo_ataque: item.enemy.tipo_ataque,
              } : undefined);

              const nuevasProps = {};
              for (const key of PROPIEDADES_ACTUALIZABLES) {
                if (nuevo[key] !== undefined) nuevasProps[key] = nuevo[key];
              }

              return {
                ...item,
                enemy: {
                  ...item.enemy,
                  ...nuevasProps,
                  cara: 'B',
                  respaldoA,
                  capacidades: adjustCapabilitiesByRunes(nuevo.capacidades, nuevo.rune, getRuneCount),
                  capacidadesOriginales: nuevo.capacidades,
                },
              };
            }

            // Vuelta a la cara A: se recupera el respaldo si existe.
            const respaldo = item.enemy.respaldoA;
            let updatedEnemy = respaldo
              ? {
                ...item.enemy,
                ...respaldo,
                cara: 'A',
                capacidades: adjustCapabilitiesByRunes(
                  respaldo.capacidadesOriginales || respaldo.capacidades || [],
                  nuevo.rune || item.enemy.rune,
                  getRuneCount,
                ),
              }
              : {
                ...item.enemy,
                ...Object.fromEntries(
                  PROPIEDADES_ACTUALIZABLES
                    .filter((key) => nuevo[key] !== undefined)
                    .map((key) => [key, nuevo[key]]),
                ),
                cara: 'A',
                capacidades: adjustCapabilitiesByRunes(nuevo.capacidades, nuevo.rune, getRuneCount),
                capacidadesOriginales: nuevo.capacidades,
              };

            // ⚡️ Si pasa a cara A y tiene evolución activa, aplicar bonificación
            const evo = enemyEvolutions.find(e => e.uuid === item.enemy.uuid);
            if (evo && evo.count > 0) {
              updatedEnemy = {
                ...updatedEnemy,
                ataque: (updatedEnemy.ataque || 0) + (2 * evo.count),
                movimiento: (updatedEnemy.movimiento || 0) + (1 * evo.count),
              };
            }

            return { ...item, enemy: updatedEnemy };
          }));
          setFlippedCards(prev => (prev.includes(currentTurnEntity.uuid) ? prev : [...prev, currentTurnEntity.uuid]));
          setTimeout(() => {
            setFlippedCards(prev => prev.filter(id => id !== currentTurnEntity.uuid));
          }, 650);
        }
      }
  
      if (currentTurnEntity.type === 'rune') {
        // Detectamos la lista de origen según su tipo
        let dataSource = RUNAS;
        if (currentTurnEntity.tipo === 'defensa') dataSource = DEFENSA;
        if (currentTurnEntity.tipo === 'incursion') dataSource = INCURSION;
        if (currentTurnEntity.tipo === 'asalto') dataSource = ASALTO;
        // La cara actual se toma del tablero para no repetir siempre la misma.
        const runaEnTablero = placedRunes.find(r => r.rune.uuid === currentTurnEntity.uuid)?.rune;
        const caraRuna = runaEnTablero?.cara || currentTurnEntity.cara;
        const caraDestinoRuna = caraRuna === 'A' ? 'B' : 'A';
        // Buscar la misma carta pero en la cara opuesta
        const nueva = dataSource.find(r => r.id === currentTurnEntity.id && r.cara === caraDestinoRuna);

        if (nueva) {
          setPlacedRunes(prev => prev.map(item =>
            item.rune.uuid === currentTurnEntity.uuid
              ? { rune: { ...item.rune, ...nueva, cara: caraDestinoRuna } }
              : item
          ));
          setFlippedCards(prev => (prev.includes(currentTurnEntity.uuid) ? prev : [...prev, currentTurnEntity.uuid]));
          setTimeout(() => {
            setFlippedCards(prev => prev.filter(id => id !== currentTurnEntity.uuid));
          }, 650);
        }
      }
    }
  
   // ➡️ Avanzar dentro del grupo si hay más
    if (
      currentTurnEntity?.group?.length > 1 &&
      groupTurnTracker.index < currentTurnEntity.group.length - 1
    ) {
      const nextIndex = groupTurnTracker.index + 1;
      const nextEntity = currentTurnEntity.group[nextIndex];
      setGroupTurnTracker({ group: currentTurnEntity.group, index: nextIndex });
      setCurrentTurnEntity({ ...nextEntity, type: currentTurnEntity.type, group: currentTurnEntity.group });
      return;
    }
  
    // 🔁 Buscar siguiente entidad
    for (let i = 1; i <= TURN_ORDER.length; i++) {
      const idx = (turnIndex + i) % TURN_ORDER.length;
      const step = TURN_ORDER[idx];
  
      if (step.type === 'hero') {
        const hero = trackerData.placedHeroes?.find(h =>
          h.role === step.role && h.position === step.index);
        if (hero) {
          setTurnIndex(idx);
          setLastRealTurnIndex(idx);
          setCurrentTurnEntity({ ...hero, type: 'hero' });
          setGroupTurnTracker({ group: [], index: 0 });
          return;
        }
      } else if (step.type === 'enemy') {
        let enemies = placedEnemies
          .filter(e =>
            e.enemy.rune === step.rune &&
            e.enemy.position === step.index &&
            e.enemy.runePosition === step.position
          )
          .map(e => e.enemy);
      
        
        if (enemies.length > 0) {
          setTurnIndex(idx);
          setLastRealTurnIndex(idx);
          setCurrentTurnEntity({ ...enemies[0], type: 'enemy', group: enemies });
          setGroupTurnTracker({ group: enemies, index: 0 });
          return;
        }
      } else if (step.type === 'rune') {
        const runes = placedRunes
          .filter(r => r.rune.colorIndex === step.index && r.rune.posicion === step.position)
          .map(r => r.rune);
  
        if (runes.length > 0) {
          setTurnIndex(idx);
          setLastRealTurnIndex(idx);
          setCurrentTurnEntity({ ...runes[0], type: 'rune', group: runes });
          setGroupTurnTracker({ group: runes, index: 0 });
          return;
        }
      }
    }
  
    console.warn("No se encontró siguiente entidad disponible para el turno.");
  };

  const undoTurn = () => {
    const snapshot = popHistory();
    if (!snapshot) {
      showScenarioToast(ti.noUndo || 'No hay turnos que deshacer');
      return;
    }
    restoreCursor(snapshot);
    roundRef.current = snapshot.roundNumber;
    previousTurnIndexRef.current = snapshot.previousTurnIndex;
    setCurrentTurnEntity(snapshot.currentTurnEntity);
    showScenarioToast(ti.undoDone || 'Turno anterior restaurado');
  };
  const restartTurnOrder = () => {
    resetCursor();
    previousTurnIndexRef.current = null;
    roundRef.current = 1;
    setCurrentTurnEntity(null);
    setExecutedRunes([]);
    processedVoragineRef.current = new Set();
    processedDefenseTurnRef.current = new Set();
    processedStartEffectsRef.current.clear();
    processedEndEffectsRef.current.clear();
    processedCardsRef.current.clear();
    processedTiempoRef.current = new Set();
    processedHeroEffectsRef.current = new Set();
    lastHeroTurnRef.current = null;
  
    showScenarioToast(`🔁 ${ti.rondaInicial}`);
  };
  
  const showToast = (enemyData) => {
  
    toast(
      <AnimatedEnemyToast
        enemyData={enemyData}
        t={translations}

      />,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastClassName: '!max-w-[800px] w-auto overflow-visible',
        bodyClassName: '!p-0 !m-0',
      }
    );
  };

  // Registro del turno activo: quién actúa y en qué ronda.
  useEffect(() => {
    if (!currentTurnEntity) return;
    const id = currentTurnEntity.id || currentTurnEntity.uuid;
    const label = translations.enemies?.[currentTurnEntity.id]
      || translations.heroes?.[currentTurnEntity.id]
      || translations.runas?.[currentTurnEntity.id]
      || currentTurnEntity.name
      || id;

    // Rastro para el carrusel: solo cuando cambia la entidad.
    const trail = turnTrailRef.current;
    if (trail[trail.length - 1]?.id !== id) {
      trail.push({ id, name: label, type: currentTurnEntity.type });
      if (trail.length > 6) trail.shift();
    }

    appendGameLog('turn', `Turno de ${label}`, {
      round: roundRef.current,
      turn: turnIndex,
      type: currentTurnEntity.type,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurnEntity?.uuid, currentTurnEntity?.id]);

  // Cronómetro por turno y tiempo acumulado por héroe.
  useEffect(() => {
    const now = Date.now();
    const previo = turnTimerRef.current;

    // Cierra el turno anterior: si era de un héroe, suma su tiempo.
    if (heroManagementEnabled && previo.entity?.type === 'hero' && previo.entity.id) {
      const transcurrido = Math.round((now - previo.startedAt) / 1000);
      if (transcurrido > 0) {
        const total = addHeroTurnTime(previo.entity.id, transcurrido);
        const nombre = translations.heroes?.[previo.entity.id] || previo.entity.id;
        appendGameLog('turn', `⏱ ${nombre}: ${formatClock(transcurrido)} · total ${formatClock(total)}`, {
          round: roundRef.current,
          turn: turnIndex,
          type: 'hero',
        });
        refreshHeroExtras();
      }
    }

    turnTimerRef.current = {
      entity: currentTurnEntity
        ? { type: currentTurnEntity.type, id: currentTurnEntity.id || currentTurnEntity.uuid }
        : null,
      startedAt: now,
    };
    setTurnSeconds(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurnEntity?.uuid, currentTurnEntity?.id]);

  // Tick de un segundo mientras haya turno activo.
  useEffect(() => {
    if (!currentTurnEntity) return undefined;
    const interval = window.setInterval(() => {
      setTurnSeconds(Math.max(0, Math.floor((Date.now() - turnTimerRef.current.startedAt) / 1000)));
    }, 1000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurnEntity?.uuid, currentTurnEntity?.id]);

  // Firma única del turno (ronda + índice + entidad): permite aplicar los
  // efectos de inicio aunque el mismo héroe repita turno en rondas distintas.
  const turnSignature = `${roundNumber}-${turnIndex}-${currentTurnEntity?.type || ''}-${currentTurnEntity?.id || currentTurnEntity?.uuid || ''}`;

  // Efectos de INICIO del turno del héroe (estados alterados), igual que en enemigos.
  // La firma del turno se persiste para que recargar la página no vuelva a aplicarlos.
  useEffect(() => {
    if (!heroManagementEnabled) return;
    if (currentTurnEntity?.type !== 'hero' || !currentTurnEntity.id) return;
    if (lastHeroTurnRef.current === turnSignature) return;
    lastHeroTurnRef.current = turnSignature;
    aplicarEfectosHeroe(currentTurnEntity.id, 'inicio');
    persistProcessed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnSignature]);

  const showScenarioToast = (message, action = null, action2 = null, extra = null) => {
    const id = createId();
    // Máximo 5 avisos visibles y cierre automático para no tapar el tablero.
    setScenarioToasts(prev => [...prev, { id, message, action, action2, extra }].slice(-5));
    window.setTimeout(() => {
      setScenarioToasts(prev => prev.filter(item => item.id !== id));
    }, 9000);
    // Historial exportable: registra el evento junto al guardado de la partida.
    appendGameLog('event', [message, action, action2].filter(Boolean).join(' · '), {
      round: roundRef.current,
      turn: turnIndex,
    });
  };

  const rolesOnTop = ['defensor', 'lider', 'controlador'];
  const rolesOnBottom = ['apoyo', 'agresor'];

  const RuneCard = ({ rune, onRemove, flipped }) => {
    const tipo = rune.tipo;
    const [estadosLocal, setEstadosLocal] = useState(rune?.estadosAlterados || []);
    const { toggleRuneEffect } = useInitRunes();
    const applyEffect = rune.applyEffect !== false;
    const totalEnemies = placedEnemies.length;
    const totalHeroes = trackerData.placedHeroes?.length || 0;
    const replacementValue = totalHeroes <= 2 ? '2' : totalHeroes <= 4 ? '3' : '4';
  
    const borderColorMap = {
      runa: 'border-indigo-400',
      asalto: 'border-indigo-300',
      defensa: 'border-green-400',
      incursion: 'border-red-400'
    };
    useEffect(() => {
      setEstadosLocal(rune?.estadosAlterados ? [...rune.estadosAlterados] : []);
    }, [rune?.estadosAlterados]);
    
    const renderSide = (caraB = false) => {
      const isCaraB = rune.cara === 'B';
      const borderColor = borderColorMap[tipo] || 'border-indigo-400';
      const title = ts[rune.id];
      const accion = ts[rune.accion];
      const accion2 = ts[rune.accion2];
      const y = ts.Y;
      const nombre = ts[rune.nombre]?.replace('{x}', replacementValue) || rune.nombre;
      const posicion = rune.posicion;
      return (
        <div className={`${posicion === 'abajo' ? 'absolute top-0 left-0 right-0' : 'absolute bottom-0 left-0 right-0'} backface-hidden ${ caraB ? 'rotate-y-180' : '' }`} >
          <div className="relative">
            {/* 🌊 Fondo del río */}
            <div className="river-bg rounded-lg max-w-[95%] mx-auto sm:max-w-[140px]">
              <svg className="river-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path
                  d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z"
                  fill="rgba(0, 255, 150, 0.2)"
                />
              </svg>
              <svg className="river-waves2" viewBox="0 0 100 800" preserveAspectRatio="none">
                <path
                  d="M50,0 
                     C60,100 40,200 50,300 
                     C60,400 40,500 50,600 
                     C60,700 40,800 50,900"
                  fill="none"
                  stroke="rgba(0, 255, 150, 0.2)"
                  strokeWidth="10"
                />
              </svg>
              <svg className="river-waves3" viewBox="0 0 100 800" preserveAspectRatio="none">
                <path
                  d="M50,0 
                     C60,100 40,200 50,300 
                     C60,400 40,500 50,600 
                     C60,700 40,800 50,900"
                  fill="none"
                  stroke="rgba(0, 255, 150, 0.2)"
                  strokeWidth="10"
                />
              </svg>
            </div>

            <div className="relative z-10">

              <div className="absolute top-1 left-1 grid grid-rows-4 grid-flow-col gap-1">
                {estadosLocal
                  .filter(estado => estado.count > 0)
                  .map((estado) => {
                    const estadoConfig = ESTADOS_ALTERADOS.find(e => e.id === estado.id);
                    if (!estadoConfig) return null;
                    return (
                      <div key={estado.id} className="relative group cursor-help">
                        <img 
                          src={estadoConfig.imagen}
                          alt={estadoConfig.texto}
                          className="w-6 h-6 border border-white rounded-full shadow-md" loading="lazy" decoding="async" />
                        {estado.count > 1 && (
                          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                            {estado.count}
                          </span>
                        )}
                        {/* Tooltip */}
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black text-white text-[0.65rem] rounded px-2 py-1 opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap">
                          {tea[estadoConfig.texto] || estadoConfig.texto}
                        </div>
                      </div>
                    );
                  })}
              </div>

            
              <div className={`p-0 rounded-lg border-2 shadow-md ${borderColor} max-w-[95%] mx-auto sm:max-w-[140px]`} >
                {/* Título */}
                <div className="flex justify-center mb-1 text-white font-bold text-xs sm:text-sm text-center">
                  {title}
                </div>
            
                {/* ✅ Contenido según tipo */}
                {(tipo === 'runa' || tipo === 'defensa') && (
                  <>
                    <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                      {accion} {rune.numRunas || ''}
                    </div>
                    <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center">
                      {nombre}
                    </div>
                  </>
                )}
            
                {tipo === 'asalto' && (
                  <>
                    {!isCaraB ? (
                      <>
                        <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                          {accion} {y}
                        </div>
                        <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                          {accion2} 
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                          {accion2} {y}
                        </div>
                        <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                          {accion}
                        </div>
                      </>
                    )}
                  </>
                )}
            
                {tipo === 'incursion' && (
                  <>
                    {isCaraB ? (
                      <>
                        <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                          {accion} {rune.numRunas}
                        </div>
                        <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center">
                          {nombre}
                        </div>
                      </>
                    ) : (
                      totalEnemies === 0 && (
                        <>
                          <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                            {accion} {rune.numRunas}
                          </div>
                          <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center">
                            {nombre}
                          </div>
                        </>
                      )
                    )}
                  </>
                )}
            
                {/* Cara */}
                <div className="flex justify-center text-[0.55rem] sm:text-[0.65rem] italic text-indigo-100 text-center font-bold">
                  {caraB ? (
                    <RiArrowTurnForwardLine className="text-white text-xs sm:text-xs" />
                  ) : (
                    <RiArrowTurnBackLine className="text-white text-xs sm:text-xs" />
                  )} {ti.cara} {rune.cara} {caraB ? (
                    <RiArrowTurnForwardLine className="text-white text-xs sm:text-xs" />
                  ) : (
                    <RiArrowTurnBackLine className="text-white text-xs sm:text-xs" />
                  )}
                </div>
            
                {/* Checkbox */}
                <div className="flex items-center justify-center mt-1 text-white text-[0.55rem] sm:text-[0.65rem]">
                  <input
                    type="checkbox"
                    checked={applyEffect}
                    onChange={() => toggleRuneEffect(rune.uuid)}
                    className="mr-1"
                  />
                  <label>{ti.applyEffect}</label>
                </div>
    
                <div className="flex items-center justify-end mt-1 text-white text-[0.55rem] sm:text-[0.65rem]">
                  <button
                    type="button"
                    onClick={() => onRemove(rune.uuid)}
                    className="right-2 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label={ti.eliminarRuna || ti.remove || 'Eliminar runa'}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
  
    return (
      <div className={`w-full perspective hover:scale-105`}>
        
        <div
          className={`relative w-full h-full transform-style preserve-3d ${flipped ? 'card-flip' : ''}`}
        >
          {renderSide(false)}
          {renderSide(true)}

        </div>
      </div>
    );
  };


  // Alturas de carta y separación desde la barra central (ver trackLayout.js).

  // Altura única para TODO el tablero: así todas las etiquetas comparten la misma
  // línea central aunque una posición acumule muchas cartas.
  // Se pasan NÚMEROS DE CARTAS (no alturas): boardSlotHeightFrom aplica stackHeight.
  const countsPerSlot = Array.from({ length: 11 }, (_, i) => {
    const isRuneSlot = Object.values(runesColorMap).includes(i);
    const isRuneText = i === 10;
    const above =
      (trackerData.placedHeroes || []).filter((h) => h.position === i && rolesOnTop.includes(h.role)).length +
      (isRuneSlot ? placedEnemies.filter((e) => e.enemy.position === i && e.enemy.runePosition === 'arriba').length : 0) +
      (isRuneText ? placedRunes.filter((r) => r.rune.colorIndex === i && r.rune.posicion === 'arriba').length : 0);
    const below =
      (trackerData.placedHeroes || []).filter((h) => h.position === i && rolesOnBottom.includes(h.role)).length +
      (isRuneSlot ? placedEnemies.filter((e) => e.enemy.position === i && e.enemy.runePosition === 'abajo').length : 0) +
      (isRuneText ? placedRunes.filter((r) => r.rune.colorIndex === i && r.rune.posicion === 'abajo').length : 0);
    return Math.max(above, below);
  });
  // La densidad compacta reduce cartas y separaciones un 15 %; el solape
  // compacto acerca las cartas entre sí dentro de cada pila.
  const densityFactor = density === 'compact' ? 0.85 : 1;
  const overlapFactor = overlap === 'compact' ? 0.72 : 1;
  const boardSlotHeight = boardSlotHeightFrom(countsPerSlot) * densityFactor * overlapFactor;

  const currentSlotIndex = (() => {
    if (!currentTurnEntity) return -1;
    if (currentTurnEntity.type === 'rune') return currentTurnEntity.colorIndex ?? -1;
    return typeof currentTurnEntity.position === 'number' ? currentTurnEntity.position : -1;
  })();

  // Cada posición del tablero se renderiza en su propio componente.
  const slotDeps = {
    runesColorMap,
    getRuneColorFromIndex,
    COLOR_RUNAS,
    runes,
    tr,
    ti,
    tea,
    placedHeroes: trackerData.placedHeroes || [],
    placedEnemies,
    placedRunes,
    rolesOnTop,
    rolesOnBottom,
    currentTurnEntity,
    currentSlotIndex,
    flippedCards,
    boardSlotHeight,
    getHeroName,
    getHeroProf,
    getHeroExtras,
    getEnemyName,
    heroManagementEnabled,
    onRemove,
    openEnemyModal,
    removeRuneByUUID,
    setSelectedHeroId,
    RuneCard,
  };

  const renderSlot = (index, options = {}) => (
    <TrackSlot
      index={index}
      compact={Boolean(options.compact)}
      density={options.density || density}
      overlap={options.overlap || overlap}
      deps={slotDeps}
    />
  );

  const currentEntityName = (() => {
    const entity = currentTurnEntity;
    if (!entity) return '';
    const id = entity.id;
    return translations.enemies?.[id]
      || translations.heroes?.[id]
      || translations.runas?.[id]
      || entity.name
      || id
      || '';
  })();

  // Carrusel: anterior (rastro), actual y siguiente (orden de iniciativa).
  const carouselPrev = (() => {
    const trail = turnTrailRef.current;
    return trail.length >= 2 ? trail[trail.length - 2] : null;
  })();
  const carouselCurrent = currentTurnEntity
    ? { name: currentEntityName, type: currentTurnEntity.type, turnNumber: turnIndex + 1 }
    : null;
  const carouselNext = (() => {
    if (turnIndex < 0) return null;
    const next = getNextActiveEntity((turnIndex + 1) % TURN_ORDER.length);
    if (!next) return null;
    const name = translations.enemies?.[next.id]
      || translations.heroes?.[next.id]
      || translations.runas?.[next.id]
      || next.name
      || next.id
      || '';
    return { name, type: next.type };
  })();

  const slotSummaries = Array.from({ length: 11 }, (_, index) => {
    const runeColorId = Object.keys(runesColorMap).find((key) => runesColorMap[key] === index);
    const label =
      index === 0 ? (tr.defensor || 'Defensor') :
      index === 2 ? (tr.apoyo || 'Apoyo') :
      index === 4 ? (tr.lider || 'Líder') :
      index === 6 ? (tr.agresor || 'Agresor') :
      index === 8 ? (tr.controlador || 'Controlador') :
      index === 10 ? (ti.rune || 'Runa') :
      `${ti.rune || 'Runa'} ${ti.colores?.[runeColorId] || ''}`.trim();

    const heroes = (trackerData.placedHeroes || [])
      .filter((hero) => hero.position === index)
      .map((hero) => getHeroName(hero.id));
    const enemies = placedEnemies
      .filter((entry) => entry.enemy.position === index)
      .map((entry) => getEnemyName(entry.enemy.id, entry.enemy.color));
    const slotRunes = placedRunes
      .filter((entry) => entry.rune.colorIndex === index)
      .map((entry) => entry.rune.id);
    const names = [...heroes, ...enemies, ...slotRunes];

    return { index, label, count: names.length, names: names.join(' · ') };
  });
  return ( 
      <PageTransition>
       
        <div className="min-w-0">
          <div className={`flex min-h-[100dvh] flex-col overflow-x-hidden bg-slate-950 p-3 pt-20 text-slate-200 sm:p-4 sm:pt-20 md:pb-4 ${presentation ? 'text-lg' : ''}`}>
            {!presentation && (
              <TopMenu
                onAddEnemy={openCategorySelector}
                onSelectCommander={handleRandomCommander}
                onSelectBoss={openManualBoss}
                onAddManual={openManualSelector}
                behaviors={behaviors}
                onSelectRuneCard={handleAddRuneCard}
                onTileDraw={handleTileDraw}
              />
            )}

            {/* Zona especial para Jefes */}
            {placedEnemies
              .filter(e => e.enemy.categoria === 'jefe' && e.enemy.tipo != 'especial')
              .map(({ enemy }) => (
                <div key={enemy.uuid} className="track-surface mt-3 overflow-hidden p-3">
                  <div className="mx-auto flex max-w-full origin-center scale-125 justify-center py-6 sm:scale-150 md:scale-[1.75]">
                    <EnemyCard
                      uuid={enemy.uuid}
                      id={enemy.id}
                      name={getEnemyName(enemy.id, enemy.color)}
                      image={enemy.imagen}
                      comportamiento={enemy.comportamiento}
                      categoria={enemy.categoria}
                      position={enemy.runePosition}
                      color={enemy.color}
                      onRemove={onRemove}
                      vida={enemy.vida}
                      vidaMax={enemy.vidaMax}
                      movimiento={enemy.movimiento}
                      ataque={enemy.ataque}
                      openEnemyModal={openEnemyModal}
                      inmunidad={enemy.inmunidad}
                      tipo_ataque={enemy.tipo_ataque}
                      capacidades={enemy.capacidades}
                      ringColor={enemy.ringColor}
                      isFlipping={false}
                      estadosAlterados={enemy.estadosAlterados}
                    />
                  </div>
                </div>
            ))}

            
            {/* Puntos de aparición visibles encima del track */}
            {pilas.length > 0 && (
                <div className="track-surface mt-3 p-3">
                  <div className="text-xs text-yellow-300 mb-2">{ti.gestionPilas || ''}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {pilas.map(pila => (
                      <div key={pila.id} className="track-surface-raised p-2 text-center text-white">
                        
                        {pila.estado === 'reserva' ? (
                          <>
                            <div className="font-bold mb-2">{ti.pila} 🗃️</div>
                            <button
                              className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                              onClick={() => activarPila(pila.id)}
                            >
                              ✅ {ti.activaPila || 'Activar Pila'}
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="font-bold mb-1">
                              <span>{ti.pila} 🗃️</span>
                              <input
                                type="text"
                                maxLength={5}
                                value={codigosPilas[pila.id] || ''}
                                onChange={(e) => handleCodigoChange(pila.id, e.target.value)}
                                className="bg-slate-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center"
                                placeholder="ABC12"
                                title={ti.codigoPila}
                              />
                            </div>
                            <div className="text-xs text-slate-300 mb-2">
                              {ti.tamano}: {pila.tiles.length}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <button
                                className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                onClick={() => {addTileToPila(pila.id);}}
                              >
                                {ti.addRunaToPila}
                              </button>
                              <button
                                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                onClick={() => {
                                  const tilesRemoved = removeTileFromPila(pila.id);
                                    if (tilesRemoved && tilesRemoved.length > 0) {
                                      tilesRemoved.forEach(tile => showTileToast(tile, 'retira'));
                                    } else {
                                      alert(ti.emptyPila);
                                    }
                                }}
                              >
                                {ti.devolver}
                              </button>
                              {/* Botón combate estrecho */}
                                <button
                                  className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-xs"
                                  onClick={() => {
                                    const tiles = placeTilesFromPilaToTrack(pila.id);
                                    if (!tiles || tiles.length === 0) {
                                      alert(ti.emptyPila);
                                      return;
                                    }
                                  }}
                                >
                                  {ti.combateEstrecho_pila || "Combate estrecho"}
                                </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {pilasConcentrada.length > 0 && (
                <div className="track-surface mt-3 p-3">
                  <div className="text-xs text-yellow-300 mb-2">{ti.gestionPilas2 || ''}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {pilasConcentrada.map(pila => (
                        <div key={pila.id} className="track-surface-raised p-2 text-center text-white">
                          {pila.estado === 'reserva' ? (
                            <>
                              <div className="font-bold mb-2">{ti.nodo || 'Nodo'} 🗃️</div>
                              <button
                                className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                onClick={() => activarPilaConcentrada(pila.id)}
                              >
                                ✅ {ti.activaNodo || 'Activar Nodo'}
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="font-bold mb-1">
                                <span>{ti.nodo || 'Nodo'} 🗃️</span>
                                <input
                                  type="text"
                                  maxLength={5}
                                  value={codigosPilas[pila.id] || ''}
                                  onChange={(e) => handleCodigoChange(pila.id, e.target.value)}
                                  className="bg-slate-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center"
                                  placeholder="ABC12"
                                  title={ti.codigoPila}
                                />
                              </div>
                              <div className="text-xs text-slate-300 mb-2">
                                {ti.tamano}: {pila.tiles.length}
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <button
                                  className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                  onClick={() => {addTileToPilaConcentrada(pila.id);}}
                                >
                                  {ti.addRunaToPila}
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
                                  {ti.devolverNodo}
                                </button>
                                
                                {pilaConcentradaEliminarAbierta === pila.id && (
                                  <div className="mt-1 flex flex-wrap justify-center gap-1 rounded-lg border border-red-800 bg-slate-950 p-2">
                                    <div className="w-full text-[11px] text-slate-300 mb-1">
                                      {ti.eliminarPorColor || 'Eliminar una runa:'}
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
                                              alert(ti.emptyPila);
                                            }
                                
                                            setPilaConcentradaEliminarAbierta(null);
                                          }}
                                        >
                                          {ti.colores?.[color] || color}
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
                                          alert(ti.emptyPila);
                                        }
                                
                                        setPilaConcentradaEliminarAbierta(null);
                                      }}
                                    >
                                      🎲 {ti.removeRandom || 'Aleatoria'}
                                    </button>
                                  </div>
                                )}
                               {/* Botón combate estrecho */}
                                <button
                                  className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-xs"
                                  onClick={() => {
                                    const tiles = placeTilesFromPilaConcentradaToTrack(pila.id);
                                    if (!tiles || tiles.length === 0) {
                                      alert(ti.emptyPila);
                                      return;
                                    }
                                  }}
                                >
                                  {ti.combateEstrecho || "Combate estrecho"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                 </div>
              </div>
            )}  
           

            {spawnPoints.length > 0 && (
              <div className="mt-3 p-2 bg-slate-700 rounded-lg">
                <div className="text-xs text-yellow-300 mb-2">{ti.activeSpawnPoints}</div>
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
                          <span>{ti.evento || 'Evento'}</span>
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
                        <span>{ti.colores[point.runa]}</span>
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

            {/* Puntos de control de area visibles encima del track */}
            {controlPoints.length > 0 && (
                <div className="track-surface mt-3 p-3">
                  <div className="text-xs text-yellow-300 mb-2cursor-help" title={ti.infoCA || ''}>{ti.activeBarricade || ''}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {controlPoints.map(point => (
                      <div
                        key={point.uuid}
                        className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                      >
                        <span>{ti.colores[point.runa]}</span>
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
            
              {/* LLaves rúnicas visibles encima del track */}
              {runeKeys.length > 0 && (
                <div className="track-surface mt-3 p-3">
                  <div className="text-xs text-yellow-300 mb-2">{ti.activeRuneKeys}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {runeKeys.map(point => (
                      <div
                        key={point.uuid}
                        className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                      >
                        <span>{ti.colores[point.runa]}</span>
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

          {/* Aldeanos visibles encima del track */}
            {rescue.length > 0  && (
              <div className="track-surface mt-3 p-3">
                <div className="text-xs text-yellow-300 mb-2">{ti.activeRescue}</div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {rescue.map(point => (
                    <div
                      key={point.uuid}
                      className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                    >
                      <span>{ti.colores[point.runa]}</span>
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

            {/* 🐉 Aviso de que la mecánica de Huésped está activa */}
            {huespedActivo && (
              <div className="mt-3 p-2 bg-indigo-900 rounded-lg">
                <div className="text-xs text-indigo-300 font-bold">
                  {ti.huespedActivo}
                </div>
              </div>
            )}

            {/* 🐉 Aviso de la mecánica de Rey redivivo acecha */}
            {acechoActivo && (
              <div className="mt-3 p-2 bg-indigo-900 rounded-lg">
                <div className="text-xs text-indigo-300 font-bold">
                  {ti.acechoActivo}
                </div>
              </div>
            )}

            {/* 🐉 Aviso de la mecánica INVADIDOS */}
            {invadidosActivo && (
              <div className="mt-3 p-2 bg-indigo-900 rounded-lg">
                <div className="text-xs text-indigo-300 font-bold">
                  {ti.invadidosActivo}
                </div>
              </div>
            )}
            
            <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <TurnTrackBoard
                  renderSlot={renderSlot}
                  summaries={slotSummaries}
                  currentSlotIndex={currentSlotIndex}
                  presentation={presentation}
                  onTogglePresentation={() => setPresentation((prev) => !prev)}
                  onNextTurn={() => setTimeout(() => handleNextTurn(), 300)}
                  onUndoTurn={undoTurn}
                  canUndo={undoCount > 0}
                  density={density}
                  onToggleDensity={toggleDensity}
                  overlap={overlap}
                  onToggleOverlap={toggleOverlap}
                  carouselOpen={carouselOpen}
                  onToggleCarousel={() => setCarouselOpen((prev) => !prev)}
                  carousel={(
                    <TurnCarousel
                      prev={carouselPrev}
                      current={carouselCurrent}
                      next={carouselNext}
                      labels={{
                        title: ti.carousel || 'Turnos',
                        prev: ti.previousTurn || 'Anterior',
                        current: ti.currentTurn || 'Turno actual',
                        next: ti.nextTurnShort || 'Siguiente',
                        none: ti.noTurn || '—',
                      }}
                    />
                  )}
                  bagOpen={bagOpen}
                  onToggleBag={() => setBagOpen((prev) => !prev)}
                  historyOpen={historyOpen}
                  onToggleHistory={() => setHistoryOpen((prev) => !prev)}
                  diceOpen={diceOpen}
                  onToggleDice={() => setDiceOpen((prev) => !prev)}
                  status={(
                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs">
                      <span className="font-semibold text-emerald-200">
                        {ti.roundShort || 'Ronda'} <b className="text-white">{roundNumber || 0}</b>
                      </span>
                      <span className="h-3.5 w-px bg-slate-700" aria-hidden="true" />
                      <span className="text-slate-300">
                        {ti.turno || 'Turno'} <b className="text-white">{turnIndex >= 0 ? turnIndex + 1 : '—'}</b>
                      </span>
                      <span className="h-3.5 w-px bg-slate-700" aria-hidden="true" />
                      <span
                        data-testid="turn-timer"
                        title={ti.turnTimer || 'Tiempo del turno'}
                        className={`rounded-md px-1 font-mono text-[0.7rem] font-bold tabular-nums ${
                          turnSeconds >= 300
                            ? 'bg-red-600/20 text-red-300 ring-1 ring-red-500/70'
                            : 'text-sky-200'
                        }`}
                      >
                        ⏱ {formatClock(turnSeconds)}
                      </span>
                      {currentEntityName && (
                        <span
                          className="hidden max-w-[8rem] truncate text-sky-200 2xl:inline"
                          title={currentEntityName}
                        >
                          · {currentEntityName}
                        </span>
                      )}
                    </div>
                  )}
                  labels={{
                    section: ti.track || 'Orden de iniciativa',
                    track: ti.track || 'Orden de iniciativa',
                    board: ti.viewBoard || 'Tablero',
                    list: ti.viewList || 'Lista',
                    zoomIn: ti.zoomIn || 'Aumentar zoom',
                    zoomOut: ti.zoomOut || 'Reducir zoom',
                    fit: ti.fitWidth || 'Ajustar',
                    presentation: ti.presentation || 'Modo presentación',
                    exitPresentation: ti.exitPresentation || 'Salir de presentación',
                    current: ti.currentTurn || 'Turno actual',
                    empty: ti.noCharacters || 'Sin personajes',
                    undoTurn: ti.undoTurn || 'Deshacer',
                    nextTurn: ti.nextTurn || 'Siguiente turno',
                    bag: ti.estadoBolsa || 'Bolsa de runas',
                    density: ti.density || 'Densidad',
                    densityCompact: ti.densityCompact || 'Densidad compacta',
                    densityNormal: ti.densityNormal || 'Densidad normal',
                    overlap: ti.overlap || 'Solape',
                    overlapCompact: ti.overlapCompact || 'Superponer más las cartas',
                    overlapNormal: ti.overlapNormal || 'Separar cartas',
                    carousel: ti.carousel || 'Turnos',
                    panels: ti.panels || 'Paneles',
                    boardGroup: ti.boardGroup || 'Vista del tablero',
                  }}
                />
              </div>

              {(bagOpen || historyOpen) && (
                <aside className="flex w-full flex-col gap-3 lg:w-64 lg:shrink-0">
                  {bagOpen && (
                    <BagStatusPanel
                      usedTiles={usedTiles}
                      availableTiles={availableTiles}
                      labels={{
                        title: ti.bag || 'Bolsa de runas',
                        drawn: ti.extraidas || 'Extraídas',
                        total: ti.total || 'Total',
                      }}
                      colors={ti.colores || {}}
                    />
                  )}

                  {historyOpen && (
                    <HistoryPanel
                      limit={60}
                      refreshKey={scenarioToasts.length + turnIndex + roundNumber}
                      labels={{
                        title: ti.history || 'Historial',
                        empty: ti.historyEmpty || 'Sin eventos todavía.',
                        noMatches: ti.historyNoMatches || 'Sin resultados.',
                        search: ti.historySearch || 'Buscar…',
                        filters: ti.historyFilters || 'Filtrar historial',
                      }}
                    />
                  )}
                </aside>
              )}
            </div>
            
            {categorySelector.open && (
              <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/60 p-4" role="presentation">
                <div role="dialog" aria-modal="true" aria-label={ti.selectCategory || 'Seleccionar categoría'} className="track-surface p-4 text-center text-white shadow-2xl">
                  <h2 className="mb-4 text-lg font-bold">{ti.selectCategory}</h2>
                    {allowedCategories.map(cat => (
                      <button key={cat} type="button" onClick={() => handleCategorySelect(cat)} className="m-1 min-h-11 rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
                        {tc[cat] || cat}
                      </button>
                    ))}
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="min-h-11 rounded-lg bg-red-700 px-4 py-2 text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                      onClick={() => setCategorySelector({ open: false, color: null })}
                    >
                      {ti.close || 'Cerrar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Manual Selector Modal */}
            {manualSelector.open && (
              <div className="layer-modal fixed inset-0 flex flex-col items-center justify-center bg-black/75 p-4">
                <div role="dialog" aria-modal="true" aria-label={ti.manualTitle || 'Seleccionar enemigo manualmente'} className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                  <h2 className="text-xl text-yellow-300 mb-4">{ti.manualTitle || 'Seleccionar enemigo manualmente'}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(
                      getEnemiesByColor(enemiesInSelectedExpansions, manualSelector.color).reduce((acc, enemy) => {
                        if (!acc[enemy.id]) acc[enemy.id] = {};
                        if (!acc[enemy.id][enemy.categoria]) acc[enemy.id][enemy.categoria] = [];
                        acc[enemy.id][enemy.categoria].push(enemy);
                        return acc;
                      }, {})
                    ).map(([enemyId, categories]) => {
                      if (EnemiesNoShow.includes(enemyId)) return null
                      const sampleEnemy = Object.values(categories)[0][0]; // Para imagen y nombre
                    
                      return (
                        <div key={enemyId} className="track-surface-raised flex flex-col items-center p-2">
                          <img src={sampleEnemy.imagen} alt={enemyId} className="w-20 h-20 object-cover mb-2 rounded" loading="lazy" decoding="async" />
                          <div className="text-sm text-white text-center mb-2">{getEnemyName(enemyId, manualSelector.color)}</div>
                    
                          {Object.entries(categories).map(([categoria, variants]) => (
                            <div key={categoria} className="w-full mb-2">
                              {specialCategories.includes(categoria) ? (
                                <div className="flex flex-wrap justify-center gap-1">
                                  {variants
                                    .filter((variant, index, self) =>
                                      index === self.findIndex(v =>
                                        v.id === variant.id &&
                                        v.categoria === variant.categoria &&
                                        v.comportamiento === variant.comportamiento &&
                                        (v.cara === 'A' || !v.cara)
                                      )
                                    )
                                    .filter(v => v.cara === 'A' || !v.cara)
                                    .map(variant => (
                                      <button
                                        key={`${variant.id}-${variant.categoria}-${variant.comportamiento}`}
                                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleManualEnemyAdd(variant.id, variant.comportamiento, variant.categoria)}
                                      >
                                        {ti.addEnemy}
                                      </button>
                                    ))}
                                </div>
                              ) : (
                                <>
                                  <div className="text-xs text-yellow-300 mb-1 text-center">{tc?.[categoria] || categoria}</div>
                                  <div className="flex flex-wrap justify-center gap-1">
                                    {variants
                                      .filter((variant, index, self) =>
                                        index === self.findIndex(v =>
                                          v.id === variant.id &&
                                          v.categoria === variant.categoria &&
                                          v.comportamiento === variant.comportamiento &&
                                          (v.cara === 'A' || !v.cara) // si tiene cara, preferimos la A
                                        )
                                      )
                                      .filter(v => v.cara === 'A' || !v.cara) // segunda seguridad: solo mostramos cara A o sin cara
                                      .map(variant => (
                                        <button
                                          key={`${variant.id}-${variant.categoria}-${variant.comportamiento}`}
                                          className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                                          onClick={() => handleManualEnemyAdd(variant.id, variant.comportamiento, variant.categoria)}
                                        >
                                          {tb?.[variant.comportamiento] || variant.comportamiento}
                                        </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}

                  </div>
                  <div className="mt-4 text-center">
                    <button
                      className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => setManualSelector({ open: false, color: null })}
                    >
                      {ti.close || 'Cerrar'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
        <ToastContainer toastClassName="toast-expand" bodyClassName="" />
        {selectedEnemyUuid && (
          <ModalEnemyCard
            key={selectedEnemyUuid}
            uuid={selectedEnemyUuid}
            enemy={placedEnemies.find(e => e.enemy.uuid === selectedEnemyUuid)?.enemy}
            onClose={() => setSelectedEnemyUuid(null)}
            onDelete={onRemove}
            onVidaChange={updateEnemyVida}
            overhealedEnemies={overhealedEnemies}
            setOverhealedEnemies={setOverhealedEnemies}
            onEstadoChange={updateEnemyEstados}
            getEffectiveStats={getEnemyEffectiveStats}
          />
          )}
        {selectedHeroId && (
          <ModalHeroCard
            key={selectedHeroId}
            heroId={selectedHeroId}
            role={trackerData.roles?.[selectedHeroId]}
            onClose={() => setSelectedHeroId(null)}
            onChanged={refreshHeroExtras}
          />
        )}
        <DiceRoller
          open={diceOpen}
          onClose={() => setDiceOpen(false)}
          heroes={(trackerData.placedHeroes || []).map((hero) => ({ id: hero.id, name: getHeroName(hero.id) }))}
          currentEntity={currentTurnEntity}
          labels={{
            title: ti.dados || 'Dados',
            roll: ti.tirarD20 || 'Tirar d20',
            rollTrap: ti.tirarTrampa || 'Tirar dado de trampa',
            trapDie: ti.dadoTrampa || 'Trampa',
            applyTo: ti.aplicarTurno || 'Aplicar al turno actual',
            noActiveTurn: ti.sinTurno || 'No hay un turno activo',
            addModifier: ti.sumarModificador || 'Sumar modificador de',
            noModifier: ti.sinModificador || 'Ninguno (tirada genérica)',
            close: ti.close || 'Cerrar',
          }}
          onApplyEstado={(estadoId, count) => {
            if (currentTurnEntity?.type === 'hero' && currentTurnEntity.id) {
              stepHeroEstadoAlterado(currentTurnEntity.id, estadoId, count);
              refreshHeroExtras();
            } else if (currentTurnEntity?.type === 'enemy' && currentTurnEntity.uuid) {
              setPlacedEnemies((prev) => prev.map((entry) => {
                if (entry.enemy.uuid !== currentTurnEntity.uuid) return entry;
                const estados = [...(entry.enemy.estadosAlterados || [])];
                const index = estados.findIndex((item) => item.id === estadoId);
                if (index === -1) estados.push({ id: estadoId, count });
                else estados[index] = { ...estados[index], count: estados[index].count + count };
                return { ...entry, enemy: { ...entry.enemy, estadosAlterados: estados } };
              }));
            }
          }}
        />
        {showPCModal && (
          <ModalCommanderPC
              onConfirm={(pcValue) => {
                onPCConfirm?.(pcValue);
                closePCModal();
              }}
              onCancel={closePCModal}
            />
        )}
       
        <TileWarningModal
          message={tileWarning}
          onClose={() => setTileWarning(null)}
        />
        {warningMessage && (
          <div role="alert" className="layer-toast fixed left-1/2 top-20 -translate-x-1/2 items-center rounded bg-red-600 px-4 py-2 text-white shadow-lg">
            {warningMessage}
          </div>
        )}
        
        <AnimatePresence>
          <div
            className="layer-toast fixed left-1/2 top-16 flex -translate-x-1/2 flex-col items-center gap-2"
            aria-live="polite"
            aria-atomic="false"
          >

            
            {tileToasts.map(tile => (
              <motion.div
                key={tile.uuid}
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.22 }}
              >
                <TileToast
                  tile={tile}
                  tipo={tile.tipo}
                  onClose={() => handleCloseToast(tile)}
                />
              </motion.div>
            ))}
            
            {avisos.map((aviso) => (
              <div
                key={aviso.id}
                className="bg-black/80 text-white px-3 py-2 rounded shadow flex items-center gap-2"
              >
                <span>{aviso.mensaje}</span>
                <button
                  onClick={() => removeAviso(aviso.id)}
                  className="ml-auto text-red-400 hover:text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </AnimatePresence>

        {/* Avisos de escenario: pila lateral para no tapar el tablero */}
        <AnimatePresence>
          {scenarioToasts.length > 0 && (
            <div
              className="layer-toast fixed bottom-3 left-3 flex max-h-[62dvh] w-[min(92vw,26rem)] flex-col gap-2 overflow-y-auto pr-1"
              role="status"
              aria-live="polite"
              aria-atomic="false"
            >
              {scenarioToasts.map((toast) => {
                const { icon, tone } = classifyScenarioToast(toast.message);
                // El icono ya se muestra aparte: se quita el emoji inicial del texto.
                const cleanMessage = toast.message
                  ? String(toast.message).replace(/^[^\p{L}\p{N}]+/u, '').trim()
                  : '';
                return (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className={`relative rounded-xl border-l-4 ${tone} px-3 py-2 text-sm text-white shadow-xl backdrop-blur`}
                  >
                    <div className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-0.5 text-base leading-none">{icon}</span>
                      <div className="min-w-0 flex-1">
                        {cleanMessage && (
                          <p className="font-semibold uppercase tracking-wide text-yellow-300">{cleanMessage}</p>
                        )}
                        {toast.action && <p className="mt-1 whitespace-pre-line">{toast.action}</p>}
                        {toast.action2 && <p className="mt-1 whitespace-pre-line">{toast.action2}</p>}
                        {toast.extra && <p className="mt-1 whitespace-pre-line text-xs text-slate-300">{toast.extra}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => setScenarioToasts((prev) => prev.filter((item) => item.id !== toast.id))}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800/80 text-xs hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        aria-label={ti.close || 'Cerrar aviso'}
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </PageTransition>
  );
};

export default InitTracker;
