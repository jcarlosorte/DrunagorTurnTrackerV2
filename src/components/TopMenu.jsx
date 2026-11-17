// src/components/TopMenu.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMenu } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useSavesUi } from '@/context/SavesUiContext';
import { GiArchiveRegister, GiSwordClash, GiCrownedSkull, GiDaemonSkull, GiBullyMinion, GiRuneStone, GiMinions, GiBrickWall, GiCardPlay, GiVillage, GiUprising, GiStoneTower, GiSwapBag, GiTrashCan, GiLeechingWorm, GiReaperScythe, GiGearHammer, GiMusicalNotes, GiWoodenCrate, GiPawPrint, GiCampfire, GiWoodenSign } from 'react-icons/gi';
import { MdAddCircleOutline, MdMenu } from 'react-icons/md';
import { RUNAS, RUNAS_F, ASALTO } from '@/data/runas';
import { RUNAS_DESPERTAR } from '@/data/runasDespertar';
import { INCURSION } from '@/data/incursion';
import { INCURSION_DESPERTAR } from '@/data/incursionDespertar';
import { DEFENSA } from '@/data/defensa';
import { getScenarioMonstersForCampaign } from '@/utils/scenarioCampaign';
import { GENERATION_COLORS, GENERATION_IMAGES } from '@/components/track/GenerationPointsBar';
import { MAGIC_CANNON_COLORS, MAGIC_CANNON_IMAGES } from '@/components/track/MagicCannonsBar';
import { } from '@/data/estadosAlterados';
import { useInitEnemies } from "@/context/InitEnemiesContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTracker } from '@/context/TrackerContext';
import LanguageMenu from "@/components/LanguageMenu";
import { FOLLOWERS } from '@/data/followers';
import { ROLE_POSITIONS } from '@/data/roles';
import { getInteractionBackgroundAt } from '@/data/companions';
import { saveCampFollower } from '@/utils/campFollowers';
import { createId } from '@/utils/id';
import { appNotify, appConfirm } from '@/utils/appDialogs';import { SCENES } from '@/data/scenes';
import { EXPANSIONS } from '@/data/expansions';
import SceneFollowerDialog from '@/components/track/SceneFollowerDialog';
import SceneFollowerSelectionDialog from '@/components/track/SceneFollowerSelectionDialog';
import pilaRunasIcon from '@/assets/assets_logo/pila-runas.webp';
import mecanicaEspecialIcon from '@/assets/assets_logo/mecanica_especial.png';
import ScenarioPanels from '@/components/scenario/ScenarioPanels';
import NodosOscuridadPanel from '@/components/scenario/NodosOscuridadPanel';
import ResponsiveImage from '@/components/track/ResponsiveImage';
import EnemyPortraitBackdrop from '@/components/track/EnemyPortraitBackdrop';
import { useGame } from '@/context/GameContext';
import { ENEMIES } from '@/data/enemies';
import { useInitRunes } from "@/context/initRunesContext";
import { useExpansions } from '@/context/ExpansionContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import CompanionPicker from '@/components/track/CompanionPicker';
import RiskZone from '@/components/track/RiskZone';


const RuneStackIcon = ({ size = 20 }) => (
  <img
    src={pilaRunasIcon}
    alt=""
    width={size}
    height={size}
    className="rounded-full"
    aria-hidden="true"
  />
);

const SpecialEventIcon = ({ size = 20 }) => (
  <img
    src={mecanicaEspecialIcon}
    alt=""
    width={size}
    height={size}
    className="rounded-md object-cover"
    aria-hidden="true"
  />
);

const SCENE_GROUP_THEMES = {
  base: {
    header: 'border-amber-700/60 bg-amber-950/40 text-amber-100',
    card: 'border-amber-800/60 bg-amber-950/30',
    title: 'text-amber-100',
    description: 'text-amber-100/75',
    button: 'bg-amber-700 hover:bg-amber-600 focus-visible:ring-amber-300',
  },
  awakenings: {
    header: 'border-cyan-700/60 bg-cyan-950/40 text-cyan-100',
    card: 'border-cyan-800/60 bg-cyan-950/30',
    title: 'text-cyan-100',
    description: 'text-cyan-100/75',
    button: 'bg-cyan-700 hover:bg-cyan-600 focus-visible:ring-cyan-300',
  },
  luccanor: {
    header: 'border-violet-700/60 bg-violet-950/40 text-violet-100',
    card: 'border-violet-800/60 bg-violet-950/30',
    title: 'text-violet-100',
    description: 'text-violet-100/75',
    button: 'bg-violet-700 hover:bg-violet-600 focus-visible:ring-violet-300',
  },
  dark_world: {
    header: 'border-rose-700/60 bg-rose-950/40 text-rose-100',
    card: 'border-rose-800/60 bg-rose-950/30',
    title: 'text-rose-100',
    description: 'text-rose-100/75',
    button: 'bg-rose-700 hover:bg-rose-600 focus-visible:ring-rose-300',
  },
  infernal_desert: {
    header: 'border-orange-700/60 bg-orange-950/40 text-orange-100',
    card: 'border-orange-800/60 bg-orange-950/30',
    title: 'text-orange-100',
    description: 'text-orange-100/75',
    button: 'bg-orange-700 hover:bg-orange-600 focus-visible:ring-orange-300',
  },
  undead_dragon: {
    header: 'border-emerald-700/60 bg-emerald-950/40 text-emerald-100',
    card: 'border-emerald-800/60 bg-emerald-950/30',
    title: 'text-emerald-100',
    description: 'text-emerald-100/75',
    button: 'bg-emerald-700 hover:bg-emerald-600 focus-visible:ring-emerald-300',
  },
};

const SCENE_FALLBACK_THEMES = [
  {
    header: 'border-emerald-700/60 bg-emerald-950/40 text-emerald-100',
    card: 'border-emerald-800/60 bg-emerald-950/30',
    title: 'text-emerald-100',
    description: 'text-emerald-100/75',
    button: 'bg-emerald-700 hover:bg-emerald-600 focus-visible:ring-emerald-300',
  },
  {
    header: 'border-sky-700/60 bg-sky-950/40 text-sky-100',
    card: 'border-sky-800/60 bg-sky-950/30',
    title: 'text-sky-100',
    description: 'text-sky-100/75',
    button: 'bg-sky-700 hover:bg-sky-600 focus-visible:ring-sky-300',
  },
  {
    header: 'border-orange-700/60 bg-orange-950/40 text-orange-100',
    card: 'border-orange-800/60 bg-orange-950/30',
    title: 'text-orange-100',
    description: 'text-orange-100/75',
    button: 'bg-orange-700 hover:bg-orange-600 focus-visible:ring-orange-300',
  },
  {
    header: 'border-lime-700/60 bg-lime-950/40 text-lime-100',
    card: 'border-lime-800/60 bg-lime-950/30',
    title: 'text-lime-100',
    description: 'text-lime-100/75',
    button: 'bg-lime-700 hover:bg-lime-600 focus-visible:ring-lime-300',
  },
];

function getSceneGroupTheme(key) {
  if (SCENE_GROUP_THEMES[key]) return SCENE_GROUP_THEMES[key];
  const hash = [...String(key)].reduce((total, char) => total + char.charCodeAt(0), 0);
  return SCENE_FALLBACK_THEMES[hash % SCENE_FALLBACK_THEMES.length];
}

function getSceneBadge(scene, index) {
  const match = String(scene.id).match(/chapter(\d+)([a-z]?)/i);
  if (!match) return String(index + 1).padStart(2, '0');
  return `${match[1].padStart(2, '0')}${match[2]?.toUpperCase() || ''}`;
}

