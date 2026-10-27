/**
 * Convierte las ilustraciones de `src/assets` a AVIF y actualiza los imports.
 *
 *   node scripts/convert-to-avif.mjs --dry-run   # informe sin tocar nada
 *   node scripts/convert-to-avif.mjs --apply     # genera los .avif y reescribe imports
 *
 * Conserva el WebP/PNG original como respaldo (no se importa, no entra en el build).
 * Requiere `sharp` (devDependency).
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import sharp from 'sharp';

const APPLY = process.argv.includes('--apply');
const ROOT = 'src/assets';
const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const CODE_EXT = new Set(['.js', '.jsx']);
const MIN_BYTES = 20 * 1024;
const QUALITY = 60;
const MIN_SAVING = 0.15;

const images = [];
const codeFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    const ext = extname(entry).toLowerCase();
    if (SOURCE_EXT.has(ext)) images.push(full);
    if (CODE_EXT.has(ext)) codeFiles.push(full);
  }
}

function walkCode(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkCode(full);
      continue;
    }
    if (CODE_EXT.has(extname(entry).toLowerCase())) codeFiles.push(full);
  }
}

walk(ROOT);
walkCode('src');

let beforeBytes = 0;
let afterBytes = 0;
let converted = 0;
const convertedPaths = [];

for (const file of images) {
  const original = readFileSync(file);
  beforeBytes += original.length;

  if (original.length < MIN_BYTES) {
    afterBytes += original.length;
    continue;
  }

  const target = file.replace(/\.(png|jpe?g|webp)$/i, '.avif');
  try {
    const output = await sharp(original).avif({ quality: QUALITY, effort: 5, chromaSubsampling: '4:2:0' }).toBuffer();
    if (output.length >= original.length * (1 - MIN_SAVING)) {
      afterBytes += original.length;
      continue;
    }

    afterBytes += output.length;
    converted += 1;
    convertedPaths.push({ from: file, to: target });

    if (APPLY) writeFileSync(target, output);
  } catch (err) {
    afterBytes += original.length;
    console.warn(`⚠ ${file}: ${err.message}`);
  }
}

let touchedCodeFiles = 0;
if (APPLY && convertedPaths.length > 0) {
  for (const codeFile of new Set(codeFiles)) {
    const original = readFileSync(codeFile, 'utf8');
    let updated = original;

    convertedPaths.forEach(({ from }) => {
      const relFromCode = relative(dirname(codeFile), from).replace(/\\/g, '/');
      const specifier = relFromCode.startsWith('.') ? relFromCode : `./${relFromCode}`;
      const avifSpecifier = specifier.replace(/\.(png|jpe?g|webp)$/i, '.avif');
      if (updated.includes(specifier)) {
        updated = updated.split(specifier).join(avifSpecifier);
      }
      const aliasPath = from.replace(/\\/g, '/').split('src/')[1];
      const aliasSpecifier = `@/${aliasPath}`;
      const aliasAvif = aliasSpecifier.replace(/\.(png|jpe?g|webp)$/i, '.avif');
      if (updated.includes(aliasSpecifier)) {
        updated = updated.split(aliasSpecifier).join(aliasAvif);
      }
    });

    if (updated !== original) {
      writeFileSync(codeFile, updated, 'utf8');
      touchedCodeFiles += 1;
    }
  }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
console.log(`Imágenes candidatas: ${images.length} · convertidas: ${converted}`);
console.log(`Antes: ${mb(beforeBytes)} · Después: ${mb(afterBytes)} · Ahorro: ${(100 - (afterBytes / beforeBytes) * 100).toFixed(1)}%`);
if (APPLY) console.log(`Imports actualizados en ${touchedCodeFiles} archivos`);
else console.log('(dry-run: nada modificado)');
