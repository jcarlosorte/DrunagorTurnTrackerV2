// Capacidades de los seguidores, con su descripción.
export const FOLLOWER_ABILITIES = [
  {
    id: 'veneno_2',
    label: 'VENENO 2',
    name: 'Veneno 2',
    color: 'border-emerald-600/60 bg-emerald-950/50 text-emerald-100',
    description: 'Al atacar, inflige 2 de veneno al objetivo.',
  },
  {
    id: 'hendedura_2',
    label: 'HENDEDURA 2',
    name: 'Hendedura 2',
    color: 'border-rose-600/60 bg-rose-950/50 text-rose-100',
    description: 'Al atacar, inflige 2 de hendedura al objetivo.',
  },
  {
    id: 'alcance_1',
    label: 'ALCANCE 1',
    name: 'Alcance 1',
    color: 'border-sky-600/60 bg-sky-950/50 text-sky-100',
    description: 'Puede atacar a 1 de distancia.',
  },
  {
    id: 'escudo_2',
    label: 'ESCUDO 2',
    name: 'Escudo 2',
    color: 'border-blue-600/60 bg-blue-950/50 text-blue-100',
    description: 'Gana 2 de escudo.',
  },
  {
    id: 'lentitud',
    label: 'LENTITUD',
    name: 'Lentitud',
    color: 'border-violet-600/60 bg-violet-950/50 text-violet-100',
    description: 'Al atacar, el objetivo no puede moverse en su próximo turno.',
  },
  {
    id: 'ataque_doble',
    label: 'ATAQUE DOBLE',
    name: 'Ataque doble',
    color: 'border-green-500/70 bg-green-950/50 text-green-200',
    rulesVersion: '2.0',
    description: 'Al atacar, realiza un segundo ataque.',
  },
];

export function getFollowerAbility(label) {
  return FOLLOWER_ABILITIES.find((ability) => ability.label === label) || null;
}
