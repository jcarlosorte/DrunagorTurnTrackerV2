/**
 * Cubos de acción iniciales por héroe.
 *
 * Regla general del juego: todos los héroes empiezan con 5 cubos, al menos uno
 * de cada color. El quinto (el extra) depende de la clase:
 *   - cuerpo a cuerpo → amarillo
 *   - a distancia     → rojo
 *   - agilidad        → verde
 *   - sabiduría/magia → azul
 *
 * Cuando lleguen los datos definitivos basta con ajustar este mapa o el campo
 * `cubos` de cada héroe en HEROES.
 */

const CLASS_COLOR = {
  // Cuerpo a cuerpo
  guerrero: 'amarillo',
  guerrero_sombrio: 'amarillo',
  paladin: 'amarillo',
  paladina: 'amarillo',
  barbaro: 'amarillo',
  barbara: 'amarillo',
  adalid: 'amarillo',
  monje: 'amarillo',
  maga_espadachina: 'amarillo',
  mago_espadachin: 'amarillo',
  // A distancia
  arquero: 'rojo',
  arquera: 'rojo',
  // Agilidad
  asesino: 'verde',
  bardo: 'verde',
  // Sabiduría / magia
  maga: 'azul',
  mago: 'azul',
  clerigo: 'azul',
  hechicero: 'azul',
  druida: 'azul',
  necromante: 'azul',
  chaman: 'azul',
  chamana: 'azul',
};

export const CUBE_COLORS = ['amarillo', 'rojo', 'verde', 'azul'];

const normalizeProfession = (profession) => String(profession || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/\s+/g, '_');

/** Color del cubo extra según la clase del héroe. */
export function getClassCubeColor(profession) {
  return CLASS_COLOR[normalizeProfession(profession)] || 'amarillo';
}

/**
 * Cubos base: 1 de cada color + 1 extra del color de la clase = 5.
 * Devuelve `{ amarillo, rojo, verde, azul, max: {...} }`.
 */
export function getHeroBaseCubes(profession) {
  const cubos = { amarillo: 1, rojo: 1, verde: 1, azul: 1 };
  cubos[getClassCubeColor(profession)] += 1;
  return cubos;
}
