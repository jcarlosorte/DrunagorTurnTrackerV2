import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/ConfirmDialog';
import PromptDialog from '@/components/PromptDialog';

/** Host único para confirmaciones y entradas de la app, sin ventanas del sistema. */
export default function AppDialogHost({ onNotify }) {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const onConfirm = (event) => {
      setQueue((prev) => [...prev, {
        kind: 'confirm',
        message: event.detail?.message || '',
        title: event.detail?.title || 'Confirmar',
        confirmLabel: event.detail?.confirmLabel,
        cancelLabel: event.detail?.cancelLabel,
        resolve: event.detail?.resolve,
      }]);
    };
    const onPrompt = (event) => {
      setQueue((prev) => [...prev, {
        kind: 'prompt',
        message: event.detail?.message || '',
        title: event.detail?.title || 'Introducir valor',
        label: event.detail?.label,
        defaultValue: event.detail?.defaultValue || '',
        inputType: event.detail?.inputType || 'text',
        confirmLabel: event.detail?.confirmLabel,
        cancelLabel: event.detail?.cancelLabel,
        resolve: event.detail?.resolve,
      }]);
    };
    const handleNotify = (event) => {
      onNotify?.(event.detail?.message || '');
    };

    window.addEventListener('dsh:app-confirm', onConfirm);
    window.addEventListener('dsh:app-prompt', onPrompt);
    window.addEventListener('dsh:app-notify', handleNotify);
    return () => {
      window.removeEventListener('dsh:app-confirm', onConfirm);
      window.removeEventListener('dsh:app-prompt', onPrompt);
      window.removeEventListener('dsh:app-notify', handleNotify);
    };
  }, [onNotify]);

  const current = queue[0] || null;
  const finish = (value) => {
    current?.resolve?.(value);
    setQueue((prev) => prev.slice(1));
  };

  if (!current) return null;

  if (current.kind === 'prompt') {
    return (
      <PromptDialog
        open
        title={current.title}
        description={current.message}
        label={current.label}
        defaultValue={current.defaultValue}
        inputType={current.inputType}
        confirmLabel={current.confirmLabel || 'Aceptar'}
        cancelLabel={current.cancelLabel || 'Cancelar'}
        onConfirm={(value) => finish(value)}
        onCancel={() => finish(null)}
      />
    );
  }

  return (
    <ConfirmDialog
      open
      title={current.title}
      description={current.message}
      confirmLabel={current.confirmLabel || 'Aceptar'}
      cancelLabel={current.cancelLabel || 'Cancelar'}
      onConfirm={() => finish(true)}
      onCancel={() => finish(false)}
    />
  );
}
