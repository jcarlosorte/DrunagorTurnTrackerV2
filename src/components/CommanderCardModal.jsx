// src/components/CommanderCardModal.jsx
import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';
import { useTracker } from '@/context/TrackerContext';

const CommanderCardModal = ({ carta, onClose, onDelete }) => {
  const { translations } = useLanguage();
  const { getRuneCount } = useGame();
  const { trackerData } = useTracker();
  const closeRef = useRef(null);
  const titleId = useId();
  const [wisdomCubes, setWisdomCubes] = useState(0);
  const [overDarkness, setOverDarkness] = useState(true);

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
  const nombreEnemy = carta.nombreEnemy;
  
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
    <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border bg-slate-900/95 text-slate-100 shadow-2xl ${
          carta.categoria === 'overlord'
            ? 'border-purple-500/70'
            : carta.categoria === 'comandante' || carta.categoria === 'hero'
            ? 'border-yellow-500/60'
            : carta.categoria === 'jefe'
            ? 'border-purple-400/60'
            : 'border-slate-600'
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-700/80 px-5 pb-3 pt-5">
          <div className="min-w-0">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-emerald-300">
              {carta.categoria === 'overlord'
                ? ta.ataqueO || 'Acción de Señor Supremo'
                : carta.categoria === 'comandante'
                ? ta.ataqueC || 'Acción de Comandante'
                : carta.categoria === 'hero'
                ? ta.ataqueF || 'Acción de Héroe Caído'
                : carta.categoria === 'jefe'
                ? ta.ataqueB || 'Acción de Jefe'
                : 'Carta de acción'}
            </p>
            <h2 id={titleId} className="mt-1 truncate text-lg font-black text-slate-50 sm:text-xl">
              {nombre}
            </h2>
            {carta.expansionId === 'base' && (
              <span className="mt-1 inline-flex rounded-full bg-amber-400 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wide text-slate-950">
                Base
              </span>
            )}
            {carta.expansionId === 'apocalypse_awakenings' && (
              <span className="mt-1 inline-flex rounded-full bg-violet-400 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wide text-slate-950">
                Despertar
              </span>
            )}
            {carta.lista_capacidad?.includes('PASIVA') && (
              <span className="mt-1 ml-1 inline-flex rounded-full bg-violet-700 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wide text-white">
                Pasiva
              </span>
            )}
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {nombreEnemy || ''}
              {carta.rune ? ` · ${carta.rune}` : ''}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={translations.trackerSelect?.close || 'Cerrar'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm text-slate-200 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="rounded-xl border border-slate-700/80 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-200">
            {capacidad}
          </div>
          {ta.nota?.[carta.id] && (
            <p className="mt-3 rounded-lg border border-amber-700/50 bg-amber-950/30 p-3 text-xs text-amber-100">
              {ta.nota[carta.id]}
            </p>
          )}
          {carta.id === 'cmd_12' && (
            <div className="mt-3 rounded-lg border border-sky-700/50 bg-sky-950/30 p-3 text-xs text-sky-100">
              <label htmlFor="commander-wisdom-cubes" className="block font-semibold">
                Cubos de Sabiduría descartados
              </label>
              <input
                id="commander-wisdom-cubes"
                type="number"
                min="0"
                value={wisdomCubes}
                onChange={(event) => setWisdomCubes(Math.max(0, Number(event.target.value) || 0))}
                className="mt-1 min-h-8 w-24 rounded border border-slate-600 bg-slate-900 px-2 text-white"
              />
              <p className="mt-1">
                Daño final: {numRunasColor} × {wisdomCubes} = {numRunasColor * wisdomCubes}
              </p>
            </div>
          )}
          {carta.id === 'cmd_17' && (
            <div className="mt-3 rounded-lg border border-emerald-700/50 bg-emerald-950/30 p-3 text-xs text-emerald-100">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={overDarkness}
                  onChange={(event) => setOverDarkness(event.target.checked)}
                />
                Hay héroes sobre Oscuridad
              </label>
              <p className="mt-1">
                {overDarkness
                  ? `Veneno ${numRunasColor} a cada héroe sobre Oscuridad.`
                  : `No hay héroes sobre Oscuridad: sanar ${numRunasColor} al Comandante.`}
              </p>
            </div>
          )}
          {carta.id === 'cmd_16' && (
            <p className="mt-3 rounded-lg border border-red-700/50 bg-red-950/30 p-3 text-xs text-red-100">
              Pierde {numRunasColor} de vida y gana {numRunasColor * 2} de escudo (puede superar 4). Después, Evolución.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-700/80 px-5 py-3">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="min-h-9 rounded-lg border border-red-500/40 bg-red-950/40 px-3 text-xs font-bold text-red-200 transition hover:bg-red-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              Eliminar carta
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
          >
            Cerrar
          </button>
        </div>
      </div>

    </div>,
    document.body
  );
};

export default CommanderCardModal;
