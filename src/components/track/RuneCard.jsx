import { useState } from 'react';
import { createPortal } from 'react-dom';
import { RiArrowTurnBackLine, RiArrowTurnForwardLine } from 'react-icons/ri';
import { useLanguage } from '@/context/LanguageContext';
import { useTracker } from '@/context/TrackerContext';
import { useGame } from '@/context/GameContext';
import { useInitRunes } from '@/context/initRunesContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import { appendGameLog } from '@/utils/gameLog';
import { resolveSoulHarvesterTimeZero, getSoulHarvesterTime, formatEstadoAlterado } from '@/utils/soulHarvester';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import { RUNAS } from '@/data/runas';
import { RUNAS_DESPERTAR } from '@/data/runasDespertar';
import { INCURSION } from '@/data/incursion';
import { INCURSION_DESPERTAR } from '@/data/incursionDespertar';
import runeRed from '@/assets/runes/card.png';
import runeIndigo from '@/assets/runes/card-indigo.webp';
import runeBlue from '@/assets/runes/card-blue.webp';
import runeGreen from '@/assets/runes/card-green.webp';
import runePurple from '@/assets/runes/card-purple.webp';

const BACKGROUNDS = {
  runa: runeIndigo,
  asalto: runeBlue,
  defensa: runeGreen,
  incursion: runeRed,
  acecho: runePurple,
};

const TONES = {
  runa: { border: 'border-indigo-400', header: 'bg-indigo-500/10', text: 'text-indigo-200' },
  asalto: { border: 'border-sky-400', header: 'bg-sky-500/10', text: 'text-sky-200' },
  defensa: { border: 'border-green-400', header: 'bg-green-500/10', text: 'text-green-200' },
  incursion: { border: 'border-red-400', header: 'bg-red-500/10', text: 'text-red-200' },
  acecho: { border: 'border-purple-400', header: 'bg-purple-500/10', text: 'text-purple-200' },
};

/**
 * Carta de runa del track: solo título y cara. El resto de mecánicas se
 * resuelven en la vista ampliada.
 */
