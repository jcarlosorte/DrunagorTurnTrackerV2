import { useEffect, useRef, useState } from 'react';
import { GiHeartBeats, GiFootprint, GiBroadsword } from 'react-icons/gi';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { getFollower, getFollowerState } from '@/data/followers';
import ConfirmDialog from '@/components/ConfirmDialog';
import useFocusTrap from '@/hooks/useFocusTrap';

/**
 * Ficha ampliada de un seguidor: estados, capacidades y resto de información.
 */
export default function FollowerModal({ uid, onClose }) {
  const { trackerData, setTrackerData } = useTracker();
  const { translations } = useLanguage();
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

  const update = (changes) => {
    setTrackerData((prev) => ({
      ...prev,
      followers: (prev.followers || []).map((item) => (
        item.uid === uid ? { ...item, ...changes } : item
      )),
    }));
  };

  const remove = () => {
    setTrackerData((prev) => ({
      ...prev,
      followers: (prev.followers || []).filter((item) => item.uid !== uid),
    }));
    setConfirmRemove(false);
    onClose?.();
  };

  const attackLabel = follower.attackType === 'distancia' ? 'A distancia' : 'Cuerpo a cuerpo';

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
          {follower.image && (
            <img
              src={follower.image}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-sm"
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
              {rolesT[follower.role] || follower.role} · {t.follower || 'Seguidor'}
            </p>
            <h2 id="follower-modal-title" className="text-2xl font-black text-white">{follower.name}</h2>
            <p className="text-xs text-slate-300">{follower.epithet}</p>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="follower-modal-state" className="text-xs font-semibold text-slate-200">
              {t.followersState || 'Estado'}
            </label>
            <select
              id="follower-modal-state"
              value={entry.stateId}
              onChange={(event) => update({ stateId: event.target.value })}
              className="min-h-9 rounded-lg border border-slate-600 bg-slate-800 px-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              {follower.states.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-center">
              <GiHeartBeats className="mx-auto text-lg text-rose-300" aria-hidden="true" />
              <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">Vida</p>
              <p className="text-lg font-black tabular-nums">{state?.vida}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-center">
              <GiBroadsword className="mx-auto text-lg text-amber-300" aria-hidden="true" />
              <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">Ataque</p>
              <p className="text-lg font-black tabular-nums">{state?.ataque}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-center">
              <GiFootprint className="mx-auto text-lg text-sky-300" aria-hidden="true" />
              <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">Movimiento</p>
              <p className="text-lg font-black tabular-nums">{state?.movimiento}</p>
            </div>
          </div>

          <section>
            <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-wide text-slate-400">Tipo de ataque</p>
            <p className="text-sm text-slate-200">{attackLabel}</p>
          </section>

          <section>
            <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-wide text-slate-400">Capacidades</p>
            <div className="flex flex-wrap gap-1.5">
              {(follower.capabilities || []).map((ability) => (
                <span key={ability} className="rounded-full border border-emerald-700/60 bg-emerald-950/50 px-2 py-0.5 text-xs font-semibold text-emerald-100">
                  {ability}
                </span>
              ))}
              {(follower.capabilities || []).length === 0 && (
                <span className="text-xs text-slate-400">Sin capacidades.</span>
              )}
            </div>
          </section>

          <section>
            <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-wide text-slate-400">Estados</p>
            <div className="overflow-hidden rounded-xl border border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-800/80 text-slate-300">
                  <tr>
                    <th className="px-2 py-1 text-left font-semibold">Estado</th>
                    <th className="px-2 py-1 text-center font-semibold">Vida</th>
                    <th className="px-2 py-1 text-center font-semibold">Ataque</th>
                    <th className="px-2 py-1 text-center font-semibold">Mov.</th>
                  </tr>
                </thead>
                <tbody>
                  {follower.states.map((item) => (
                    <tr
                      key={item.id}
                      className={item.id === entry.stateId ? 'bg-emerald-950/50 text-emerald-100' : 'bg-slate-950/40 text-slate-300'}
                    >
                      <td className="px-2 py-1 font-semibold">{item.name}</td>
                      <td className="px-2 py-1 text-center tabular-nums">{item.vida}</td>
                      <td className="px-2 py-1 text-center tabular-nums">{item.ataque}</td>
                      <td className="px-2 py-1 text-center tabular-nums">{item.movimiento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
