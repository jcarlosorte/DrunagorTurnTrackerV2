import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ENEMY_RING_COLORS } from '@/data/enemyRings';
import { ENEMY_RING_COLORS_BIG } from '@/data/enemyRingsBig';
import { useInitEnemies } from '@/context/InitEnemiesContext';

export default function EnemyRingControl({ enemy, labels = {} }) {
  const {
    placedEnemies,
    setPlacedEnemies,
    usedColors,
    setUsedColors,
    usedColorsBig,
    setUsedColorsBig,
    setEnemyColorMap,
  } = useInitEnemies();
  const { translations } = useLanguage();
  const [swapOpen, setSwapOpen] = useState(false);
  const [error, setError] = useState('');
  const [currentColor, setCurrentColor] = useState(enemy?.ringColor);

  useEffect(() => {
    setCurrentColor(enemy?.ringColor);
  }, [enemy?.uuid, enemy?.ringColor]);

  if (!enemy?.ringColor) return null;

  const isBig = enemy.size === 'grande';
  const colors = isBig ? ENEMY_RING_COLORS_BIG : ENEMY_RING_COLORS;
  const used = new Set(isBig ? usedColorsBig : usedColors);
  const available = colors.filter((color) => color.id !== currentColor && !used.has(color.id));
  const otherEnemies = placedEnemies.filter((entry) => (
    entry.enemy.uuid !== enemy.uuid
    && entry.enemy.ringColor
    && (entry.enemy.size === 'grande') === isBig
  ));

  const updateColor = (nextColor) => {
    if (isBig) {
      setUsedColorsBig((prev) => [...prev.filter((color) => color !== currentColor), nextColor]);
    } else {
      setUsedColors((prev) => [...prev.filter((color) => color !== currentColor), nextColor]);
    }
    setPlacedEnemies((prev) => prev.map((entry) => (
      entry.enemy.uuid === enemy.uuid
        ? { ...entry, enemy: { ...entry.enemy, ringColor: nextColor } }
        : entry
    )));
    setEnemyColorMap((prev) => ({ ...prev, [enemy.uuid]: nextColor }));
    setCurrentColor(nextColor);
    setSwapOpen(false);
    setError('');
  };

  const removeRing = () => {
    if (isBig) setUsedColorsBig((prev) => prev.filter((color) => color !== currentColor));
    else setUsedColors((prev) => prev.filter((color) => color !== currentColor));
    setPlacedEnemies((prev) => prev.map((entry) => (
      entry.enemy.uuid === enemy.uuid
        ? { ...entry, enemy: { ...entry.enemy, ringColor: null } }
        : entry
    )));
    setEnemyColorMap((prev) => {
      const next = { ...prev };
      delete next[enemy.uuid];
      return next;
    });
    setCurrentColor(null);
  };

  const swapWith = (otherUuid) => {
    const other = placedEnemies.find((entry) => entry.enemy.uuid === otherUuid)?.enemy;
    if (!other?.ringColor || (other.size === 'grande') !== isBig) {
      setError(labels.ringSizeMismatch || 'Solo se pueden intercambiar anillos del mismo tamaño.');
      return;
    }
    setPlacedEnemies((prev) => prev.map((entry) => {
      if (entry.enemy.uuid === enemy.uuid) {
        return { ...entry, enemy: { ...entry.enemy, ringColor: other.ringColor } };
      }
      if (entry.enemy.uuid === otherUuid) {
        return { ...entry, enemy: { ...entry.enemy, ringColor: currentColor } };
      }
      return entry;
    }));
    setEnemyColorMap((prev) => ({
      ...prev,
      [enemy.uuid]: other.ringColor,
      [otherUuid]: currentColor,
    }));
    setCurrentColor(other.ringColor);
    setSwapOpen(false);
    setError('');
  };

  return (
    <section className="mt-3 w-full rounded-xl border border-sky-800/70 bg-sky-950/40 p-2" aria-label={labels.ringManagement || 'Anillo del enemigo'}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-sky-200">
          {labels.ringManagement || 'Anillo'}
        </span>
        <span className="rounded bg-slate-900/70 px-2 py-0.5 text-[0.65rem] text-slate-200">
          {isBig ? (labels.ringBig || 'Grande') : (labels.ringSmall || 'Pequeño')}
        </span>
        <span className="ml-auto flex items-center gap-1 text-[0.7rem] font-semibold text-sky-100">
          <span className={`h-4 w-4 rounded-full border-2 border-white/70 ${colors.find((color) => color.id === currentColor)?.className || ''}`} />
          {colors.find((color) => color.id === currentColor)?.name || currentColor}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {available.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => updateColor(color.id)}
            title={color.name}
            aria-label={`${labels.ringChange || 'Cambiar a'} ${color.name}`}
            className={`h-7 w-7 rounded-full border-2 border-white/70 ${color.className}`}
          />
        ))}
        {available.length === 0 && (
          <span className="text-[0.65rem] text-slate-400">{labels.ringNoAvailable || 'No hay anillos disponibles'}</span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={removeRing}
          className="min-h-8 rounded-lg bg-red-900 px-2 text-[0.65rem] font-bold text-red-100 hover:bg-red-800"
        >
          {labels.ringRemove || 'Quitar anillo'}
        </button>
        <button
          type="button"
          onClick={() => setSwapOpen((prev) => !prev)}
          disabled={otherEnemies.length === 0}
          className="min-h-8 rounded-lg bg-slate-700 px-2 text-[0.65rem] font-bold text-white hover:bg-slate-600 disabled:opacity-40"
        >
          {labels.ringSwap || 'Intercambiar anillo'}
        </button>
      </div>

      {swapOpen && (
        <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
          <p className="text-[0.65rem] text-slate-300">{labels.ringSwapWith || 'Elige otro enemigo del mismo tamaño:'}</p>
          {otherEnemies.map((entry) => (
            <button
              key={entry.enemy.uuid}
              type="button"
              onClick={() => swapWith(entry.enemy.uuid)}
              className="flex w-full items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-left text-xs text-slate-100 hover:border-sky-500"
            >
              {entry.enemy.imagen && (
                <img src={entry.enemy.imagen} alt="" className="h-7 w-7 rounded object-cover" loading="lazy" />
              )}
              <span className="min-w-0 flex-1 truncate">
                {translations.enemies?.[entry.enemy.id] || entry.enemy.nombre || entry.enemy.id}
              </span>
              <span className={`h-3.5 w-3.5 rounded-full border border-white/70 ${colors.find((color) => color.id === entry.enemy.ringColor)?.className || ''}`} />
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-[0.65rem] text-red-300">{error}</p>}
    </section>
  );
}
