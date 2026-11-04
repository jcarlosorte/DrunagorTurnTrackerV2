import { useEffect, useRef, useState } from 'react';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRules } from '@/context/RulesContext';
import { getAllyStatusCatalog } from '@/data/estadosAlterados';
import { getFollower, getFollowerState } from '@/data/followers';
import { getFollowerAbility } from '@/data/followerAbilities';
import { getCompanionBackground } from '@/data/companions';
import AllyDetailModal from '@/components/track/AllyDetailModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import useFocusTrap from '@/hooks/useFocusTrap';

/**
 * Ficha ampliada de un seguidor, con el mismo formato que mascotas y compañeros.
 */
export default function FollowerModal({ uid, onClose }) {
  const { trackerData, setTrackerData } = useTracker();
  const { translations } = useLanguage();
  const { rulesVersion } = useRules();
  const t = translations.trackerInit || {};
  const rolesT = translations.roles || {};
  const dialogRef = useRef(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useFocusTrap(dialogRef, true);

  const entry = (trackerData.followers || []).find((item) => item.uid === uid);
  const follower = entry ? getFollower(entry.id) : null;
  const state = entry ? getFollowerState(entry.id, entry.stateId) : null;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!entry || !follower) return null;

  const vida = entry.vida ?? state?.vida ?? 0;
  const vidaMax = entry.vidaMax ?? state?.vida ?? 1;
  const estados = entry.estadosAlterados || [];
  const catalogue = getAllyStatusCatalog(rulesVersion);
  const countOf = (id) => estados.find((estado) => estado.id === id)?.count || 0;
  const background = entry.background || getCompanionBackground(entry.id);
  const abilities = (follower.capabilities || [])
    .map((label) => getFollowerAbility(label))
    .filter(Boolean)
    .filter((ability) => !ability.rulesVersion || ability.rulesVersion === rulesVersion)
    .map((ability) => ({ id: ability.id, label: ability.label, description: ability.description }));

  const update = (changes) => {
    setTrackerData((prev) => ({
      ...prev,
      followers: (prev.followers || []).map((item) => (
        item.uid === uid ? { ...item, ...changes } : item
      )),
    }));
  };

  const changeVida = (delta) => {
    update({ vida: Math.max(0, Math.min(vidaMax, vida + delta)) });
  };

  const changeEstado = (estado, delta) => {
    const current = countOf(estado.id);
    const next = Math.max(0, Math.min(estado.max || 1, current + delta));
    const rest = estados.filter((item) => item.id !== estado.id);
    update({ estadosAlterados: next > 0 ? [...rest, { id: estado.id, count: next }] : rest });
  };

  const remove = () => {
    setTrackerData((prev) => ({
      ...prev,
      followers: (prev.followers || []).filter((item) => item.uid !== uid),
    }));
    setConfirmRemove(false);
    onClose?.();
  };

  const statusPanel = (
    <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
      <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
        {t.alteredStates || 'Estados alterados'}
      </p>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {catalogue.map((estado) => {
          const count = countOf(estado.id);
          return (
            <div
              key={estado.id}
              title={estado.texto}
              className={`flex items-center gap-1 rounded-lg border px-1 py-0.5 ${
                count > 0 ? 'border-amber-700/70 bg-amber-950/40' : 'border-slate-700 bg-slate-800/60'
              }`}
            >
              {estado.imagen && (
                <img src={estado.imagen} alt="" className="h-5 w-5 shrink-0 object-contain" loading="lazy" />
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
        titleId="follower-modal-title"
        image={follower.image}
        background={background}
        name={follower.name}
        subtitle={follower.epithet}
        roleLabel={`${rolesT[follower.role] || follower.role} · ${state?.name || ''}`}
        movement={state?.movimiento}
        attack={state?.ataque}
        attackType={follower.attackType}
        life={vida}
        lifeMax={vidaMax}
        lifeTestId="follower-life"
        onLifeChange={changeVida}
        abilities={abilities}
        activeStatuses={estados}
        statusPanel={statusPanel}
        onDelete={() => setConfirmRemove(true)}
        onClose={onClose}
      />

      <ConfirmDialog
        open={confirmRemove}
        title={t.followerRemoveTitle || 'Quitar seguidor'}
        description={t.followerRemoveConfirm || 'El seguidor se retirará del track.'}
        confirmLabel={t.followerRemove || 'Quitar del track'}
        cancelLabel={translations.trackerSelect?.cancel || 'Cancelar'}
        onCancel={() => setConfirmRemove(false)}
        onConfirm={remove}
      />
    </div>
  );
}
