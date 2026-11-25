import { useEffect, useRef, useState } from 'react';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRules } from '@/context/RulesContext';
import { getAllyStatusCatalog } from '@/data/estadosAlterados';
import {
  getFollower,
  getFollowerEpithet,
  getFollowerName,
  getFollowerState,
  getFollowerStateName,
} from '@/data/followers';
import { getFollowerAbility } from '@/data/followerAbilities';
import { getCompanionBackground } from '@/data/companions';
import AllyDetailModal from '@/components/track/AllyDetailModal';
import AllyStatusGrid from '@/components/track/AllyStatusGrid';
import ConfirmDialog from '@/components/ConfirmDialog';
import useFocusTrap from '@/hooks/useFocusTrap';

/**
 * Ficha ampliada de un seguidor, con el mismo formato que mascotas y compañeros.
 */
export default function FollowerModal({ uid, onClose }) {
  const { trackerData, setTrackerData } = useTracker();
  const { language, translations } = useLanguage();
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
    .map((ability) => ({
      id: ability.id,
      label: language === 'en' ? String(ability.nameEn || ability.label).toUpperCase() : ability.label,
      description: language === 'en' ? ability.descriptionEn : ability.description,
    }));

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
    <section data-testid="ally-status-panel" className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
      <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
        {t.alteredStates || 'Estados alterados'}
      </p>
      <AllyStatusGrid
        catalogue={catalogue}
        countOf={countOf}
        onChange={changeEstado}
      />
    </section>
  );

  return (
    <div className="layer-dialog fixed inset-0 flex items-center justify-center bg-black/70 p-3" role="presentation">
      <AllyDetailModal
        dialogRef={dialogRef}
        titleId="follower-modal-title"
        image={follower.image}
        background={background}
        name={getFollowerName(follower, language)}
        subtitle={getFollowerEpithet(follower, language)}
        roleLabel={`${follower.cohort ? `${t.cohort || 'Acompañante'} · ` : ''}${rolesT[follower.role] || follower.role} · ${getFollowerStateName(state, language)}`}
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
