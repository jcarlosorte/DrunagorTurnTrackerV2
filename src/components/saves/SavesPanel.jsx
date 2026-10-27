import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  applyStorageData,
  createStorageSnapshot,
  extractSnapshotData,
  formatBytes,
  getStorageUsage,
  STORAGE_WARNING_RATIO,
} from '@/utils/storage';
import { sanitizeConfiguration } from '@/utils/configValidation';
import { deleteGame, listSaves, loadGame, MAX_SAVES, saveGame } from '@/utils/saves';
import { exportGameLogText, readGameLog } from '@/utils/gameLog';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function SavesPanel({ mode = 'page' }) {
  const { translations } = useLanguage();
  const inputRef = useRef(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [importScope, setImportScope] = useState('full');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saves, setSaves] = useState([]);
  const [saveName, setSaveName] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [usage, setUsage] = useState(() => getStorageUsage());
  const [logCount, setLogCount] = useState(0);
  const t = translations?.saves || translations?.config || {};

  const refresh = () => {
    setSaves(listSaves());
    setUsage(getStorageUsage());
    setLogCount(readGameLog().length);
  };

  useEffect(() => {
    refresh();
  }, []);

  const notify = (type, text) => setFeedback({ type, text });

  const downloadLog = () => {
    const text = exportGameLogText();
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `drunagor-historial-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    notify('ok', t.exportLogSuccess || 'Historial exportado correctamente.');
  };

  const exportSnapshot = (scope, filename) => {
    const snapshot = createStorageSnapshot(scope);
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `drunagor-${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify('ok', scope === 'configuration'
      ? (t.exportConfigSuccess || 'Configuración exportada correctamente.')
      : (t.exportSuccess || 'Partida exportada correctamente.'));
  };

  const handleSave = () => {
    try {
      saveGame({ name: saveName, snapshot: createStorageSnapshot('full') });
      setSaveName('');
      refresh();
      notify('ok', t.saveSuccess || 'Partida guardada en este dispositivo.');
    } catch (error) {
      notify('error', error.message || 'No se pudo guardar la partida.');
    }
  };

  const handleLoad = (id) => {
    try {
      const record = loadGame(id);
      const data = extractSnapshotData(record.snapshot, 'full');
      const { data: sanitized } = sanitizeConfiguration(data);
      applyStorageData(sanitized, { scope: 'full' });
      window.location.reload();
    } catch (error) {
      notify('error', error.message || 'No se pudo cargar la partida.');
    }
  };

  const confirmDelete = () => {
    deleteGame(pendingDelete.id);
    setPendingDelete(null);
    refresh();
    notify('ok', t.deleteSuccess || 'Partida eliminada.');
  };

  const selectImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const snapshot = JSON.parse(await file.text());
      if (!snapshot || ![1, 2, 3].includes(Number(snapshot.schemaVersion))) throw new Error('Formato no compatible');
      const fileScope = Number(snapshot.schemaVersion) >= 2 ? snapshot.scope : 'full';
      const allowedScope = ['configuration', 'track', 'full'].includes(fileScope) ? fileScope : 'full';
      const initialScope = allowedScope === 'full' ? 'full' : allowedScope;

      const extracted = extractSnapshotData(snapshot, initialScope);
      const { warnings } = sanitizeConfiguration(extracted);

      setPendingImport({ snapshot, name: file.name, allowedScope, warnings });
      setImportScope(initialScope);
      notify('', '');
    } catch {
      setPendingImport(null);
      notify('error', t.importError || 'No se pudo leer la partida seleccionada.');
    }
  };

  const confirmImport = () => {
    try {
      const extracted = extractSnapshotData(pendingImport.snapshot, importScope);
      const { data } = sanitizeConfiguration(extracted);
      applyStorageData(data, { scope: importScope });
      window.location.reload();
    } catch {
      setPendingImport(null);
      notify('error', t.importError || 'La partida no es válida.');
    }
  };

  const quotaWarning = usage.ratio >= STORAGE_WARNING_RATIO;

  return (
    <section
      className={mode === 'drawer'
        ? 'space-y-4'
        : 'space-y-4 rounded-2xl border border-slate-600 bg-slate-800/80 p-4'}
      aria-labelledby="save-game-title"
    >
      {mode !== 'drawer' && (
        <h2 id="save-game-title" className="text-lg font-bold text-white">
          {t.savedGames || 'Partidas guardadas'}
        </h2>
      )}

      {/* Cuota */}
      <div>
        <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
          <span>{t.storageUsed || 'Almacenamiento local'}</span>
          <span>{formatBytes(usage.bytes)} / {formatBytes(usage.limit)}</span>
        </div>
        <div
          className="mt-1 h-2 overflow-hidden rounded-full bg-slate-700"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(usage.ratio * 100)}
          aria-label={t.storageUsed || 'Almacenamiento local'}
        >
          <div
            className={`h-full rounded-full ${quotaWarning ? 'bg-amber-400' : 'bg-emerald-500'}`}
            style={{ width: `${Math.max(usage.ratio * 100, 2)}%` }}
          />
        </div>
        {quotaWarning && (
          <p className="mt-2 rounded-lg border border-amber-500/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-100" role="alert">
            {t.quotaWarning || 'El almacenamiento local está casi lleno. Exporta tu partida para no perderla.'}
          </p>
        )}
      </div>

      {/* Guardar con nombre */}
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[10rem] flex-1">
          <label htmlFor="save-name" className="mb-1 block text-xs font-semibold text-slate-300">
            {t.saveName || 'Nombre de la partida'}
          </label>
          <input
            id="save-name"
            type="text"
            value={saveName}
            onChange={(event) => setSaveName(event.target.value)}
            maxLength={60}
            placeholder={t.saveNamePlaceholder || 'Campaña de los sábados'}
            className="min-h-11 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saves.length >= MAX_SAVES}
          className="min-h-11 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-50"
        >
          {t.saveGame || 'Guardar partida'}
        </button>
      </div>

      {/* Lista de partidas */}
      {saves.length === 0 ? (
        <p className="text-sm text-slate-400">{t.noSaves || 'Todavía no hay partidas guardadas en este dispositivo.'}</p>
      ) : (
        <ul className="space-y-2">
          {saves.map((save) => (
            <li key={save.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-950 p-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-100">{save.name}</p>
                <p className="text-xs text-slate-400">
                  {new Date(save.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleLoad(save.id)}
                  className="min-h-11 rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  {t.loadGame || 'Cargar'}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(save)}
                  className="min-h-11 rounded-lg bg-red-800 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                  {t.deleteGame || 'Eliminar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Exportar / importar */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => exportSnapshot('full', 'partida')} className="min-h-11 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
          {t.exportGame || 'Exportar partida'}
        </button>
        <button type="button" onClick={() => exportSnapshot('configuration', 'configuracion')} className="min-h-11 rounded-lg border border-emerald-500/70 bg-emerald-950 px-4 py-2 font-semibold text-emerald-100 transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
          {t.exportConfig || 'Exportar configuración'}
        </button>
        <button type="button" onClick={() => inputRef.current?.click()} className="min-h-11 rounded-lg border border-slate-500 bg-slate-700 px-4 py-2 font-semibold text-white transition hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
          {t.importGame || 'Importar JSON'}
        </button>
        <input ref={inputRef} type="file" accept="application/json,.json" onChange={selectImportFile} className="sr-only" aria-label={t.importGame || 'Importar JSON'} />
      </div>

      {/* Historial de la partida */}
      <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-100">{t.gameLog || 'Historial de la partida'}</p>
            <p className="text-xs text-slate-400">
              {(t.gameLogEntries || '{n} eventos registrados').replace('{n}', logCount)}
            </p>
          </div>
          <button
            type="button"
            onClick={downloadLog}
            disabled={logCount === 0}
            className="min-h-11 rounded-lg border border-slate-500 bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:opacity-40"
          >
            {t.exportLog || 'Exportar historial'}
          </button>
        </div>
      </div>

      {pendingImport && (
        <div className="rounded-lg border border-amber-500/60 bg-amber-950/40 p-3 text-left text-sm text-amber-100" role="alert">
          <p>{t.confirmImport || '¿Qué parte quieres importar?'}</p>
          <p className="mt-1 truncate text-amber-200/80">{pendingImport.name}</p>
          {pendingImport.warnings.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-xs text-amber-200">
              {pendingImport.warnings.map((warning) => <li key={warning}>{warning}</li>)}
            </ul>
          )}
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

      {feedback.text && (
        <p
          className={`text-sm ${feedback.type === 'error' ? 'text-red-200' : 'text-emerald-200'}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {feedback.text}
        </p>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t.deleteConfirmTitle || 'Eliminar partida guardada'}
        description={pendingDelete ? `${pendingDelete.name}` : ''}
        confirmLabel={t.deleteGame || 'Eliminar'}
        cancelLabel={t.cancel || 'Cancelar'}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
