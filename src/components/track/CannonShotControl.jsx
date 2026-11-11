import { useState } from 'react';
import { GiCannon } from 'react-icons/gi';
import { useGame } from '@/context/GameContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import { applyBossRuneEffect } from '@/utils/bossRunes';
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
    setPlacedEnemies((prev) => prev.map((entry) => (
      entry.enemy.uuid === bossEntry.enemy.uuid ? { ...entry, enemy: updated } : entry
    )));

    appendGameLog(
      'event',
      `💥 Disparo de Cañón (${color.label}): se descargan ${loadedCannons.length} cañones, el Cosechador cambia a la runa ${color.label}, pierde 5 de vida y recibe ${color.condition} ${color.count}. Se termina la ronda.`,
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

      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={labels.cannonShot || 'Disparo de Cañón'}
            className="w-full max-w-sm rounded-2xl border-2 border-amber-600 bg-slate-900 p-4 text-slate-100 shadow-2xl"
          >
            <h2 className="text-lg font-black text-amber-100">{labels.cannonShot || 'Disparo de Cañón'}</h2>
            <p className="mt-1 text-xs text-slate-300">
              {labels.cannonShotColor || 'Elige el color del cubo de acción.'}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {SHOT_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => fire(color.id)}
                  className={`min-h-10 rounded-xl px-3 text-sm font-bold text-white ${color.className}`}
                >
                  {color.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 min-h-8 w-full rounded-lg bg-slate-700 text-xs font-bold text-white hover:bg-slate-600"
            >
              {labels.cancel || 'Cancelar'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
