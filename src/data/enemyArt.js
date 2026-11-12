const V2_ART = import.meta.glob('../assets/enemies/*V2.png', {
  eager: true,
  import: 'default',
});

const normalize = (value) => String(value || '')
  .replace(/V2(\.png)?$/i, '')
  .replace(/\.(png|webp|avif)$/i, '')
  .replace(/[^a-z0-9]/gi, '')
  .toLowerCase();

const ART_BY_ID = Object.fromEntries(
  Object.entries(V2_ART).map(([path, src]) => [
    normalize(path.split('/').pop()),
    src,
  ]),
);

// Enemigos cuyo id de datos no coincide con el nombre del archivo V2.
const V2_ALIASES = {
  skeleton_guard: 'SkeletonArcherV2',
  skeleton_archer_esbirro1: 'SkeletonArcherV2',
  skeleton_archer_esbirro2: 'SkeletonArcherV2',
  violent_bully: 'AbominationV2',
  boatswain: 'ExecutionerV2',
  wakened_king_boss: 'LichV2',
  undead_king_boss: 'LichV2',
  undead_king_boss_1: 'LichV2',
  undead_king_boss_2: 'LichV2',
  undead_king_boss_Acecho_1: 'LichV2',
  undead_king_boss_Acecho_2: 'LichV2',
  dark_vampire: 'ShadowVampireV2',
  hero_corrupted: 'ShadowVampireV2',
  dark_vampire_com: 'ShadowVampireV2',
  luccanor_com: 'RavagerV2',
  aralhezec: 'DragonV2',
  wermunggdir: 'WurmV2',
  'wermunggdir_Señor': 'WurmV2',
  scout_darkness: 'ScoutOfDarknessV2',
  commander_twins: 'TwinV2',
  commander_thern: 'ThernV2',
  fallen_sisters: 'fallen_sisterV2',
};

/** Devuelve el arte V2 del enemigo si existe; si no, conserva el arte original. */
export function getEnemyArt(enemyId, fallback) {
  return ART_BY_ID[normalize(V2_ALIASES[enemyId] || enemyId)] || fallback;
}
