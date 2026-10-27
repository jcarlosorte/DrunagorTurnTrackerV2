import { ENEMY_RING_COLORS } from '@/data/enemyRings';
import { ENEMY_RING_COLORS_BIG } from '@/data/enemyRingsBig';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';
import { createContext, useContext, useEffect, useState } from 'react';
import { isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';
import { compactPlacedEnemies } from '@/utils/enemySanitize';
import { resolveEntityLabel } from '@/utils/entityLabel';
import { appendGameLog } from '@/utils/gameLog';

const InitEnemiesContext = createContext();

export const InitEnemiesProvider = ({ children }) => {
  const { translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const persisted = readJsonStorage('initEnemiesState', {}, isPlainObject);
  const [placedEnemies, setPlacedEnemies] = useState(() => persisted.placedEnemies || []);
  const [huespedActivo, setHuespedActivo] = useState(() => persisted.huespedActivo || false);
  const [acechoActivo, setAcechoActivo] = useState(() => persisted.acechoActivo || false);
  const [invadidosActivo, setInvadidosActivo] = useState(() => persisted.invadidosActivo || false);
  const [oscuridadActivo, setOscuridadActivo] = useState(() => persisted.oscuridadActivo || false);
  const [asaltoActivo, setAsaltoActivo] = useState(() => persisted.asaltoActivo || false);
  const [usedColors, setUsedColors] = useState(() => persisted.usedColors || []);
  const [usedColorsBig, setUsedColorsBig] = useState(() => persisted.usedColorsBig || []);
  const [enemyColorMap, setEnemyColorMap] = useState(() => persisted.enemyColorMap || {});
  const [avisos, setAvisos] = useState([]);

  useEffect(() => {
    writeJsonStorage('initEnemiesState', {
      // Compactado: evita que un enemigo con datos anidados infle la cuota.
      placedEnemies: compactPlacedEnemies(placedEnemies),
      huespedActivo,
      acechoActivo,
      invadidosActivo,
      oscuridadActivo,
      asaltoActivo,
      usedColors,
      usedColorsBig,
      enemyColorMap,
    });
  }, [
    placedEnemies, huespedActivo, acechoActivo, invadidosActivo,
    oscuridadActivo, asaltoActivo, usedColors, usedColorsBig, enemyColorMap,
  ]);
  
  const { handleTileDraw, drawMultipleTiles } = useGame();

  const activaHuesped = () => setHuespedActivo(true);
  const desactivaHuesped = () => setHuespedActivo(false);

  const activaAcecho = () => setAcechoActivo(true);
  const desactivaAcecho = () => setAcechoActivo(false);

  const activaInvadidos = () => setInvadidosActivo(true);
  const desactivaInvadidos = () => setInvadidosActivo(false);

  const activaOscuridad = () => setOscuridadActivo(true);
  const desactivaOscuridad = () => setOscuridadActivo(false);

  const activaAsalto = () => setAsaltoActivo(true);
  const desactivaAsalto = () => setAsaltoActivo(false);
  
  // Función para mostrar aviso
  const mostrarAviso = (mensaje) => {
    setAvisos((prev) => [...prev, { id: Date.now(), mensaje }]);
  };
  
  // Función para cerrar aviso manualmente
  const removeAviso = (id) => {
    setAvisos((prev) => prev.filter((a) => a.id !== id));
  };
  
  // Función para obtener un color libre
  const getNextAvailableColor = (isBig = false) => {
    const used = new Set(isBig ? usedColorsBig : usedColors);
    const source = isBig ? ENEMY_RING_COLORS_BIG : ENEMY_RING_COLORS;
    const next = source.find(c => !used.has(c.id));
    return next ? next.id : null;
  };
  
  // Función para asignar un color a un enemigo
  const assignColorToEnemy = (enemyUUID, isBig = false, forcedColor = false) => {
    const available = forcedColor || getNextAvailableColor(isBig);
    if (!available) {
      alert(ti.noColorsAvailable || 'No hay más colores disponibles');
      return undefined;
    }
  
    if (isBig) {
      setUsedColorsBig(prev => [...prev, available]);
    } else {
      setUsedColors(prev => [...prev, available]);
    }
    setEnemyColorMap(prev => ({ ...prev, [enemyUUID]: available }));
    return available;
  };
  // Función para liberar el color
  const releaseColor = (enemyUUID) => {
    const colorId = enemyColorMap[enemyUUID];
    if (!colorId) return;
  
    setUsedColors(prev => prev.filter(c => c !== colorId));
    setUsedColorsBig(prev => prev.filter(c => c !== colorId));
    setEnemyColorMap(prev => {
      const updated = { ...prev };
      delete updated[enemyUUID];
      return updated;
    });
  };
  
  const placeEnemy = (enemyWithPosition) => {
    setPlacedEnemies(prev => [...prev, enemyWithPosition]);

    // Historial: alta de enemigo (manual, aleatorio o invocado).
    const enemy = enemyWithPosition?.enemy || enemyWithPosition;
    const enemyId = enemy?.id;
    const name = resolveEntityLabel({ id: enemyId, name: enemy?.name || enemy?.nombre, translations }) || 'Enemigo';
    const color = translations.trackerInit?.colores?.[enemy?.color] || enemy?.color || '';
    appendGameLog('summon', `Aparece ${name}${color ? ` (${color})` : ''}`, {
      position: enemy?.position,
      runePosition: enemy?.runePosition,
    });
  };

  const removeEnemyAt = (position) => {
    //console.log('Removing enemy at position:', position);
    setPlacedEnemies(prev => {
      const updated = prev.filter(e => e.position !== position);
      //console.log('Updated placedEnemies after removal:', updated);
      return updated;
    });
  };

  const removeEnemyByUUID = (uuid) => {
    const target = placedEnemies.find((entry) => entry.enemy.uuid === uuid);
    if (!target) return;

    const { categoria } = target.enemy;
    const isCommander = categoria === 'comandante';
    const isOverlord = categoria === 'overlord';
    const isFallenHero = categoria === 'hero';
    const isBoss = categoria === 'jefe';
    const updated = placedEnemies.filter((entry) => {
      const enemy = entry.enemy;
      if (enemy.uuid === uuid) return false;
      if (isCommander && enemy.tipo === 'especial' && enemy.sourceEnemyUUID === uuid) return false;
      if (isOverlord && enemy.tipo === 'especial' && enemy.sourceEnemyUUID === uuid) return false;
      if (isFallenHero && (enemy.tipo === 'especial' || enemy.tipo === 'fallenHero') && enemy.sourceEnemyUUID === uuid) return false;
      if (isBoss && enemy.tipo === 'especial' && enemy.sourceEnemyUUID === uuid) return false;
      return true;
    });

    // Keep the state updater pure. React may invoke it more than once in StrictMode.
    setPlacedEnemies(updated);
    if (huespedActivo) {
      const cantidad = target.enemy.size === 'grande' ? 2 : 1;
      const tiles = drawMultipleTiles(cantidad);
      if (tiles && tiles.length > 0) {
        tiles.forEach(tile => handleTileDraw(tile));
      } else {
        mostrarAviso(ti.aviso);
      }
      mostrarAviso(`🐉 ${ti.robaHuesped}`);
    }
    if (acechoActivo) desactivaAcecho();
  };
  
  const resetPlacedEnemies = () => {
    setPlacedEnemies([]);
    setUsedColors([]);
    setUsedColorsBig([]);
    setEnemyColorMap({});
  };

  const resetEnemySession = () => {
    resetPlacedEnemies();
    setHuespedActivo(false);
    setAcechoActivo(false);
    setInvadidosActivo(false);
    setOscuridadActivo(false);
    setAsaltoActivo(false);
    setAvisos([]);
  };

  return (
    <InitEnemiesContext.Provider value={{ placedEnemies, setPlacedEnemies, placeEnemy, 
                                         removeEnemyAt, removeEnemyByUUID, resetPlacedEnemies, resetEnemySession, 
                                         assignColorToEnemy, releaseColor, usedColors, setUsedColors, 
                                         usedColorsBig, setUsedColorsBig, enemyColorMap, setEnemyColorMap, 
                                         huespedActivo, activaHuesped, desactivaHuesped, 
                                         activaAcecho, desactivaAcecho, acechoActivo,
                                         oscuridadActivo, activaOscuridad, desactivaOscuridad,
                                         asaltoActivo, activaAsalto, desactivaAsalto,
                                         activaInvadidos, desactivaInvadidos, invadidosActivo,
                                         avisos, mostrarAviso, removeAviso }}>
      {children}
    </InitEnemiesContext.Provider>
  );
};

export const useInitEnemies = () => {
  const context = useContext(InitEnemiesContext);
  if (!context) {
    throw new Error('useInitEnemies must be used within an InitEnemiesProvider');
  }
  return context;
};

