import { describe, expect, it } from 'vitest';
import { CORRUPT_SHIP_CARDS, ERRADEN_CARDS, SWAN_SHIP_CARDS } from './eventosEspeciales';

describe('Sorpresa de Eradren', () => {
  it('tiene seis cartas con textos completos y fondo', () => {
    expect(ERRADEN_CARDS).toHaveLength(6);
    ERRADEN_CARDS.forEach((card) => {
      expect(card.instanceId).toBeTruthy();
      expect(card.title).toBeTruthy();
      expect(card.text.length).toBeGreaterThan(20);
      expect(card.background).toBeTruthy();
    });
  });

  it('incluye dos Asaltos con invocación de MG – Bisoño', () => {
    const asaltos = ERRADEN_CARDS.filter((card) => card.id === 'asalto');
    expect(asaltos).toHaveLength(2);
    asaltos.forEach((card) => {
      expect(card.summon?.label).toBe('MG – Bisoño');
      expect(card.summon?.categoria).toBe('bisoño');
      expect(card.summon?.color).toBe('gris');
    });
  });

  it('incluye las dos resoluciones del superviviente', () => {
    const supervivientes = ERRADEN_CARDS.filter((card) => card.id.startsWith('superviviente'));
    expect(supervivientes.map((card) => card.id).sort()).toEqual([
      'superviviente_121',
      'superviviente_124',
    ]);
  });

  it('incluye las dos pasivas distintas del gatito', () => {
    const gatitos = ERRADEN_CARDS.filter((card) => card.id.startsWith('gatito'));
    expect(gatitos).toHaveLength(2);
    expect(gatitos[0].text).not.toBe(gatitos[1].text);
  });
});

describe('PS del Navío Corrupto', () => {
  it('tiene seis cartas con sus dos Fuegos y dos Visiones', () => {
    expect(CORRUPT_SHIP_CARDS).toHaveLength(6);
    expect(CORRUPT_SHIP_CARDS.filter((card) => card.action === 'fuego')).toHaveLength(2);
    expect(CORRUPT_SHIP_CARDS.filter((card) => card.action === 'vision')).toHaveLength(2);
    expect(CORRUPT_SHIP_CARDS.filter((card) => card.id === 'agarraos')).toHaveLength(2);
  });
});

describe('PS del Buque Cisne', () => {
  it('tiene tres Refuerzos y un Disparo del Cañón', () => {
    expect(SWAN_SHIP_CARDS).toHaveLength(6);
    expect(SWAN_SHIP_CARDS.filter((card) => card.action === 'refuerzos')).toHaveLength(3);
    expect(SWAN_SHIP_CARDS.filter((card) => card.action === 'disparo')).toHaveLength(1);
    expect(SWAN_SHIP_CARDS.filter((card) => card.id === 'disparo_critico')).toHaveLength(2);
  });
});
