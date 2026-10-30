import { describe, expect, it } from 'vitest';
import {
  addAlmacenItem,
  getHeroExtras,
  patchHeroExtras,
  removeAlmacenItem,
  resetHero,
  resetHeroForNewGame,
  toggleCapacidadNivel,
  setDungeonSkillColor,
  setHeroSkill,
} from '@/utils/heroExtras';

describe('resetHero', () => {
  it('quita estados y recursos, recobra cubos y conserva la vida', () => {
    const before = getHeroExtras('sun');
    patchHeroExtras('sun', {
      vida: 4,
      estados: [{ id: 'AURA_X', count: 1 }],
      estadosAlterados: [
        { id: 'CONCENTRACION', count: 3 },
        { id: 'KI', count: 2 },
      ],
      cubos: { ...before.cubosMax, amarillo: 0 },
      trauma: 2,
      maldicion: 3,
    });

    const after = resetHero('sun');

    expect(after.vida).toBe(10);
    expect(after.estados).toEqual([]);
    expect(after.estadosAlterados).toEqual([]);
    expect(after.trauma).toBe(0);
    expect(after.maldicion).toBe(0);
    expect(after.cubos).toEqual(after.cubosMax);
  });
});

describe('habilidades y capacidades', () => {
  it('cada nivel de habilidad añade un cubo del color de la categoría', () => {
    const before = getHeroExtras('elros');

    const one = setHeroSkill('elros', 'melee', 1);
    expect(one.cubosMax.amarillo).toBe(before.cubosMax.amarillo + 1);
    expect(one.cubos.amarillo).toBe(before.cubos.amarillo + 1);

    const two = setHeroSkill('elros', 'melee', 2);
    expect(two.cubosMax.amarillo).toBe(before.cubosMax.amarillo + 2);

    const back = setHeroSkill('elros', 'melee', 0);
    expect(back.cubosMax.amarillo).toBe(before.cubosMax.amarillo);
  });

  it('la habilidad de mazmorra mueve sus cubos al cambiar de color', () => {
    const before = getHeroExtras('shadow');
    setHeroSkill('shadow', 'dungeon', 1);

    const moved = setDungeonSkillColor('shadow', 'rojo');
    expect(moved.cubosMax.amarillo).toBe(before.cubosMax.amarillo);
    expect(moved.cubosMax.rojo).toBe(before.cubosMax.rojo + 1);
    expect(moved.habilidades.dungeon).toEqual({ nivel: 1, color: 'rojo' });
  });

  it('los rombos 2 y 3 de una capacidad exigen el 1', () => {
    expect(toggleCapacidadNivel('savran', 0, 2).capacidadesClase[0].niveles).toEqual([false, false, false]);
    expect(toggleCapacidadNivel('savran', 0, 1).capacidadesClase[0].niveles).toEqual([true, false, false]);
    expect(toggleCapacidadNivel('savran', 0, 3).capacidadesClase[0].niveles).toEqual([true, false, true]);
    expect(toggleCapacidadNivel('savran', 0, 2).capacidadesClase[0].niveles).toEqual([true, true, true]);
    expect(toggleCapacidadNivel('savran', 0, 1).capacidadesClase[0].niveles).toEqual([false, false, false]);
  });

  it('el almacén añade y elimina objetos', () => {
    const added = addAlmacenItem('tork', 'Poción');
    expect(added.almacen).toContain('Poción');

    const removed = removeAlmacenItem('tork', added.almacen.indexOf('Poción'));
    expect(removed.almacen).not.toContain('Poción');
  });
});

describe('resetHeroForNewGame', () => {
  it('deja la vida al máximo y limpia estados y cubos', () => {
    patchHeroExtras('willow', {
      vida: 3,
      vidaMax: 12,
      estados: [{ id: 'AURA_X', count: 1 }],
      estadosAlterados: [{ id: 'FRUTO_DE_VIDA', count: 2 }],
      cubos: { amarillo: 0, rojo: 0, verde: 0, azul: 0 },
      trauma: 2,
      maldicion: 1,
    });

    const after = resetHeroForNewGame('willow');

    expect(after.vida).toBe(12);
    expect(after.estados).toEqual([]);
    expect(after.estadosAlterados).toEqual([]);
    expect(after.trauma).toBe(0);
    expect(after.maldicion).toBe(0);
    expect(after.cubos).toEqual(after.cubosMax);
  });
});
