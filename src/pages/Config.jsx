import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useExpansions } from "@/context/ExpansionContext";
import { useRules } from "@/context/RulesContext";
import { languages as availableLanguages, languageNames } from "@/i18n/languageData";
import { EXPANSIONS } from "@/data/expansions";
import { RULES_VERSIONS } from "@/utils/rulesVersion";
import PageTransition from "@/components/PageTransition";
import SavesPanel from "@/components/saves/SavesPanel";
import { isHeroManagementEnabled, setHeroManagementEnabled } from "@/utils/heroSettings";

export default function Config() {
  const navigate = useNavigate();
  const { language, setLanguage, translations } = useLanguage();
  const { selectedExpansions, toggleExpansion } = useExpansions();
  const { rulesVersion, detected, isAuto, setRulesVersion } = useRules();
  const [heroManagement, setHeroManagement] = useState(isHeroManagementEnabled);
  const config = translations.config || {};
  const saves = translations.saves || {};

  const activeExpansions = EXPANSIONS.filter((exp) => exp.active !== 'off');

  const toggleHeroManagement = () => {
    const next = !heroManagement;
    setHeroManagement(next);
    setHeroManagementEnabled(next);
  };

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

        <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 sm:p-6" aria-labelledby="hero-management-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="hero-management-title" className="text-xl font-bold">{config.heroManagementTitle || 'Gestión de héroes'}</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">
                {config.heroManagementHint || 'Activa las funcionalidades ampliadas de la vista de héroe: auras, consecuencias y estados.'}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleHeroManagement}
              aria-pressed={heroManagement}
              className={`flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                heroManagement
                  ? 'border-emerald-400 bg-emerald-600 text-white'
                  : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-400'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${heroManagement ? 'bg-emerald-950/60' : 'bg-slate-700'}`}
              >
                <span className={`h-4 w-4 rounded-full bg-white transition ${heroManagement ? 'translate-x-4' : ''}`} />
              </span>
              {heroManagement ? (config.heroManagementOn || 'Activado') : (config.heroManagementOff || 'Desactivado')}
            </button>
          </div>
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

        <section aria-labelledby="rules-version-title" className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="rules-version-title" className="text-xl font-bold">{config.rulesVersionTitle || 'Versión de reglas'}</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">
                {config.rulesVersionHint || 'Elige el reglamento de la partida. Las expansiones de Apocalipsis activan el 2.0 automáticamente.'}
              </p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-sm font-bold ${
              rulesVersion === '2.0'
                ? 'border-amber-400/80 bg-amber-950/60 text-amber-100'
                : 'border-slate-500 bg-slate-800 text-slate-200'
            }`}>
              {rulesVersion}
            </span>
          </div>

          <div role="radiogroup" aria-labelledby="rules-version-title" className="mt-4 flex flex-wrap gap-2">
            {RULES_VERSIONS.map((version) => (
              <button
                key={version}
                type="button"
                role="radio"
                aria-checked={rulesVersion === version}
                onClick={() => setRulesVersion(version)}
                className={`min-h-11 min-w-52 rounded-xl border px-4 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                  rulesVersion === version
                    ? 'border-emerald-400 bg-emerald-950/50 text-white'
                    : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-400'
                }`}
              >
                <span className="block text-sm font-bold">
                  {version === '2.0' ? (config.rulesVersion20 || 'Reglas 2.0 · Apocalipsis') : (config.rulesVersion15 || 'Reglas 1.5 · juego base')}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {version === '2.0' ? (config.rulesVersion20Hint || 'Preparado para los cambios de Apocalipsis.') : (config.rulesVersion15Hint || 'Reglamento original.')}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-2">
            <button
              type="button"
              aria-pressed={isAuto}
              onClick={() => setRulesVersion('auto')}
              className={`min-h-9 rounded-full border px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                isAuto
                  ? 'border-emerald-400 bg-emerald-800 text-white'
                  : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-400'
              }`}
            >
              {config.rulesVersionAuto || 'Automático'} ({detected})
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            {isAuto
              ? (config.rulesVersionAutoOn || 'Automático: {version} según las expansiones activas.').replace('{version}', detected)
              : (config.rulesVersionManualOn || 'Forzado manualmente a {version}.').replace('{version}', rulesVersion)}
          </p>

          {detected === '2.0' && rulesVersion === '1.5' && (
            <p role="status" className="mt-2 rounded-lg border border-amber-500/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-100">
              {config.rulesVersionMismatch || 'Hay expansiones de Apocalipsis activas con las reglas 1.5 forzadas.'}
            </p>
          )}
        </section>

        <details className="rounded-2xl border border-slate-700 bg-slate-900/80">
          <summary className="cursor-pointer px-4 py-4 text-xl font-bold sm:px-6">
            {saves.title || 'Partidas'}
          </summary>
          <div className="border-t border-slate-700 p-4 sm:p-6">
            <SavesPanel mode="drawer" />
          </div>
        </details>

        <div className="flex flex-wrap gap-3">
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
