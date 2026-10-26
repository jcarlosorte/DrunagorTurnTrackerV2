import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import PageTransition from '@/components/PageTransition';
import SavesPanel from '@/components/saves/SavesPanel';

export default function Saves() {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const t = translations?.saves || {};

  return (
    <PageTransition>
      <main className="mx-auto min-h-[calc(100dvh-3.5rem)] max-w-3xl space-y-6 bg-slate-950 px-4 py-6 text-white sm:px-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">Drunagor</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{t.title || 'Partidas'}</h1>
          <p className="mt-2 text-slate-300">
            {t.subtitle || 'Guarda, carga, exporta e importa el estado de tus campañas en este dispositivo.'}
          </p>
        </header>

        <SavesPanel mode="page" />

        <button
          type="button"
          onClick={() => navigate('/', { replace: true })}
          className="min-h-11 rounded-lg bg-slate-700 px-4 py-2 font-bold text-white transition hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          ← {translations.home?.back_to_home || 'Volver al inicio'}
        </button>
      </main>
    </PageTransition>
  );
}
