import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';

// El panel se carga bajo demanda para no incluir los catálogos del juego en el bundle inicial.
const LazySavesPanel = lazy(() => import('@/components/saves/SavesPanel'));

const SavesUiContext = createContext(null);

export const SavesUiProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openSaves = useCallback(() => setIsOpen(true), []);
  const closeSaves = useCallback(() => setIsOpen(false), []);

  // Atajo global: Ctrl/⌘ + S abre el panel de partidas sin abrir el diálogo del navegador.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        setIsOpen((previous) => !previous);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = useMemo(() => ({ isOpen, openSaves, closeSaves }), [isOpen, openSaves, closeSaves]);

  return (
    <SavesUiContext.Provider value={value}>
      {children}
      <SavesDrawer open={isOpen} onClose={closeSaves} />
    </SavesUiContext.Provider>
  );
};

export const useSavesUi = () => useContext(SavesUiContext);

function SavesDrawer({ open, onClose }) {
  const { translations } = useLanguage();
  const panelRef = useRef(null);
  const t = translations?.saves || {};

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const first = panelRef.current?.querySelector('button, input, select');
    first?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/70" role="presentation" onClick={onClose}>
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="saves-drawer-title"
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-slate-900 p-4 text-white shadow-2xl sm:w-96"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="saves-drawer-title" className="text-lg font-bold">{t.title || 'Partidas'}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close || 'Cerrar'}
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-xl hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            ✕
          </button>
        </div>
        <Suspense fallback={<p className="text-sm text-slate-400" role="status">{t.loading || 'Cargando…'}</p>}>
          <LazySavesPanel mode="drawer" />
        </Suspense>
      </aside>
    </div>,
    document.body,
  );
}
