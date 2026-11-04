import { useEffect, useRef, useState } from 'react';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { getAllyStatusCatalog } from '@/data/estadosAlterados';
import { getCompanion, getCompanionBackground, getCompanionImage } from '@/data/companions';
import { parseCompanionAbilities } from '@/utils/companionAbilities';
import ConfirmDialog from '@/components/ConfirmDialog';
import AllyDetailModal from '@/components/track/AllyDetailModal';
import useFocusTrap from '@/hooks/useFocusTrap';
import useGlossary from '@/hooks/useGlossary';
import { useRules } from '@/context/RulesContext';
import { getEstadoLogo2 } from '@/data/estados2';
import { CHAOS_SEED_DAMAGE, isChaosSeedBurst } from '@/utils/chaosSeed';

/**
 * Ficha de un compañero o mascota, con el mismo formato que los seguidores.
 */
export default function ModalCompanionCard({ uid, onClose }) {
  const { trackerData, setTrackerData } = useTracker();
  const { translations } = useLanguage();
  const { rulesVersion } = useRules();
  const { labels, descriptions } = useGlossary();
  const t = translations.heroes || {};
  const ti = translations.trackerInit || {};
  const dialogRef = useRef(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useFocusTrap(dialogRef, true);

  const entry = (trackerData.companions || []).find((item) => item.uid === uid);
  const companion = entry ? getCompanion(entry.id) : null;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!entry || !companion) return null;

  const image = getCompanionImage(companion.id);
  const background = getCompanionBackground(companion.id);
  const abilities = parseCompanionAbilities(companion.abilities, { labels, descriptions });
  const catalogue = getAllyStatusCatalog(rulesVersion);
  const estados = entry.estadosAlterados || [];
  const countOf = (id) => estados.find((estado) => estado.id === id)?.count || 0;
  const vidaMax = entry.vidaMax ?? companion.life;

  const update = (changes) => {
    setTrackerData((prev) => ({
      ...prev,
      companions: (prev.companions || []).map((item) => (
        item.uid === uid ? { ...item, ...changes } : item
      )),
    }));
  };

  const remove = () => {
    setTrackerData((prev) => ({
      ...prev,
      companions: (prev.companions || []).filter((item) => item.uid !== uid),
    }));
    setConfirmRemove(false);
    onClose?.();
  };

  const changeVida = (delta) => {
    const next = Math.max(0, Math.min(vidaMax, entry.vida + delta));
    update({ vida: next });
  };

  const changeEstado = (estado, delta) => {
    const current = countOf(estado.id);
    const next = Math.max(0, Math.min(estado.max || 1, current + delta));
    const rest = estados.filter((item) => item.id !== estado.id);
    if (isChaosSeedBurst(estado.id, next, rulesVersion)) {
      update({
        estadosAlterados: rest,
        vida: Math.max(0, entry.vida - CHAOS_SEED_DAMAGE),
      });
      return;
    }
    update({ estadosAlterados: next > 0 ? [...rest, { id: estado.id, count: next }] : rest });
  };

  const typeLabel = companion.type === 'mascota'
    ? (t.pet || 'Mascota')
    : (t.companion || 'Compañero');
  const subtitle = `${companion.alias}${companion.subtype && companion.subtype !== '-' ? ` · ${companion.subtype}` : ''}`;

  const statusPanel = (
    <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
      <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
        {t.alteredStates || 'Estados alterados'}
      </p>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {catalogue.map((estado) => {
          const count = countOf(estado.id);
          const logo = rulesVersion === '2.0' ? getEstadoLogo2(estado.id) : null;
          return (
            <div
              key={estado.id}
              title={descriptions[estado.id] || estado.texto}
              className={`flex items-center gap-1 rounded-lg border px-1 py-0.5 ${
                count > 0 ? 'border-amber-700/70 bg-amber-950/40' : 'border-slate-700 bg-slate-800/60'
              }`}
            >
              {(logo || estado.imagen) && (
                <img src={logo || estado.imagen} alt="" className="h-5 w-5 shrink-0 object-contain" loading="lazy" />
              )}
              <span className="min-w-0 flex-1 truncate text-[0.6rem] capitalize text-slate-200">{estado.texto}</span>
              <button
                type="button"
                onClick={() => changeEstado(estado, -1)}
                disabled={count <= 0}
                aria-label={`${estado.texto}: −1`}
                className="flex h-6 w-5 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-slate-600 disabled:opacity-40"
              >
                −
              </button>
              <span className="w-4 text-center text-[0.65rem] font-bold tabular-nums">{count}</span>
              <button
                type="button"
                onClick={() => changeEstado(estado, 1)}
                disabled={count >= (estado.max || 1)}
                aria-label={`${estado.texto}: +1`}
                className="flex h-6 w-5 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-slate-600 disabled:opacity-40"
              >
                +
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="layer-dialog fixed inset-0 flex items-center justify-center bg-black/70 p-3" role="presentation">
      <AllyDetailModal
        dialogRef={dialogRef}
        titleId="companion-title"
        image={image}
        background={background}
        name={companion.name}
        subtitle={subtitle}
        roleLabel={typeLabel}
        movement={companion.movement}
        attack={companion.attack}
        attackType={companion.attackType}
        life={entry.vida}
        lifeMax={vidaMax}
        lifeTestId="companion-life"
        onLifeChange={changeVida}
        abilities={abilities.map((ability, index) => ({
          id: ability.token || `ability-${index}`,
          label: ability.label,
          description: ability.description,
        }))}
        statusPanel={statusPanel}
        onDelete={() => setConfirmRemove(true)}
        onClose={onClose}
      />

      <ConfirmDialog
        open={confirmRemove}
        title={ti.companionsRemove || 'Eliminar compañero'}
        description={ti.companionsRemoveConfirm || 'Se quitará de la partida. Esta acción no se puede deshacer.'}
        confirmLabel={ti.companionsRemoveAction || 'Eliminar'}
        cancelLabel={translations.trackerSelect?.cancel || 'Cancelar'}
        onCancel={() => setConfirmRemove(false)}
        onConfirm={remove}
      />
    </div>
  );
}
