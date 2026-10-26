// ModalCommanderPC.jsx
import React, { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const ModalCommanderPC = ({ onConfirm, onCancel }) => {
  const [pcValue, setPcValue] = useState('');
  const { translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const ts = translations.trackerSelect || {};
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

  const handleSubmit = () => {
    const parsed = parseInt(pcValue, 10);
    onConfirm(Number.isNaN(parsed) || parsed <= 0 ? 1 : parsed);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xs rounded-xl bg-yellow-400 p-4 text-white shadow-2xl"
      >
        <h2 id={titleId} className="mb-2 text-lg font-bold">{ti.PC || 'PC'}</h2>
        <label htmlFor={inputId} className="sr-only">{ti.PC || 'PC'}</label>
        <input
          id={inputId}
          ref={inputRef}
          type="number"
          min="1"
          value={pcValue}
          onChange={(event) => setPcValue(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') handleSubmit(); }}
          className="w-full rounded p-2 text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="min-h-11 rounded bg-yellow-700 px-3 py-2 font-semibold text-white hover:bg-yellow-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            {ts.cancel || 'Cancelar'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="min-h-11 rounded bg-yellow-600 px-3 py-2 font-semibold text-white hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            {ts.confirm || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCommanderPC;
