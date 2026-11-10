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
import fragil from "@/assets/assets_logo/fragil.png";
import polimorfismo from "@/assets/assets_logo/polimorfismo.png";
import restriccion from "@/assets/assets_logo/restriccion.png";
import semillaDelCaos from "@/assets/assets_logo/semilla_del_caos.png";
import atadura from "@/assets/assets_logo/atadura.png";
import entropia from "@/assets/assets_logo/entropia.png";
import idoloDeFuria from "@/assets/assets_logo/idolo_de_furia.webp";
import idoloDeResistencia from "@/assets/assets_logo/idolo_de_resistencia.webp";
import idoloDeTormenta from "@/assets/assets_logo/idolo_de_tormenta.webp";
import idoloDeTranquilidad from "@/assets/assets_logo/idolo_de_tranquilidad.webp";
import inspiracion from "@/assets/assets_logo/inspiracion.png";
import { getHeroClassId } from "@/data/heroClasses";

export const ESTADOS_ALTERADOS = [
  {
    id: "INSPIRACION", texto: "inspiracion", accion: "inspiracion",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1,
    imagen: inspiracion, mostrar: "si", prevenible: "si", soloHeroes: true,
  },

  // condiciones redundantes
  { id: "DERRIBO_I", texto: "derribo", accion: "derribo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: derribo, mostrar: "si", prevenible: "si" },
  { id: "MARCA_DE_MONTARAZ", texto: "marca", accion: "marca", reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1, imagen: marca, mostrar: "si", prevenible: "si" },
  { id: "SIGILO_I", texto: "sigilo", accion: "sigilo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: sigilo, mostrar: "si", prevenible: "si" },
  { id: "ATURDIMIENTO_I", texto: "aturdimiento", accion: "aturdimiento", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: aturdimiento, mostrar: "si", prevenible: "si" },
  { id: "LENTITUD_I", texto: "lentitud", accion: "lentitud", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: lentitud, mostrar: "si", prevenible: "si" },
  { id: "FRAGIL", texto: "fragil", accion: "fragil", reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1, imagen: fragil, mostrar: "si", prevenible: "si", version: "2.0" },
  { id: "POLIMORFISMO", texto: "polimorfismo", accion: "polimorfismo", reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1, imagen: polimorfismo, mostrar: "si", prevenible: "si", version: "2.0" },
  { id: "RESTRICCION", texto: "restriccion", accion: "restriccion", reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1, imagen: restriccion, mostrar: "si", prevenible: "si", version: "2.0" },

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
  { id: "TIEMPO", texto: "tiempo", accion: "tiempo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 4, imagen: tiempo, mostrar: "no", prevenible: "si" },

  // estados de la versión 2.0
  {
    id: "SEMILLA_DEL_CAOS", texto: "semilla del caos", accion: "semilla_del_caos",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 4,
    imagen: semillaDelCaos, mostrar: "si", prevenible: "no",
    soloHeroes: true, aliados: true, version: "2.0",
  },
  {
    id: "LAZO_DE_ALMA", texto: "lazo_de_alma", accion: "lazo_de_alma",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1,
    imagen: atadura, mostrar: "si", prevenible: "no",
    soloHeroes: true, aliados: true, version: "2.0",
  },
  {
    id: "ENTROPIA", texto: "entropía", accion: "entropia",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 4,
    imagen: entropia, mostrar: "si", prevenible: "no",
    soloHeroes: true, clases: ["mago_espadachin"], version: "2.0",
  },
  {
    id: "IDOLO_DE_FURIA", texto: "ídolo de furia", accion: "idolo_de_furia",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1,
    imagen: idoloDeFuria, mostrar: "si", prevenible: "no",
    soloHeroes: true, clases: ["chaman"], version: "2.0",
  },
  {
    id: "IDOLO_DE_RESISTENCIA", texto: "ídolo de resistencia", accion: "idolo_de_resistencia",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1,
    imagen: idoloDeResistencia, mostrar: "si", prevenible: "no",
    soloHeroes: true, clases: ["chaman"], version: "2.0",
  },
  {
    id: "IDOLO_DE_TORMENTA", texto: "ídolo de tormenta", accion: "idolo_de_tormenta",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1,
    imagen: idoloDeTormenta, mostrar: "si", prevenible: "no",
    soloHeroes: true, clases: ["chaman"], version: "2.0",
  },
  {
    id: "IDOLO_DE_TRANQUILIDAD", texto: "ídolo de tranquilidad", accion: "idolo_de_tranquilidad",
    reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1,
    imagen: idoloDeTranquilidad, mostrar: "si", prevenible: "no",
    soloHeroes: true, clases: ["chaman"], version: "2.0",
  },
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

const matchesVersion = (estado, rulesVersion) => !estado.version || estado.version === rulesVersion;

/**
 * Estados que puede tener un héroe: los generales más los recursos propios de
 * su clase (Ki de Sun, Furia de Katarina/Tork, Fruto de Savran/Willow).
 */
export function getHeroStatusCatalog(heroId, rulesVersion = '1.5') {
  const classId = getHeroClassId(heroId);
  return ESTADOS_ALTERADOS.filter((estado) => (
    matchesVersion(estado, rulesVersion)
    && estado.mostrar === 'si'
    && (!estado.soloHeroes || !estado.clases || estado.clases.includes(classId))
  ));
}

/** Estados de enemigo: excluye los recursos que solo existen en héroes y aliados. */
export function getEnemyStatusCatalog(rulesVersion = '1.5') {
  return ESTADOS_ALTERADOS.filter((estado) => matchesVersion(estado, rulesVersion) && !estado.soloHeroes);
}

/** Estados de aliados (compañeros y mascotas): generales y los marcados como aliados. */
export function getAllyStatusCatalog(rulesVersion = '1.5') {
  return ESTADOS_ALTERADOS.filter((estado) => (
    matchesVersion(estado, rulesVersion)
    && estado.mostrar === 'si'
    && (!estado.soloHeroes || estado.aliados)
  ));
}


/** Metadatos de un estado, aceptando el id con o sin el sufijo _I. */
export function getEstadoMeta(id) {
  if (!id) return null;
  const normalized = String(id).replace(/_I$/, '');
  return ESTADOS_ALTERADOS.find((item) => (
    item.id === id || item.id.replace(/_I$/, '') === normalized
  )) || null;
}
