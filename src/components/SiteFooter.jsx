import { FaGithub, FaInstagram } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import BuildBadge from '@/components/BuildBadge';
import fido from '@/assets/assets_logo/darkfidodido.png';

/**
 * Pie de la portada: autoría, enlaces y versión del build.
 *
 * El logo de DaRkFiDoDiDo se sustituirá por el archivo definitivo cuando esté
 * disponible; de momento se representa con una marca CSS (muro + figura).
 */
export default function SiteFooter() {
  const { translations } = useLanguage();
  const home = translations.home || {};

  return (
    <footer className="relative z-10 border-t border-slate-800 bg-slate-950/80 px-4 py-5">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-slate-400 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={fido}
            alt="DaRkFiDoDiDo"
            className="h-11 w-12 shrink-0 object-contain"
            loading="lazy"
            decoding="async"
          />
          <span>
            <span className="block text-sm font-black tracking-wide text-slate-100">DaRkFiDoDiDo</span>
            <span className="block text-xs">{home.footerTagline || 'Herramienta no oficial para Drunagor'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BuildBadge alwaysVisible />
          <a
            href="https://github.com/jcarlosorte"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub de jcarlosorte"
            title="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <FaGithub aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/carl_el_mazmorrero/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Instagram de carl_el_mazmorrero"
            title="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
          >
            <FaInstagram aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
