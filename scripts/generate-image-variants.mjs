/**
 * Genera variantes 320/640 para las miniaturas de enemigos y héroes y escribe
 * el manifiesto `src/assets/imageVariants.js` que consume `ResponsiveImage`.
 *
 *   node scripts/generate-image-variants.mjs
 *
 * Idempotente: sobrescribe las variantes y el manifiesto.
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const DIRS = [
  { dir: 'src/assets/enemies', prefix: './enemies' },
  { dir: 'src/assets/heroes', prefix: './heroes' },
];
const SIZES = [320, 640];
const QUALITY = 55;

const isVariant = (name) => /-\d+\.avif$/i.test(name);

const entries = [];

for (const { dir, prefix } of DIRS) {
  const files = readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith('.avif') && !isVariant(name))
    .sort();

  for (const name of files) {
    const file = join(dir, name);
    const meta = await sharp(file).metadata();
    const variants = [];

    for (const size of SIZES) {
      if (!meta.width || meta.width <= size) continue;
      const outName = name.replace(/\.avif$/i, `-${size}.avif`);
      await sharp(file)
        .resize({ width: size, withoutEnlargement: true })
        .avif({ quality: QUALITY, effort: 5 })
        .toFile(join(dir, outName));
      variants.push({ size, name: outName });
    }

    if (variants.length > 0) entries.push({ prefix, name, variants });
  }
}

const imports = [];
const lines = [];

entries.forEach((entry, index) => {
  imports.push(`import original${index} from '${entry.prefix}/${entry.name}';`);
  const parts = entry.variants.map((variant) => {
    imports.push(`import variant${index}_${variant.size} from '${entry.prefix}/${variant.name}';`);
    return `\${variant${index}_${variant.size}} ${variant.size}w`;
  });
  lines.push(`  [original${index}]: \`${parts.join(', ')}\`,`);
});

const content = `// Generado por scripts/generate-image-variants.mjs — no editar a mano.
${imports.join('\n')}

export const IMAGE_SRCSET = {
${lines.join('\n')}
};
`;

writeFileSync('src/assets/imageVariants.js', content, 'utf8');
console.log(`Miniaturas con variantes: ${entries.length} · archivos de variantes: ${entries.reduce((sum, entry) => sum + entry.variants.length, 0)}`);
