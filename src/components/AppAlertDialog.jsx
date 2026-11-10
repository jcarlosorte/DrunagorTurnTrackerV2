export default function AppAlertDialog({ open, message, onClose, confirmLabel = 'Aceptar' }) {
  if (!open) return null;

  return (
    <div className="layer-modal fixed inset-0 z-[99] flex items-center justify-center bg-black/80 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={message}
        className="w-full max-w-md rounded-2xl border-2 border-amber-600/80 bg-slate-900 p-5 text-slate-100 shadow-2xl"
      >
        <p className="text-base font-bold text-amber-100">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-xl bg-amber-600 px-4 text-sm font-bold text-white hover:bg-amber-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
