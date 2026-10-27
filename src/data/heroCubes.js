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
 * Cubos iniciales reales por héroe (5 en total: 2 de un color + 1 del resto).
 * Fuente: valores del manual para cada héroe publicado.
 */
const HERO_CUBES = {
  // 2 Melee · 1 Ranged · 1 Agility · 1 Wisdom
  vorn: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  jaheen: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  tork: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  katarina: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  jade: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  drasek: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  duncan: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  devron: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  shadow: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  sun: { amarillo: 2, rojo: 1, verde: 1, azul: 1 },
  'lord-of-wrath': { amarillo: 2, rojo: 1, verde: 1, azul: 1 },

  // 1 Melee · 2 Ranged · 1 Agility · 1 Wisdom
  maya: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  elros: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  lorelai: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  flavian: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  pietro: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  barak: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  savran: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  handuriel: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  lorien: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  arkhanos: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  kellam: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  sskar: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
  willow: { amarillo: 1, rojo: 2, verde: 1, azul: 1 },
};

/**
 * Cubos base de un héroe.
 * Si está en la tabla oficial se usan sus valores exactos; si no (héroes de
 * Apocalipsis pendientes de datos), se aplica la regla 1 de cada color + 1 del
 * color de su clase.
 */
export function getHeroBaseCubes(heroOrProfession) {
  const hero = typeof heroOrProfession === 'string'
    ? { profession: heroOrProfession }
    : (heroOrProfession || {});

  if (hero.id && HERO_CUBES[hero.id]) return { ...HERO_CUBES[hero.id] };

  const cubos = { amarillo: 1, rojo: 1, verde: 1, azul: 1 };
  cubos[getClassCubeColor(hero.profession)] += 1;
  return cubos;
}