const TopMenu = ({
  onAddEnemy,
  onSelectCommander,
  onSelectBoss,
  onAddManual,
  behaviors,
  onSelectRuneCard,
  onTileDraw,
  onOpenRestart,
  onOpenCamp,
  onOpenCampPhase,
  onOpenSequentialAdventure,
  onOpenCompanion,
  onOpenFollower,
  onActivateScene,
}) => {

  const { translations } = useLanguage();
  const navigate = useNavigate();
  const { openSaves } = useSavesUi() || {};
  const savesT = translations?.saves || {};
  const t = translations?.trackerInit || {};
  const { resetPlacedEnemies, activaHuesped, desactivaHuesped, huespedActivo, activaAcecho, desactivaAcecho, acechoActivo, activaInvadidos, desactivaInvadidos, invadidosActivo, oscuridadActivo, activaOscuridad, desactivaOscuridad, asaltoActivo, activaAsalto, desactivaAsalto } = useInitEnemies();
  const [enemySelect, setEnemySelect] = useState('');
  const [randomExpansionIds, setRandomExpansionIds] = useState([]);
  const [randomBehaviors, setRandomBehaviors] = useState(['estandar', 'alternativo', 'complejo']);
  const [manualSelect, setManualSelect] = useState('');
  const [showRuneFaceOptions, setShowRuneFaceOptions] = useState(false);
  const [showAssaultFaceOptions, setshowAssaultFaceOptions] = useState(false);
  const [expandedSceneGroups, setExpandedSceneGroups] = useState({});


  const [showEmbrujoOptions, setShowEmbrujoOptions] = useState(false);
  const [showScenarioFaceOptions, setShowScenarioFaceOptions] = useState({ incursion: false, defensa: false });
  const [pendingRuneAction, setPendingRuneAction] = useState(null);
  const { removeRune, availableTiles, usedTiles, showTileToast, drawTileByColor, addRunesCascade, resetTiles, resetNodeMechanics, deleteAvailableTileByColor, scenarioMonster, setScenarioMonster, manifestTile, pilas, pilasConcentrada, spawnPoints, generationPoints, addGenerationPoint, removeGenerationPoint, magicCannons, addMagicCannon, toggleMagicCannon, removeMagicCannon, controlPoints, runeKeys, rescue, erradenEvent, addErradenEvent, resetErradenEvent, sorpresaEvent, addSorpresaEvent, resetSorpresaEvent, corruptShipEvent, addCorruptShipEvent, resetCorruptShipEvent, swanShipEvent, addSwanShipEvent, resetSwanShipEvent, siegeEvent, addSiegeEvent, resetSiegeEvent, eternalDarknessActive, setEternalDarknessActive } = useGame();
  const { trackerData, setTrackerData } = useTracker();
  const { placedRunes, setPlacedRunes, resetPlacedRunes } = useInitRunes();
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const gameMenuRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null); // 'enemies' | 'runes' | 'nodes' | 'scenario' | 'events' | 'scenes'
  const [sceneFollowerOpen, setSceneFollowerOpen] = useState(false);
  const [sceneFollowerSelection, setSceneFollowerSelection] = useState(null);
  const [sceneMissing, setSceneMissing] = useState({ vorn: false, elros: false });
  const [sceneFollowerValues, setSceneFollowerValues] = useState({ vorn: 'animado', elros: 'energico' });
  const containerRef = useRef(null);
  const menuRefEnemies = useRef(null);
  const menuRefRunes = useRef(null);
  const menuRefScenario = useRef(null);
  const menuRefNodes = useRef(null);
  const { selectedExpansions, mainBox, previewOtherBoxes, togglePreview, canPreviewOtherBoxes } = useExpansions();

  const sceneGroups = useMemo(() => {
    const grouped = new Map();
    SCENES
      .filter((scene) => {
        const campaign = scene.campaign || 'awakenings';
        const campaignMatches = previewOtherBoxes
          ? ['core', 'awakenings'].includes(campaign)
          : campaign === mainBox;
        return campaignMatches
          && (!scene.expansionId || selectedExpansions.includes(scene.expansionId));
      })
      .forEach((scene) => {
        const key = scene.expansionId || (scene.campaign === 'core' ? 'base' : 'awakenings');
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(scene);
      });
    const groupOrder = (group) => {
      if (group.key === 'base') return -2;
      if (group.key === 'awakenings') return -1;
      return group.scenes[0]?.order ?? Number(group.scenes[0]?.id.replace(/\D/g, ''));
    };
    return [...grouped.entries()]
      .map(([key, scenes]) => ({
        key,
        scenes: [...scenes].sort((a, b) => {
          const orderA = a.order ?? Number(a.id.replace(/\D/g, ''));
          const orderB = b.order ?? Number(b.id.replace(/\D/g, ''));
          return orderA - orderB;
        }),
      }))
      .sort((a, b) => groupOrder(a) - groupOrder(b));
  }, [mainBox, previewOtherBoxes, selectedExpansions]);
  const activeEnemyExpansions = selectedExpansions.filter((expansionId) => (
    ENEMIES.some((enemy) => enemy.expansionId === expansionId)
  ));
  const activeEnemyExpansionKey = activeEnemyExpansions.join('|');
  useEffect(() => {
    const active = activeEnemyExpansionKey.split('|').filter(Boolean);
    setRandomExpansionIds((prev) => {
      const stillActive = prev.filter((id) => active.includes(id));
      return stillActive.length > 0 ? stillActive : active;
    });
  }, [activeEnemyExpansionKey]);
  const randomPool = Array.from(new Map(ENEMIES
    .filter((enemy) => (
      randomExpansionIds.includes(enemy.expansionId)
      && enemy.tipo === 'enemigo'
      && randomBehaviors.includes(enemy.comportamiento || 'estandar')
      && !['comandante', 'jefe', 'overlord', 'hero', 'escenario'].includes(enemy.categoria)
    ))
    .map((enemy) => [enemy.id, enemy])).values());
  const showCoreContent = mainBox === 'core' || previewOtherBoxes;
  const showAwakeningsContent = mainBox === 'awakenings' || previewOtherBoxes;
  
  const colorMap = {
    rojo: 'state-btn-remove',
    azul: 'bg-blue-700 hover:bg-blue-600',
    verde: 'state-btn-add',
    naranja: 'bg-orange-700 hover:bg-orange-600',
    gris: 'bg-slate-600 hover:bg-slate-500',
  };

  const toggleMenu = (name) => {
    setGameMenuOpen(false);
    setActiveMenu(prev => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleOutside = (e) => {
      // Los diálogos se montan en un portal fuera del contenedor: pulsar en
      // ellos no debe cerrar el menú que los abrió.
      if (e.target?.closest?.('[role="dialog"]')) return;
      if (gameMenuRef.current && !gameMenuRef.current.contains(e.target)) setGameMenuOpen(false);
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setGameMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
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

  const scenarioMonsterCampaigns = useMemo(
    () => (previewOtherBoxes ? ['core', 'awakenings'] : [mainBox]),
    [mainBox, previewOtherBoxes],
  );
  const monstruosUnicos = Array.from(
    new Map(
      scenarioMonsterCampaigns
        .flatMap((campaign) => getScenarioMonstersForCampaign(campaign))
        .map(m => [m.id, m])
    ).values()
  );

  useEffect(() => {
    if (!scenarioMonster) return;
    const stillAvailable = scenarioMonsterCampaigns
      .flatMap((campaign) => getScenarioMonstersForCampaign(campaign))
      .some((monster) => monster.id === scenarioMonster.id);
    if (!stillAvailable) setScenarioMonster(null);
  }, [mainBox, previewOtherBoxes, scenarioMonster, scenarioMonsterCampaigns, setScenarioMonster]);

  useEffect(() => {
    if (!['awakenings', 'core'].includes(mainBox) && activeMenu === 'events') {
      setActiveMenu(null);
    }
    if (!['awakenings', 'core'].includes(mainBox) && activeMenu === 'scenes') {
      setActiveMenu(null);
    }
  }, [mainBox, activeMenu]);

  const handleSelectUniqueCard = (card, timeToken = false) => {
    const tipo = card.tipo;
    // ✅ Comprobar si ya existe una carta de este tipo
    const yaEx = card.unique === 'id'
      ? placedRunes.some(r => r.rune.id === card.id)
      : placedRunes.some(r => r.rune.tipo === tipo);
  
    if (yaEx) {
      appNotify(t.yaExiste);
      return;
    }
  
    // ✅ Si no existe, la añadimos
    onSelectRuneCard(card, timeToken);
  };

  const buildFollowerEntry = (followerId, stateId) => {
    const follower = FOLLOWERS.find((item) => item.id === followerId);
    if (!follower) return null;
    const state = follower.states.find((item) => item.id === stateId) || follower.states[0];
    const index = FOLLOWERS.findIndex((item) => item.id === followerId);
    return {
      uid: createId(),
      id: follower.id,
      name: follower.name,
      epithet: follower.epithet,
      role: follower.role,
      position: ROLE_POSITIONS[follower.role] ?? 0,
      stateId: state.id,
      vida: state.vida,
      vidaMax: state.vida,
      estadosAlterados: [],
      background: getInteractionBackgroundAt(index),
      image: null,
    };
  };

  const addFollowersToTracker = (additions) => {
    if (additions.length === 0) return;
    setTrackerData((prev) => ({
      ...prev,
      followers: [...(prev.followers || []), ...additions],
    }));
    additions.forEach((entry) => saveCampFollower(entry));
  };

  const activateScene = (scene) => {
    onActivateScene?.(scene);
    const followers = trackerData.followers || [];
    const missing = {
      vorn: !followers.some((entry) => entry.id === 'vorn_guerrero'),
      elros: !followers.some((entry) => entry.id === 'elros_asesino'),
    };
    setSceneMissing(missing);
    setActiveMenu(null);

    if (scene.followerSelection) {
      const totalHeroes = trackerData.placedHeroes?.length || trackerData.heroes?.length || 0;
      const count = Math.max(0, scene.followerSelection.countBase - totalHeroes);
      const options = scene.followerSelection.options
        .filter((option) => !followers.some((entry) => entry.id === option.id))
        .map((option) => {
          const follower = FOLLOWERS.find((item) => item.id === option.id);
          const state = follower?.states.find((item) => item.id === option.stateId) || follower?.states[0];
          return {
            id: option.id,
            stateId: state?.id || option.stateId,
            name: follower?.name || option.id,
            stateName: state?.name || option.stateId,
          };
        });
      const toChoose = Math.min(count, options.length);
      if (toChoose > 0) {
        setSceneFollowerSelection({ count: toChoose, options, selected: [] });
        return;
      }
    }

    if (scene.id === 'chapter4' && (missing.vorn || missing.elros)) {
      setSceneFollowerOpen(true);
    }
  };

  const confirmSceneFollowers = () => {
    const additions = [];
    if (sceneMissing.vorn) {
      const entry = buildFollowerEntry('vorn_guerrero', sceneFollowerValues.vorn);
      if (entry) additions.push(entry);
    }
    if (sceneMissing.elros) {
      const entry = buildFollowerEntry('elros_asesino', sceneFollowerValues.elros);
      if (entry) additions.push(entry);
    }
    addFollowersToTracker(additions);
    setSceneFollowerOpen(false);
  };

  const confirmSceneFollowerSelection = () => {
    const selection = sceneFollowerSelection;
    if (!selection) return;
    const additions = selection.selected
      .map((followerId) => {
        const option = selection.options.find((entry) => entry.id === followerId);
        return option ? buildFollowerEntry(option.id, option.stateId) : null;
      })
      .filter(Boolean);
    addFollowersToTracker(additions);
    setSceneFollowerSelection(null);
  };

  const handleResetNodeMechanics = async () => {
    const confirmed = await appConfirm(
      t.resetNodeMechanicsConfirm || 'Se reiniciarán todas las mecánicas del menú Nodos: pilas, Nodos, áreas, generación y cañones.',
      {
        title: t.resetNodeMechanics || 'Resetear mecánicas',
        confirmLabel: t.reset || 'Resetear',
        cancelLabel: t.cancel || 'Cancelar',
      },
    );
    if (!confirmed) return;
    resetNodeMechanics();
    appNotify(t.resetNodeMechanicsDone || 'Mecánicas de Nodos reiniciadas.');
  };

  const runeColorName = (color) => (color ? (t.colores?.[color] || color) : (t.removeRandom || 'Aleatoria'));

  // Las fichas solo se retiran tras confirmar: son acciones sin deshacer.
  const requestRemoveRune = (color) => {
    const availableColors = ['naranja', 'verde', 'azul', 'rojo', 'gris']
      .filter((candidate) => usedTiles.some((tile) => tile.runa === candidate));
    const targetColor = color || availableColors[Math.floor(Math.random() * availableColors.length)];
    if (!targetColor) {
      appNotify(t.noTilesToRemove || 'No hay fichas para eliminar.');
      return;
    }
    setPendingRuneAction({ type: 'remove', color: targetColor });
  };

  const requestDeleteAvailableTile = (color) => {
    const targetColor = color || availableTiles[Math.floor(Math.random() * availableTiles.length)]?.runa;
    if (!targetColor) {
      appNotify(t.noTilesToRemove || 'No hay fichas para eliminar.');
      return;
    }
    setPendingRuneAction({ type: 'delete', color: targetColor });
  };

  const confirmRuneAction = () => {
    const action = pendingRuneAction;
    setPendingRuneAction(null);
    if (!action) return;

    if (action.type === 'reset') {
      resetPlacedRunes();
      resetTiles();
      desactivaAcecho();
      desactivaHuesped();
      desactivaOscuridad();
      desactivaAsalto();
      return;
    }

    if (action.type === 'remove') {
      const removed = removeRune(action.color);
      if (removed) showTileToast(removed, 'remove');
      else appNotify(t.noTilesToRemove || 'No hay fichas para eliminar.');
      return;
    }

    const tile = deleteAvailableTileByColor(action.color);
    if (tile) showTileToast(tile, 'remove');
    else appNotify(t.noTilesToRemove || 'No hay fichas para eliminar.');
  };

  const pendingRuneCopy = (() => {
    if (!pendingRuneAction) return null;
    if (pendingRuneAction.type === 'reset') {
      return {
        title: t.resetRunesConfirmTitle || 'Borrar runas y fichas',
        description: t.resetRunesConfirm || 'Se eliminarán las cartas de runa colocadas, todas las fichas de la bolsa y los estados activos de la escena.',
        confirm: t.resetRunes || 'Resetear Runas',
      };
    }
    if (pendingRuneAction.type === 'remove') {
      return {
        title: t.confirmRemoveTileTitle || 'Eliminar ficha del medidor',
        description: (t.confirmRemoveTileDesc || 'Se retirará la ficha {color} del medidor de iniciativa. Esta acción no se puede deshacer.')
          .replace('{color}', runeColorName(pendingRuneAction.color)),
        confirm: t.removeTiles || 'Eliminar Runa del Medidor',
      };
    }
    return {
      title: t.confirmDeleteTileTitle || 'Eliminar ficha de la bolsa',
      description: (t.confirmDeleteTileDesc || 'Se descartará la ficha {color} de la bolsa. Esta acción no se puede deshacer.')
        .replace('{color}', runeColorName(pendingRuneAction.color)),
      confirm: t.eliminarDirecto || 'Eliminar Runa de la Bolsa',
    };
  })();

  const scenarioCards = placedRunes.filter((entry) => ['incursion', 'defensa'].includes(entry.rune?.tipo)).length;
  const maxScenarioCards = mainBox === 'awakenings' || previewOtherBoxes ? 3 : 2;
  const activeNodes = spawnPoints.length + controlPoints.length + runeKeys.length + rescue.length + pilas.length + pilasConcentrada.length;
  
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
              { id: 'nodes', icon: RuneStackIcon, label: t.nodesMenu || 'Nodos', tone: 'cyan' },
              { id: 'scenario', icon: GiVillage, label: t.scenarioMenu || 'Escenario', tone: 'amber' },
              { id: 'companions', icon: GiPawPrint, label: t.companionsMenu || 'Compañeros', tone: 'amber' },
              ...(['awakenings', 'core'].includes(mainBox) ? [
                { id: 'events', icon: SpecialEventIcon, label: t.eventsMenu || 'Eventos', tone: 'amber' },
              ] : []),
              ...(['awakenings', 'core'].includes(mainBox) ? [
                { id: 'scenes', icon: GiStoneTower, label: t.scenesMenu || 'Escenas', tone: 'amber' },
              ] : []),
            ].map(({ id, icon: Icon, label, tone }) => {
              const isActive = activeMenu === id;
              const activeTone = tone === 'sky'
                ? 'border-sky-400/80 bg-sky-700 text-white shadow-inner shadow-sky-950/40'
                : tone === 'emerald'
                  ? 'border-emerald-400/80 bg-emerald-700 text-white shadow-inner shadow-emerald-950/40'
                  : tone === 'cyan'
                    ? 'border-cyan-400/80 bg-cyan-700 text-white shadow-inner shadow-cyan-950/40'
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
                  className={`flex h-10 shrink-0 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
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

        <div className="flex shrink-0 items-center gap-1.5">
          <div className="relative" ref={gameMenuRef}>
            <button
              type="button"
              onClick={() => setGameMenuOpen((open) => !open)}
              aria-expanded={gameMenuOpen}
              aria-controls="track-game-menu"
              aria-label={t.gameMenu || 'Menú de juego'}
              title={t.gameMenu || 'Menú de juego'}
              className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-slate-800 px-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <MdMenu size={20} aria-hidden="true" />
              <span className="hidden lg:inline">{t.gameMenu || 'Menú de juego'}</span>
            </button>

            {gameMenuOpen && (
              <div
                id="track-game-menu"
                role="menu"
                aria-label={t.gameMenu || 'Menú de juego'}
                className="layer-menu absolute right-0 top-full mt-2 w-60 rounded-xl border border-slate-700 bg-slate-900 p-1.5 text-sm text-slate-100 shadow-2xl"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setGameMenuOpen(false); openSaves?.(); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <GiArchiveRegister size={18} aria-hidden="true" />
                  {savesT.title || 'Partidas'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setGameMenuOpen(false); window.open('https://tabletopaudio.com/', '_blank', 'noopener,noreferrer'); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <GiMusicalNotes size={18} aria-hidden="true" />
                  {t.music || 'Música'}
                </button>
                {canPreviewOtherBoxes && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { togglePreview(); setGameMenuOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  >
                    <span aria-hidden="true">🎴</span>
                    {previewOtherBoxes
                      ? (t.hideOtherBoxes || 'Ocultar contenido de otras cajas')
                      : (t.showOtherBoxes || 'Ver contenido de otras cajas')}
                  </button>
                )}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setGameMenuOpen(false); navigate('/'); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <AiOutlineMenu size={18} aria-hidden="true" />
                  {t.goHome || 'Inicio'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setGameMenuOpen(false); navigate('/tracker'); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <GiGearHammer size={18} aria-hidden="true" />
                  {t.backToConfig || 'Volver a configuración'}
                </button>
                <div className="my-1 border-t border-slate-700" role="separator" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setGameMenuOpen(false); onOpenCamp?.(); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <GiWoodenCrate size={18} aria-hidden="true" />
                  {t.campMenu || 'Campamento'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setGameMenuOpen(false); onOpenCampPhase?.(); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <GiCampfire size={18} aria-hidden="true" />
                  {t.campPhaseMenu || 'Fase de Campamento'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setGameMenuOpen(false); onOpenSequentialAdventure?.(); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <GiWoodenSign size={18} aria-hidden="true" />
                  {t.sequentialAdventureMenu || 'Aventura Secuencial'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setGameMenuOpen(false); onOpenRestart?.(); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-red-200 hover:bg-red-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                  <GiTrashCan size={18} aria-hidden="true" />
                  {t.restartMenu || 'Reiniciar partida'}
                </button>
                <div className="mt-1 border-t border-slate-700 px-2 py-2">
                  <LanguageMenu label={savesT.language || 'Idioma'} />
                </div>
              </div>
            )}
          </div>

          {['enemies', 'runes', 'nodes', 'scenario', 'events', 'scenes'].includes(activeMenu) && (
            <button
              type="button"
              data-testid="close-menu"
              onClick={() => setActiveMenu(null)}
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
            className="menu-panel layer-menu flex max-h-[70dvh] flex-col gap-2 overflow-y-auto px-3 pb-3 pt-2 text-white sm:px-4"
          >
            <div className="grid gap-2 md:grid-cols-2">
              {/* Aleatorios */}
              <div data-testid="random-enemies" className="track-surface-raised p-2.5 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900/60 text-blue-300">
                    <GiSwordClash className="text-lg" />
                  </span>
                  <span className="font-semibold">{t.addEnemies || 'Enemigos aleatorios'}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { key: 'blanco', label: t.addWhiteEnemies, color: 'text-white', ring: 'ring-white/30' },
                    { key: 'gris', label: t.addGrayEnemies, color: 'text-slate-400', ring: 'ring-slate-400/30' },
                    { key: 'negro', label: t.addBlackEnemies, color: 'text-black', ring: 'ring-slate-200/40' },
                    { key: 'comandante', label: t.addCommanders, color: 'text-yellow-500', ring: 'ring-yellow-500/30' },
                  ].map(({ key, label, color, ring }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setEnemySelect(key);
                        handleEnemySelect({ target: { value: key } });
                      }}
                      className={`state-chip flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border px-1 py-1 text-[0.6rem] font-semibold leading-tight transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                        enemySelect === key
                          ? 'border-sky-400 bg-sky-700 text-white shadow-lg shadow-sky-950/50'
                          : 'border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <GiBullyMinion className={`text-xl ${key === 'negro' ? 'rounded bg-white text-black' : color} ${ring}`} />
                      <span className="break-words text-center text-[0.6rem]">{label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-2 border-t border-slate-700/70 pt-2">
                  <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
                    {t.randomExpansions || 'Expansiones incluidas'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {activeEnemyExpansions.map((expansionId) => {
                      const active = randomExpansionIds.includes(expansionId);
                      return (
                        <button
                          key={expansionId}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setRandomExpansionIds((prev) => (
                            prev.includes(expansionId)
                              ? prev.filter((id) => id !== expansionId)
                              : [...prev, expansionId]
                          ))}
                          className={`rounded-full border px-2 py-1 text-[0.6rem] font-semibold transition ${
                            active
                              ? 'border-sky-400 bg-sky-800 text-sky-100'
                              : 'border-slate-600 bg-slate-900 text-slate-400'
                          }`}
                        >
                          {translations.expansions?.[expansionId] || expansionId}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mb-1 mt-2 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
                    {t.randomBehaviors || 'Versiones incluidas'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { key: 'estandar', label: t.behaviorStandard || 'Estándar' },
                      { key: 'alternativo', label: t.behaviorAlternative || 'Alternativo' },
                      { key: 'complejo', label: t.behaviorComplex || 'Complejo' },
                    ].map(({ key, label }) => {
                      const active = randomBehaviors.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setRandomBehaviors((prev) => (
                            prev.includes(key)
                              ? prev.filter((value) => value !== key)
                              : [...prev, key]
                          ))}
                          className={`rounded-full border px-2 py-1 text-[0.6rem] font-semibold transition ${
                            active
                              ? 'border-emerald-400 bg-emerald-800 text-emerald-100'
                              : 'border-slate-600 bg-slate-900 text-slate-400'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <details className="mt-2 rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1.5">
                    <summary className="cursor-pointer text-[0.65rem] font-semibold text-slate-300">
                      {t.randomPool || 'Ver enemigos incluidos'} ({randomPool.length})
                    </summary>
                    <div className="mt-1 max-h-36 space-y-1 overflow-y-auto text-[0.65rem] text-slate-300">
                      {activeEnemyExpansions
                        .filter((expansionId) => randomExpansionIds.includes(expansionId))
                        .map((expansionId) => (
                          <div key={expansionId}>
                            <p className="font-semibold text-sky-200">{translations.expansions?.[expansionId] || expansionId}</p>
                            <p className="text-slate-400">
                              {randomPool
                                .filter((enemy) => enemy.expansionId === expansionId)
                                .map((enemy) => translations.enemies?.[enemy.id] || enemy.nombre || enemy.id)
                                .join(' · ')}
                            </p>
                          </div>
                        ))}
                      {randomPool.length === 0 && (
                        <p className="text-amber-300">{t.randomNoEnemies || 'No hay enemigos en las expansiones seleccionadas.'}</p>
                      )}
                    </div>
                  </details>
                </div>
              </div>

              {/* Manuales: 2 filas agrupadas (colores + especiales) */}
              <div data-testid="manual-enemies" className="track-surface-raised p-2.5 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-900/60 text-purple-300">
                    <MdAddCircleOutline className="text-lg" />
                  </span>
                  <span className="font-semibold">{t.addManualEnemy || 'Enemigos manuales'}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { key: 'esbirro', label: t.addMinionEnemies, color: 'text-cyan-300' },
                    { key: 'blanco', label: t.addWhiteEnemies, color: 'text-white' },
                    { key: 'gris', label: t.addGrayEnemies, color: 'text-slate-400' },
                    { key: 'negro', label: t.addBlackEnemies, color: 'text-black' },
                    { key: 'comandante', label: t.addCommanders, color: 'text-yellow-500' },
                    { key: 'overlord', label: t.selectOverlord, color: 'text-red-400' },
                    { key: 'jefe', label: t.selectBosses, color: 'text-purple-400' },
                    { key: 'hero', label: t.selectHeroFall, color: 'text-orange-400' },
                    { key: 'escenario', label: t.selectScenario, color: 'text-cyan-600' },
                    { key: 'any', label: t.manualAnyShort || 'Manual', color: 'text-purple-300', title: t.manualAny || 'Añadir enemigo manual' },
                  ].map(({ key, label, color, title }) => (
                    <button
                      key={key}
                      onClick={() => {
                        if (key === 'any') {
                          setManualSelect('');
                          onAddManual();
                          return;
                        }
                        setManualSelect(key);
                        handleManualSelect({ target: { value: key } });
                      }}
                      aria-label={title || label}
                      title={title || label}
                      className={`state-chip flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg border px-1 py-1.5 text-[0.65rem] font-semibold leading-tight transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 ${
                        manualSelect === key
                          ? 'border-purple-400 bg-purple-700 text-white shadow-lg shadow-purple-950/50'
                          : 'border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <GiBullyMinion className={`text-xl ${key === 'negro' ? 'rounded bg-white text-black' : color}`} />
                      <span className="text-center">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <RiskZone
              id="enemies-riesgo"
              title={t.riskZone || 'Zona de riesgo'}
              hint={t.riskZoneHint || 'Estas acciones no se pueden deshacer.'}
            >
              <div className="text-center">
                <button
                  type="button"
                  data-testid="reset-enemies"
                  onClick={resetPlacedEnemies}
                  className="min-h-11 rounded-xl border border-amber-600/70 bg-amber-950/50 px-4 text-sm font-semibold text-amber-100 transition hover:border-amber-400 hover:bg-amber-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                >
                  ↺ {t.resetEnemies || 'Resetear enemigos'}
                </button>
              </div>
            </RiskZone>
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
            className="menu-panel layer-menu flex max-h-[70dvh] flex-col gap-2 overflow-y-auto px-3 pb-3 pt-2 text-white sm:px-4"
          >
            <div className="flex flex-col gap-3">
              <div data-testid="menu-header" className="sticky top-0 z-10 -mx-3 -mt-2 flex shrink-0 items-center gap-2 border-b border-slate-700 bg-slate-900/95 px-3 py-2 backdrop-blur sm:-mx-4 sm:px-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-900/60 text-emerald-300">
                  <GiRuneStone className="text-lg" />
                </span>
                <h2 className="min-w-0 flex-1 truncate text-base font-bold">{t.runesMenu || 'Runas'}</h2>
                <span className="shrink-0 rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-200">
                  {t.runasChip || 'Runas'} {placedRunes.length}
                </span>
                <span className="hidden shrink-0 rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-200 sm:inline">
                  {t.fichasChip || 'Fichas'} {availableTiles.length}/{availableTiles.length + usedTiles.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMenu(null)}
                  aria-label={t.close || 'Cerrar menú'}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  ✕
                </button>
              </div>

              <div data-testid="runes-row" className="grid gap-3 lg:grid-cols-3">
              {/* Añadir Cartas de Runa */}
              <section className="track-surface-raised p-3 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <GiCardPlay className="text-indigo-400 text-xl" />
                  <h3 className="min-w-0 flex-1 text-sm font-semibold">{t.cartas}</h3>
                </div>
                <div className="flex flex-col gap-2">

                  {/* --- Bloque 1: OSCURIDAD DE CAZA --- */}
                  {showCoreContent && (
                  <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-2">
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
                            className="state-btn-add text-white text-xs px-2 py-1 rounded"
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
                  )}

                  {showAwakeningsContent && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {RUNAS_DESPERTAR.filter((card) => card.cara === 'A').map((cardA) => {
                      const cardB = RUNAS_DESPERTAR.find((card) => card.id === cardA.id && card.cara === 'B');
                      const already = placedRunes.some((entry) => entry.rune.tipo === 'runa');
                      return (
                        <div
                          key={cardA.id}
                          data-testid={`despertar-rune-${cardA.id}`}
                          className="rounded-xl border border-slate-700 bg-slate-950/50 p-2"
                        >
                          <h4 className="flex min-w-0 items-center gap-1.5 text-xs font-bold text-slate-100">
                            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-950/70 text-indigo-300">
                              <GiRuneStone className="text-sm" />
                            </span>
                            <span className="truncate">{translations.scenarioCard?.[cardA.id] || cardA.nombre}</span>
                          </h4>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              disabled={already}
                              onClick={() => handleSelectUniqueCard(cardA)}
                              className={`state-btn-add text-white text-xs px-2 py-1 rounded ${already ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Añadir (A)
                            </button>
                            {cardB && (
                              <button
                                type="button"
                                disabled={already}
                                onClick={() => handleSelectUniqueCard(cardB)}
                                className={`bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded ${already ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Cara B
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}

                  {/* --- Bloque 2: ASALTO (solo si expansión activa) --- */}
                  {showCoreContent && selectedExpansions.includes("infernal_desert") && (
                    <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-2">
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
                              className="state-btn-add text-white text-xs px-2 py-1 rounded"
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

                  <div className="grid gap-2 sm:grid-cols-3">

                {/* --- Bloque 3: ACECHO --- */}
                {showCoreContent && (
                  <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-2"> 
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex flex-wrap gap-2 justify-center items-center">
                        <GiCrownedSkull className="text-indigo-300 text-xl" />
                  
                        {!acechoActivo ? (
                          <button
                            onClick={() => setShowEmbrujoOptions(prev => !prev)}
                            className="state-btn-add text-white text-xs px-2 py-1 rounded"
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
                )}

                {/* --- Bloque 5: INVADIDOS --- */}
                {showCoreContent && (
                <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-2"> 
                  <div className="flex flex-wrap gap-2 justify-center">
                    <GiReaperScythe className="text-indigo-300 text-xl" />
                    
                    {!invadidosActivo ? (
                      <button
                        onClick={() => {
                          activaInvadidos();
                          setScenarioMonster(prev => prev?.id === "dark_vampire" ? null : "dark_vampire");
                        }}
                        className="state-btn-add text-white text-xs px-2 py-1 rounded"
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
                )}
                </div>
                </div>
              </section>

              {/* 📦 Estado de la bolsa */}
              <div className="track-surface-raised p-3 shadow-md">
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
                
                {/* Columna: añadir y manifestar */}
                <div className="flex flex-col gap-2">
                {/* Añadir ficha */}
                <div className="track-surface-raised p-3 shadow-md">
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
                            appNotify(`${t.aviso2} ${t.colores[color]}`);
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
                          appNotify(`${t.aviso2} ${t.colores[randomColor]}`);
                        }
                      }}
                      className="bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      🎲 {t.fichaAleatoria || 'Aleatoria'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                {/* Añadir oscuridad en cascada */}
                <div className="track-surface-raised flex-1 p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiRuneStone className="text-purple-400 text-xl" />
                    <span className="text-sm font-semibold text-center">{t.oscuridadCascada}</span>
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

                {/* Manifestar Runa */}
                <div className="track-surface-raised p-3 shadow-md">
                  <div className="flex flex-row items-center gap-2 mb-2 justify-center">
                    <GiRuneStone className="text-blue-400 text-xl inline-block" />
                    <span className="text-sm font-semibold text-center">{t.manifestarTitulo || 'Manifestar Runa'}</span>
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
                </div>
                </div>
              </div>

              {/* Zona de riesgo: acciones sin deshacer */}
              <section aria-labelledby="runas-riesgo" className="rounded-xl border border-red-900/70 bg-red-950/20 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
                  <GiTrashCan className="text-red-400 text-xl" />
                  <h3 id="runas-riesgo" className="text-sm font-semibold text-red-200">
                    {t.riskZone || 'Zona de riesgo'}
                  </h3>
                  <span className="text-xs text-red-200/80">{t.riskZoneHint || 'Estas acciones no se pueden deshacer.'}</span>
                </div>
                <div className="mx-auto grid max-w-4xl gap-2 sm:grid-cols-3">
                  <div role="group" aria-label={t.removeTiles || 'Eliminar Runa del Medidor'} className="rounded-xl border border-red-900/60 bg-slate-950/50 p-2 text-center">
                    <div className="mb-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-200">
                      <GiBrickWall className="text-base" />
                      <span>{t.removeTiles || 'Eliminar Runa del Medidor'}</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {['naranja', 'verde', 'azul', 'rojo', 'gris'].map(color => (
                        <button
                          key={color}
                          onClick={() => requestRemoveRune(color)}
                          className={`${colorMap[color]} text-white text-xs px-2 py-1 rounded-full`}
                        >
                          {t.colores[color]}
                        </button>
                      ))}
                      <button
                        onClick={() => requestRemoveRune()}
                        className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded-full"
                      >
                        🎲 {t.removeRandom || 'Aleatoria'}
                      </button>
                    </div>
                  </div>

                  <div role="group" aria-label={t.eliminarDirecto || 'Eliminar Runa de la Bolsa'} className="rounded-xl border border-red-900/60 bg-slate-950/50 p-2 text-center">
                    <div className="mb-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-200">
                      <GiTrashCan className="text-base" />
                      <span>{t.eliminarDirecto}</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {['naranja', 'verde', 'azul', 'rojo', 'gris'].map(color => (
                        <button
                          key={color}
                          onClick={() => requestDeleteAvailableTile(color)}
                          className={`${colorMap[color]} text-white text-xs px-2 py-1 rounded-full`}
                        >
                          {t.colores[color]}
                        </button>
                      ))}
                      <button
                        onClick={() => requestDeleteAvailableTile()}
                        className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded-full"
                      >
                        🎲 {t.removeRandom || 'Aleatoria'}
                      </button>
                    </div>
                  </div>

                  <div role="group" aria-label={t.resetRunes || 'Resetear Runas'} className="rounded-xl border border-red-900/60 bg-slate-950/50 p-2 text-center">
                    <div className="mb-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-200">
                      <GiRuneStone className="text-base" />
                      <span>{t.resetRunes || 'Resetear Runas'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingRuneAction({ type: 'reset' })}
                      className="mx-auto block min-h-9 rounded-full bg-yellow-500 px-3 text-xs font-semibold text-slate-900 hover:bg-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200"
                    >
                      {t.resetRunes || 'Resetear Runas'}
                    </button>
                  </div>
                </div>
              </section>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMenu === 'nodes' && (
          <motion.div
            ref={menuRefNodes}
            id="track-menu-nodes"
            role="region"
            aria-label={t.nodesMenu || 'Nodos'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="menu-panel layer-menu flex max-h-[70dvh] flex-col gap-2 overflow-y-auto px-3 pb-3 pt-2 text-white sm:px-4"
          >
            <div className="flex flex-col gap-3">
              <div data-testid="menu-header" className="sticky top-0 z-10 -mx-3 -mt-2 flex shrink-0 items-center gap-2 border-b border-slate-700 bg-slate-900/95 px-3 py-2 backdrop-blur sm:-mx-4 sm:px-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-900/60 text-cyan-300">
                  <RuneStackIcon size={18} />
                </span>
                <h2 className="min-w-0 flex-1 truncate text-base font-bold">{t.nodesMenu || 'Nodos'}</h2>
                <span className="shrink-0 rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-200">
                  {t.nodesChip || 'Nodos'} {activeNodes}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMenu(null)}
                  aria-label={t.close || 'Cerrar menú'}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  ✕
                </button>
              </div>

              <section aria-labelledby="nodes-section" className="track-surface-raised p-2.5 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-900/60 text-cyan-300">
                    <GiRuneStone className="text-lg" />
                  </span>
                  <h3 id="nodes-section" className="min-w-0 flex-1 text-sm font-semibold">{t.nodesSection || 'Nodos y áreas'}</h3>
                </div>
                <ScenarioPanels />
                <div className="mt-2 grid items-start gap-2 lg:grid-cols-3">
                {showAwakeningsContent && <NodosOscuridadPanel />}
                {showAwakeningsContent && (
                  <div className="rounded-xl border border-cyan-700/60 bg-cyan-950/30 p-1.5">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wide text-cyan-200">
                      {t.generationPoints || 'Fichas de Generación'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {GENERATION_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          disabled={generationPoints.some((point) => point.color === color)}
                          onClick={() => addGenerationPoint(color)}
                          className="flex items-center gap-1 rounded-full border border-cyan-700/60 bg-slate-950/60 px-2 py-1 text-[0.65rem] font-semibold text-cyan-100 hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <img src={GENERATION_IMAGES[color]} alt="" className="h-5 w-5 rounded-full" />
                          + {t.colores?.[color] || color}
                        </button>
                      ))}
                    </div>
                    {generationPoints.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {generationPoints.map((point) => (
                          <button
                            key={point.id}
                            type="button"
                            onClick={() => removeGenerationPoint(point.id)}
                            title={t.remove || 'Quitar'}
                            className="flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900 px-2 py-1 text-[0.65rem] text-slate-200 hover:border-red-400"
                          >
                            <img src={GENERATION_IMAGES[point.color]} alt="" className="h-5 w-5 rounded-full" />
                            {t.colores?.[point.color] || point.color}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {showAwakeningsContent && (
                <div className="rounded-xl border border-orange-700/60 bg-orange-950/30 p-1.5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-200">
                    {t.magicCannons || 'Cañones Mágicos'}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {MAGIC_CANNON_COLORS.map((color) => {
                      const cannon = magicCannons.find((entry) => entry.color === color);
                      return (
                        <div key={color} data-testid={`magic-cannon-${color}`} className="flex items-center gap-2 rounded-lg bg-slate-950/50 p-1.5">
                          <img src={MAGIC_CANNON_IMAGES[color]} alt="" className="h-8 w-8 rounded-full" />
                          <span className="min-w-0 flex-1 text-[0.65rem] font-semibold text-orange-100">
                            {t.colores?.[color] || color}
                          </span>
                          {!cannon ? (
                            <>
                              <button
                                type="button"
                                onClick={() => addMagicCannon(color, true)}
                                className="rounded bg-emerald-700 px-1.5 py-0.5 text-[0.6rem] font-bold text-white"
                              >
                                {t.loaded || 'Cargado'}
                              </button>
                              <button
                                type="button"
                                onClick={() => addMagicCannon(color, false)}
                                className="rounded bg-slate-700 px-1.5 py-0.5 text-[0.6rem] font-bold text-white"
                              >
                                {t.unloaded || 'Descargado'}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => toggleMagicCannon(cannon.id)}
                                className={`rounded px-1.5 py-0.5 text-[0.6rem] font-bold text-white ${cannon.loaded ? 'bg-emerald-700' : 'bg-slate-700'}`}
                              >
                                {cannon.loaded ? (t.loaded || 'Cargado') : (t.unloaded || 'Descargado')}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeMagicCannon(cannon.id)}
                                className="rounded bg-red-900 px-1.5 py-0.5 text-[0.6rem] font-bold text-red-100"
                              >
                                {t.removeMagicCannon || t.remove || 'Quitar'}
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}
                </div>
              </section>
              <RiskZone
                id="nodes-riesgo"
                title={t.riskZone || 'Zona de riesgo'}
                hint={t.riskZoneHint || 'Estas acciones no se pueden deshacer.'}
              >
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResetNodeMechanics}
                    className="min-h-11 rounded-xl border border-red-700 bg-red-950/50 px-4 text-sm font-semibold text-red-100 transition hover:border-red-400 hover:bg-red-900/60"
                  >
                    ↺ {t.resetNodeMechanicsShort || 'Resetear mecánicas'}
                  </button>
                </div>
              </RiskZone>
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
            className="menu-panel layer-menu flex max-h-[70dvh] flex-col gap-2 overflow-y-auto px-3 pb-3 pt-2 text-white sm:px-4"
          >
            <div className="flex flex-col gap-3">
              <div data-testid="menu-header" className="sticky top-0 z-10 -mx-3 -mt-2 flex shrink-0 items-center gap-2 border-b border-slate-700 bg-slate-900/95 px-3 py-2 backdrop-blur sm:-mx-4 sm:px-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-900/60 text-amber-300">
                  <GiVillage className="text-lg" />
                </span>
                <h2 className="min-w-0 flex-1 truncate text-base font-bold">{t.scenarioMenu || 'Escenario'}</h2>
                <span className="shrink-0 rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-200">
                  {t.scenarioMonsterChip || 'Monstruo'} {scenarioMonster ? 1 : 0}/{monstruosUnicos.length}
                </span>
                <span className="shrink-0 rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-200">
                  {t.scenarioCardsChip || 'Cartas'} {scenarioCards}/{maxScenarioCards}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMenu(null)}
                  aria-label={t.close || 'Cerrar menú'}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  ✕
                </button>
              </div>

              <div data-testid="scenario-row" className="grid gap-3 sm:grid-cols-2">
              {/* Monstruo de escenario */}
              <section aria-labelledby="scenario-monstruo" className="track-surface-raised p-2.5 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-900/60 text-red-300">
                    <GiDaemonSkull className="text-lg" />
                  </span>
                  <h3 id="scenario-monstruo" className="min-w-0 flex-1 text-sm font-semibold">{t.monstruoEscenario}</h3>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-400">
                    {scenarioMonster ? 1 : 0}/{monstruosUnicos.length}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-6">
                  {monstruosUnicos.map(monstruo => {
                    const selected = scenarioMonster?.id === monstruo.id;
                    const nombre = translations.enemies.escenario?.[monstruo.id] || monstruo.id;
                    return (
                      <button
                        key={monstruo.id}
                        type="button"
                        aria-pressed={selected}
                        aria-label={nombre}
                        onClick={() => setScenarioMonster(prev => prev?.id === monstruo.id ? null : monstruo)}
                        className={`relative mx-auto aspect-[567/827] w-full max-w-[190px] overflow-hidden rounded-lg border-2 transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${
                          selected ? 'border-emerald-400 ring-2 ring-emerald-300' : 'border-slate-600'
                        }`}
                      >
                        <EnemyPortraitBackdrop
                          color={monstruo.color || 'escenario'}
                          categoria={monstruo.categoria || 'escenario'}
                          className="h-full w-full"
                        >
                          <ResponsiveImage
                            src={monstruo.imagen}
                            alt=""
                            sizes="190px"
                            className="absolute inset-0 h-full w-full object-contain object-bottom p-1"
                            loading="lazy"
                            decoding="async"
                          />
                          <span className="absolute inset-x-0 bottom-0 z-10 truncate bg-black/70 px-1 py-0.5 text-[0.65rem] font-semibold text-white">
                            {nombre}
                          </span>
                        </EnemyPortraitBackdrop>
                      </button>
                    );
                  })}
                </div>

                {scenarioMonster ? (
                  <p className="mt-2 text-xs text-slate-300">
                    ✅ {t.monstruoSeleccionado}: <strong>{translations.enemies.escenario?.[scenarioMonster.id] || scenarioMonster.id}</strong>
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">{t.noMonster || 'Sin monstruo seleccionado'}</p>
                )}
              </section>

              {/* Cartas de escenario */}
              <section aria-labelledby="scenario-cartas" className="track-surface-raised p-2.5 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-900/60 text-amber-300">
                    <GiVillage className="text-lg" />
                  </span>
                  <h3 id="scenario-cartas" className="min-w-0 flex-1 text-sm font-semibold">{t.scenarioCardsSection || 'Cartas de escenario'}</h3>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-400">{scenarioCards}/{maxScenarioCards}</span>
                </div>

                <div className="grid gap-2">
                  {/* Incursión */}
                  {showCoreContent && (
                  <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-2">
                    <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-orange-200">
                      <GiUprising className="text-sky-300 text-xl" />
                      <span>{t.incru1}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={!scenarioMonster}
                        onClick={() => {
                          const carta = INCURSION.find(c => c.cara === 'A');
                          if (carta) handleSelectUniqueCard(carta);
                        }}
                        className={`state-btn-add text-white text-xs px-2 py-1 rounded 
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
                  )}

                  {showAwakeningsContent && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {INCURSION_DESPERTAR.filter((card) => card.cara === 'A').map((cardA) => {
                      const cardB = INCURSION_DESPERTAR.find((card) => card.id === cardA.id && card.cara === 'B');
                      const already = placedRunes.some((entry) => entry.rune.tipo === 'incursion');
                      const needsScenario = !cardA.incursion?.fixedMonsterId;
                      const disabled = already || (needsScenario && !scenarioMonster);
                      return (
                        <div
                          key={cardA.id}
                          data-testid={`despertar-incursion-${cardA.id}`}
                          className="rounded-xl border border-slate-700 bg-slate-950/50 p-2"
                        >
                          <h4 className="flex min-w-0 items-center gap-1.5 text-xs font-bold text-slate-100">
                            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-950/70 text-indigo-300">
                              <GiUprising className="text-sm" />
                            </span>
                            <span className="truncate">{translations.scenarioCard?.[cardA.id] || cardA.nombre}</span>
                          </h4>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => handleSelectUniqueCard(cardA)}
                              className={`state-btn-add text-white text-xs px-2 py-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Añadir (A)
                            </button>
                            {cardB && (
                              <button
                                type="button"
                                disabled={disabled}
                                onClick={() => handleSelectUniqueCard(cardB)}
                                className={`bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Cara B
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}

                  {/* Defensa */}
                  {showCoreContent && (
                  <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-2">
                    <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-sky-200">
                      <GiStoneTower className="text-sky-300 text-xl" />
                      <span>{t.defen1}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const carta = DEFENSA.find(c => c.cara === 'A');
                          if (carta) handleSelectUniqueCard(carta, true);
                        }}
                        className={`state-btn-add text-white text-xs px-2 py-1 rounded`}
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
                  )}
                </div>

                <div className="mt-3">
                  <RiskZone
                    id="scenario-riesgo"
                    title={t.riskZone || 'Zona de riesgo'}
                    hint={t.riskZoneHint || 'Estas acciones no se pueden deshacer.'}
                  >
                    <div className="text-center">
                      <button
                        type="button"
                        data-testid="scenario-reset"
                        disabled={!scenarioMonster && !placedRunes.some((entry) => ['incursion', 'defensa'].includes(entry.rune?.tipo))}
                        onClick={async () => {
                          const confirmed = await appConfirm(
                            t.scenarioResetConfirm || 'Se quitará el monstruo de escenario y sus cartas de incursión y defensa.',
                            {
                              title: t.scenarioResetTitle || 'Reiniciar escenario',
                              confirmLabel: t.scenarioResetAction || 'Reiniciar',
                            },
                          );
                          if (!confirmed) return;
                          setScenarioMonster(null);
                          setPlacedRunes((prev) => prev.filter((entry) => !['incursion', 'defensa'].includes(entry.rune?.tipo)));
                          setShowScenarioFaceOptions({ incursion: false, defensa: false });
                        }}
                        className="min-h-11 rounded-xl border border-red-700 bg-red-950/50 px-4 text-sm font-semibold text-red-100 transition hover:border-red-400 hover:bg-red-900/60 disabled:opacity-40"
                      >
                        ↺ {t.scenarioReset || 'Reiniciar escenario'}
                      </button>
                    </div>
                  </RiskZone>
                </div>
              </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMenu === 'companions' && (
          <motion.div
            id="track-menu-companions"
            role="region"
            aria-label={t.companionsMenu || 'Compañeros'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="menu-panel layer-menu flex max-h-[70dvh] flex-col gap-2 overflow-y-auto px-3 pb-3 pt-2 text-white sm:px-4"
          >
            <CompanionPicker
              inline
              open
              hideReset
              onClose={() => setActiveMenu(null)}
              onOpenCompanion={(uid) => {
                setActiveMenu(null);
                onOpenCompanion?.(uid);
              }}
              onOpenFollower={(uid) => {
                setActiveMenu(null);
                onOpenFollower?.(uid);
              }}
            />
            <RiskZone
              id="companions-riesgo"
              title={t.riskZone || 'Zona de riesgo'}
              hint={t.riskZoneHint || 'Estas acciones no se pueden deshacer.'}
            >
              <div className="text-center">
                <button
                  type="button"
                  disabled={!(trackerData.companions || []).length}
                  onClick={async () => {
                    const confirmed = await appConfirm(
                      t.companionsResetConfirm || 'Se restaurará la vida y se quitarán los estados de todas las criaturas asignadas.',
                      { title: t.companionsResetTitle || 'Resetear compañeros', confirmLabel: t.companionsResetAction || 'Resetear' },
                    );
                    if (!confirmed) return;
                    setTrackerData((prev) => ({
                      ...prev,
                      companions: (prev.companions || []).map((entry) => ({
                        ...entry,
                        vida: entry.vidaMax ?? entry.vida,
                        estadosAlterados: [],
                      })),
                    }));
                  }}
                  className="min-h-11 rounded-xl border border-red-700 bg-red-950/50 px-4 text-sm font-semibold text-red-100 transition hover:border-red-400 hover:bg-red-900/60 disabled:opacity-40"
                >
                  ↺ {t.companionsReset || 'Resetear compañeros'}
                </button>
              </div>
            </RiskZone>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMenu === 'events' && (
          <motion.div
            id="track-menu-events"
            role="region"
            aria-label={t.eventsMenu || 'Eventos'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="menu-panel layer-menu flex max-h-[70dvh] flex-col gap-3 overflow-y-auto px-3 pb-3 pt-2 text-white sm:px-4"
          >
            <div className="flex items-center gap-2">
              <img src={mecanicaEspecialIcon} alt="" className="h-8 w-8 rounded-lg object-cover" />
              <h2 className="min-w-0 flex-1 truncate text-base font-bold">
                {t.eventsTitle || 'Eventos y mecánicas especiales'}
              </h2>
            </div>

            {showCoreContent && selectedExpansions.includes('dark_world') && (
              <div data-testid="eternal-darkness-toggle" className="rounded-xl border border-violet-800/60 bg-violet-950/30 p-2">
                <p className="text-xs font-bold text-violet-100">{t.eternalDarknessTitle || 'Ocuridad Eterna'}</p>
                <p className="mt-1 text-[0.6rem] text-violet-200/80">
                  {t.eternalDarknessDescription || 'Todas las casillas están bajo Oscuridad. Los enemigos invocados ganan +2 al Ataque.'}
                </p>
                <button
                  type="button"
                  aria-pressed={eternalDarknessActive}
                  onClick={() => setEternalDarknessActive((prev) => !prev)}
                  className={`mt-2 min-h-9 rounded-lg px-3 text-xs font-bold text-white ${
                    eternalDarknessActive ? 'bg-violet-600 hover:bg-violet-500' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {eternalDarknessActive
                    ? (t.eternalDarknessDisable || 'Desactivar Ocuridad Eterna')
                    : (t.eternalDarknessEnable || 'Activar Ocuridad Eterna')}
                </button>
              </div>
            )}

            {showCoreContent && (
              <div data-testid="host-monster-toggle" className="rounded-xl border border-indigo-800/60 bg-indigo-950/30 p-2">
                <p className="text-xs font-bold text-indigo-100">{t.hostMonsterTitle || 'Monstruo Huésped'}</p>
                <p className="mt-1 text-[0.6rem] text-indigo-200/80">
                  {t.hostMonsterSummary || 'Al derrotar un monstruo se roba 1 Runa si es pequeño y 2 si es Grande.'}
                </p>
                <button
                  type="button"
                  aria-pressed={huespedActivo}
                  onClick={huespedActivo ? desactivaHuesped : activaHuesped}
                  className={`mt-2 min-h-9 rounded-lg px-3 text-xs font-bold text-white ${
                    huespedActivo ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {huespedActivo
                    ? (t.desactivaHuesped || 'Desactivar Monstruo Huésped')
                    : (t.activaHuesped || 'Activar Monstruo Huésped')}
                </button>
              </div>
            )}

            {showCoreContent && (
              <div className="rounded-xl border border-fuchsia-800/60 bg-fuchsia-950/30 p-2">
                <p className="text-xs font-bold text-fuchsia-100">{t.buriedSurpriseTitle || 'Sorpresa Enterrada'}</p>
                <p className="mt-1 line-clamp-2 text-[0.6rem] text-fuchsia-200/80">
                  {t.buriedSurpriseDescription || 'Baraja de 5 cartas de Sorpresa Enterrada del juego base.'}
                </p>
                {!sorpresaEvent.active ? (
                  <button
                    type="button"
                    onClick={addSorpresaEvent}
                    className="mt-3 min-h-9 rounded-lg bg-fuchsia-700 px-3 text-xs font-bold text-white hover:bg-fuchsia-600"
                  >
                    ➕ {t.addBuriedSurprise || 'Añadir Sorpresa Enterrada'}
                  </button>
                ) : (
                  <div className="mt-3">
                    <span className="rounded-full border border-fuchsia-700 bg-slate-950/50 px-2 py-1 text-[0.65rem] text-fuchsia-100">
                      {t.erradenRemaining || 'Cartas restantes'}: {sorpresaEvent.deck.length}/5
                    </span>
                  </div>
                )}
              </div>
            )}

            {showAwakeningsContent && (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-amber-800/60 bg-amber-950/30 p-2">
              <p className="text-xs font-bold text-amber-100">
                {t.corruptShipDeck || 'PS del Navío Corrupto'}
              </p>
              {!corruptShipEvent.active ? (
                <button
                  type="button"
                  onClick={addCorruptShipEvent}
                  className="mt-2 min-h-9 rounded-lg bg-amber-700 px-3 text-xs font-bold text-white hover:bg-amber-600"
                >
                  ➕ {t.addCorruptShip || 'Añadir PS del Navío Corrupto'}
                </button>
              ) : (
                <div className="mt-2">
                  <span className="rounded-full border border-amber-700 bg-slate-950/50 px-2 py-1 text-[0.65rem]">
                    {t.erradenRemaining || 'Cartas restantes'}: {corruptShipEvent.deck.length}/6
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/30 p-2">
              <p className="text-xs font-bold text-cyan-100">
                {t.swanShipDeck || 'PS del Buque Cisne'}
              </p>
              {!swanShipEvent.active ? (
                <button
                  type="button"
                  onClick={addSwanShipEvent}
                  className="mt-2 min-h-9 rounded-lg bg-cyan-700 px-3 text-xs font-bold text-white hover:bg-cyan-600"
                >
                  ➕ {t.addSwanShip || 'Añadir PS del Buque Cisne'}
                </button>
              ) : (
                <div className="mt-2">
                  <span className="rounded-full border border-cyan-700 bg-slate-950/50 px-2 py-1 text-[0.65rem]">
                    {t.erradenRemaining || 'Cartas restantes'}: {swanShipEvent.deck.length}/6
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-amber-800/60 bg-amber-950/30 p-2">
              <p className="text-xs font-bold text-amber-100">{t.siegeTitle || 'Asedio de Limiternia'}</p>
              <p className="mt-1 line-clamp-2 text-[0.6rem] text-amber-200/80">
                {t.siegeDescription || 'Baraja de 10 cartas que se roban en orden y se resuelven al final de la ronda.'}
              </p>
              {!siegeEvent.active ? (
                <button
                  type="button"
                  onClick={addSiegeEvent}
                  className="mt-3 min-h-9 rounded-lg bg-amber-700 px-3 text-xs font-bold text-white hover:bg-amber-600"
                >
                  ➕ {t.siegeAdd || 'Añadir Asedio de Limiternia'}
                </button>
              ) : (
                <div className="mt-3">
                  <span className="rounded-full border border-amber-700 bg-slate-950/50 px-2 py-1 text-[0.65rem] text-amber-100">
                    {t.siegeRemaining || 'Cartas restantes'}: {siegeEvent.deck.length}/10
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-fuchsia-800/60 bg-fuchsia-950/30 p-2">
              <p className="text-xs font-bold text-fuchsia-100">
                {t.erradenTitle || 'Sorpresa de Eradren'}
              </p>
              <p className="mt-1 line-clamp-2 text-[0.6rem] text-fuchsia-200/80">
                {t.erradenDescription || 'Mazo de 6 cartas que se barajan y se descartan al salir.'}
              </p>

              {!erradenEvent.active ? (
                <button
                  type="button"
                  onClick={addErradenEvent}
                  className="mt-3 min-h-9 rounded-lg bg-fuchsia-700 px-3 text-xs font-bold text-white hover:bg-fuchsia-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
                >
                  ➕ {t.addErraden || 'Añadir Sorpresa de Eradren'}
                </button>
              ) : (
                <div className="mt-3">
                  <span className="rounded-full border border-fuchsia-700 bg-slate-950/50 px-2 py-1 text-[0.65rem] text-fuchsia-100">
                    {t.erradenRemaining || 'Cartas restantes'}: {erradenEvent.deck.length}/6
                  </span>
                </div>
              )}
            </div>
            </div>
            )}
            <RiskZone
              id="events-riesgo"
              title={t.riskZone || 'Zona de riesgo'}
              hint={t.riskZoneHint || 'Estas acciones no se pueden deshacer.'}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {sorpresaEvent.active && (
                  <div className="rounded-xl border border-red-900/60 bg-slate-950/50 p-2">
                    <p className="mb-1 text-xs font-semibold text-red-200">{t.buriedSurpriseTitle || 'Sorpresa Enterrada'}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={addSorpresaEvent} className="min-h-8 rounded bg-slate-700 px-2 text-[0.65rem] font-bold text-white hover:bg-slate-600">{t.resetDeck || 'Reiniciar mazo'}</button>
                      <button type="button" onClick={resetSorpresaEvent} className="min-h-8 rounded bg-red-900 px-2 text-[0.65rem] font-bold text-white hover:bg-red-800">{t.removeDeck || 'Quitar'}</button>
                    </div>
                  </div>
                )}
                {corruptShipEvent.active && (
                  <div className="rounded-xl border border-red-900/60 bg-slate-950/50 p-2">
                    <p className="mb-1 text-xs font-semibold text-red-200">{t.corruptShipDeck || 'PS del Navío Corrupto'}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={addCorruptShipEvent} className="min-h-8 rounded bg-slate-700 px-2 text-[0.65rem] font-bold text-white hover:bg-slate-600">{t.resetDeck || 'Reiniciar mazo'}</button>
                      <button type="button" onClick={resetCorruptShipEvent} className="min-h-8 rounded bg-red-900 px-2 text-[0.65rem] font-bold text-white hover:bg-red-800">{t.removeDeck || 'Quitar'}</button>
                    </div>
                  </div>
                )}
                {swanShipEvent.active && (
                  <div className="rounded-xl border border-red-900/60 bg-slate-950/50 p-2">
                    <p className="mb-1 text-xs font-semibold text-red-200">{t.swanShipDeck || 'PS del Buque Cisne'}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={addSwanShipEvent} className="min-h-8 rounded bg-slate-700 px-2 text-[0.65rem] font-bold text-white hover:bg-slate-600">{t.resetDeck || 'Reiniciar mazo'}</button>
                      <button type="button" onClick={resetSwanShipEvent} className="min-h-8 rounded bg-red-900 px-2 text-[0.65rem] font-bold text-white hover:bg-red-800">{t.removeDeck || 'Quitar'}</button>
                    </div>
                  </div>
                )}
                {siegeEvent.active && (
                  <div className="rounded-xl border border-red-900/60 bg-slate-950/50 p-2">
                    <p className="mb-1 text-xs font-semibold text-red-200">{t.siegeTitle || 'Asedio de Limiternia'}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={addSiegeEvent} className="min-h-8 rounded bg-slate-700 px-2 text-[0.65rem] font-bold text-white hover:bg-slate-600">{t.resetDeck || 'Reiniciar mazo'}</button>
                      <button type="button" onClick={resetSiegeEvent} className="min-h-8 rounded bg-red-900 px-2 text-[0.65rem] font-bold text-white hover:bg-red-800">{t.removeDeck || 'Quitar'}</button>
                    </div>
                  </div>
                )}
                {erradenEvent.active && (
                  <div className="rounded-xl border border-red-900/60 bg-slate-950/50 p-2">
                    <p className="mb-1 text-xs font-semibold text-red-200">{t.erradenTitle || 'Sorpresa de Eradren'}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={addErradenEvent} className="min-h-8 rounded bg-slate-700 px-2 text-[0.65rem] font-bold text-white hover:bg-slate-600">{t.resetDeck || 'Reiniciar mazo'}</button>
                      <button type="button" onClick={resetErradenEvent} className="min-h-8 rounded bg-red-900 px-2 text-[0.65rem] font-bold text-white hover:bg-red-800">{t.removeDeck || 'Quitar'}</button>
                    </div>
                  </div>
                )}
              </div>
            </RiskZone>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMenu === 'scenes' && (
          <motion.div
            id="track-menu-scenes"
            role="region"
            aria-label={t.scenesMenu || 'Escenas'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="menu-panel layer-menu flex max-h-[70dvh] flex-col gap-3 overflow-y-auto px-3 pb-3 pt-2 text-white sm:px-4"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-900/60 text-amber-200">
                <GiStoneTower size={20} />
              </span>
              <h2 className="text-base font-bold">{t.scenesTitle || 'Escenas'}</h2>
            </div>
            <div className="space-y-2">
              {sceneGroups.map((group) => {
                const theme = getSceneGroupTheme(group.key);
                const collapsed = !expandedSceneGroups[group.key];
                const groupLabel = group.key === 'base'
                  ? (t.sceneGroupBase || 'Juego base')
                  : group.key === 'awakenings'
                    ? (t.sceneGroupAwakenings || 'Despertar')
                    : (translations.expansions?.[group.key] || group.key);
                const groupImage = group.key === 'awakenings'
                  ? EXPANSIONS.find((expansion) => expansion.id === 'apocalypse_awakenings')?.imagen
                  : EXPANSIONS.find((expansion) => expansion.id === group.key)?.imagen;
                const firstBadge = getSceneBadge(group.scenes[0], 0);
                const lastBadge = getSceneBadge(group.scenes[group.scenes.length - 1], group.scenes.length - 1);
                const groupRange = firstBadge === lastBadge ? firstBadge : `${firstBadge}–${lastBadge}`;
                return (
                  <section
                    key={group.key}
                    data-testid={`scene-group-${group.key}`}
                    data-scene-group={group.key}
                    className={`rounded-xl border p-1.5 ${theme.header}`}
                  >
                    <button
                      type="button"
                      aria-expanded={!collapsed}
                      aria-controls={`scene-group-content-${group.key}`}
                      onClick={() => setExpandedSceneGroups((prev) => ({ ...prev, [group.key]: !prev[group.key] }))}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1 text-left"
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        {groupImage && (
                          <img src={groupImage} alt="" loading="lazy" decoding="async" className="h-10 w-16 shrink-0 rounded-lg object-cover shadow" />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-extrabold tracking-wide">{groupLabel}</span>
                          <span className="mt-0.5 block text-[0.58rem] font-semibold uppercase tracking-wider opacity-75">
                            {group.scenes.length} escenas · {groupRange}
                          </span>
                        </span>
                      </span>
                      <span aria-hidden="true" className="shrink-0 text-lg font-bold opacity-80">{collapsed ? '▸' : '▾'}</span>
                    </button>
                    {!collapsed && (
                      <div id={`scene-group-content-${group.key}`} className="mt-1 grid grid-cols-1 gap-1 pl-2 sm:grid-cols-2 xl:grid-cols-3">
                        {group.scenes.map((scene, sceneIndex) => {
                          const rawTitle = t[scene.titleKey] || scene.titleEn;
                          const sceneTitle = group.key === 'base' || group.key === 'awakenings'
                            ? rawTitle
                            : rawTitle.includes('·')
                              ? rawTitle.split('·').slice(1).join('·').trim()
                              : rawTitle;
                          const badge = getSceneBadge(scene, sceneIndex);
                          return (
                            <div
                              key={scene.id}
                              data-testid={`scene-${scene.id}`}
                              className={`group relative flex min-h-9 items-start gap-2 rounded-lg border px-2 py-1.5 transition hover:border-white/50 hover:brightness-110 ${theme.card}`}
                            >
                              <button
                                type="button"
                                aria-label={`${sceneTitle} · ${t.activateChapter || 'Activar capítulo'}`}
                                title={sceneTitle}
                                onClick={() => activateScene(scene)}
                                className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                              />
                              <span className={`relative z-0 mt-0.5 inline-flex h-5 min-w-7 shrink-0 items-center justify-center rounded-md bg-white/10 px-1 text-[0.52rem] font-black tabular-nums ${theme.title}`}>
                                {badge}
                              </span>
                              <span className={`relative z-0 min-w-0 flex-1 whitespace-normal break-words text-[0.68rem] font-semibold leading-snug ${theme.title}`}>
                                {sceneTitle}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

      <SceneFollowerDialog
        open={sceneFollowerOpen}
        missing={sceneMissing}
        values={sceneFollowerValues}
        onChange={(key, value) => setSceneFollowerValues((prev) => ({ ...prev, [key]: value }))}
        onConfirm={confirmSceneFollowers}
        onCancel={() => setSceneFollowerOpen(false)}
        labels={{
          title: t.sceneFollowersTitle || 'Seguidores de la escena',
          description: t.sceneFollowersDescription || 'Elige el estado con el que se añaden Vorn y Elros.',
          confirm: t.sceneFollowersConfirm || 'Añadir seguidores',
          cancel: t.close || 'Cancelar',
        }}
      />

      <SceneFollowerSelectionDialog
        open={Boolean(sceneFollowerSelection)}
        count={sceneFollowerSelection?.count || 0}
        options={sceneFollowerSelection?.options || []}
        selected={sceneFollowerSelection?.selected || []}
        onToggle={(followerId) => setSceneFollowerSelection((prev) => {
          if (!prev) return prev;
          const selected = prev.selected.includes(followerId)
            ? prev.selected.filter((id) => id !== followerId)
            : (prev.selected.length < prev.count ? [...prev.selected, followerId] : prev.selected);
          return { ...prev, selected };
        })}
        onConfirm={confirmSceneFollowerSelection}
        onClose={() => setSceneFollowerSelection(null)}
        labels={{
          title: t.sceneFollowerSelectionTitle || 'Elegir seguidores',
          description: t.sceneFollowerSelectionDescription || 'Elige los seguidores que acompañan al grupo.',
          confirm: t.sceneFollowersConfirm || 'Añadir seguidores',
          cancel: t.close || 'Cancelar',
        }}
      />

      {/* Los avisos de fichas se muestran una sola vez desde InitTracker,
          que ya incluye la región aria-live y el cierre funcional. */}

      <ConfirmDialog
        open={Boolean(pendingRuneAction)}
        title={pendingRuneCopy?.title}
        description={pendingRuneCopy?.description}
        confirmLabel={pendingRuneCopy?.confirm}
        cancelLabel={translations.trackerSelect?.cancel || 'Cancelar'}
        onCancel={() => setPendingRuneAction(null)}
        onConfirm={confirmRuneAction}
      />
    </>
  );
};

export default TopMenu;
