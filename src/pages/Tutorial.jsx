import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import PageTransition from '@/components/PageTransition';
import {
  GiCardPlay,
  GiMinions,
  GiRuneStone,
  GiPositionMarker,
  GiVillage,
  GiCharacter,
  GiSave,
  GiGearHammer,
} from 'react-icons/gi';

const ICONS = [GiCardPlay, GiMinions, GiRuneStone, GiPositionMarker, GiVillage, GiCharacter, GiSave, GiGearHammer];

/**
 * Guía de uso. El contenido vive en `translations.tutorial.sections` para
 * mantenerlo actualizado en ambos idiomas con cada mejora de la app.
 */
export default function Tutorial() {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const t = translations.tutorial || {};
  const sections = Array.isArray(t.sections) ? t.sections : [];

  return (
    <PageTransition>
      <main className="mx-auto min-h-[calc(100dvh-3.5rem)] max-w-4xl space-y-6 bg-slate-950 px-4 py-6 text-white sm:px-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">Drunagor</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{t.title || 'Tutorial'}</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            {t.subtitle || 'Una guía rápida de todo lo que puede hacer la aplicación.'}
          </p>
        </header>

        <ol className="space-y-3">
          {sections.map((section, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <li key={section.title} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-900/50 text-emerald-300">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold">
                      <span className="mr-2 text-emerald-300">{index + 1}.</span>
                      {section.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{section.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => navigate('/', { replace: true })}
          className="min-h-11 rounded-lg bg-slate-700 px-4 py-2 font-bold text-white transition hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          ← {t.back || 'Volver al inicio'}
        </button>
      </main>
    </PageTransition>
  );
}
