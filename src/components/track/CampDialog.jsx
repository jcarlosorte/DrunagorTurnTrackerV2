import { useEffect, useRef, useState } from 'react';
import { GiWoodenCrate } from 'react-icons/gi';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';
import useFocusTrap from '@/hooks/useFocusTrap';

/**
 * Campamento del grupo: objetos compartidos que no lleva ningún héroe.
 * Se guardan dentro de `gameState`, así que viajan con la partida.
 */
export default function CampDialog({ open, onClose }) {
  const { translations } = useLanguage();
  const { campamento, addCampItem, removeCampItem } = useGame();
  const t = translations.trackerInit || {};
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [text, setText] = useState('');

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return undefined;
    setText('');
    inputRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const add = () => {
    if (!text.trim()) return;
    addCampItem(text);
    setText('');
    inputRef.current?.focus();
  };

  return (
    <div className="layer-dialog fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="camp-title"
        className="flex max-h-[85dvh] w-full max-w-lg flex-col rounded-2xl border border-slate-600 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <header className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
          <GiWoodenCrate className="text-lg text-amber-300" aria-hidden="true" />
          <h2 id="camp-title" className="min-w-0 flex-1 truncate text-base font-bold">
            {t.campTitle || 'Campamento del grupo'}
          </h2>
          <span className="shrink-0 rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums">
            {campamento.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close || 'Cerrar'}
            className="min-h-9 shrink-0 rounded-lg bg-slate-700 px-3 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            ✕
          </button>
        </header>

        <div className="flex gap-2 border-b border-slate-700 p-3">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                add();
              }
            }}
            maxLength={60}
            placeholder={t.campPlaceholder || 'Objeto del campamento'}
            aria-label={t.campPlaceholder || 'Objeto del campamento'}
            className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-950 px-3 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          />
          <button
            type="button"
            onClick={add}
            className="min-h-10 shrink-0 rounded-lg bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
          >
            + {t.campAdd || 'Añadir'}
          </button>
        </div>

        <div className="min-h-24 flex-1 overflow-y-auto p-3">
          {campamento.length === 0 ? (
            <p className="rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-center text-sm text-slate-400">
              {t.campEmpty || 'Sin objetos en el campamento.'}
            </p>
          ) : (
            <ul className="space-y-1.5">
              {campamento.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1.5 text-sm"
                >
                  <span className="truncate">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeCampItem(index)}
                    aria-label={`${item}: ${t.remove || 'Quitar'}`}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-slate-700 px-4 py-2.5">
          <span className="text-[0.7rem] text-slate-400">{t.campHint || 'Se guarda con la partida'}</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-lg bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {t.close || 'Cerrar'}
          </button>
        </footer>
      </div>
    </div>
  );
}
