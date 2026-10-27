import lorelai from "@/assets/heroes/Lorelai.png";
import elros from "@/assets/heroes/Elros.png";
import jaheen from "@/assets/heroes/Jaheen.png";
import maya from "@/assets/heroes/Maya.png";
import vorn from "@/assets/heroes/Vorn.png";
import drasek from "@/assets/heroes/Drasek.png";
import jade from "@/assets/heroes/Jade.png";
import katarina from "@/assets/heroes/Katarina.png";
import tork from "@/assets/heroes/Tork.png";
import handuriel from "@/assets/heroes/Handuriel.png";
import lord_of_wrath from "@/assets/heroes/Lordwrath.png";
import arkhanos from "@/assets/heroes/Arkhanos.png";
import barak from "@/assets/heroes/Barak.png";
import devron from "@/assets/heroes/Devron.png";
import duncan from "@/assets/heroes/Duncan.png";
import flavian from "@/assets/heroes/Flavian.png";
import kellam from "@/assets/heroes/Kellam.png";
import pietro from "@/assets/heroes/Pietro.png";
import savran from "@/assets/heroes/Savran.png";
import shadow from "@/assets/heroes/Shadow.png";
import sskar from "@/assets/heroes/Sskar.png";
import sun from "@/assets/heroes/Sun.png";
import willow from "@/assets/heroes/Willow.png";
import mordred from "@/assets/heroes/Mordred.png";
import siff from "@/assets/heroes/Siff.png";
import sahara from "@/assets/heroes/Sahara.png";
import garamond from "@/assets/heroes/Garamond.png";
import diana from "@/assets/heroes/Diana.png";
import azriel from "@/assets/heroes/Azriel.png";
import brigitte from "@/assets/heroes/Brigitte.png";
import drixx from "@/assets/heroes/Drixx.png";
import lorien from "@/assets/heroes/Lorien.png";
import vacrem from "@/assets/heroes/Vacrem.png";
import andreas from "@/assets/heroes/Andreas.png";
import nyx from "@/assets/heroes/Nyx.png";
import catharina from "@/assets/heroes/Catharina.png";
import { getHeroBaseCubes } from "@/data/heroCubes";

export const HEROES = [
  { id: "lorelai", expansionId: "base", baseLife: 10, baseMove: 2, type: "hero", profession: "Maga", image: lorelai },
  { id: "elros", expansionId: "base", baseLife: 10, baseMove: 2, type: "hero", profession: "Asesino", image: elros },
  { id: "jaheen", expansionId: "base", baseLife: 10, baseMove: 2, type: "hero", profession: "Clerigo", image: jaheen },
  { id: "maya", expansionId: "base", baseLife: 10, baseMove: 2, type: "hero", profession: "Arquera", image: maya },
  { id: "vorn", expansionId: "base", baseLife: 10, baseMove: 2, type: "hero", profession: "Guerrero", image: vorn },
  { id: "drasek", expansionId: "undead_dragon", baseLife: 10, baseMove: 2, type: "hero", profession: "Paladin", image: drasek },
  { id: "jade", expansionId: "undead_dragon", baseLife: 10, baseMove: 2, type: "hero", profession: "Paladina", image: jade },
  { id: "katarina", expansionId: "infernal_desert", baseLife: 10, baseMove: 2, type: "hero", profession: "Bárbara", image: katarina },
  { id: "tork", expansionId: "infernal_desert", baseLife: 10, baseMove: 2, type: "hero", profession: "Bárbaro", image: tork },
  { id: "handuriel", expansionId: "handuriel", baseLife: 10, baseMove: 2, type: "hero", profession: "Arquero", image: handuriel },
  { id: "lord-of-wrath", expansionId: "lord_of_wrath", baseLife: 10, baseMove: 2, type: "hero", profession: "Guerrero_Sombrio", image: lord_of_wrath },
  { id: "arkanos", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Mago", image: arkhanos },
  { id: "barak", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Hechicero", image: barak },
  { id: "devron", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Guerrero_Sombrio", image: devron },
  { id: "duncan", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Guerrero", image: duncan },
  { id: "flavian", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Bardo", image: flavian },
  { id: "kellam", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Bardo", image: kellam },
  { id: "pietro", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Clérigo", image: pietro },
  { id: "savran", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Druida", image: savran },
  { id: "shadow", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Asesino", image: shadow },
  { id: "sskar", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Hechicero", image: sskar },
  { id: "sun", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Monje", image: sun },
  { id: "willow", expansionId: "war_loot", baseLife: 10, baseMove: 2, type: "hero", profession: "Druida", image: willow },
  { id: "mordred", expansionId: "apocalypse_heroes_1", baseLife: 10, baseMove: 2, type: "hero", profession: "Necromante", image: mordred },
  { id: "siff", expansionId: "apocalypse_heroes_1", baseLife: 10, baseMove: 2, type: "hero", profession: "Necromante", image: siff },
  { id: "sahara", expansionId: "apocalypse_heroes_1", baseLife: 10, baseMove: 2, type: "hero", profession: "Chamana", image: sahara },
  { id: "garamond", expansionId: "apocalypse_heroes_1", baseLife: 10, baseMove: 2, type: "hero", profession: "Chamán", image: garamond },
  { id: "diana", expansionId: "apocalypse_heroes_1", baseLife: 10, baseMove: 2, type: "hero", profession: "Maga_Espadachina", image: diana },
  { id: "azriel", expansionId: "apocalypse_heroes_1", baseLife: 10, baseMove: 2, type: "hero", profession: "Mago_Espadachin", image: azriel },
  { id: "brigitte", expansionId: "apocalypse_heroes_1", baseLife: 10, baseMove: 2, type: "hero", profession: "Adalid", image: brigitte },
  { id: "drixx", expansionId: "apocalypse_heroes_1", baseLife: 10, baseMove: 2, type: "hero", profession: "Adalid", image: drixx },
  { id: "lorien", expansionId: "apocalypse_lorien", baseLife: 10, baseMove: 2, type: "hero", profession: "Maga", image: lorien },
  { id: "vacrem", expansionId: "apocalypse_awakenings", baseLife: 10, baseMove: 2, type: "hero", profession: "Adalid", image: vacrem },
  { id: "andreas", expansionId: "apocalypse_awakenings", baseLife: 10, baseMove: 2, type: "hero", profession: "Necromante", image: andreas },
  { id: "nyx", expansionId: "apocalypse_awakenings", baseLife: 10, baseMove: 2, type: "hero", profession: "Mago_Espadachin", image: nyx },
  { id: "catharina", expansionId: "apocalypse_awakenings", baseLife: 10, baseMove: 2, type: "hero", profession: "Chamana", image: catharina },
];

/**
 * Cubos de acción base: 5 por héroe (1 de cada color + 1 del color de su clase).
 * Se calcula aquí para no repetir el dato en cada entrada y poder ajustarlo en
 * un único sitio cuando lleguen los valores definitivos.
 */
HEROES.forEach((hero) => {
  if (!hero.cubos) hero.cubos = getHeroBaseCubes(hero);
});

export { getHeroBaseCubes, getClassCubeColor, CUBE_COLORS } from '@/data/heroCubes';
