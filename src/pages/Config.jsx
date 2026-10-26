import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useExpansions } from "@/context/ExpansionContext";
import { languages as availableLanguages, languageNames } from "@/i18n/languageData";
import { EXPANSIONS } from "@/data/expansions";
import PageTransition from "@/components/PageTransition";

export default function Config() {
  const navigate = useNavigate();
  const { language, setLanguage, translations } = useLanguage();
  const { selectedExpansions, toggleExpansion } = useExpansions();
  const config = translations.config || {};
  const saves = translations.saves || {};

  const activeExpansions = EXPANSIONS.filter((exp) => exp.active !== 'off');

  return (
    <PageTransition>
      <main className="mx-auto min-h-[calc(100dvh-3.5rem)] max-w-7xl space-y-8 bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">Drunagor</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{config.title || 'Contenido'}</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            {config.subtitle || 'Elige el idioma y las expansiones que estarán disponibles al preparar una partida.'}
          </p>
        </header>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 sm:p-6" aria-labelledby="language-section-title">
          <h2 id="language-section-title" className="text-xl font-bold">{config.language_section_title || 'Idioma'}</h2>
          <label htmlFor="config-language" className="mt-3 block text-sm text-slate-300">{config.select_language || 'Selecciona el idioma'}</label>
          <select
            id="config-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="mt-2 min-h-11 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>{languageNames[lang]}</option>
            ))}
          </select>
        </section>

        <section aria-labelledby="expansions-section-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="expansions-section-title" className="text-xl font-bold">{config.select_expansions || 'Expansiones'}</h2>
              <p className="mt-1 text-sm text-slate-400">
                <b className="text-emerald-300">{selectedExpansions.length}</b> {saves.selected || 'seleccionadas'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPANSIONS.map((exp) => {
              const isInactive = exp.active === "off";
              const isSelected = selectedExpansions.includes(exp.id);
              const label = translations.expansions?.[exp.id] || exp.id;
              return (
                <label
                  key={exp.id}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-2 transition focus-within:ring-2 focus-within:ring-sky-300 ${
                    isSelected ? 'border-emerald-400 bg-emerald-950/40' : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                  } ${isInactive ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleExpansion(exp.id)}
                    disabled={isInactive}
                    className="sr-only"
                    aria-label={label}
                  />
                  <div className="relative">
                    <img src={exp.imagen} alt="" loading="lazy" decoding="async" className="h-36 w-full rounded-xl object-cover" />
                    {isInactive && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 px-2 text-center text-sm font-semibold">
                        {config.waiting_for_spanish_copy || "Esperando copia en español"}
                      </div>
                    )}
                  </div>
                  <div className="flex min-h-12 items-center justify-between gap-3 px-2">
                    <span className="font-semibold text-slate-100">{label}</span>
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm ${
                        isSelected ? 'border-emerald-300 bg-emerald-500 text-slate-950' : 'border-slate-500'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          <p className="mt-4 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-300">
            {config.expansionsHint || 'Las expansiones activas determinan qué héroes y enemigos aparecen en la selección de partida.'}
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/saves')}
            className="min-h-11 rounded-lg bg-emerald-700 px-4 py-2 font-bold text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
          >
            {saves.goToSaves || 'Ir a Partidas'} →
          </button>
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="min-h-11 rounded-lg bg-slate-700 px-4 py-2 font-bold text-white transition hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            ← {translations.home?.back_to_home || 'Volver al inicio'}
          </button>
        </div>

        {activeExpansions.length === 0 && (
          <p role="alert" className="text-sm text-amber-200">
            {config.noActiveExpansions || 'No hay expansiones activas disponibles.'}
          </p>
        )}
      </main>
    </PageTransition>
  );
}
