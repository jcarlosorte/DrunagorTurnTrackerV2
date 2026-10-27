import { describe, expect, it } from 'vitest';
import { applyStatusEffects } from '@/utils/statusEngine';

const catalogo = [
  { id: 'QUEMADURA_I', texto: 'quemadura', turno: 'principio', daño: 1, reduce: 'si', numReduce: 1, max: 4, prevenir: 'no' },
  { id: 'VENENO_I', texto: 'veneno', turno: 'principio', daño: 1, reduce: 'no', numReduce: 0, max: 4, prevenir: 'no' },
  { id: 'ESCUDO', texto: 'escudo', turno: 'final', daño: 0, reduce: 'no', numReduce: 0, max: 4, prevenir: 'si' },
  { id: 'LENTITUD_I', texto: 'lentitud', turno: 'principio', daño: 0, reduce: 'si', numReduce: 1, max: 1, prevenir: 'si' },
  { id: 'TIEMPO', texto: 'tiempo', turno: 'principio', daño: 1, reduce: 'si', numReduce: 1, max: 4 },
];

describe('applyStatusEffects', () => {
  it('aplica daño y reduce fichas al inicio del turno', () => {
    const result = applyStatusEffects({
      vida: 10,
      estados: [{ id: 'QUEMADURA_I', count: 3 }],
      fase: 'inicio',
      catalogo,
    });

    expect(result.vida).toBe(7);
    expect(result.estados).toEqual([{ id: 'QUEMADURA_I', count: 2 }]);
    expect(result.logs).toHaveLength(1);
  });

  it('no reduce los estados con reduce "no" pero sí hace daño', () => {
    const result = applyStatusEffects({
      vida: 6,
      estados: [{ id: 'VENENO_I', count: 2 }],
      fase: 'inicio',
      catalogo,
    });

    expect(result.vida).toBe(4);
    expect(result.estados).toEqual([{ id: 'VENENO_I', count: 2 }]);
  });

  it('elimina el estado cuando llega a cero fichas', () => {
    const result = applyStatusEffects({
      vida: 10,
      estados: [{ id: 'QUEMADURA_I', count: 1 }],
      fase: 'inicio',
      catalogo,
    });

    expect(result.vida).toBe(9);
    expect(result.estados).toEqual([]);
  });

  it('ignora los estados de otra fase', () => {
    const result = applyStatusEffects({
      vida: 10,
      estados: [{ id: 'ESCUDO', count: 2 }],
      fase: 'inicio',
      catalogo,
    });

    expect(result.vida).toBe(10);
    expect(result.estados).toEqual([{ id: 'ESCUDO', count: 2 }]);
    expect(result.logs).toEqual([]);
  });

  it('nunca deja más fichas que el máximo del estado', () => {
    const result = applyStatusEffects({
      vida: 10,
      estados: [{ id: 'LENTITUD_I', count: 9 }],
      fase: 'inicio',
      catalogo,
    });

    expect(result.estados).toEqual([{ id: 'LENTITUD_I', count: 1 }]);
  });

  it('absorbe daño con ESCUDO cuando el estado es prevenible', () => {
    const conEscudo = [
      { id: 'QUEMADURA_I', texto: 'quemadura', turno: 'principio', daño: 4, reduce: 'no', numReduce: 0, max: 4, prevenir: 'si' },
      catalogo[2],
    ];

    const result = applyStatusEffects({
      vida: 10,
      estados: [{ id: 'QUEMADURA_I', count: 1 }, { id: 'ESCUDO', count: 3 }],
      fase: 'inicio',
      catalogo: conEscudo,
    });

    expect(result.vida).toBe(9);
    // El escudo consumido por completo desaparece de la lista.
    expect(result.estados).toEqual([{ id: 'QUEMADURA_I', count: 1 }]);
  });

  it('no hace nada si la vida ya es 0', () => {
    const result = applyStatusEffects({
      vida: 0,
      estados: [{ id: 'QUEMADURA_I', count: 2 }],
      fase: 'inicio',
      catalogo,
    });

    expect(result.vida).toBe(0);
    expect(result.logs).toEqual([]);
  });

  it('omite TIEMPO (se gestiona aparte)', () => {
    const result = applyStatusEffects({
      vida: 10,
      estados: [{ id: 'TIEMPO', count: 3 }],
      fase: 'inicio',
      catalogo,
    });

    expect(result.vida).toBe(10);
    expect(result.estados).toEqual([{ id: 'TIEMPO', count: 3 }]);
  });
});
