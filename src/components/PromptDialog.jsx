import { useEffect, useState } from 'react';

export default function PromptDialog({
  open,
  title,
  description,
  label,
  defaultValue = '',
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  inputType = 'text',
  onConfirm,
  onCancel,
}) {
  const [value, setValue] = useState(String(defaultValue));

  useEffect(() => {
    if (open) setValue(String(defaultValue));
  }, [open, defaultValue]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    onConfirm?.(value);
  };

  return (
    <div className="layer-modal fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4" role="presentation">
      <form
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Introducir valor'}
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border-2 border-slate-600 bg-slate-900 p-4 text-slate-100 shadow-2xl"
      >
        <h2 className="text-lg font-black text-slate-100">{title || 'Introducir valor'}</h2>
        {description && <p className="mt-2 text-sm text-slate-300">{description}</p>}
        {label && <label className="mt-3 block text-xs font-semibold text-slate-300">{label}</label>}
        <input
          autoFocus
          type={inputType}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-9 rounded-lg bg-slate-700 px-3 text-xs font-bold text-white hover:bg-slate-600"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="min-h-9 rounded-lg bg-emerald-700 px-3 text-xs font-bold text-white hover:bg-emerald-600"
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
