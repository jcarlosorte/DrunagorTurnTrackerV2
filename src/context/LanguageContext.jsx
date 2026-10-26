import { createContext, useContext, useState, useEffect } from 'react';
import { translationsByLang } from '../i18n/languageData';
import { writeJsonStorage } from '../utils/storage';

const LanguageContext = createContext();
const DEFAULT_LANGUAGE = 'es';
const isSupportedLanguage = (value) => (
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(translationsByLang, value)
);

const readStoredLanguage = () => {
  try {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    const raw = window.localStorage.getItem('lang');
    if (!raw) return DEFAULT_LANGUAGE;
    let candidate = raw;
    try { candidate = JSON.parse(raw); } catch { /* legacy unquoted value */ }
    return isSupportedLanguage(candidate) ? candidate : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const LanguageProvider = ({ children }) => {
  const initialLanguage = readStoredLanguage();
  const [language, setLanguage] = useState(initialLanguage);
  const [translations, setTranslations] = useState(translationsByLang[initialLanguage]);

  useEffect(() => {
    const safeLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
    if (safeLanguage !== language) setLanguage(safeLanguage);
    writeJsonStorage('lang', safeLanguage);
    setTranslations(translationsByLang[safeLanguage]);

    // Cambiar atributo lang del <html>
    document.documentElement.lang = language;

    // Cambiar el título del documento si está definido en los textos
    const newTitle = translationsByLang[language]?.home?.title || 'Drunagor Turn Tracker';
    document.title = newTitle;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
