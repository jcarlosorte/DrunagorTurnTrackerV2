import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { RiArrowTurnBackLine, RiArrowTurnForwardLine } from 'react-icons/ri';
import { useLanguage } from '@/context/LanguageContext';
import { useTracker } from '@/context/TrackerContext';
import { useInitRunes } from '@/context/initRunesContext';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
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
export default function RuneCard({ rune, onRemove }) {
  const { translations } = useLanguage();
  const { trackerData } = useTracker();
  const { toggleRuneEffect } = useInitRunes();
  const [estadosLocal, setEstadosLocal] = useState(rune?.estadosAlterados || []);
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

  useEffect(() => {
    setEstadosLocal(rune?.estadosAlterados ? [...rune.estadosAlterados] : []);
  }, [rune?.estadosAlterados]);

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
        className="relative block w-full overflow-hidden rounded-xl border border-black/40 text-left shadow-md transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        style={{ aspectRatio: '756 / 1087' }}
        aria-label={`${title}${rune.cara ? ` · ${ti.cara || 'Cara'} ${rune.cara}` : ''}`}
      >
        <img src={background} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
        <span className="absolute inset-x-0 top-0 flex flex-col items-center px-2 pt-2 text-center">
          <span className="text-[0.62rem] font-black uppercase leading-tight text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] sm:text-[0.72rem]">
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
                <h2 id={`rune-title-${rune.uuid}`} className="mt-1 truncate text-xl font-black text-slate-50">
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

              {estadosLocal.filter((estado) => estado.count > 0).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {estadosLocal.filter((estado) => estado.count > 0).map((estado) => {
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

            <div className="grid grid-cols-3 items-center gap-2 border-t border-slate-700/80 px-5 py-3">
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
        </div>,
        document.body
      )}
    </div>
  );
}
