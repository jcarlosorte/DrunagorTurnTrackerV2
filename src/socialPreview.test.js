import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = readFileSync(`${root}index.html`, 'utf8');
const imagePath = `${root}public/social-preview.jpg`;
const imageUrl = 'https://jcarlosorte.github.io/DrunagorTurnTrackerV2/social-preview.jpg';

describe('vista previa social', () => {
  it('anuncia la imagen grande en Open Graph y Twitter', () => {
    expect(html).toContain(`<meta property="og:image" content="${imageUrl}" />`);
    expect(html).toContain(`<meta name="twitter:image" content="${imageUrl}" />`);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain('<meta property="og:image:width" content="1200" />');
    expect(html).toContain('<meta property="og:image:height" content="630" />');
    expect(html).toContain('property="og:image:alt"');
    expect(html).not.toContain('%BASE_URL%logo.png');
  });

  it('publica una imagen 1200×630 optimizada', async () => {
    expect(existsSync(imagePath)).toBe(true);
    expect(statSync(imagePath).size).toBeLessThan(300 * 1024);
    const metadata = await sharp(imagePath).metadata();
    expect(metadata.format).toBe('jpeg');
    expect(metadata.width).toBe(1200);
    expect(metadata.height).toBe(630);
  });
});
