/**
 * Nombre legible de una entidad (héroe, enemigo, runa o carta).
 *
 * El tablero usa identificadores internos (`dark_vampire_com`, cartas de
 * comandante como `ataqueC`…). Cada familia vive en un mapa distinto de
 * traducciones, así que se consultan en orden antes de caer al `name` del
 * catálogo o al propio id.
 */
export function resolveEntityLabel({ id, name, translations } = {}) {
  const t = translations || {};
  const clave = id || '';

  return t.enemies?.[clave]
    || t.heroes?.[clave]
    || t.runas?.[clave]
    || t.cartas_ataque?.nombre?.[clave]
    || t.scenarioCard?.[clave]
    || t.defensaCard?.nombre?.[clave]
    || t.incursionCard?.[clave]
    || name
    || id
    || '';
}
