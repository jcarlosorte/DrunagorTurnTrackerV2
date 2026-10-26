import { useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { createStorageSnapshot, importStorageSnapshot } from '@/utils/storage';

export default function SaveGameActions({ compact = false }) {
  const { translations } = useLanguage();
  const inputRef = useRef(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [importScope, setImportScope] = useState('full');
  const [feedback, setFeedback] = useState('');
  const t = translations?.config || {};

  const exportGame = (scope, filename) => {
    const snapshot = createStorageSnapshot(scope);
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `drunagor-${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback(scope === 'configuration'
      ? (t.exportConfigSuccess || 'Configuración exportada correctamente.')
      : (t.exportSuccess || 'Partida exportada correctamente.'));
  };

  const selectImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const snapshot = JSON.parse(await file.text());
      if (!snapshot || ![1, 2].includes(snapshot.schemaVersion)) throw new Error('Formato no compatible');
      const fileScope = snapshot.schemaVersion === 2 ? snapshot.scope : 'full';
      const allowedScope = ['configuration', 'track', 'full'].includes(fileScope) ? fileScope : 'full';
      setPendingImport({ snapshot, name: file.name, allowedScope });
      setImportScope(allowedScope === 'configuration' || allowedScope === 'track' ? allowedScope : 'full');
      setFeedback('');
    } catch {
      setFeedback(t.importError || 'No se pudo leer la partida seleccionada.');
    }
  };

  const confirmImport = () => {
    try {
      importStorageSnapshot(pendingImport.snapshot, importScope);
      window.location.reload();
    } catch {
      setPendingImport(null);
      setFeedback(t.importError || 'La partida no es válida.');
    }
  };

  return (
    <section className={compact ? 'flex flex-wrap items-center gap-2' : 'rounded-2xl border border-slate-600 bg-slate-800/80 p-4'} aria-labelledby="save-game-title">
      {!compact && <h2 id="save-game-title" className="mb-3 text-lg font-bold text-white">{t.savedGames || 'Partidas guardadas'}</h2>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => exportGame('full', 'partida')} className="min-h-11 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
          {t.exportGame || 'Exportar partida'}
        </button>
        <button type="button" onClick={() => exportGame('configuration', 'configuracion')} className="min-h-11 rounded-lg border border-emerald-500/70 bg-emerald-950 px-4 py-2 font-semibold text-emerald-100 transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
          {t.exportConfig || 'Exportar configuración'}
        </button>
        <button type="button" onClick={() => inputRef.current?.click()} className="min-h-11 rounded-lg border border-slate-500 bg-slate-700 px-4 py-2 font-semibold text-white transition hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
          {t.importGame || 'Importar JSON'}
        </button>
        <input ref={inputRef} type="file" accept="application/json,.json" onChange={selectImportFile} className="sr-only" aria-label={t.importGame || 'Importar JSON'} />
      </div>

      {pendingImport && (
        <div className="mt-3 rounded-lg border border-amber-500/60 bg-amber-950/40 p-3 text-left text-sm text-amber-100" role="alert">
          <p>{t.confirmImport || '¿Qué parte quieres importar?'}</p>
          <p className="mt-1 truncate text-amber-200/80">{pendingImport.name}</p>
          <label htmlFor="import-scope" className="mt-3 block font-semibold">{t.importScope || 'Contenido'}</label>
          <select
            id="import-scope"
            value={importScope}
            onChange={(event) => setImportScope(event.target.value)}
            disabled={pendingImport.allowedScope !== 'full'}
            className="mt-1 min-h-11 w-full rounded-lg border border-amber-500/50 bg-slate-900 px-3 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          >
            {pendingImport.allowedScope === 'full' && <option value="full">{t.fullSave || 'Configuración y track'}</option>}
            {(pendingImport.allowedScope === 'full' || pendingImport.allowedScope === 'configuration') && <option value="configuration">{t.onlyConfig || 'Solo configuración'}</option>}
            {(pendingImport.allowedScope === 'full' || pendingImport.allowedScope === 'track') && <option value="track">{t.onlyTrack || 'Solo track'}</option>}
          </select>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={confirmImport} className="min-h-11 rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
              {t.confirm || 'Confirmar'}
            </button>
            <button type="button" onClick={() => setPendingImport(null)} className="min-h-11 rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200">
              {t.cancel || 'Cancelar'}
            </button>
          </div>
        </div>
      )}

      {feedback && <p className="mt-3 text-sm text-emerald-200" role="status" aria-live="polite">{feedback}</p>}
    </section>
  );
}
