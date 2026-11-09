import barricade from '@/assets/interactions/barricade.avif';
import seed from '@/assets/interactions/seed.avif';
import beerFactory from '@/assets/interactions/beer-factory.avif';
import ship from '@/assets/interactions/ship.avif';
import flood from '@/assets/interactions/flood.avif';
import forge from '@/assets/interactions/forge.avif';
import runic from '@/assets/interactions/runic.avif';
import portal from '@/assets/interactions/portal.avif';

/**
 * Sorpresa de Eradren: seis cartas con sus textos completos.
 *
 * Las dos cartas de Asalto, las dos de Superviviente y las dos de Gatito
 * comparten título, pero son cartas distintas: cada instancia se baraja y se
 * descarta por separado.
 */
export const ERRADEN_CARDS = [
  {
    instanceId: 'erraden_asalto_1',
    id: 'asalto',
    title: '¡ASALTO!',
    text: 'Hurgando entre los escombros, terminas liberando una monstruosidad que, de lo contrario, estaría atrapada por su torpeza...\n\nInvoca 1 MG – Bisoño en la casilla que previamente ocupaba esta ficha de Mecánica Especial.',
    background: barricade,
    summon: { label: 'MG – Bisoño', categoria: 'bisoño', color: 'gris' },
  },
  {
    instanceId: 'erraden_asalto_2',
    id: 'asalto',
    title: '¡ASALTO!',
    text: 'Hurgando entre los escombros, terminas liberando una monstruosidad que, de lo contrario, estaría atrapada por su torpeza...\n\nInvoca 1 MG – Bisoño en la casilla que previamente ocupaba esta ficha de Mecánica Especial.',
    background: barricade,
    summon: { label: 'MG – Bisoño', categoria: 'bisoño', color: 'gris' },
  },
  {
    instanceId: 'erraden_superviviente_124',
    id: 'superviviente_124',
    title: 'SUPERVIVIENTE PERDIDO',
    text: 'Hurgando entre los escombros, descubres el escondite donde un superviviente buscó refugio. ¿Qué historia tendrá que contar?\n\nVe a la resolución 124.',
    background: seed,
  },
  {
    instanceId: 'erraden_superviviente_121',
    id: 'superviviente_121',
    title: 'SUPERVIVIENTE PERDIDO',
    text: 'Hurgando entre los escombros, descubres el escondite donde un superviviente buscó refugio. ¿Qué historia tendrá que contar?\n\nVe a la resolución 121.',
    background: seed,
  },
  {
    instanceId: 'erraden_gatito_1',
    id: 'gatito_1',
    title: 'GATITO',
    text: 'Recibes el Objeto de Aventura:\n\nGatito de Christi. -Pertrecho-\n\nPASIVA:\n\nSi Infliges el Golpe de Gracia a un Monstruo que no sea Esbirro La primera vez durante el turno: ese Monstruo suelta 1 Ficha de Botín en su Casilla.',
    background: beerFactory,
  },
  {
    instanceId: 'erraden_gatito_2',
    id: 'gatito_2',
    title: 'GATITO',
    text: 'Recibes el Objeto de Aventura:\n\nGatito de Christi. -Pertrecho-\n\nPASIVA:\n\nCada vez que impactes a un Personaje con un Ataque con Arma o con Hechizo: Empujón 1. Si se caen a un nivel de mazmorra inferior, también sufren Derribo.',
    background: beerFactory,
  },
];

/** PS del Navío Corrupto (6 cartas). */
export const CORRUPT_SHIP_CARDS = [
  {
    instanceId: 'corrupt_fuego_1', id: 'fuego_respuesta', title: '¡FUEGO DE RESPUESTA!',
    text: 'Primero, manifiesta 1 runa.\nLuego, recarga el cañón mágico del Buque Cisne que coincida con el color de la runa revelada (si manifiestas una runa azul, el líder del grupo escoge el cañón que se recarga).\nLuego, invoca un grupo de incursión de Cazamareas adyacente a ese cañón.',
    background: forge, action: 'fuego', actionLabel: 'Resolver ¡FUEGO DE RESPUESTA!',
  },
  {
    instanceId: 'corrupt_fuego_2', id: 'fuego_respuesta', title: '¡FUEGO DE RESPUESTA!',
    text: 'Primero, manifiesta 1 runa.\nLuego, recarga el cañón mágico del Buque Cisne que coincida con el color de la runa revelada (si manifiestas una runa azul, el líder del grupo escoge el cañón que se recarga).\nLuego, invoca un grupo de incursión de Cazamareas adyacente a ese cañón.',
    background: forge, action: 'fuego', actionLabel: 'Resolver ¡FUEGO DE RESPUESTA!',
  },
  {
    instanceId: 'corrupt_vision_1', id: 'vision_clara', title: 'VISIÓN CLARA',
    text: 'Primero, coloca 1 ficha de evento especial encima de la carta de escenario de Artillero Infame en el medidor de iniciativa.\nMientras la ficha esté ahí, considera que la regla especial de visión reducida está suspendida.\nSi el marcador de iniciativa vuelve a alcanzar esta carta en la siguiente ronda, retira la ficha. La regla especial vuelve a funcionar.',
    background: runic, action: 'vision', actionLabel: 'Activar Visión Clara',
  },
  {
    instanceId: 'corrupt_vision_2', id: 'vision_clara', title: 'VISIÓN CLARA',
    text: 'Primero, coloca 1 ficha de evento especial encima de la carta de escenario de Artillero Infame en el medidor de iniciativa.\nMientras la ficha esté ahí, considera que la regla especial de visión reducida está suspendida.\nSi el marcador de iniciativa vuelve a alcanzar esta carta en la siguiente ronda, retira la ficha. La regla especial vuelve a funcionar.',
    background: runic, action: 'vision', actionLabel: 'Activar Visión Clara',
  },
  {
    instanceId: 'corrupt_agarraos_1', id: 'agarraos', title: 'AGARRAOS',
    text: 'Cada héroe sobre alguna loseta del Buque Cisne tiene que realizar un reto de habilidad de Agilidad (verde), dificultad 11. Cada dado de Agilidad que tengas te otorga +2 adicional a tu tirada. Si tienes éxito, obtienes 1 ficha de inspiración. En caso contrario, sufres derribo.\nLas mascotas, seguidores y monstruos sobre estas losetas sufren esta condición sin defenderse (excepto si son inmunes).',
    background: flood,
  },
  {
    instanceId: 'corrupt_agarraos_2', id: 'agarraos', title: 'AGARRAOS',
    text: 'Cada héroe sobre alguna loseta del Buque Cisne tiene que realizar un reto de habilidad de Agilidad (verde), dificultad 11. Cada dado de Agilidad que tengas te otorga +2 adicional a tu tirada. Si tienes éxito, obtienes 1 ficha de inspiración. En caso contrario, sufres derribo.\nLas mascotas, seguidores y monstruos sobre estas losetas sufren esta condición sin defenderse (excepto si son inmunes).',
    background: flood,
  },
];

