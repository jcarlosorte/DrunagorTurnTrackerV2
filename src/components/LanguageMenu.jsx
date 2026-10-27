import { useEffect, useRef, useState } from 'react';
import { FaLanguage } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { languages as availableLanguages, languageNames } from '@/i18n/languageData';

/**
 * Selector de idioma: botón con icono y desplegable.
 * Se usa en la barra de la portada y en la del track.
 */
export default function LanguageMenu({ label = 'Idioma' }) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label}: ${languageNames[language] || language}`}
        title={`${label}: ${languageNames[language] || language}`}
        data-testid="language-menu"
        className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-slate-800 px-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:px-3"
      >
        <FaLanguage size={20} aria-hidden="true" />
        <span className="hidden sm:inline">{languageNames[language] || language}</span>
        <span aria-hidden="true" className="text-[0.6rem] text-slate-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul
          role="menu"
          aria-label={label}
          className="absolute right-0 z-[80] mt-2 w-40 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-2xl"
        >
          {availableLanguages.map((lang) => (
            <li key={lang} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={language === lang}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                  language === lang ? 'font-bold text-emerald-300' : 'text-slate-200'
                }`}
              >
                {languageNames[lang] || lang}
                {language === lang && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
