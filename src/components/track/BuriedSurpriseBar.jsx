import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import mecanicaEspecialIcon from '@/assets/assets_logo/mecanica_especial.png';

export default function BuriedSurpriseBar({ onDraw }) {
  const { sorpresaEvent } = useGame();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  if (!sorpresaEvent?.active || sorpresaEvent.deck.length === 0) return null;

  return (
    <div className="mb-2 rounded-xl border border-fuchsia-700/60 bg-fuchsia-950/40 p-2 text-fuchsia-100">
      <p className="truncate text-xs font-black uppercase tracking-wide">
        {t.buriedSurpriseTitle || 'Sorpresa Enterrada'}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={onDraw}
          aria-label={t.openBuriedSurprise || 'Abrir Sorpresa Enterrada'}
          className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
        >
          <img src={mecanicaEspecialIcon} alt="" className="h-8 w-8 rounded-lg object-cover" />
        </button>
        <p className="min-w-0 flex-1 text-[0.65rem] text-fuchsia-200/80">
          {t.erradenRemaining || 'Cartas restantes'}: {sorpresaEvent.deck.length}/5
        </p>
        <button
          type="button"
          onClick={onDraw}
          className="min-h-8 shrink-0 rounded-lg bg-fuchsia-700 px-2.5 text-xs font-bold text-white hover:bg-fuchsia-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
        >
          {t.drawEventCard || 'Robar carta'}
        </button>
      </div>
    </div>
  );
}