export default function RuneCard({ rune, onRemove, flipped = false }) {
  const { translations } = useLanguage();
  const { trackerData } = useTracker();
  const { magicCannons, setMagicCannonLoaded } = useGame();
  const { toggleRuneEffect, setRuneEstadoCount, setPlacedRunes } = useInitRunes();
  const { placedEnemies, setPlacedEnemies } = useInitEnemies();
  const [expanded, setExpanded] = useState(false);

  const tipo = rune.tipo;
  const applyEffect = rune.applyEffect !== false;
  const totalHeroes = trackerData.placedHeroes?.length || 0;
  const replacementValue = totalHeroes <= 2 ? '2' : totalHeroes <= 4 ? '3' : '4';
  const tone = TONES[tipo] || TONES.runa;
  const background = BACKGROUNDS[tipo] || BACKGROUNDS.runa;

  const ts = translations.scenarioCard || {};
  const ti = translations.trackerInit || {};
  const tea = translations.estadosAlterados || {};

  const isCaraB = rune.cara === 'B';
  const title = ts[rune.id] || rune.nombre || rune.id;
  const accion = ts[rune.accion];
  const accion2 = ts[rune.accion2];
  const y = ts.Y || 'Y';
  const nombre = ts[rune.nombre]?.replace('{x}', replacementValue) || rune.nombre;
  const actionLine = tipo === 'asalto'
    ? `${(isCaraB ? accion2 : accion) || ''} ${y}`.trim()
    : `${accion || ''} ${rune.numRunas || ''}`.trim();
  const estados = rune?.estadosAlterados || [];
  const tiempoConfig = ESTADOS_ALTERADOS.find((estado) => estado.id === 'TIEMPO');
  const tiempoEstado = estados.find((estado) => estado.id === 'TIEMPO');
  const tiempoCount = tiempoEstado?.count || 0;
  const setTiempo = (next) => {
    const max = tiempoConfig?.max || 4;
    setRuneEstadoCount(rune.uuid, 'TIEMPO', Math.max(0, Math.min(max, next)));
  };

  const reduceFuriaTime = () => {
    const nextTiempo = Math.max(0, tiempoCount - 1);
    setTiempo(nextTiempo);
    if (tiempoCount > 0 && nextTiempo === 0) {
      const unloaded = magicCannons.filter((cannon) => !cannon.loaded);
      unloaded.forEach((cannon) => setMagicCannonLoaded(cannon.id, true));
      if (unloaded.length > 0) {
        appendGameLog('event', `🔥 Furia del Cosechador: se recargan ${unloaded.length} cañones mágicos.`);
      }
    }
    const bossEntry = placedEnemies.find((entry) => entry.enemy?.id === 'soul_harvester_boss');
    if (!bossEntry || getSoulHarvesterTime(bossEntry.enemy) <= 0) return;
    const estados = [...(bossEntry.enemy.estadosAlterados || [])];
    const index = estados.findIndex((estado) => estado.id === 'TIEMPO');
    if (index === -1) estados.push({ id: 'TIEMPO', count: 0 });
    else estados[index] = { ...estados[index], count: Math.max(0, (estados[index].count || 0) - 1) };
    const decremented = { ...bossEntry.enemy, estadosAlterados: estados };
    const result = getSoulHarvesterTime(decremented) === 0
      ? resolveSoulHarvesterTimeZero(decremented)
      : { enemy: decremented, triggered: false };
    setPlacedEnemies((prev) => prev.map((entry) => (
      entry.enemy?.uuid === bossEntry.enemy.uuid ? { ...entry, enemy: result.enemy } : entry
    )));
    if (result.triggered) {
      const statesText = result.states.length > 0
        ? result.states.map((estado) => `${formatEstadoAlterado(estado.id, translations.estadosAlterados)} ×${estado.count}`).join(', ')
        : 'sin estados alterados';
      appendGameLog(
        'event',
        `⏳ Cosechador de Almas: Ficha de Tiempo a 0. Estados: ${statesText}. Pierde ${result.damage} de vida (${result.vidaAntes} → ${result.vidaDespues}). Se selecciona la runa gris.`,
      );
    }
  };

  const canFlip = tipo === 'runa' || tipo === 'incursion';
  const flipCard = () => {
    const source = tipo === 'runa'
      ? [...RUNAS, ...RUNAS_DESPERTAR]
      : [...INCURSION, ...INCURSION_DESPERTAR];
    const caraDestino = rune.cara === 'A' ? 'B' : 'A';
    const nueva = source.find((card) => card.id === rune.id && card.cara === caraDestino);
    if (!nueva) return;
    setPlacedRunes(prev => prev.map(item => (
      item.rune.uuid === rune.uuid
        ? { ...item, rune: { ...item.rune, ...nueva, cara: caraDestino } }
        : item
    )));
  };

  const renderMechanics = () => {
    if (tipo === 'asalto') {
      return (
        <div className="space-y-1 text-center">
          <div className="font-bold">{isCaraB ? accion2 : accion} {y}</div>
          <div className="font-bold">{isCaraB ? accion : accion2}</div>
        </div>
      );
    }

    if (rune.pasos?.length) {
      return (
        <div className="space-y-2 text-left">
          {rune.pasos.map((paso, index) => (
            <p key={`${rune.id}-${index}`} className="text-sm leading-relaxed text-slate-200">
              {paso}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-1 text-center">
        <div className="font-bold">{accion} {rune.numRunas || ''}</div>
        <div>{nombre}</div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={`relative block w-full overflow-hidden rounded-xl border border-black/40 text-left shadow-md transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${flipped ? 'card-flip' : ''}`}
        style={{ aspectRatio: '756 / 1087' }}
        aria-label={`${title}${rune.cara ? ` · ${ti.cara || 'Cara'} ${rune.cara}` : ''}`}
      >
        <img src={background} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
        <span className="absolute inset-x-0 top-0 flex flex-col items-center px-2 pt-2 text-center">
          <span className="w-full break-words text-center text-[0.62rem] font-black uppercase leading-tight text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] sm:text-[0.72rem]">
            {title}
          </span>
          {actionLine && (
            <span className="mt-0.5 text-[0.5rem] font-semibold leading-tight text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] sm:text-[0.55rem]">
              {actionLine}
            </span>
          )}
        </span>
        {rune.cara && (
          <span className="absolute inset-x-0 bottom-[8%] flex items-center justify-center gap-1 text-[0.6rem] font-black text-slate-800">
            <RiArrowTurnBackLine className="text-[0.6rem]" />
            {ti.cara || 'Cara'} {rune.cara}
            <RiArrowTurnForwardLine className="text-[0.6rem]" />
          </span>
        )}
        {tiempoCount > 0 && (
          <span className="absolute right-1 top-1 flex items-center gap-0.5 rounded-full bg-slate-950/85 px-1 py-0.5 text-[0.55rem] font-bold text-amber-100">
            {tiempoConfig?.imagen && <img src={tiempoConfig.imagen} alt="" className="h-3.5 w-3.5 rounded-full" />}
            {tiempoCount}
          </span>
        )}
      </button>

      {expanded && createPortal(
        <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`rune-title-${rune.uuid}`}
            className={`relative flex max-h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border bg-slate-900/95 text-slate-100 shadow-2xl ${tone.border}`}
          >
            <div className={`flex items-start gap-3 border-b border-slate-700/80 px-5 py-4 ${tone.header}`}>
              <div className="min-w-0">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-emerald-300">
                  {ti.runeCard || 'Carta de runa'}
                </p>
                <h2 id={`rune-title-${rune.uuid}`} className="mt-1 break-words text-center text-xl font-black text-slate-50">
                  {title}
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {tipo}
                  {rune.cara ? ` · ${ti.cara || 'Cara'} ${rune.cara}` : ''}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <div className={`rounded-xl border border-slate-700/80 bg-slate-950/60 p-4 text-sm ${tone.text}`}>
                {renderMechanics()}
              </div>

              {tipo === 'runa' && (
                <div className="rounded-xl border border-amber-700/60 bg-amber-950/25 p-3">
                  <div className="flex items-center gap-2">
                    {tiempoConfig?.imagen && (
                      <img src={tiempoConfig.imagen} alt="" className="h-5 w-5 rounded-full" />
                    )}
                    <span className="min-w-0 flex-1 text-xs font-bold uppercase tracking-wide text-amber-200">
                      {ti.gestionTiempo || 'Fichas de Tiempo'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTiempo(tiempoCount - 1)}
                      disabled={tiempoCount <= 0}
                      aria-label={ti.quitarTiempo || 'Quitar ficha de tiempo'}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-lg font-black text-white hover:bg-slate-600 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-lg font-black text-amber-100">{tiempoCount}</span>
                    <button
                      type="button"
                      onClick={() => setTiempo(tiempoCount + 1)}
                      aria-label={ti.anadirTiempo || 'Añadir ficha de tiempo'}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-700 text-lg font-black text-white hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2 text-[0.7rem] leading-relaxed text-amber-100/70">
                    {ti.tiempoCartaAyuda || 'Al llegar el turno de esta carta se retira 1 ficha de tiempo.'}
                  </p>
                  {rune.id === 'runa_despertar_furia' && (
                    <button
                      type="button"
                      onClick={reduceFuriaTime}
                      disabled={tiempoCount <= 0 && !placedEnemies.some((entry) => entry.enemy?.id === 'soul_harvester_boss')}
                      className="mt-2 min-h-8 w-full rounded-lg bg-amber-700 px-2 text-[0.65rem] font-bold text-white hover:bg-amber-600 disabled:opacity-40"
                    >
                      {ti.runaFuriaTime || 'Retirar 1 Ficha de Tiempo de esta carta y del Cosechador'}
                    </button>
                  )}
                </div>
              )}

              {estados.filter((estado) => estado.count > 0 && estado.id !== 'TIEMPO').length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {estados.filter((estado) => estado.count > 0 && estado.id !== 'TIEMPO').map((estado) => {
                    const estadoConfig = ESTADOS_ALTERADOS.find((item) => item.id === estado.id);
                    if (!estadoConfig) return null;
                    return (
                      <span key={estado.id} className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs text-slate-200">
                        <img src={estadoConfig.imagen} alt={estadoConfig.texto} className="h-5 w-5 rounded-full" />
                        {tea[estadoConfig.texto] || estadoConfig.texto} ×{estado.count}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-700/80 px-5 py-3">
              <button
                type="button"
                onClick={() => {
                  onRemove(rune.uuid);
                  setExpanded(false);
                }}
                className="justify-self-start min-h-9 rounded-lg border border-red-500/40 bg-red-950/40 px-3 text-xs font-bold text-red-200 transition hover:bg-red-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                {ti.eliminarRuna || 'Eliminar'}
              </button>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {canFlip && (
                  <button
                    type="button"
                    onClick={flipCard}
                    className="min-h-9 rounded-lg border border-purple-500/60 bg-purple-950/50 px-3 text-xs font-bold text-purple-100 transition hover:bg-purple-900/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                  >
                    🔄 {ti.voltearCarta || 'Voltear'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggleRuneEffect(rune.uuid)}
                  className={`justify-self-center min-h-9 rounded-lg border border-slate-600 bg-slate-800 px-3 text-xs font-bold transition hover:bg-slate-700 ${tone.text}`}
                >
                  {ti.applyEffect || 'Aplicar efecto'}: {applyEffect ? 'Sí' : 'No'}
                </button>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="justify-self-end min-h-9 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
