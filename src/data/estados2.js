import aturdimiento from '@/assets/assets_logo/aturdimiento.png';
import ceguera from '@/assets/assets_logo/ceguera.png';
import derribo from '@/assets/assets_logo/derribo.png';
import escudo from '@/assets/assets_logo/escudo.png';
import hemorragia from '@/assets/assets_logo/hemorragia.png';
import intimidar from '@/assets/assets_logo/intimidar.png';
import lentitud from '@/assets/assets_logo/lentitud.png';
import quemadura from '@/assets/assets_logo/quemadura.png';
import sigilo from '@/assets/assets_logo/sigilo.png';
import tiempo from '@/assets/assets_logo/tiempo.png';
import veneno from '@/assets/assets_logo/veneno.png';
import trampaVenenosa from '@/assets/assets_logo/trampa_venenosa.png';

/** Logos de estados de la versión 2.0. */
export const ESTADOS_2_LOGOS = {
  ATURDIMIENTO: aturdimiento,
  CEGUERA: ceguera,
  DERRIBO: derribo,
  ESCUDO: escudo,
  HEMORRAGIA: hemorragia,
  INTIMIDAR: intimidar,
  LENTITUD: lentitud,
  QUEMADURA: quemadura,
  SIGILO: sigilo,
  TIEMPO: tiempo,
  VENENO: veneno,
  TRAMPA_VENENOSA: trampaVenenosa,
};

export function getEstadoLogo2(id) {
  return ESTADOS_2_LOGOS[id] || null;
}
