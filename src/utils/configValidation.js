import { EXPANSIONS } from '@/data/expansions';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';

const BEHAVIORS = ['estandar', 'alternativo', 'complejo'];
const MAX_HEROES = 5;

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');

export const EXPANSION_IDS = new Set(EXPANSIONS.map((expansion) => expansion.id));
export const HERO_IDS = new Set(HEROES.map((hero) => hero.id));
export const ENEMY_IDS = new Set(ENEMIES.map((enemy) => enemy.id));
export const ROLE_IDS = new Set(ROLES.map((role) => role.id));

/**
 * Valida y limpia una configuración importada contra los catálogos actuales.
 * Devuelve los datos saneados y un informe de lo descartado.
 */
export function sanitizeConfiguration(data) {
  const warnings = [];
  const result = { ...data };

  if (Array.isArray(result.expansions)) {
    const valid = Array.from(new Set(result.expansions.filter((id) => EXPANSION_IDS.has(id))));
    if (valid.length !== result.expansions.length) {
      warnings.push('Se han ignorado expansiones desconocidas.');
    }
    result.expansions = valid;
  }

  if (isPlainObject(result.trackerData)) {
    const tracker = { ...result.trackerData };

    const heroes = isStringArray(tracker.heroes)
      ? Array.from(new Set(tracker.heroes.filter((id) => HERO_IDS.has(id)))).slice(0, MAX_HEROES)
      : [];
    if (Array.isArray(tracker.heroes) && heroes.length !== tracker.heroes.length) {
      warnings.push('Se han ignorado héroes desconocidos o por encima del límite de 5.');
    }

    const roles = isPlainObject(tracker.roles)
      ? Object.fromEntries(
        Object.entries(tracker.roles).filter(
          ([heroId, roleId]) => heroes.includes(heroId) && ROLE_IDS.has(roleId),
        ),
      )
      : {};
    if (isPlainObject(tracker.roles) && Object.keys(roles).length !== Object.keys(tracker.roles).length) {
      warnings.push('Se han ignorado roles no válidos o sin héroe asociado.');
    }

    const enemies = isStringArray(tracker.enemies)
      ? Array.from(new Set(tracker.enemies.filter((id) => ENEMY_IDS.has(id))))
      : [];
    if (Array.isArray(tracker.enemies) && enemies.length !== tracker.enemies.length) {
      warnings.push('Se han ignorado enemigos desconocidos.');
    }

    const behaviors = isStringArray(tracker.behaviors)
      ? tracker.behaviors.filter((behavior) => BEHAVIORS.includes(behavior))
      : [];
    if (Array.isArray(tracker.behaviors) && behaviors.length !== tracker.behaviors.length) {
      warnings.push('Se han ignorado comportamientos desconocidos.');
    }

    result.trackerData = {
      ...tracker,
      heroes,
      roles,
      enemies,
      behaviors: behaviors.length > 0 ? behaviors : BEHAVIORS,
    };
  }

  return { data: result, warnings };
}
