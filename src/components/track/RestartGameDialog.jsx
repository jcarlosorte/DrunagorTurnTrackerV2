import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Reinicio de partida por capas.
 *
 * Turno e historial se reinician siempre. El resto se agrupa para que el
 * diálogo no acumule demasiadas opciones.
 */
export default function RestartGameDialog({ open, onClose, onConfirm }) {
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  const [runas, setRunas] = useState(false);
  const [heroes, setHeroes] = useState(false);
  const [enemies, setEnemies] = useState(true);
  const [events, setEvents] = useState(false);

  useEffect(() => {
    if (open) {
      setRunas(false);
      setHeroes(false);
      setEnemies(true);
      setEvents(false);
    }
  }, [open]);

  return (
    <ConfirmDialog
      open={open}
      title={t.restartTitle || 'Reiniciar partida'}
      description={t.restartDescription || 'Se reiniciarán el turno y el historial. Elige qué más quieres reiniciar.'}
      confirmLabel={t.restartAction || 'Reiniciar partida'}
      cancelLabel={translations.trackerSelect?.cancel || 'Cancelar'}
      onCancel={onClose}
      onConfirm={() => onConfirm({ runas, heroes, enemies, events })}
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
            <span className="block font-semibold text-slate-100">{t.restartHeroesGroup || 'Héroes, compañeros, mascotas y seguidores'}</span>
            <span className="block text-xs text-slate-400">
              {t.restartHeroesGroupHint || 'Vida al máximo, sin estados ni recursos y cubos recobrados para todo el grupo.'}
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-sm">
          <input
            type="checkbox"
            checked={enemies}
            onChange={(event) => setEnemies(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-sky-400"
          />
          <span>
            <span className="block font-semibold text-slate-100">{t.restartEnemies || 'Reiniciar enemigos'}</span>
            <span className="block text-xs text-slate-400">
              {t.restartEnemiesHint || 'Elimina enemigos, cartas de ataque y el monstruo de escenario.'}
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-sm">
          <input
            type="checkbox"
            checked={events}
            onChange={(event) => setEvents(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-fuchsia-400"
          />
          <span>
            <span className="block font-semibold text-slate-100">{t.restartEventsGroup || 'Eventos, mazos especiales y aldeanos'}</span>
            <span className="block text-xs text-slate-400">
              {t.restartEventsGroupHint || 'Sorpresas, mazos de escenario, cañones, Visión Clara y aldeanos en apuros.'}
            </span>
          </span>
        </label>
      </div>
    </ConfirmDialog>
  );
}
