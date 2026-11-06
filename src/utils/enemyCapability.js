const NUMBERED = /^([A-ZÁÉÍÓÚÜÑ_ ]+?)\s+(X(?:[+-]\d+)?|\d+)$/i;

const lookup = (labels, key) => (
  labels?.[key]
  || labels?.[key.replaceAll('_', ' ')]
  || labels?.[key.replaceAll(' ', '_')]
);

const fill = (text, value) => String(text ?? '')
  .replaceAll('{x}', value)
  .replaceAll('{X}', value);

export function hasCapabilityLabel(token, labels = {}) {
  const value = String(token ?? '').trim();
  const match = value.match(NUMBERED);
  if (match) {
    const base = match[1].trim().replace(/\s+/g, '_').toUpperCase();
    return Boolean(lookup(labels, `${base}_X`));
  }
  return Boolean(lookup(labels, value));
}

/**
 * Resuelve la etiqueta y la descripción de una capacidad de enemigo.
 * Acepta variantes como HEMORRAGIA 1, ESCUDO X-3, ALIVIAR X o VUDU.
 */
export function resolveCapabilityLabel(token, labels = {}, descriptions = {}) {
  const value = String(token ?? '').trim();
  const match = value.match(NUMBERED);

  if (match) {
    const base = match[1].trim().replace(/\s+/g, '_').toUpperCase();
    const key = `${base}_X`;
    const number = match[2];
    const label = lookup(labels, key);
    const description = lookup(descriptions, key);
    return {
      claveGeneral: key,
      texto: label ? fill(label, number) : value,
      detalle: description ? fill(description, number) : '',
    };
  }

  const label = lookup(labels, value) || lookup(labels, value.toUpperCase());
  const description = lookup(descriptions, value) || lookup(descriptions, value.toUpperCase());
  return {
    claveGeneral: value,
    texto: label || value,
    detalle: description || '',
  };
}
