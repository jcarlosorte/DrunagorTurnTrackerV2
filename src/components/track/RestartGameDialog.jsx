import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Reinicio de partida por capas.
 *
 * Turno, historial y enemigos se reinician siempre; runas y héroes son
 * opcionales para no borrar progreso por accidente.
 */
export default function RestartGameDialog({ open, onClose, onConfirm }) {
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  const [runas, setRunas] = useState(false);
  const [heroes, setHeroes] = useState(false);

  useEffect(() => {
    if (open) {
      setRunas(false);
      setHeroes(false);
    }
  }, [open]);

  return (
    <ConfirmDialog
      open={open}
      title={t.restartTitle || 'Reiniciar partida'}
      description={t.restartDescription || 'Se reiniciarán el turno, el historial y los enemigos. Elige qué más quieres reiniciar.'}
      confirmLabel={t.restartAction || 'Reiniciar partida'}
      cancelLabel={translations.trackerSelect?.cancel || 'Cancelar'}
      onCancel={onClose}
      onConfirm={() => onConfirm({ runas, heroes })}
    >
      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-sm">
          <input
            type="checkbox"
            checked={runas}
            onChange={(event) => setRunas(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-amber-400"
          />
          <span>
            <span className="block font-semibold text-slate-100">{t.restartRunes || 'Reiniciar runas'}</span>
            <span className="block text-xs text-slate-400">
              {t.restartRunesHint || 'Cartas, fichas, pilas, nodos y mecánicas activas.'}
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-sm">
          <input
            type="checkbox"
            checked={heroes}
            onChange={(event) => setHeroes(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-rose-400"
          />
          <span>
            <span className="block font-semibold text-slate-100">{t.restartHeroes || 'Restablecer héroes'}</span>
            <span className="block text-xs text-slate-400">
              {t.restartHeroesHint || 'Vida al máximo, sin estados ni recursos y cubos recobrados.'}
            </span>
          </span>
        </label>
      </div>
    </ConfirmDialog>
  );
}
