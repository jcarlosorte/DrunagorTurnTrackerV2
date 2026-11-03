import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const files = {
  runic: 'C:/Users/er_du/.dsh/attachments/v1/objects/b0/b0279672b8efc37f8db9cee685392985cccd9e257db040492151324d53190c46',
  seed: 'C:/Users/er_du/.dsh/attachments/v1/objects/9a/9ab2f7e9d9b2ac625f869f12fe53e24e1af1d0cbad6e516ce11e9e6538417c06',
  barricade: 'C:/Users/er_du/.dsh/attachments/v1/objects/a4/a4f7066fa7bc2442d5e34aaab1961d5e50350773f31b95b01e36ca45d6209d07',
  'beer-factory': 'C:/Users/er_du/.dsh/attachments/v1/objects/56/56a49ef13552a1bdc58137203bde76fbe2935117cab57eac86ee2e2932a950f8',
  'draconian-altar': 'C:/Users/er_du/.dsh/attachments/v1/objects/89/89473082c9f96789cab0e70a38b1ceb827f05aa9cedfae344a5d201c409ee9fe',
  forge: 'C:/Users/er_du/.dsh/attachments/v1/objects/22/22497b6649cdb31d223b40dbee29c248c2eb5e3564d7c1a6458eb494c635ad49',
};

await mkdir('src/assets/interactions', { recursive: true });
for (const [name, input] of Object.entries(files)) {
  const output = `src/assets/interactions/${name}.avif`;
  await sharp(input).resize({ width: 800 }).avif({ quality: 62 }).toFile(output);
  const meta = await sharp(output).metadata();
  console.log(name, `${meta.width}x${meta.height}`, meta.format);
}
