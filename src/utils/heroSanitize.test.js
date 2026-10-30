import { describe, expect, it } from 'vitest';
import { sanitizeHeroEntry, sanitizeHeroExtras } from '@/utils/heroSanitize';

describe('sanitizeHeroEntry', () => {
  it('acota vida, cubos y modificadores a rangos válidos', () => {
    const result = sanitizeHeroEntry({
      vida: -5,
      vidaMax: 0,
      trauma: 99,
      maldicion: 99,
      impactoMod: 999,
      cubos: { amarillo: 99, rojo: -3 },
      cubosMax: { amarillo: 2, rojo: 1 },
    });

    expect(result.vidaMax).toBe(1);
    // La vida se recorta al máximo resultante (1) y no puede ser negativa.
    expect(result.vida).toBe(0);
    expect(result.trauma).toBe(2);
    expect(result.maldicion).toBe(5);
    expect(result.impactoMod).toBe(20);
    expect(result.cubos.amarillo).toBe(2);
    expect(result.cubos.rojo).toBe(0);
  });

  it('descarta estados desconocidos y limita los existentes', () => {
    const result = sanitizeHeroEntry({
      estadoAlterados: [],
      estadosAlterados: [
        { id: 'NO_EXISTE', count: 3 },
        { id: 'VENENO_I', count: 99 },
      ],
    });

    expect(result.estadosAlterados).toEqual([{ id: 'VENENO_I', count: 4 }]);
  });

  it('normaliza habilidades, capacidades y almacén', () => {
    const result = sanitizeHeroEntry({
      habilidades: { melee: 9, agility: -1, ranged: 2, wisdom: 'x', dungeon: { nivel: 3, color: 'rosa' } },
      capacidadesClase: [{ nombre: 'A', nivel: 5 }, { nombre: 123, nivel: 1 }],
      almacen: ['Poción', '', 7, 'X'.repeat(80)],
    });

    expect(result.habilidades.melee).toBe(2);
    expect(result.habilidades.agility).toBe(0);
    expect(result.habilidades.ranged).toBe(2);
    expect(result.habilidades.wisdom).toBe(0);
    expect(result.habilidades.dungeon).toEqual({ nivel: 2, color: 'amarillo' });
    expect(result.capacidadesClase).toHaveLength(3);
    expect(result.capacidadesClase[0]).toEqual({ nombre: 'A', nivel: 2 });
    expect(result.capacidadesClase[1]).toEqual({ nombre: '', nivel: 1 });
    expect(result.almacen).toEqual(['Poción', 'X'.repeat(60)]);
  });

  it('normaliza el equipo y fuerza el ataque del arma', () => {
    const result = sanitizeHeroEntry({
      equipo: { arma: 'Espada', amuleto: 'Amuleto' },
      equipoMods: {
        arma: { value: 2, stat: 'movimiento' },
        amuleto: { value: 1, stat: 'invalido' },
      },
    });

    expect(result.equipo.arma).toBe('Espada');
    expect(result.equipoMods.arma).toEqual({ value: 2, stat: 'ataque' });
    expect(result.equipoMods.amuleto).toEqual({ value: 1, stat: 'movimiento' });
  });

  it('devuelve null para entradas no válidas', () => {
    expect(sanitizeHeroEntry(null)).toBeNull();
    expect(sanitizeHeroEntry([1, 2])).toBeNull();
  });
});

describe('sanitizeHeroExtras', () => {
  it('mantiene solo héroes con datos válidos', () => {
    const result = sanitizeHeroExtras({
      vorn: { vida: 3, vidaMax: 10 },
      roto: 'texto',
    });

    expect(Object.keys(result)).toEqual(['vorn']);
    expect(result.vorn.vida).toBe(3);
  });
});
