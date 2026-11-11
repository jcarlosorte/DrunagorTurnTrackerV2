import { useState } from 'react';
import { createPortal } from 'react-dom';
import { GiCannon } from 'react-icons/gi';
import { useGame } from '@/context/GameContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import { useTracker } from '@/context/TrackerContext';
import { useInitRunes } from '@/context/initRunesContext';
import { applyBossRuneEffect } from '@/utils/bossRunes';
import { getCannonShotTimeTokens } from '@/utils/soulHarvester';
import { appendGameLog } from '@/utils/gameLog';

const SHOT_COLORS = [
  { id: 'rojo', label: 'Rojo', className: 'bg-red-600 hover:bg-red-500', condition: 'HEMORRAGIA_I', count: 2 },
  { id: 'amarillo', label: 'Amarillo', className: 'bg-yellow-500 text-slate-950 hover:bg-yellow-400', condition: 'QUEMADURA_I', count: 2 },
  { id: 'verde', label: 'Verde', className: 'bg-emerald-600 hover:bg-emerald-500', condition: 'VENENO_I', count: 2 },
  { id: 'azul', label: 'Azul', className: 'bg-blue-600 hover:bg-blue-500', condition: 'ATURDIMIENTO_I', count: 1 },
];

export default function CannonShotControl({ onEndRound, className = '', labels = {}, compact = false }) {
  const { magicCannons, setMagicCannonLoaded } = useGame();
  const { placedEnemies, setPlacedEnemies } = useInitEnemies();
  const { trackerData } = useTracker();
  const { placedRunes, setRuneEstadoCount } = useInitRunes();
  const [open, setOpen] = useState(false);

  const bossEntry = placedEnemies.find((entry) => entry.enemy?.id === 'soul_harvester_boss');
  if (!bossEntry) return null;

  const loadedCannons = magicCannons.filter((cannon) => cannon.loaded);
  const canShoot = loadedCannons.length > 0;

  const fire = (colorId) => {
    const color = SHOT_COLORS.find((item) => item.id === colorId);
    if (!color || !canShoot) return;

    loadedCannons.forEach((cannon) => setMagicCannonLoaded(cannon.id, false));

    const withRune = applyBossRuneEffect(bossEntry.enemy, colorId);
    const estados = [...(withRune.estadosAlterados || [])];
    const index = estados.findIndex((estado) => estado.id === color.condition);
    const nextCount = color.id === 'azul' ? 1 : (estados[index]?.count || 0) + color.count;
    if (index === -1) estados.push({ id: color.condition, count: nextCount });
    else estados[index] = { ...estados[index], count: nextCount };
    const updated = {
      ...withRune,
      vida: Math.max(0, (withRune.vida || 0) - 5),
      estadosAlterados: estados,
    };

    const heroCount = trackerData.placedHeroes?.length || trackerData.heroes?.length || 0;
    const timeTokens = getCannonShotTimeTokens(heroCount);
    const furia = placedRunes.find((entry) => entry.rune.id === 'runa_despertar_furia');
    if (furia) {
      const currentTime = (furia.rune.estadosAlterados || []).find((estado) => estado.id === 'TIEMPO')?.count || 0;
      setRuneEstadoCount(furia.rune.uuid, 'TIEMPO', Math.min(4, currentTime + timeTokens.rune));
    }
    const bossTimeIndex = updated.estadosAlterados.findIndex((estado) => estado.id === 'TIEMPO');
    if (bossTimeIndex === -1) updated.estadosAlterados.push({ id: 'TIEMPO', count: timeTokens.boss });
    else {
      updated.estadosAlterados[bossTimeIndex] = {
        ...updated.estadosAlterados[bossTimeIndex],
        count: Math.min(4, (updated.estadosAlterados[bossTimeIndex].count || 0) + timeTokens.boss),
      };
    }

    setPlacedEnemies((prev) => prev.map((entry) => (
      entry.enemy.uuid === bossEntry.enemy.uuid ? { ...entry, enemy: updated } : entry
    )));

    appendGameLog(
      'event',
      `💥 Disparo de Cañón (${color.label}): se descargan ${loadedCannons.length} cañones, el Cosechador cambia a la runa ${color.label}, pierde 5 de vida y recibe ${color.condition} ${color.count}. Se añaden ${timeTokens.rune} Fichas de Tiempo a Furia y ${timeTokens.boss} al Cosechador. Se termina la ronda.`,
    );
    setOpen(false);
    onEndRound?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (canShoot) setOpen(true);
        }}
        disabled={!canShoot}
        aria-label={labels.cannonShot || 'Disparo de Cañón'}
        title={canShoot
          ? (labels.cannonShot || 'Disparo de Cañón')
          : (labels.cannonShotDisabled || 'No hay cañones mágicos cargados')}
        className={`inline-flex items-center justify-center gap-1 rounded-full border text-[0.6rem] font-black shadow-lg transition ${
          canShoot
            ? 'border-amber-200 bg-amber-600 text-white hover:bg-amber-500'
            : 'cursor-not-allowed border-slate-500 bg-slate-800 text-slate-400 opacity-60'
        } ${compact ? 'h-7 w-7 p-0' : 'px-2 py-1'} ${className}`}
      >
        <GiCannon className={compact ? 'text-base' : 'text-sm'} />
        {!compact && <span>{labels.cannonShot || 'Disparo de Cañón'}</span>}
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={labels.cannonShot || 'Disparo de Cañón'}
            className="w-full max-w-md rounded-2xl border-2 border-amber-600 bg-slate-900 p-5 text-slate-100 shadow-2xl"
          >
            <h2 className="text-xl font-black text-amber-100">{labels.cannonShot || 'Disparo de Cañón'}</h2>
            <p className="mt-1 text-sm text-slate-300">
              {labels.cannonShotColor || 'Elige el color del cubo de acción.'}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {SHOT_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => fire(color.id)}
                  className={`min-h-14 rounded-xl px-4 text-base font-bold text-white ${color.className}`}
                >
                  {color.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 min-h-10 w-full rounded-lg bg-slate-700 text-sm font-bold text-white hover:bg-slate-600"
            >
              {labels.cancel || 'Cancelar'}
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
