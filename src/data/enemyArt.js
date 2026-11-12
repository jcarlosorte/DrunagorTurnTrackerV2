const V2_ART = import.meta.glob('../assets/enemies/*V2.png', {
  eager: true,
  import: 'default',
});

const normalize = (value) => String(value || '')
  .replace(/V2\.png$/i, '')
  .replace(/\.(png|webp|avif)$/i, '')
  .replace(/[^a-z0-9]/gi, '')
  .toLowerCase();

const ART_BY_ID = Object.fromEntries(
  Object.entries(V2_ART).map(([path, src]) => [
    normalize(path.split('/').pop()),
    src,
  ]),
);

/** Devuelve el arte V2 del enemigo si existe; si no, conserva el arte original. */
export function getEnemyArt(enemyId, fallback) {
  return ART_BY_ID[normalize(enemyId)] || fallback;
}
