import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';

const TileWarningModal = () => {
  const { tileWarning, setTileWarning } = useGame();
  const { translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const closeRef = useRef(null);

  useEffect(() => {
    if (!tileWarning) return undefined;
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setTileWarning(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tileWarning, setTileWarning]);

  if (!tileWarning) return null;

  return (
    <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="tile-warning-title">
        <h2 id="tile-warning-title" className="mb-2 text-lg font-bold text-gray-800">{ti.aviso1 || 'Aviso'}</h2>
        <p className="mb-4 text-sm text-gray-800">{tileWarning}</p>
        <button
          ref={closeRef}
          type="button"
          className="min-h-11 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          onClick={() => setTileWarning(null)}
        >
          {ti.close || 'Cerrar'}
        </button>
      </div>
    </div>
  );
};

export default TileWarningModal;
