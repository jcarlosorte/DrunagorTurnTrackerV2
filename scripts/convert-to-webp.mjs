/**
 * Convierte las ilustraciones de `src/assets` a WebP y actualiza los imports.
 *
 *   node scripts/convert-to-webp.mjs --dry-run   # informe sin tocar nada
 *   node scripts/convert-to-webp.mjs --apply     # convierte, borra el original y reescribe imports
 *
 * Requiere `sharp` (devDependency).
 */
import { readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import sharp from 'sharp';

const APPLY = process.argv.includes('--apply');
const ROOTS = ['src'];
const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg']);
const CODE_EXT = new Set(['.js', '.jsx']);
const MIN_BYTES = 40 * 1024;
const QUALITY = 82;

const files = [];
const codeFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    const ext = extname(entry).toLowerCase();
    if (SOURCE_EXT.has(ext)) files.push(full);
    if (CODE_EXT.has(ext)) codeFiles.push(full);
  }
}

ROOTS.forEach(walk);

let beforeBytes = 0;
let afterBytes = 0;
let converted = 0;
const convertedPaths = [];

for (const file of files) {
  const original = readFileSync(file);
  beforeBytes += original.length;

  if (original.length < MIN_BYTES) {
    afterBytes += original.length;
    continue;
  }

  const target = file.replace(/\.(png|jpe?g)$/i, '.webp');
  try {
    const output = await sharp(original).webp({ quality: QUALITY, effort: 6 }).toBuffer();
    if (output.length >= original.length * 0.95) {
      afterBytes += original.length;
      continue;
    }

    afterBytes += output.length;
    converted += 1;
    convertedPaths.push({ from: file, to: target });

    if (APPLY) {
      writeFileSync(target, output);
      unlinkSync(file);
    }
  } catch (err) {
    afterBytes += original.length;
    console.warn(`⚠ ${file}: ${err.message}`);
  }
}

// Actualiza los imports que apuntan a las imágenes convertidas.
let touchedCodeFiles = 0;
if (APPLY && convertedPaths.length > 0) {
  const replacements = new Map(convertedPaths.map(({ from }) => [from.replace(/\\/g, '/'), '']));

  for (const codeFile of new Set(codeFiles)) {
    const original = readFileSync(codeFile, 'utf8');
    let updated = original;

    replacements.forEach((_, fromPath) => {
      const relFromCode = relative(dirname(codeFile), fromPath).replace(/\\/g, '/');
      const specifier = relFromCode.startsWith('.') ? relFromCode : `./${relFromCode}`;
      const webpSpecifier = specifier.replace(/\.(png|jpe?g)$/i, '.webp');
      if (updated.includes(specifier)) {
        updated = updated.split(specifier).join(webpSpecifier);
      }
      // Imports con alias '@/assets/...'
      const aliasPath = fromPath.replace(/\\/g, '/').split('src/')[1];
      const aliasSpecifier = `@/${aliasPath}`;
      const aliasWebp = aliasSpecifier.replace(/\.(png|jpe?g)$/i, '.webp');
      if (updated.includes(aliasSpecifier)) {
        updated = updated.split(aliasSpecifier).join(aliasWebp);
      }
    });

    if (updated !== original) {
      writeFileSync(codeFile, updated, 'utf8');
      touchedCodeFiles += 1;
    }
  }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
console.log(`Imágenes candidatas: ${files.length} · convertidas: ${converted}`);
console.log(`Antes: ${mb(beforeBytes)} · Después: ${mb(afterBytes)} · Ahorro: ${(100 - (afterBytes / beforeBytes) * 100).toFixed(1)}%`);
if (APPLY) console.log(`Imports actualizados en ${touchedCodeFiles} archivos`);
else console.log('(dry-run: nada modificado)');
