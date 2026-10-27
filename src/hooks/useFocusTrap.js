import { useEffect } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE))
    .filter((el) => el.offsetParent !== null || el === document.activeElement);
}

/**
 * Retiene el foco dentro de un diálogo y lo devuelve al elemento que lo abrió.
 *
 * - `Tab` / `Shift+Tab` ciclan solo entre los elementos del diálogo.
 * - Al desmontarse, el foco vuelve al disparador original.
 */
export default function useFocusTrap(ref, active = true) {
  useEffect(() => {
    if (!active) return undefined;
    const container = ref.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement;

    // Primer foco: el primer elemento enfocable o el propio contenedor.
    const focusables = getFocusable(container);
    if (focusables.length > 0) {
      focusables[0].focus({ preventScroll: true });
    } else {
      container.setAttribute('tabindex', '-1');
      container.focus({ preventScroll: true });
    }

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const items = getFocusable(container);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Solo se devuelve el foco si el elemento sigue en el DOM.
      if (previouslyFocused && previouslyFocused.isConnected
        && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [ref, active]);
}
