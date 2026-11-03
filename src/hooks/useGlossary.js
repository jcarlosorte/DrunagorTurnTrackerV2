import { useLanguage } from '@/context/LanguageContext';
import { useRules } from '@/context/RulesContext';
import glosario2Es from '@/i18n/glosario2.es.json';
import glosario2En from '@/i18n/glosario2.en.json';

/**
 * Glosario de condiciones y capacidades según la versión de reglas.
 *
 * En 2.0 se superponen las descripciones nuevas sobre las de 1.5, de modo que
 * las claves que no aparezcan en el glosario nuevo conservan su texto anterior.
 */
export default function useGlossary() {
  const { translations, language } = useLanguage();
  const { rulesVersion } = useRules();

  const labels = translations.condiciones_t || {};
  const base = translations.condiciones_d || {};
  const descriptions = rulesVersion === '2.0'
    ? { ...base, ...(language === 'en' ? glosario2En : glosario2Es) }
    : base;

  return { labels, descriptions };
}
