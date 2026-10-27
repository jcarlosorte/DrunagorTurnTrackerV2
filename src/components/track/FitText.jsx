import { useLayoutEffect, useRef } from 'react';

/**
 * Mantiene el texto en una sola línea reduciendo la tipografía hasta que encaja.
 * Evita los nombres partidos en dos o tres líneas dentro de las tarjetas.
 */
export default function FitText({
  text,
  max = 12,
  min = 6.5,
  className = '',
  title,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let size = max;
    element.style.fontSize = `${size}px`;

    // Ajuste iterativo: bajamos medio píxel hasta que el texto quepa.
    let guard = 0;
    while (element.scrollWidth > element.clientWidth && size > min && guard < 40) {
      size -= 0.5;
      element.style.fontSize = `${size}px`;
      guard += 1;
    }

    return undefined;
  }, [text, max, min]);

  return (
    <span
      ref={ref}
      title={title || text}
      className={`block whitespace-nowrap ${className}`}
    >
      {text}
    </span>
  );
}
