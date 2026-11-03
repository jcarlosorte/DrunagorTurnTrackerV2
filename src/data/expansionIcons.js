import apocalypse from '@/assets/box_symbols/apocalypse.png';
import awakenings from '@/assets/box_symbols/awakenings.png';
import corebox from '@/assets/box_symbols/corebox.png';
import desertHellscar from '@/assets/box_symbols/desert_hellscar.png';
import fallenSister from '@/assets/box_symbols/fallen_sister.png';
import handuriel from '@/assets/box_symbols/handuriel.png';
import heroPack from '@/assets/box_symbols/hero_pack.png';
import lordwrath from '@/assets/box_symbols/lordwrath.png';
import lorien from '@/assets/box_symbols/lorien.png';
import luccanor from '@/assets/box_symbols/luccanor.png';
import monsterPack from '@/assets/box_symbols/monster_pack.png';
import shadowWorld from '@/assets/box_symbols/shadow_world.png';
import spoilsOfWar from '@/assets/box_symbols/spoils_of_war.png';
import undeadDragon from '@/assets/box_symbols/undead_dragon.png';

export const EXPANSION_ICONS = {
  base: corebox,
  luccanor,
  undead_dragon: undeadDragon,
  infernal_desert: desertHellscar,
  dark_world: shadowWorld,
  handuriel,
  lord_of_wrath: lordwrath,
  monsters_pack_1: monsterPack,
  war_loot: spoilsOfWar,
  gencon: heroPack,
  dicetower: monsterPack,
  apocalypse_adventures: apocalypse,
  apocalypse_heroes_1: heroPack,
  apocalypse_lorien: lorien,
  apocalypse_awakenings: awakenings,
  apocalypse_sisters: fallenSister,
};

export const EXPANSION_COLORS = {
  base: '#b45309',
  luccanor: '#0e7490',
  undead_dragon: '#7c3aed',
  infernal_desert: '#c2410c',
  dark_world: '#4f46e5',
  handuriel: '#15803d',
  lord_of_wrath: '#b91c1c',
  monsters_pack_1: '#57534e',
  war_loot: '#a16207',
  gencon: '#0f766e',
  dicetower: '#7e22ce',
  apocalypse_adventures: '#9f1239',
  apocalypse_heroes_1: '#1d4ed8',
  apocalypse_lorien: '#047857',
  apocalypse_awakenings: '#c026d3',
  apocalypse_sisters: '#be123c',
};

export function getExpansionIcon(id) {
  return EXPANSION_ICONS[id] || null;
}

export function getExpansionColor(id) {
  return EXPANSION_COLORS[id] || '#64748b';
}
