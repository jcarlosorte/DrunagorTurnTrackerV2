import { useState } from 'react';
import { GiScrollUnfurled } from 'react-icons/gi';
import { getConsecuenciaName, getConsecuenciasForCampaign } from '@/data/heroes/index';
import { normalizeCampRecord, withConsecuencia } from '@/utils/campRecord';

/**
 * Panel compartido de Consecuencias (Outcomes).
 *
 * No pertenece a un héroe concreto: se guarda en trackerData.campRecord y
 * todas las fichas y el Seguimiento de Historia muestran la misma lista.
 * Solo se muestran las consecuencias de la campaña activa.
 */
export default function SharedConsequencesPanel({
  record,
  onUpdate,
  language = 'es',
  campaign = 'core',
  t = {},
  testId = 'camp-consequences',
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const catalogue = getConsecuenciasForCampaign(campaign);
  const catalogueIds = new Set(catalogue.map((consequence) => consequence.id));
  const normalized = normalizeCampRecord(record);
  const selected = normalized.consecuencias.filter((id) => catalogueIds.has(id));
  const selectedSet = new Set(selected);
  const byId = new Map(catalogue.map((consequence) => [consequence.id, consequence]));
  const available = catalogue.filter((consequence) => !selectedSet.has(consequence.id));

  const toggle = (id) => {
    if (!catalogueIds.has(id)) return;
    onUpdate?.(withConsecuencia(normalized, id, !selectedSet.has(id)));
  };

  if (catalogue.length === 0) return null;

  return (
    <section
      data-testid={testId}
      className="flex h-full flex-col rounded-xl border border-rose-900/50 bg-rose-950/20 p-2"
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <GiScrollUnfurled className="shrink-0 text-base text-rose-300" aria-hidden="true" />
          <h3 className="truncate text-[0.7rem] font-bold uppercase tracking-wide text-slate-200">
            {t.consecuencias || 'Consecuencias'}
          </h3>
          <span className="hidden shrink-0 rounded bg-rose-900/60 px-1 text-[0.5rem] uppercase tracking-wide text-rose-200 sm:inline">
            {t.consecuenciasShared || 'Compartidas'}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums">
            {selected.length}
          </span>
          <button
            type="button"
            data-testid={`${testId}-add`}
            onClick={() => setPickerOpen((value) => !value)}
            aria-expanded={pickerOpen}
            disabled={available.length === 0}
            className="min-h-7 rounded-lg bg-rose-800 px-2 text-[0.7rem] font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + {t.add || 'Añadir'}
          </button>
        </div>
      </div>

      <p className="mb-1.5 text-[0.62rem] leading-snug text-slate-400">
        {t.consecuenciasHint || 'Se comparten con todo el grupo y se guardan en el Seguimiento de Historia.'}
      </p>

      {pickerOpen && (
        <div
          data-testid={`${testId}-picker`}
          className="mb-1.5 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-rose-800/60 bg-slate-900 p-1"
        >
          {available.length === 0 ? (
            <p className="px-1 py-1 text-[0.7rem] text-slate-400">{t.allAdded || 'Todas añadidas.'}</p>
          ) : available.map((consequence) => (
            <button
              key={consequence.id}
              type="button"
              data-testid={`${testId}-option-${consequence.id}`}
              onClick={() => {
                toggle(consequence.id);
                setPickerOpen(false);
              }}
              className="flex w-full items-center gap-1 rounded px-1.5 py-1 text-left text-[0.7rem] text-slate-200 hover:bg-slate-800"
            >
              <span className="min-w-0 flex-1 truncate font-semibold">
                {getConsecuenciaName(consequence.id, language)}
              </span>
              {consequence.special && (
                <span className="shrink-0 rounded bg-rose-900/70 px-1 text-[0.55rem] uppercase tracking-wide text-rose-200">
                  {t.consecuenciasSpecial || 'Especial'}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {selected.length === 0 ? (
        <p className="flex flex-1 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-2 text-center text-[0.68rem] text-slate-400">
          {t.consecuenciasEmpty || 'Sin consecuencias anotadas.'}
        </p>
      ) : (
        <ul className="mt-1 flex flex-wrap gap-1">
          {selected.map((id) => (
            <li
              key={id}
              data-testid={`${testId}-item-${id}`}
              className="flex items-center gap-1 rounded-full border border-rose-900/60 bg-slate-900/80 px-1.5 py-0.5 text-[0.65rem] text-slate-200"
            >
              <span className="max-w-52 truncate">{getConsecuenciaName(id, language)}</span>
              {byId.get(id)?.special && (
                <span className="shrink-0 rounded bg-rose-900/70 px-1 text-[0.5rem] uppercase tracking-wide text-rose-200">
                  {t.consecuenciasSpecial || 'Especial'}
                </span>
              )}
              <button
                type="button"
                onClick={() => toggle(id)}
                aria-label={`${getConsecuenciaName(id, language)}: ${t.remove || 'Quitar'}`}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[0.6rem] leading-none text-white hover:bg-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
