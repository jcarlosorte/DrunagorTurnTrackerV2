import { describe, expect, it } from 'vitest';
import {
  addAlmacenItem,
  addManualHeroExtra,
  changeHeroCubes,
  changeHeroVida,
  changeHeroVidaMax,
  getHeroExtras,
  setHeroAura,
  toggleHeroExtra,
  patchHeroExtras,
  removeAlmacenItem,
  removeHeroExtra,
  resetHero,
  resetHeroForNewGame,
  stepHeroEstadoAlterado,
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
    expect(moved.habilidades.dungeon).toEqual({
      nivel: 1,
      color: 'rojo',
      colors: ['rojo', 'amarillo'],
    });
  });

  it('permite elegir un color distinto para cada nivel de mazmorra', () => {
    const before = getHeroExtras('vorn');
    setHeroSkill('vorn', 'dungeon', 2);
    setDungeonSkillColor('vorn', 'rojo', 1);
    const result = setDungeonSkillColor('vorn', 'verde', 2);

    expect(result.habilidades.dungeon).toEqual({
      nivel: 2,
      color: 'rojo',
      colors: ['rojo', 'verde'],
    });
    expect(result.cubosMax.rojo).toBe(before.cubosMax.rojo + 1);
    expect(result.cubosMax.verde).toBe(before.cubosMax.verde + 1);
    expect(result.cubosMax.amarillo).toBe(before.cubosMax.amarillo);
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

describe('límite de vida', () => {
  it('la vida y la vida máxima nunca superan 17', () => {
    changeHeroVidaMax('vorn', 20);
    expect(getHeroExtras('vorn').vidaMax).toBe(17);

    changeHeroVida('vorn', 100, 17);
    expect(getHeroExtras('vorn').vida).toBe(17);
  });
});

describe('Semilla del Caos', () => {
  it('al recibir la cuarta se descartan todas y sufre 4 de daño', () => {
    patchHeroExtras('vorn', {
      vida: 10,
      vidaMax: 10,
      estadosAlterados: [{ id: 'SEMILLA_DEL_CAOS', count: 3 }],
    });

    const after = stepHeroEstadoAlterado('vorn', 'SEMILLA_DEL_CAOS', 1, '2.0');
    expect(after.estadosAlterados.some((estado) => estado.id === 'SEMILLA_DEL_CAOS')).toBe(false);
    expect(after.vida).toBe(6);
  });
});

describe('efectos manuales de héroe', () => {
  it('guarda el nombre de un estado manual y permite quitarlo', () => {
    const added = addManualHeroExtra('vorn', 'estados', 'Estado de prueba');
    const entry = added.estados.find((item) => item.name?.es === 'Estado de prueba');
    expect(entry).toBeTruthy();
    expect(entry.manual).toBe(true);

    const removed = removeHeroExtra('vorn', 'estados', entry);
    expect(removed.estados.some((item) => item.name?.es === 'Estado de prueba')).toBe(false);
  });
});

describe('auras', () => {
  it('solo conserva un aura y elegir otra sustituye la anterior', () => {
    patchHeroExtras('vorn', { trauma: 0, auras: [] });

    const first = setHeroAura('vorn', 'bendicion_de_gratitud');
    expect(first.auras).toEqual(['bendicion_de_gratitud']);

    const second = setHeroAura('vorn', 'vinculo_de_amistad');
    expect(second.auras).toEqual(['vinculo_de_amistad']);

    const toggled = toggleHeroExtra('vorn', 'auras', 'sed_de_sangre');
    expect(toggled.auras).toEqual(['sed_de_sangre']);
  });

  it('se pierde al recibir un cubo de Trauma', () => {
    patchHeroExtras('vorn', { trauma: 1, auras: [] });
    const withAura = setHeroAura('vorn', 'corazon_bravo');
    expect(withAura.auras).toEqual(['corazon_bravo']);

    const after = changeHeroCubes('vorn', 'trauma', 1);
    expect(after.trauma).toBe(2);
    expect(after.auras).toEqual([]);
  });

  it('no se pierde al quitar Trauma ni al recibir Maldición', () => {
    patchHeroExtras('vorn', { trauma: 1, maldicion: 0, auras: [] });
    setHeroAura('vorn', 'corazon_frio');

    const healed = changeHeroCubes('vorn', 'trauma', -1);
    expect(healed.auras).toEqual(['corazon_frio']);

    const cursed = changeHeroCubes('vorn', 'maldicion', 1);
    expect(cursed.auras).toEqual(['corazon_frio']);
  });
});
