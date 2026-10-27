/**
 * Comprime las ilustraciones de `src/assets` en su sitio (PNG → PNG optimizado).
 *
 * Pensado para ejecutarse puntualmente, no en cada build:
 *   node scripts/optimize-images.mjs           # aplica cambios
 *   node scripts/optimize-images.mjs --dry-run # solo informa
 *
 * Requiere `sharp` (devDependency).
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const DRY_RUN = process.argv.includes('--dry-run');
const MIN_BYTES = 150 * 1024;
const ROOTS = ['src/assets'];
const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (EXTENSIONS.has(extname(entry).toLowerCase())) files.push(full);
  }
}
ROOTS.forEach(walk);

let before = 0;
let after = 0;
let optimized = 0;
let skipped = 0;

for (const file of files) {
  const original = readFileSync(file);
  before += original.length;

  if (original.length < MIN_BYTES) {
    after += original.length;
    skipped += 1;
    continue;
  }

  try {
    const output = await sharp(original)
      // Paleta de 256 colores con tramado: gran ahorro sin bandas visibles.
      .png({ compressionLevel: 9, quality: 90, palette: true, dither: 1, effort: 8 })
      .toBuffer();

    // Solo se sustituye si realmente mejora el tamaño.
    if (output.length < original.length) {
      after += output.length;
      optimized += 1;
      if (!DRY_RUN) writeFileSync(file, output);
    } else {
      after += original.length;
      skipped += 1;
    }
  } catch (err) {
    after += original.length;
    skipped += 1;
    console.warn(`⚠ ${file}: ${err.message}`);
  }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
console.log(`Archivos: ${files.length} · optimizados: ${optimized} · sin cambios: ${skipped}`);
console.log(`Antes: ${mb(before)} · Después: ${mb(after)} · Ahorro: ${(100 - (after / before) * 100).toFixed(1)}%`);
if (DRY_RUN) console.log('(dry-run: no se escribió ningún archivo)');
