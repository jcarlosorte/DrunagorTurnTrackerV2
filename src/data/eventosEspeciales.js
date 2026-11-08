import barricade from '@/assets/interactions/barricade.avif';
import seed from '@/assets/interactions/seed.avif';
import beerFactory from '@/assets/interactions/beer-factory.avif';

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
