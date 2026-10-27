import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const files = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(jsx|js)$/.test(entry)) files.push(full);
  }
}
walk('src');

let touched = 0;
let modifiedFiles = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  // Solo etiquetas <img ... /> autocerradas (todas las JSX del proyecto).
  const out = original.replace(/<img\s([^>]*?)\/>/g, (match, attrs) => {
    if (attrs.includes('loading=')) return match;
    touched += 1;
    return `<img ${attrs.trimEnd()} loading="lazy" decoding="async" />`;
  });

  if (out !== original) {
    writeFileSync(file, out, 'utf8');
    modifiedFiles += 1;
  }
}

console.log(`imágenes actualizadas: ${touched} en ${modifiedFiles} archivos`);
