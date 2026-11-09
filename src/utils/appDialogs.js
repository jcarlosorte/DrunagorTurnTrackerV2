const dispatch = (name, detail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

export function appNotify(message, type = 'info') {
  if (!message) return;
  dispatch('dsh:app-notify', { message, type });
}

export function appConfirm(message, options = {}) {
  return new Promise((resolve) => {
    dispatch('dsh:app-confirm', {
      message,
      title: options.title || 'Confirmar',
      confirmLabel: options.confirmLabel,
      cancelLabel: options.cancelLabel,
      resolve,
    });
  });
}

export function appPrompt(message, defaultValue = '', options = {}) {
  return new Promise((resolve) => {
    dispatch('dsh:app-prompt', {
      message,
      title: options.title || 'Introducir valor',
      label: options.label,
      defaultValue,
      inputType: options.inputType || 'text',
      confirmLabel: options.confirmLabel,
      cancelLabel: options.cancelLabel,
      resolve,
    });
  });
}
