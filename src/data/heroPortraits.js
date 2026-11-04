const PORTRAIT_FILES = import.meta.glob('../assets/hero/*.png', { eager: true, import: 'default' });

// Algunos archivos usan una variante del nombre del héroe.
const ALIASES = {
  arkhanos: 'arkanos',
  brihitte: 'brigitte',
  lordwrath: 'lord-of-wrath',
  vacren: 'vacrem',
  vacron: 'vacrem',
};

/** Variantes de clase que reutilizan el retrato del personaje base. */
const VARIANT_FALLBACK = {
  andreas_clerigo: 'andreas',
  catharina_maga: 'catharina',
  nyx_asesino: 'nyx',
  vacrem_guerrero: 'vacrem',
};

const VARIANT_FILES = {
  'andreas-necromancer': 'andreas',
  'andreas-cleric-1': 'andreas_clerigo',
  'catharina-shaman': 'catharina',
  'catharina-mage': 'catharina_maga',
  'nyx-swordmage': 'nyx',
  'nyx-assasin': 'nyx_asesino',
  'vacren-warlord': 'vacrem',
  'vacron-warrior': 'vacrem_guerrero',
};

const HERO_PORTRAITS = {};
for (const [path, url] of Object.entries(PORTRAIT_FILES)) {
  const fileName = path.split('/').pop().replace(/\.png$/i, '');
  const slug = fileName.replace(/^hero-/, '');
  const rawId = VARIANT_FILES[slug] || slug.split('-')[0];
  const id = ALIASES[rawId] || rawId;
  if (!HERO_PORTRAITS[id]) HERO_PORTRAITS[id] = url;
}

/** Retrato sin fondo del héroe, o null si no existe. */
export function getHeroPortrait(id) {
  return HERO_PORTRAITS[id] || HERO_PORTRAITS[VARIANT_FALLBACK[id]] || null;
}
