import { useEffect, useRef, useState } from 'react';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import { getHeroExtras } from '@/utils/heroExtras';
import useFocusTrap from '@/hooks/useFocusTrap';
import './dice.css';

const TRAMPA_FACES = [
  { kind: 'blank', label: { es: 'Sin efecto', en: 'No effect' } },
  { kind: 'blank', label: { es: 'Sin efecto', en: 'No effect' } },
  { kind: 'estado', id: 'VENENO_I', count: 2, label: { es: 'Veneno 2', en: 'Poison 2' } },
  { kind: 'estado', id: 'LENTITUD_I', count: 2, label: { es: 'Lentitud 2', en: 'Slow 2' } },
  { kind: 'estado', id: 'QUEMADURA_I', count: 2, label: { es: 'Quemadura 2', en: 'Burn 2' } },
  { kind: 'estado', id: 'HEMORRAGIA_I', count: 2, label: { es: 'Hemorragia 2', en: 'Bleeding 2' } },
];

const randomD20 = () => Math.floor(Math.random() * 20) + 1;

export default function DiceRoller({ open, onClose, heroes = [], currentEntity, onApplyEstado, labels = {} }) {
  const [mode, setMode] = useState('d20');
  const [rolling, setRolling] = useState(false);
  const [d20, setD20] = useState(null);
  const [trampa, setTrampa] = useState(null);
  const [heroId, setHeroId] = useState('');
  const [reel, setReel] = useState(1);
  const timerRef = useRef(null);
  const dialogRef = useRef(null);

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  if (!open) return null;

  const selectedHero = heroes.find((hero) => hero.id === heroId);
  const modifier = selectedHero ? getHeroExtras(selectedHero.id).impactoMod || 0 : 0;
  const total = d20 === null ? null : d20 + modifier;

  const rollD20 = () => {
    setRolling(true);
    setD20(null);
    let ticks = 0;
    window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      ticks += 1;
      setReel(randomD20());
      if (ticks >= 12) {
        window.clearInterval(timerRef.current);
        const value = randomD20();
        setD20(value);
        setReel(value);
        setRolling(false);
      }
    }, 65);
  };

  const rollTrampa = () => {
    setRolling(true);
    setTrampa(null);
    let ticks = 0;
    window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      ticks += 1;
      setReel(Math.floor(Math.random() * 6) + 1);
      if (ticks >= 12) {
        window.clearInterval(timerRef.current);
        const index = Math.floor(Math.random() * 6);
        setTrampa(index);
        setReel(index + 1);
        setRolling(false);
      }
    }, 65);
  };

  const face = trampa === null ? null : TRAMPA_FACES[trampa];
  const faceEstado = face?.kind === 'estado'
    ? ESTADOS_ALTERADOS.find((item) => item.id === face.id)
    : null;

  const canApply = face?.kind === 'estado' && currentEntity && (
    (currentEntity.type === 'hero' && currentEntity.id) ||
    (currentEntity.type === 'enemy' && currentEntity.uuid)
  );

  return (
    <div className="layer-modal fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        role="dialog"
        ref={dialogRef}
        aria-modal="true"
        aria-label={labels.title || 'Dados'}
        className="modal-enter relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-slate-600 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-600 via-emerald-500 to-amber-500" aria-hidden="true" />

        <header className="flex items-center justify-between gap-2 px-3 py-2">
          <h2 className="text-base font-bold text-white">{labels.title || 'Dados'}</h2>
          <div className="flex rounded-xl border border-slate-700 bg-slate-950 p-0.5">
            <button
              type="button"
              onClick={() => setMode('d20')}
              aria-pressed={mode === 'd20'}
              className={`min-h-8 rounded-lg px-3 text-xs font-bold transition ${
                mode === 'd20' ? 'bg-sky-700 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              d20
            </button>
            <button
              type="button"
              onClick={() => setMode('trampa')}
              aria-pressed={mode === 'trampa'}
              className={`min-h-8 rounded-lg px-3 text-xs font-bold transition ${
                mode === 'trampa' ? 'bg-amber-700 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {labels.trapDie || 'Trampa'}
            </button>
          </div>
        </header>

        <div className="px-3 pb-2">
          {mode === 'd20' ? (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className={`dice-face dice-d20 ${rolling ? 'is-rolling' : ''}`} aria-live="polite">
                  <span className="dice-value">{rolling ? reel : (d20 ?? '?')}</span>
                </div>

                <label className="flex w-full items-center gap-2 text-xs text-slate-300">
                  <span className="shrink-0">{labels.addModifier || 'Sumar modificador de'}</span>
                  <select
                    value={heroId}
                    onChange={(event) => setHeroId(event.target.value)}
                    className="min-h-9 min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-950 px-2 text-xs text-white"
                  >
                    <option value="">{labels.noModifier || 'Ninguno (tirada genérica)'}</option>
                    {heroes.map((hero) => (
                      <option key={hero.id} value={hero.id}>{hero.name}</option>
                    ))}
                  </select>
                </label>

                {d20 !== null && (
                  <p className="text-center text-sm font-semibold text-white">
                    {d20}
                    {modifier !== 0 && <span className="text-emerald-300"> {modifier > 0 ? '+' : '−'} {Math.abs(modifier)}</span>}
                    {' = '}
                    <span className="text-lg font-black text-emerald-300">{total}</span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={rollD20}
                className="mt-3 min-h-11 w-full rounded-xl bg-gradient-to-b from-sky-500 to-sky-700 text-sm font-bold text-white shadow-lg shadow-sky-950/40 transition hover:from-sky-400 hover:to-sky-600"
              >
                🎲 {labels.roll || 'Tirar d20'}
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className={`dice-face dice-d6 ${rolling ? 'is-rolling' : ''}`} aria-live="polite">
                  {rolling ? (
                    <span className="dice-value">{reel}</span>
                  ) : faceEstado ? (
                    <img src={faceEstado.imagen} alt={face.label.es} className="h-10 w-10" loading="lazy" decoding="async" />
                  ) : face ? (
                    <span className="text-2xl">✕</span>
                  ) : (
                    <span className="dice-value">?</span>
                  )}
                </div>

                <p className="min-h-5 text-center text-sm font-semibold text-white">
                  {rolling
                    ? (labels.rolling || 'Girando…')
                    : face
                      ? (face.kind === 'blank' ? (labels.blankFace || 'Cara en blanco') : face.label.es)
                      : (labels.pressRoll || 'Pulsa para tirar')}
                </p>
              </div>

              <button
                type="button"
                onClick={rollTrampa}
                className="mt-3 min-h-11 w-full rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 text-sm font-bold text-white shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-600"
              >
                🎲 {labels.rollTrap || 'Tirar dado de trampa'}
              </button>

              {face?.kind === 'estado' && (
                <button
                  type="button"
                  disabled={!canApply}
                  onClick={() => onApplyEstado?.(face.id, face.count)}
                  className="mt-2 min-h-10 w-full rounded-xl border border-emerald-700 bg-emerald-900/60 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-800 disabled:opacity-40"
                >
                  {canApply
                    ? `${labels.applyTo || 'Aplicar al turno actual'} · ${face.label.es}`
                    : (labels.noActiveTurn || 'No hay un turno activo al que aplicarlo')}
                </button>
              )}
            </>
          )}
        </div>

        <footer className="flex justify-end border-t border-slate-700 bg-slate-950/70 px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-xl bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600"
          >
            {labels.close || 'Cerrar'}
          </button>
        </footer>
      </div>
    </div>
  );
}