/** PS del Buque Cisne (6 cartas). */
export const SWAN_SHIP_CARDS = [
  {
    instanceId: 'swan_refuerzos_1', id: 'refuerzos', title: '¡REFUERZOS!',
    text: 'Primero, manifiesta 1 runa.\nLuego, invoca 1 Artillero Infame encima de la ficha de generación que coincida con el color de la runa revelada (si manifiestas una runa azul, el líder del grupo escoge la ficha de generación que se usará como punto de generación).',
    background: portal, action: 'refuerzos', actionLabel: 'Resolver ¡REFUERZOS!',
  },
  {
    instanceId: 'swan_refuerzos_2', id: 'refuerzos', title: '¡REFUERZOS!',
    text: 'Primero, manifiesta 1 runa.\nLuego, invoca 1 Artillero Infame encima de la ficha de generación que coincida con el color de la runa revelada (si manifiestas una runa azul, el líder del grupo escoge la ficha de generación que se usará como punto de generación).',
    background: portal, action: 'refuerzos', actionLabel: 'Resolver ¡REFUERZOS!',
  },
  {
    instanceId: 'swan_refuerzos_3', id: 'refuerzos', title: '¡REFUERZOS!',
    text: 'Primero, manifiesta 1 runa.\nLuego, invoca 1 Artillero Infame encima de la ficha de generación que coincida con el color de la runa revelada (si manifiestas una runa azul, el líder del grupo escoge la ficha de generación que se usará como punto de generación).',
    background: portal, action: 'refuerzos', actionLabel: 'Resolver ¡REFUERZOS!',
  },
  {
    instanceId: 'swan_disparo_1', id: 'disparo_canon', title: '¡DISPARO DEL CAÑÓN!',
    text: 'Primero, escoge 1 cañón terrorífico, voltéalo y coloca 1 ficha de tiempo encima de la carta de runa al final del medidor de iniciativa.\nMientras la ficha esté ahí, el cañón no está disponible (los Artilleros Infames se intentarán mover hasta él que esté disponible durante su turno).\nLuego, si el marcador de iniciativa alcanza la carta de runa al final de la ronda en curso, retira la ficha de tiempo de la carta. El cañón vuelve a estar disponible (voltéalo).',
    background: ship, action: 'disparo', actionLabel: 'Elegir Cañón Terrorífico',
  },
  {
    instanceId: 'swan_critico_1', id: 'disparo_critico', title: '¡DISPARO CRÍTICO!',
    text: 'Primero, escoge 1 de las losetas del Navío Corrupto.\nLuego, cada héroe sobre dicha loseta tiene que realizar un reto de habilidad de Agilidad (verde), dificultad 11. Cada dado de Agilidad que tengas te otorga +2 adicional a tu tirada. Si tienes éxito, obtienes 1 ficha de inspiración. En caso contrario, sufres derribo.\nLas mascotas, seguidores y monstruos sobre estas losetas sufren esta condición sin defenderse (excepto si son inmunes).',
    background: barricade,
  },
  {
    instanceId: 'swan_critico_2', id: 'disparo_critico', title: '¡DISPARO CRÍTICO!',
    text: 'Primero, escoge 1 de las losetas del Navío Corrupto.\nLuego, cada héroe sobre dicha loseta tiene que realizar un reto de habilidad de Agilidad (verde), dificultad 11. Cada dado de Agilidad que tengas te otorga +2 adicional a tu tirada. Si tienes éxito, obtienes 1 ficha de inspiración. En caso contrario, sufres derribo.\nLas mascotas, seguidores y monstruos sobre estas losetas sufren esta condición sin defenderse (excepto si son inmunes).',
    background: barricade,
  },
];
