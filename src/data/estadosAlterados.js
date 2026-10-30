import derribo from "@/assets/assets_logo/derribo.png";
import marca from "@/assets/assets_logo/montaraz.png";
import sigilo from "@/assets/assets_logo/sigilo.png";
import aturdimiento from "@/assets/assets_logo/aturdimiento.png";
import lentitud from "@/assets/assets_logo/lentitud.png";
import hemorragia from "@/assets/assets_logo/hemorragia.png";
import veneno from "@/assets/assets_logo/veneno.png";
import intimidar from "@/assets/assets_logo/intimidar.png";
import quemadura from "@/assets/assets_logo/quemadura.png";
import escudo from "@/assets/assets_logo/escudo.png";
import sanar from "@/assets/assets_logo/sanar.png";
import tiempo from "@/assets/assets_logo/tiempo.png";
import grande from "@/assets/assets_logo/grande.png";
import evento from "@/assets/assets_logo/evento.png";
import concentracion from "@/assets/assets_logo/concentracion.png";
import furia from "@/assets/assets_logo/furia.png";
import fruto from "@/assets/assets_logo/fruto.png";
import ki from "@/assets/assets_logo/ki.png";
import { getHeroClassId } from "@/data/heroClasses";

export const ESTADOS_ALTERADOS = [
  // condiciones redundantes
  { id: "DERRIBO_I", texto: "derribo", accion: "derribo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: derribo, mostrar: "si", prevenible: "si" },
  { id: "MARCA_DE_MONTARAZ", texto: "marca", accion: "marca", reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1, imagen: marca, mostrar: "si", prevenible: "si" },
  { id: "SIGILO_I", texto: "sigilo", accion: "sigilo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: sigilo, mostrar: "si", prevenible: "si" },
  { id: "ATURDIMIENTO_I", texto: "aturdimiento", accion: "aturdimiento", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: aturdimiento, mostrar: "si", prevenible: "si" },
  { id: "LENTITUD_I", texto: "lentitud", accion: "lentitud", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: lentitud, mostrar: "si", prevenible: "si" },

  // condiciones acumulables
  { id: "HEMORRAGIA_I", texto: "hemorragia", accion: "hemorragia", reduce: "si", numReduce: 4, turno: "principio", daño: 1, max: 4, imagen: hemorragia, mostrar: "si", prevenible: "no" },
  { id: "VENENO_I", texto: "veneno", accion: "veneno", reduce: "no", numReduce: 0, turno: "principio", daño: 1, max: 4, imagen: veneno, mostrar: "si", prevenible: "no" },
  { id: "INTIMIDAR_I", texto: "intimidar", accion: "intimidar", reduce: "si", numReduce: 4, turno: "final", daño: 0, max: 4, imagen: intimidar, mostrar: "si", prevenible: "si" },
  { id: "QUEMADURA_I", texto: "quemadura", accion: "quemadura", reduce: "si", numReduce: 1, turno: "principio", daño: 1, max: 4, imagen: quemadura, mostrar: "si", prevenible: "no" },

  // recursos acumulables de héroe
  {
    id: "CONCENTRACION", texto: "concentracion", accion: "concentracion",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 4,
    imagen: concentracion, mostrar: "si", prevenible: "no", soloHeroes: true,
  },
  {
    id: "KI", texto: "ki", accion: "ki",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 4,
    imagen: ki, mostrar: "si", prevenible: "no", soloHeroes: true,
    clases: ["monje"],
  },
  {
    id: "FURIA", texto: "furia", accion: "furia",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 4,
    imagen: furia, mostrar: "si", prevenible: "no", soloHeroes: true,
    clases: ["barbaro"],
  },
  {
    id: "FRUTO_DE_VIDA", texto: "fruto", accion: "fruto",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 4,
    imagen: fruto, mostrar: "si", prevenible: "no", soloHeroes: true,
    clases: ["druida"],
  },
  { id: "ESCUDO", texto: "escudo", accion: "escudo", reduce: "no", numReduce: 0, turno: "principio", daño: 0, max: 4, imagen: escudo, mostrar: "si", prevenible: "si" },
  { id: "TIEMPO", texto: "tiempo", accion: "tiempo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 4, imagen: tiempo, mostrar: "no", prevenible: "si" }
];

export const INMUNIDADES = [
  // condiciones redundantes
  { id: "DERRIBO_I", imagen: derribo },
  { id: "SIGILO_I", imagen: sigilo },
  { id: "ATURDIMIENTO_I", imagen: aturdimiento },
  { id: "LENTITUD_I", imagen: lentitud },
  { id: "HEMORRAGIA_I", imagen: hemorragia },
  { id: "VENENO_I", texto: "veneno", imagen: veneno },
  { id: "INTIMIDAR_I", imagen: intimidar },
  { id: "QUEMADURA_I", imagen: quemadura },
  { id: "GRANDE", imagen: grande }
];

export const CAPACIDADES_ACTIVADAS = [
  { id: "REGENERACION", max: 0, imagen: sanar },
  { id: "MANIFESTAR", max: 0, imagen: veneno },
  { id: "HASTA", max: 0, imagen: sanar },
  { id: "SANAR", max: 0, imagen: sanar },
  { id: "ESCUDO", max: 4, imagen: escudo }
];

export const OTROS = [
  { id: "evento", max: 0, imagen: evento }
];

/**
 * Estados que puede tener un héroe: los generales más los recursos propios de
 * su clase (Ki de Sun, Furia de Katarina/Tork, Fruto de Savran/Willow).
 */
export function getHeroStatusCatalog(heroId) {
  const classId = getHeroClassId(heroId);
  return ESTADOS_ALTERADOS.filter((estado) => (
    estado.mostrar === 'si'
    && (!estado.soloHeroes || !estado.clases || estado.clases.includes(classId))
  ));
}

/** Estados de enemigo: excluye los recursos que solo existen en héroes. */
export function getEnemyStatusCatalog() {
  return ESTADOS_ALTERADOS.filter((estado) => !estado.soloHeroes);
}

