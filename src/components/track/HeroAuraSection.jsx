import { useState } from 'react';
import {
  canHeroChooseAura,
  getAura,
  getAuraCapability,
  getAuraEffect,
  getAuraName,
  getAurasForCampaign,
  isLeaderRole,
} from '@/data/heroes/index';
import { getHeroExtras } from '@/utils/heroExtras';

const GROUP_LABEL_KEYS = {
  'leader-private': 'auraGroupLeaderPrivate',
  'leader-party': 'auraGroupLeaderParty',
  'hero-private': 'auraGroupHeroPrivate',
};

function AuraCard({ aura, language, t, editable, onRemove, testId, party = false }) {
  if (!aura) return null;
  const groupLabel = t[GROUP_LABEL_KEYS[aura.group]] || '';
  return (
    <div
      data-testid={testId}
      className="rounded-lg border border-amber-900/60 bg-amber-950/20 px-2 py-1.5"
    >
      <div className="flex items-start gap-1.5">
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1">
            <span className="font-semibold text-amber-100">{getAuraName(aura.id, language)}</span>
            {groupLabel && (
              <span className="rounded bg-amber-900/60 px-1 text-[0.55rem] uppercase tracking-wide text-amber-200">
                {groupLabel}
              </span>
            )}
            {party && (
              <span className="rounded bg-sky-900/60 px-1 text-[0.55rem] uppercase tracking-wide text-sky-200">
                {t.auraPartyVisible || 'Visible para todo el grupo'}
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-[0.65rem] font-semibold text-amber-300">
            {getAuraCapability(aura.id, language)}
          </span>
          <span className="mt-0.5 block text-[0.65rem] leading-snug text-slate-400">
            {getAuraEffect(aura.id, language)}
          </span>
        </span>
        {editable && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`${getAuraName(aura.id, language)}: ${t.remove || 'Quitar'}`}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-red-700"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Sección de Auras del Diario de Campaña.
 *
 * - Solo se muestran las auras de la campaña activa.
 * - El líder puede elegir cualquiera de las 20 auras base.
 * - El resto solo puede elegir las individuales.
 * - Las auras de grupo del líder se muestran en la ficha de todos los héroes.
 */
export default function HeroAuraSection({
  heroId,
  role,
  language,
  t,
  extras,
  campaign = 'core',
  placedHeroes = [],
  onSelectAura,
  onRemoveAura,
  getHeroName,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const campaignAuras = getAurasForCampaign(campaign);
  const ownAuraCandidate = getAura((extras.auras || [])[0]);
  const ownAura = ownAuraCandidate?.campaign === campaign ? ownAuraCandidate : null;
  const leader = isLeaderRole(role);
  const available = campaignAuras.filter((aura) => (
    canHeroChooseAura(aura, role) && aura.id !== ownAura?.id
  ));
  const partyAuras = (placedHeroes || [])
    .filter((hero) => hero.id !== heroId)
    .map((hero) => ({
      heroId: hero.id,
      aura: getAura((getHeroExtras(hero.id).auras || [])[0]),
    }))
    .filter((entry) => entry.aura?.campaign === campaign && entry.aura?.visibility === 'party');

  if (campaignAuras.length === 0) return null;

  return (
    <section
      data-testid="hero-aura-section"
      className="rounded-xl border border-amber-900/50 bg-slate-950/60 p-2"
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="text-[0.7rem] font-bold uppercase tracking-wide text-amber-200">
          {t.auras || 'Auras'}
        </p>
        <button
          type="button"
          data-testid="hero-aura-add"
          onClick={() => setPickerOpen((value) => !value)}
          className="min-h-7 rounded-lg bg-amber-800 px-2 text-[0.7rem] font-semibold text-white hover:bg-amber-700"
        >
          + {t.add || 'Añadir'}
        </button>
      </div>

      <p className="mb-1.5 text-[0.62rem] text-slate-400">
        {t.auraHint || 'Solo puedes tener 1 aura. Se pierde al recibir Trauma o al elegir otra.'}
      </p>

      {pickerOpen && (
        <div
          data-testid="hero-aura-picker"
          className="mb-2 max-h-60 space-y-1 overflow-y-auto rounded-lg border border-amber-800/60 bg-slate-900 p-1"
        >
          {!leader && (
            <p className="px-1 py-1 text-[0.65rem] text-amber-200/80">
              {t.auraLeaderOnlyHint || 'Las auras de líder solo puede elegirlas el líder.'}
            </p>
          )}
          {available.length === 0 && (
            <p className="px-1 py-1 text-[0.7rem] text-slate-400">
              {t.allAdded || 'Todas añadidas.'}
            </p>
          )}
          {available.map((aura) => (
            <button
              key={aura.id}
              type="button"
              data-testid={`hero-aura-option-${aura.id}`}
              onClick={() => {
                onSelectAura(aura.id);
                setPickerOpen(false);
              }}
              className="block w-full rounded px-1.5 py-1 text-left text-[0.7rem] text-slate-200 hover:bg-slate-800"
            >
              <span className="flex flex-wrap items-center gap-1">
                <span className="font-semibold">{getAuraName(aura.id, language)}</span>
                <span className="rounded bg-slate-800 px-1 text-[0.55rem] text-amber-300">
                  {t[GROUP_LABEL_KEYS[aura.group]] || ''}
                </span>
              </span>
              <span className="block text-[0.65rem] text-amber-300/90">
                {getAuraCapability(aura.id, language)}
              </span>
              <span className="block text-[0.65rem] text-slate-400">
                {getAuraEffect(aura.id, language)}
              </span>
            </button>
          ))}
        </div>
      )}

      {!ownAura && partyAuras.length === 0 && (
        <p className="px-1 text-[0.7rem] text-slate-400">{t.noneAdded || 'Ninguna añadida.'}</p>
      )}

      {ownAura && (
        <AuraCard
          aura={ownAura}
          language={language}
          t={t}
          editable
          onRemove={onRemoveAura}
          testId={`hero-aura-current-${ownAura.id}`}
        />
      )}

      {partyAuras.map(({ heroId: ownerId, aura }) => (
        <div key={ownerId} className="mt-1.5">
          <p className="mb-1 text-[0.6rem] uppercase tracking-wide text-sky-300">
            {getHeroName(ownerId)} · {t.auraLeaderPartyBadge || 'Aura de grupo'}
          </p>
          <AuraCard
            aura={aura}
            language={language}
            t={t}
            editable={false}
            testId={`hero-aura-party-${ownerId}`}
            party
          />
        </div>
      ))}
    </section>
  );
}
