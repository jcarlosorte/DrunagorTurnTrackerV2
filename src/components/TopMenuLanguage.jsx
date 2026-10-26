import { useLanguage } from "@/context/LanguageContext";
import { languages as availableLanguages, languageNames } from "@/i18n/languageData";
import { FaLanguage } from 'react-icons/fa';

export default function TopMenuLanguage() {
  const { language, setLanguage, translations } = useLanguage();
  const t = translations?.trackerInit || {};

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-700/80 bg-slate-950/90 shadow-lg shadow-slate-950/30 backdrop-blur-xl">
      <div className="mx-auto flex min-h-14 max-w-screen-2xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white sm:text-base">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" aria-hidden="true" />
          <span className="truncate">Drunagor</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-200">
          <FaLanguage className="text-sky-300" aria-hidden="true" />
          <label htmlFor="lang" className="sr-only">{t.language || 'Idioma'}</label>
          <select
            id="lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="min-h-11 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white outline-none transition focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {languageNames[lang]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
