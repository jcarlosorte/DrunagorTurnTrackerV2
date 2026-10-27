// src/data/expansions.js
import baseImg from '@/assets/expansions/base.avif';
import luccanorImg from '@/assets/expansions/luccanor.avif';
import dragonImg from '@/assets/expansions/dragon.avif';
import desiertoImg from '@/assets/expansions/desierto.avif';
import mundoImg from '@/assets/expansions/mundo-sombrio.avif';
import handurielImg from '@/assets/expansions/handuriel.avif';
import iraImg from '@/assets/expansions/ira.avif';
import monstruos1Img from '@/assets/expansions/monstruos1.avif';
import botinesImg from '@/assets/expansions/botines.avif';
import apocalypseImg from '@/assets/expansions/apocalypse.webp';
import heroPackImg from '@/assets/expansions/hero-pack.avif';
import lorienImg from '@/assets/expansions/lorien.avif';
import awakeningsImg from '@/assets/expansions/awakenings.avif';
import sistersImg from '@/assets/expansions/sisters.avif';

export const EXPANSIONS = [
  {
    id: "base",
    imagen: baseImg,
    heroes: ["lorelai", "elros", "jaheen", "maya", "vorn"],
    enemies: [
      "undead_king_boss", "skeleton_archer", "dark_vampire", "rotten_flesh",
      "shadow_cultist", "executioner", "shadow_knight", "abomination"
    ],
    companions: ["alyra", "koragg"],
    pets: ["bliss", "gloomy"],
    roles: ['tank', 'support', 'dps', 'healer', 'control'],
    // Campos vacíos para otras expansiones o datos adicionales
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "on"
  },
  {
    id: "luccanor",
    imagen: luccanorImg,
    heroes: [],
    enemies: ["ravager", "lady_claw"],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "on"
  },
  {
    id: "undead_dragon",
    imagen: dragonImg,
    heroes: ["drasek", "jade"],
    enemies: ["corrupted_farmer", "aralhezec"],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "on"
  },
  {
    id: "infernal_desert",
    imagen: desiertoImg,
    heroes: ["katarina", "tork"],
    enemies: ["wermunggdir", "corrupted_worm"],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "on"
  },
  {
    id: "dark_world",
    imagen: mundoImg,
    heroes: [],
    enemies: ["shadow_pain", "shadow_guardian"],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "on"
  },
  {
    id: "handuriel",
    imagen: handurielImg,
    heroes: ["handuriel"],
    enemies: [],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "on"
  },
  {
    id: "lord_of_wrath",
    imagen: iraImg,
    heroes: ["lord_of_wrath"],
    enemies: [],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "on"
  },
  {
    id: "monsters_pack_1",
    imagen: monstruos1Img,
    heroes: [],
    enemies: ["scout_of_darkness", "death_messenger", "demon_lord"],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "on"
  },
  {
    id: "war_loot",
    imagen: botinesImg,
    heroes: [
      "arkanos", "barak", "devron", "duncan", "flavian", "kellam",
      "pietro", "savran", "shadow", "sskar", "sun", "willow"
    ],
    enemies: ["shadow_mistress", "walking_horror", "bone_reaper", "commander_twins", "commander_thern"],
    companions: [],
    pets: ["wog"],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "on"
  },
  {
    id: "apocalypse_adventures",
    imagen: apocalypseImg,
    heroes: [],
    enemies: [
      "dream_titan", "chain_master", "the_witch", "skeleton_knight",
      "larua_mage", "war_horsemen", "death_horsemen",
      "plague_horsemen", "famine_horsemen"
    ],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "off"
  },
  {
    id: "apocalypse_heroes_1",
    imagen: heroPackImg,
    heroes: ["mordred", "siff", "sahara", "garamond", "diana", "azriel", "brigitte", "drixx"],
    enemies: [],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "off"
  },
  {
    id: "apocalypse_lorien",
    imagen: lorienImg,
    heroes: ["lorien"],
    enemies: [],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "off"
  },
  {
    id: "apocalypse_awakenings",
    imagen: awakeningsImg,
    heroes: ["vacrem", "andreas", "nyx", "catharina"],
    enemies: [
      "soul_harvester", "gorgon_hexer", "gremlin_horde", "gorgoness_witch",
      "grim_doctor", "fell_asteris", "nagian_hunter", "hellspawn_brute", "night_stalker"
    ],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "off"
  },
  {
    id: "apocalypse_sisters",
    imagen: sistersImg,
    heroes: [],
    enemies: ["fallen_sisters"],
    companions: [],
    pets: [],
    roles: [],
    dungeonRoles: [],
    language: { en: '', es: '' },
    active: "off"
  }
];

