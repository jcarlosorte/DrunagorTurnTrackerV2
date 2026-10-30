import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageMenu from '@/components/LanguageMenu';
import { FaLanguage } from 'react-icons/fa';
import { GiArchiveRegister } from 'react-icons/gi';
import SaveStatusIndicator from '@/components/SaveStatusIndicator';
import { useSavesUi } from '@/context/SavesUiContext';

export default function TopMenuLanguage() {
  const { translations } = useLanguage();
  const { openSaves } = useSavesUi() || {};
  const location = useLocation();
  const t = translations?.saves || {};
  const onSavesPage = location.pathname === '/saves';
  // La portada gestiona sus propios accesos (Partidas y Tutorial en el contenido).
  const onHome = location.pathname === '/';

  // El track tiene su propia barra completa: evitamos dos cabeceras superpuestas.
  if (location.pathname === '/init') return null;

  return (
    <header className="layer-app-bar fixed inset-x-0 top-0 border-b border-slate-700/80 bg-slate-950/95 shadow-lg shadow-slate-950/40 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:text-base"
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" aria-hidden="true" />
          <span className="truncate">Drunagor</span>
        </Link>

        <div className="hidden md:block">
          <SaveStatusIndicator />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {!onHome && (
          <button
            type="button"
            onClick={openSaves}
            disabled={!openSaves}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-emerald-700 px-3 text-sm font-bold text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 disabled:opacity-50"
            aria-label={t.title || 'Partidas guardadas'}
          >
            <GiArchiveRegister aria-hidden="true" className="text-lg" />
            <span className="hidden sm:inline">{t.title || 'Partidas'}</span>
          </button>
          )}

          {!onSavesPage && !onHome && (
            <Link
              to="/saves"
              className="hidden min-h-11 items-center rounded-lg border border-slate-600 px-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 lg:flex"
            >
              {t.manage || 'Gestionar'}
            </Link>
          )}

          <div className="flex items-center gap-1.5 text-sm text-slate-200">
            <FaLanguage className="hidden text-sky-300 sm:block" aria-hidden="true" />
            <label htmlFor="lang" className="sr-only">{translations.trackerInit?.language || 'Idioma'}</label>
            <LanguageMenu label={t.language || 'Idioma'} />
          </div>
        </div>
      </div>
    </header>
  );
}
