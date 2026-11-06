// ModalCommanderPC.jsx
import React, { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  COMMANDER_COLORS,
  COMMANDER_POSITIONS,
  buildCommanderDeckFromSelection,
  generateRandomCommanderDeck,
  getCommanderDeckForExpansion,
  getCommanderSlotCards,
} from '@/utils/commanderDeck';

const COLOR_LABELS = {
  naranja: 'Naranja',
  verde: 'Verde',
  azul: 'Azul',
  rojo: 'Rojo',
  gris: 'Gris',
};

const ModalCommanderPC = ({ commander, onConfirm, onCancel }) => {
  const [pcValue, setPcValue] = useState('');
  const [deckMode, setDeckMode] = useState('standard');
  const [manualDeck, setManualDeck] = useState(() => {
    const next = {};
    getCommanderDeckForExpansion(commander?.expansionId).forEach((card) => {
      next[`${card.rune}_${card.runePosition}`] = card.id;
    });
    return next;
  });
  const [error, setError] = useState('');
  const { translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const ts = translations.trackerSelect || {};
  const ta = translations.cartas_ataque || {};
  const inputRef = useRef(null);
  const titleId = useId();
  const inputId = useId();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const cardName = (card) => ta.nombre?.[card.id] || card.nombre || card.id;

  const buildManualDeck = () => buildCommanderDeckFromSelection(manualDeck);

  const buildRandomDeck = () => generateRandomCommanderDeck();

  const handleSubmit = () => {
    setError('');
    const parsed = parseInt(pcValue, 10);
    const nextPc = Number.isNaN(parsed) || parsed <= 0 ? 1 : parsed;

    if (deckMode === 'manual') {
      const deck = buildManualDeck();
      if (deck.length !== 10) {
        setError(ti.deckIncomplete || 'Completa una carta por cada color y posición (10 en total).');
        return;
      }
      onConfirm({ pcValue: nextPc, deck, mode: 'manual' });
      return;
    }

    if (deckMode === 'random') {
      const deck = buildRandomDeck();
      if (deck.length !== 10) {
        setError(ti.deckIncomplete || 'No hay cartas suficientes para completar la baraja.');
        return;
      }
      onConfirm({ pcValue: nextPc, deck, mode: 'random' });
      return;
    }

    onConfirm({ pcValue: nextPc, deck: null, mode: 'standard' });
  };

  const modeButtonClass = (mode) => (
    deckMode === mode
      ? 'border-sky-400 bg-sky-700 text-white'
      : 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
  );

  return (
    <div className="layer-dialog fixed inset-0 flex items-center justify-center bg-black/60 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-xl border border-slate-600 bg-slate-900 p-4 text-slate-100 shadow-2xl"
      >
        <h2 id={titleId} className="text-lg font-bold">{ti.PC || 'PC'}</h2>
        <p className="mt-1 text-xs text-slate-400">
          {ti.commanderDeck || 'Baraja de comandante'}
          {commander?.nombre ? ` · ${commander.nombre}` : ''}
        </p>

        <label htmlFor={inputId} className="mt-4 text-sm font-semibold">{ti.PC || 'PC'}</label>
        <input
          id={inputId}
          ref={inputRef}
          type="number"
          min="1"
          value={pcValue}
          onChange={(event) => setPcValue(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') handleSubmit(); }}
          className="mt-1 w-full rounded border border-slate-600 bg-slate-950 p-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        />

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">{ti.deckType || 'Tipo de baraja'}</legend>
          <div role="radiogroup" aria-label={ti.deckType || 'Tipo de baraja'} className="mt-2 grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              role="radio"
              aria-checked={deckMode === 'standard'}
              onClick={() => { setDeckMode('standard'); setError(''); }}
              className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold ${modeButtonClass('standard')}`}
            >
              {ti.deckStandard || 'Estandar (recomendada)'}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={deckMode === 'random'}
              onClick={() => { setDeckMode('random'); setError(''); }}
              className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold ${modeButtonClass('random')}`}
            >
              {ti.deckRandom || 'Aleatoria'}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={deckMode === 'manual'}
              onClick={() => { setDeckMode('manual'); setError(''); }}
              className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold ${modeButtonClass('manual')}`}
            >
              {ti.deckManual || 'Manual'}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {deckMode === 'standard' && (ti.deckStandardHelp || 'Usa la baraja de la expansión del comandante.')}
            {deckMode === 'random' && (ti.deckRandomHelp || 'Mezcla todas las cartas disponibles: una por color y posición.')}
            {deckMode === 'manual' && (ti.deckManualHelp || 'Elige una carta por color y posición. Deben ser 10 en total.')}
          </p>
        </fieldset>

        {deckMode === 'manual' && (
          <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950/60 p-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {COMMANDER_COLORS.map((color) => COMMANDER_POSITIONS.map((position) => {
                const key = `${color}_${position}`;
                const options = getCommanderSlotCards(color, position);
                return (
                  <label key={key} className="block text-xs">
                    <span className="font-semibold text-slate-200">
                      {COLOR_LABELS[color]} · {position === 'arriba'
                        ? (ti.deckAbove || 'Arriba')
                        : (ti.deckBelow || 'Abajo')}
                    </span>
                    <select
                      value={manualDeck[key] || ''}
                      onChange={(event) => setManualDeck((prev) => ({
                        ...prev,
                        [key]: event.target.value,
                      }))}
                      className="mt-1 w-full rounded border border-slate-600 bg-slate-900 p-2 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                    >
                      <option value="">—</option>
                      {options.map((card) => (
                        <option key={card.id} value={card.id}>
                          {cardName(card)}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              }))}
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-3 rounded border border-red-700/60 bg-red-950/40 p-2 text-xs text-red-100">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="min-h-11 rounded border border-slate-600 bg-slate-800 px-3 py-2 font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {ts.cancel || 'Cancelar'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="min-h-11 rounded bg-sky-600 px-3 py-2 font-semibold text-white hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
          >
            {ts.confirm || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCommanderPC;
