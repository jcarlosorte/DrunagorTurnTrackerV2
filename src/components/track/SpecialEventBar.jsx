import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import mecanicaEspecialIcon from '@/assets/assets_logo/mecanica_especial.png';

export default function SpecialEventBar({ onDraw }) {
  const { erradenEvent } = useGame();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  if (!erradenEvent?.active) return null;
  const remaining = erradenEvent.deck.length;
  if (remaining === 0) return null;

  return (
    <div className="mb-2 flex items-center gap-2 rounded-xl border border-fuchsia-700/60 bg-fuchsia-950/40 p-2 text-fuchsia-100">
      <button
        type="button"
        onClick={onDraw}
        disabled={remaining === 0}
        aria-label={t.openErraden || 'Abrir Sorpresa de Eradren'}
        className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <img src={mecanicaEspecialIcon} alt="" className="h-8 w-8 rounded-lg object-cover" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-black uppercase tracking-wide">
          {t.erradenTitle || 'Sorpresa de Eradren'}
        </p>
        <p className="text-[0.65rem] text-fuchsia-200/80">
          {t.erradenRemaining || 'Cartas restantes'}: {remaining}/{6}
        </p>
      </div>
      <button
        type="button"
        onClick={onDraw}
        disabled={remaining === 0}
        className="min-h-8 shrink-0 rounded-lg bg-fuchsia-700 px-2.5 text-xs font-bold text-white hover:bg-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
      >
        {t.drawEventCard || 'Robar carta'}
      </button>
    </div>
  );
}
