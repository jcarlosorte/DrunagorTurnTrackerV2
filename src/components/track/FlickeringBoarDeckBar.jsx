import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { FLICKERING_BOAR_CARDS } from '@/data/flickeringBoarDeck';

export default function FlickeringBoarDeckBar() {
  const { flickeringBoarDeck, drawFlickeringBoarCardNow, resetFlickeringBoarDeck } = useGame();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};

  if (!flickeringBoarDeck?.active) return null;
  const card = FLICKERING_BOAR_CARDS.find((entry) => entry.id === flickeringBoarDeck.current) || null;
  const exhausted = flickeringBoarDeck.deck.length === 0;

  return (
    <section
      data-testid="flickering-boar-deck"
      className="track-surface-raised mb-2 p-2 text-white"
      aria-label={t.boarDeckTitle || 'Comportamiento Jabalí Parpadeante'}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden="true" className="text-base">🐗</span>
          <h3 className="truncate text-[0.7rem] font-bold uppercase tracking-wide text-amber-200">
            {t.boarDeckTitle || 'Comportamiento Jabalí Parpadeante'}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-slate-800 px-1.5 text-[0.6rem] text-slate-300">
          {t.boarDeckRemaining || 'Mazo'}: {flickeringBoarDeck.deck.length}/8
        </span>
      </div>

      <div className="rounded-lg border border-amber-700/50 bg-slate-950/60 p-2">
        {card ? (
          <>
            <p className="text-xs font-black text-amber-100">{t[card.titleKey] || card.kind}</p>
            <p className="mt-0.5 text-[0.68rem] leading-snug text-slate-200">{t[card.textKey] || ''}</p>
            {card.fury && (
              <p className="mt-1 rounded border border-orange-600/60 bg-orange-950/40 p-1 text-[0.65rem] font-semibold text-orange-100">
                {t.boarFury || '¡FURIA! Gana EVOLUCIÓN y luego se ACTIVA de la forma habitual.'}
              </p>
            )}
          </>
        ) : (
          <p className="text-[0.68rem] text-slate-400">{t.boarDeckEmpty || 'Roba la primera carta para empezar.'}</p>
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5">
        <span className="text-[0.6rem] text-slate-400">
          {t.boarDeckDiscarded || 'Descartadas'}: {flickeringBoarDeck.discarded.length}
          {exhausted && flickeringBoarDeck.discarded.length > 0
            ? ` · ${t.boarDeckReload || 'Al robar se barajarán de nuevo'}`
            : ''}
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={drawFlickeringBoarCardNow}
            className="min-h-7 rounded-md bg-amber-700 px-2 text-[0.65rem] font-bold text-white hover:bg-amber-600"
          >
            🎴 {exhausted ? (t.boarDeckReloadButton || 'Recargar y robar') : (t.boarDeckDraw || 'Robar')}
          </button>
          <button
            type="button"
            onClick={resetFlickeringBoarDeck}
            className="min-h-7 rounded-md bg-slate-700 px-2 text-[0.65rem] font-bold text-white hover:bg-slate-600"
          >
            {t.boarDeckReset || 'Reiniciar'}
          </button>
        </div>
      </div>
    </section>
  );
}
