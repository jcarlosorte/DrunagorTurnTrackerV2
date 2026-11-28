import { getAuraCapability, getAuraEffect, getAuraName } from '@/data/heroes/index';

/** Aviso persistente del aura activa durante el turno de un héroe. */
export default function AuraNoticeBanner({ heroName, aura, language, labels = {} }) {
  if (!aura) return null;
  const name = getAuraName(aura.id, language);
  const capability = getAuraCapability(aura.id, language);
  const effect = getAuraEffect(aura.id, language);

  return (
    <div
      role="status"
      data-testid="aura-notice"
      data-aura-id={aura.id}
      className="mb-2 flex flex-wrap items-start gap-2 rounded-xl border border-amber-700/70 bg-amber-950/40 p-2 text-amber-100"
    >
      <span className="shrink-0 text-xs font-black uppercase tracking-wide">
        ✦ {labels.title || 'Aura activa'}
      </span>
      <span className="min-w-0 flex-1 text-[0.72rem] leading-snug">
        <span className="font-semibold text-amber-50">{heroName}</span>
        <span className="text-amber-300/80"> · </span>
        <span className="font-semibold text-amber-50">{name}</span>
        <span className="text-amber-300/80"> · </span>
        <span>{capability}</span>
        {aura.scope === 'party' && (
          <span className="ml-1 rounded bg-sky-900/60 px-1 text-[0.55rem] uppercase tracking-wide text-sky-200">
            {labels.party || 'Grupo'}
          </span>
        )}
      </span>
      {effect && (
        <details className="min-w-0">
          <summary className="cursor-pointer rounded bg-amber-800 px-2 py-1 text-[0.65rem] font-bold text-white hover:bg-amber-700">
            {labels.details || 'Detalles'}
          </summary>
          <p className="mt-1 max-w-xl whitespace-pre-line text-[0.68rem] leading-snug text-amber-100/90">
            {effect}
          </p>
        </details>
      )}
    </div>
  );
}
