// src/components/CommanderCardModal.jsx
import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';
import { useTracker } from '@/context/TrackerContext';

const CommanderCardModal = ({ carta, onClose }) => {
  const { translations } = useLanguage();
  const { getRuneCount } = useGame();
  const { trackerData } = useTracker();
  const closeRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  const ta = translations.cartas_ataque || {};
  const ttr = translations.defensaCard.cartas_trad || {};
  const selectedHeroes = trackerData.heroes;
  const numHeroes = Math.min(selectedHeroes.length, 4);
  const numRunasColor = getRuneCount(carta.rune);
  const nombre = ta.nombre?.[carta.id] || carta.nombre;
  
  let capacidad = ta.capacidad?.[carta.id] || carta.capacidad;
  
  if (capacidad) {
    // 1. Sustituimos valores numéricos dinámicos
    capacidad = capacidad
      .replaceAll('{X_H}', numHeroes)
      .replaceAll('{X+2}', numRunasColor + 2)
      .replaceAll('{X}', numRunasColor)
      .replaceAll('{2*X}', numRunasColor * 2)
      .replaceAll('{3*X}', numRunasColor * 3)
      .replaceAll('{4*X}', numRunasColor * 4);
  
    // 2. Buscamos todas las palabras entre {}
    const regex = /\{([^}]+)\}/g;
    const partes = [];
    let lastIndex = 0;
    let match;
  
    while ((match = regex.exec(capacidad)) !== null) {
      const [fullMatch, key] = match;
      const start = match.index;
  
      // Ignorar las que tienen X (ya procesadas antes)
      if (!key.includes('X')) {
        // Agregar texto antes de la llave
        if (start > lastIndex) {
          partes.push(capacidad.substring(lastIndex, start));
        }
  
        // Traducción desde ttr si existe, sino deja la original
        const traduccion = ttr[key] || key;
        
        // Agregar el span con estilo especial
        partes.push(
          <span key={start} className="text-blue-400 font-bold">
            {' '}{traduccion}{' '}
          </span>
        );
  
        lastIndex = start + fullMatch.length;
      }
    }
  
    // Agregar el resto del texto después de la última llave
    if (lastIndex < capacidad.length) {
      partes.push(capacidad.substring(lastIndex));
    }
  
    const finalPartes = [];
    partes.forEach((parte, i) => {
      if (typeof parte === 'string') {
        const frases = parte.split(/(\.)/);
        frases.forEach((token, idx) => {
          if (token === ".") {
            finalPartes.push(token); // Agregamos el punto original
            finalPartes.push(<br key={`br-${i}-${idx}`} />); // Luego el salto
          } else if (token.trim() !== "") {
            finalPartes.push(token);
          }
        });
      } else {
        // Si es un span, simplemente lo agregamos
        finalPartes.push(parte);
      }
    });
  
    capacidad = finalPartes;
  }


  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-w-sm rounded-lg border-2 border-yellow-400 bg-orange-900 p-6 text-white shadow-xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={translations.trackerSelect?.close || 'Cerrar'}
          className="absolute right-2 top-1 flex h-9 w-9 items-center justify-center rounded bg-red-500 text-sm hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          ✕
        </button>
        <div id={titleId} className="mb-2 text-center text-lg text-yellow-300" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
          {nombre}
        </div>

        <div className="text-sm whitespace-pre-line text-center leading-tight">
          {capacidad}
        </div>
        
      </div>

    </div>,
    document.body
  );
};

export default CommanderCardModal;
