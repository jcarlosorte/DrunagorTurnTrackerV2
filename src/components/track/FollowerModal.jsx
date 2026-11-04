import { useEffect, useRef, useState } from 'react';
import { GiHeartBeats, GiFootprint, GiBroadsword, GiBowArrow } from 'react-icons/gi';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRules } from '@/context/RulesContext';
import { getAllyStatusCatalog } from '@/data/estadosAlterados';
import { getFollower, getFollowerState } from '@/data/followers';
import { getFollowerAbility } from '@/data/followerAbilities';
import ConfirmDialog from '@/components/ConfirmDialog';
import useFocusTrap from '@/hooks/useFocusTrap';

/**
 * Ficha ampliada de un seguidor: vida, estados alterados, ataque y capacidades.
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
  const AttackIcon = follower.attackType === 'distancia' ? GiBowArrow : GiBroadsword;
  const abilities = (follower.capabilities || [])
    .map((label) => getFollowerAbility(label))
    .filter(Boolean)
    .filter((ability) => !ability.rulesVersion || ability.rulesVersion === rulesVersion);

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

  return (
    <div className="layer-dialog fixed inset-0 flex items-center justify-center bg-black/70 p-3" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="follower-modal-title"
        className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border-2 border-emerald-900/60 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <header className="relative h-48 shrink-0 overflow-hidden sm:h-56">
          {(entry.background || follower.image) && (
            <img
              src={entry.background || follower.image}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-sm"
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" aria-hidden="true" />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close || 'Cerrar'}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/80 text-sm font-bold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            ✕
          </button>
          {follower.image && (
            <img
              src={follower.image}
              alt={follower.name}
              className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)]"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-emerald-300">
              {rolesT[follower.role] || follower.role} · {state?.name}
            </p>
            <h2 id="follower-modal-title" className="text-2xl font-black text-white">{follower.name}</h2>
            <p className="text-xs text-slate-300">{follower.epithet}</p>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-center">
              <AttackIcon className="mx-auto text-lg text-amber-300" aria-hidden="true" />
              <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">{t.attack || 'Ataque'}</p>
              <p className="text-lg font-black tabular-nums">{state?.ataque}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-center">
              <GiFootprint className="mx-auto text-lg text-sky-300" aria-hidden="true" />
              <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">{t.movement || 'Movimiento'}</p>
              <p className="text-lg font-black tabular-nums">{state?.movimiento}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-center">
              <GiHeartBeats className="mx-auto text-lg text-rose-300" aria-hidden="true" />
              <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">{t.life || 'Vida'}</p>
              <p className="text-lg font-black tabular-nums">{vida}/{vidaMax}</p>
            </div>
          </div>

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              {t.life || 'Vida'}
            </p>
            <div className="mb-1.5 h-2 w-full overflow-hidden rounded bg-red-950">
              <div
                className="h-full rounded bg-red-500"
                style={{ width: `${Math.max(0, Math.min(100, (vida / Math.max(vidaMax, 1)) * 100))}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              {[-1, 1].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => changeVida(delta)}
                  className={`min-h-9 flex-1 rounded-lg border text-sm font-bold ${
                    delta < 0
                      ? 'border-red-800 bg-red-900/70 text-red-100 hover:bg-red-800'
                      : 'border-emerald-800 bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </section>

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

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              {t.abilities || 'Capacidades'}
            </p>
            {abilities.length === 0 ? (
              <p className="text-xs text-slate-400">—</p>
            ) : (
              <ul className="space-y-1.5">
                {abilities.map((ability) => (
                  <li key={ability.id} className={`rounded-lg border px-2 py-1.5 ${ability.color}`}>
                    <p className="text-xs font-bold">{ability.name}</p>
                    <p className="text-[0.65rem] leading-snug text-white/80">{ability.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <button
            type="button"
            onClick={() => setConfirmRemove(true)}
            className="min-h-10 w-full rounded-xl border border-red-700 bg-red-900/50 px-3 text-sm font-bold text-red-100 hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            {t.followerRemove || 'Quitar del track'}
          </button>
        </div>

        <footer className="flex justify-end border-t border-slate-700 px-4 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 rounded-lg bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            {t.close || 'Cerrar'}
          </button>
        </footer>
      </div>

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
