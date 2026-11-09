import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { appNotify } from '@/utils/appDialogs';
import RompenodoDialog from '@/components/track/RompenodoDialog';

const KIND_LABELS = {
  pila: 'Pila',
  niebla: 'Nodo de Niebla',
  oscuridad: 'Nodo de Oscuridad',
};

export default function useRompenodo() {
  const {
    removeSingleTileFromPila,
    removeSingleTileFromPilaConcentrada,
    removeSingleTileFromNodoOscuridad,
    notifyRompenodo,
  } = useGame();
  const { trackerData } = useTracker();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  const [target, setTarget] = useState(null);

  const numHeroes = trackerData.placedHeroes?.length || trackerData.heroes?.length || 0;
  const totalToRemove = Math.max(0, 6 - numHeroes);

  const openRompenodo = (kind, pile) => {
    const tiles = Array.isArray(pile?.tiles) ? pile.tiles : [];
    const remaining = Math.min(totalToRemove, tiles.length);
    if (remaining <= 0) {
      appNotify(t.noRunasColocadas || 'No hay runas que retirar.');
      return;
    }
    const counts = tiles.reduce((acc, tile) => {
      acc[tile.runa] = (acc[tile.runa] || 0) + 1;
      return acc;
    }, {});
    setTarget({
      kind,
      id: pile.id,
      name: `${KIND_LABELS[kind] || kind} ${pile.numPila}`,
      counts,
      total: tiles.length,
      remaining,
      removed: 0,
    });
  };

  const removeByKind = (kind, id, color) => {
    if (kind === 'pila') return removeSingleTileFromPila(id, color);
    if (kind === 'niebla') return removeSingleTileFromPilaConcentrada(id, color);
    return removeSingleTileFromNodoOscuridad(id, color);
  };

  const pickColor = (color) => {
    if (!target) return;
    const removed = removeByKind(target.kind, target.id, color);
    if (!removed) return;

    const counts = { ...target.counts };
    counts[color] = Math.max(0, (counts[color] || 0) - 1);
    const total = Math.max(0, target.total - 1);
    const remaining = Math.max(0, target.remaining - 1);
    const removedCount = target.removed + 1;

    if (remaining <= 0 || total <= 0) {
      notifyRompenodo();
      setTarget(null);
      return;
    }
    setTarget({ ...target, counts, total, remaining, removed: removedCount });
  };

  const pickRandom = () => {
    if (!target) return;
    const colors = Object.entries(target.counts).filter(([, count]) => count > 0).map(([color]) => color);
    if (colors.length === 0) return;
    pickColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const close = () => {
    if (target?.removed > 0) notifyRompenodo();
    setTarget(null);
  };

  const rompenodoDialog = (
    <RompenodoDialog
      target={target}
      onPickColor={pickColor}
      onRandom={pickRandom}
      onClose={close}
      labels={{
        title: t.rompenodo || 'Rompenodo',
        remaining: t.runasPorRetirar || 'Runas por retirar',
        help: t.rompenodoAyuda || 'Elige el color de la runa que se retira o deja que sea aleatoria.',
        random: t.removeRandom || 'Aleatoria',
        close: t.dejarDeRomper || 'Dejar de romper',
        empty: t.emptyPila || 'No quedan runas en la pila.',
        colors: t.colores,
      }}
    />
  );

  return { openRompenodo, rompenodoDialog };
}
