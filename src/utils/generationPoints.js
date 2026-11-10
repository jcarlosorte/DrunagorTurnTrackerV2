/** Añade una ficha de generación solo si no existe ya del mismo color. */
export function appendGenerationPoint(points, color, id) {
  if (!Array.isArray(points)) return points;
  if (points.some((point) => point.color === color)) return points;
  return [...points, { id, color }];
}
