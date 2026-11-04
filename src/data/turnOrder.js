// src/data/turnOrder.js
// Primero la línea superior completa y después la inferior. Cada línea recorre
// los roles y las runas de izquierda a derecha; los héroes y seguidores solo
// actúan en la línea que les corresponde.
export const TURN_ORDER = [
  // Línea superior
  { type: 'hero', role: 'defensor', position: 'arriba', index: 0 },
  { type: 'hero', role: 'maton', position: 'arriba', index: 0 },
  { type: 'enemy', rune: 'naranja', position: 'arriba', index: 1 },
  { type: 'hero', role: 'apoyo', position: 'arriba', index: 2 },
  { type: 'hero', role: 'asistente', position: 'arriba', index: 2 },
  { type: 'hero', role: 'sanador', position: 'arriba', index: 2 },
  { type: 'enemy', rune: 'verde', position: 'arriba', index: 3 },
  { type: 'hero', role: 'lider', position: 'arriba', index: 4 },
  { type: 'hero', role: 'lanza_dados', position: 'arriba', index: 4 },
  { type: 'hero', role: 'guardian', position: 'arriba', index: 4 },
  { type: 'enemy', rune: 'azul', position: 'arriba', index: 5 },
  { type: 'hero', role: 'agresor', position: 'arriba', index: 6 },
  { type: 'hero', role: 'asesino', position: 'arriba', index: 6 },
  { type: 'enemy', rune: 'rojo', position: 'arriba', index: 7 },
  { type: 'hero', role: 'controlador', position: 'arriba', index: 8 },
  { type: 'hero', role: 'embaucador', position: 'arriba', index: 8 },
  { type: 'enemy', rune: 'gris', position: 'arriba', index: 9 },
  { type: 'rune', position: 'arriba', index: 10 },

  // Línea inferior
  { type: 'hero', role: 'defensor', position: 'abajo', index: 0 },
  { type: 'hero', role: 'maton', position: 'abajo', index: 0 },
  { type: 'enemy', rune: 'naranja', position: 'abajo', index: 1 },
  { type: 'hero', role: 'apoyo', position: 'abajo', index: 2 },
  { type: 'hero', role: 'asistente', position: 'abajo', index: 2 },
  { type: 'hero', role: 'sanador', position: 'abajo', index: 2 },
  { type: 'enemy', rune: 'verde', position: 'abajo', index: 3 },
  { type: 'hero', role: 'lider', position: 'abajo', index: 4 },
  { type: 'hero', role: 'lanza_dados', position: 'abajo', index: 4 },
  { type: 'hero', role: 'guardian', position: 'abajo', index: 4 },
  { type: 'enemy', rune: 'azul', position: 'abajo', index: 5 },
  { type: 'hero', role: 'agresor', position: 'abajo', index: 6 },
  { type: 'hero', role: 'asesino', position: 'abajo', index: 6 },
  { type: 'enemy', rune: 'rojo', position: 'abajo', index: 7 },
  { type: 'hero', role: 'controlador', position: 'abajo', index: 8 },
  { type: 'hero', role: 'embaucador', position: 'abajo', index: 8 },
  { type: 'enemy', rune: 'gris', position: 'abajo', index: 9 },
  { type: 'rune', position: 'abajo', index: 10 },
];
