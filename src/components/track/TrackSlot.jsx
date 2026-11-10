import classNames from 'classnames';
import { GiWingedSword, GiAbstract065 } from 'react-icons/gi';
import siegeDeckBack from '@/assets/runes/card-indigo.webp';
import CommanderCard from '@/components/CommanderCard';
import EnemyCard from '@/components/track/EnemyCard';
import CharacterCard from '@/components/track/CharacterCard';
import CompanionTrackCard from '@/components/track/CompanionTrackCard';
import FollowerCard from '@/components/track/FollowerCard';
import { cardDistance, compactSlotHeight } from '@/components/track/trackLayout';

/**
 * Una posición del track de iniciativa.
 *
 * Dibuja la etiqueta central (rol o runa), la pila superior y la inferior.
 * Toda la información y las acciones llegan en `deps` para no acoplar el
 * componente al estado global del tracker.
 */
export default function TrackSlot({ index, compact = false, density = 'normal', overlap = 'normal', deps }) {
  const {
    runesColorMap,
    getRuneColorFromIndex,
    COLOR_RUNAS,
    runes,
    tr = {},
    ti = {},
    tea = {},
    placedHeroes = [],
    placedEnemies = [],
    placedRunes = [],
    rolesOnTop,
    rolesOnBottom,
    currentTurnEntity,
    flippedCards = [],
    currentSlotIndex = -1,
    boardSlotHeight,
    getHeroName,
    getHeroProf,
    getHeroExtras,
    getEnemyName,
    heroManagementEnabled,
    onRemove,
    openEnemyModal,
    removeRuneByUUID,
    setSelectedHeroId,
    companions = [],
    onOpenCompanion,
    placedFollowers = [],
    openFollower,
    siegeEvent,
    openSiegeDeck,
    RuneCard,
  } = deps;

  const isRune = Object.values(runesColorMap).includes(index);
  const isRuneTextSlot = index === 10;
  const runeColor = getRuneColorFromIndex(index);

  const heroesAbove = placedHeroes.filter((h) => h.position === index && rolesOnTop.includes(h.role));
  const heroesBelow = placedHeroes.filter((h) => h.position === index && rolesOnBottom.includes(h.role));
  // Cada héroe arrastra a sus compañeros: se apilan detrás, en orden de aparición.
  const withCompanions = (heroes) => heroes.flatMap((hero) => [
    hero,
    ...companions
      .filter((entry) => entry.heroId === hero.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((entry) => ({ ...entry, kind: 'companion' })),
  ]);
  const stackAbove = [
    ...withCompanions(heroesAbove),
    ...placedFollowers
      .filter((follower) => follower.position === index && rolesOnBottom.includes(follower.role))
      .map((follower) => ({ ...follower, kind: 'follower' })),
  ];
  const stackBelow = [
    ...withCompanions(heroesBelow),
    ...placedFollowers
      .filter((follower) => follower.position === index && rolesOnTop.includes(follower.role))
      .map((follower) => ({ ...follower, kind: 'follower' })),
  ];
  const enemiesAbove = placedEnemies.filter((e) => e.enemy.position === index && e.enemy.runePosition === 'arriba');
  const enemiesBelow = placedEnemies.filter((e) => e.enemy.position === index && e.enemy.runePosition === 'abajo');
  const runesAbove = placedRunes.filter((r) => r.rune.colorIndex === index && r.rune.posicion === 'arriba');
  const runesBelow = placedRunes.filter((r) => r.rune.colorIndex === index && r.rune.posicion === 'abajo');
  const runesBelowItems = [
    ...runesBelow.map((r) => r.rune),
    ...(isRuneTextSlot && siegeEvent?.active
      ? [{ kind: 'siege', id: 'siege', name: ti.siegeTitle || 'Asedio de Limiternia' }]
      : []),
  ];

  const totalAbove = stackAbove.length + (isRune ? enemiesAbove.length : 0) + (isRuneTextSlot ? runesAbove.length : 0);
  const totalBelow = stackBelow.length + (isRune ? enemiesBelow.length : 0) + (isRuneTextSlot ? runesBelowItems.length : 0);
  // Densidad compacta: cartas algo más pequeñas y pilas más juntas.
  const densityFactor = density === 'compact' ? 0.85 : 1;
  // Solape compacto: las cartas se acercan entre sí (sin tocar la separación al track).
  const overlapFactor = overlap === 'compact' ? 0.72 : 1;
  // En la vista de lista el slot se dibuja solo: usa su altura real y no la del tablero.
  // oardSlotHeight ya llega escalado por densidad y solape desde InitTracker.
  const slotHeight = compact ? compactSlotHeight(totalAbove, totalBelow) : boardSlotHeight;

  const renderStack = (items, side, type = 'hero') => {
    const isTop = side === 'top';
    const count = items.length;
    if (count === 0) return null;
    const ordered = isTop ? [...items].reverse() : items;

    return ordered.map((item, i) => {
      const distance = (i === 0 ? cardDistance(count, 0) : cardDistance(count, i) * overlapFactor) * densityFactor;
      const zIndex = count - i;

      const isCompanion = type === 'hero' && item.kind === 'companion';
      const isFollower = type === 'hero' && item.kind === 'follower';
      const isSiege = item.kind === 'siege';
      const isCurrentTurn = currentTurnEntity && (
        (type === 'enemy' && item.enemy.uuid === currentTurnEntity.uuid) ||
        (type === 'rune' && item.uuid === currentTurnEntity.uuid) ||
        (isSiege && currentTurnEntity.type === 'event') ||
        (type === 'hero' && isCompanion && currentTurnEntity.type === 'companion' && item.uid === currentTurnEntity.uid) ||
        (type === 'hero' && isFollower && currentTurnEntity.type === 'follower' && item.uid === currentTurnEntity.uid) ||
        (type === 'hero' && !isCompanion && !isFollower && !isSiege && currentTurnEntity.type === 'hero' && item.id === currentTurnEntity.id)
      );
      const isEntityFlipping = type === 'enemy' && flippedCards.includes(item.enemy.uuid);

      return (
        <div
          key={isSiege ? `siege-${siegeEvent.current ?? 'none'}-${siegeEvent.deck.length}` : type === 'enemy' ? item.enemy.uuid : type === 'rune' ? item.uuid : isFollower ? item.uid : isCompanion ? item.uid : `${type}-${item.id}`}
          className="absolute left-1/2 w-[108px] max-w-full transition-transform duration-300"
          style={{
            ...(isTop
              ? { bottom: `calc(50% + ${distance}px)` }
              : { top: `calc(50% + ${distance}px)` }),
            transform: `translateX(-50%) scale(${densityFactor})`,
            transformOrigin: 'center center',
            zIndex: isCurrentTurn ? 40 : zIndex,
          }}
        >
          <div className="relative items-center" data-current-turn={isCurrentTurn || undefined}>
            {isCurrentTurn && !isSiege && (
              <div className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 transform rounded-full border-2 border-white bg-purple-600">
                <GiWingedSword className="animate-bounce text-white" size={40} />
              </div>
            )}
            {isSiege ? (
              <button
                type="button"
                onClick={() => openSiegeDeck?.()}
                aria-label={ti.siegeTitle || 'Asedio de Limiternia'}
                className={`siege-draw relative w-full overflow-hidden rounded-lg border-2 bg-slate-950 text-left shadow-lg ${
                  isCurrentTurn ? 'border-amber-300 ring-2 ring-amber-300/70' : 'border-amber-600/80'
                }`}
              >
                <img src={siegeDeckBack} alt="" className="h-[150px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/10 to-slate-950/20" />
                <div className="absolute inset-x-0 top-0 p-1 text-center">
                  <p className="w-full break-words px-0.5 text-center text-[0.55rem] font-black uppercase leading-[1.05] text-amber-100">
                    {ti.siegeTitle || 'Asedio de Limiternia'}
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="rounded-full bg-slate-950/70 px-2 py-0.5 text-[0.65rem] font-bold text-amber-200">
                    {10 - siegeEvent.deck.length}/10
                  </p>
                </div>
              </button>
            ) : isFollower ? (
              <FollowerCard
                entry={item}
                onOpen={() => openFollower?.(item.uid)}
              />
            ) : isCompanion ? (
              <CompanionTrackCard
                entry={item}
                onOpen={() => onOpenCompanion?.(item.uid)}
                estadosLabels={tea}
              />
            ) : type === 'enemy' && (item.enemy.tipo === 'especial' || item.enemy.tipo === 'fallenHero') ? (
              <CommanderCard carta={item.enemy} highlight={item.enemy.highlight} />
            ) : type === 'enemy' ? (
              <EnemyCard
                uuid={item.enemy.uuid}
                id={item.enemy.id}
                name={getEnemyName(item.enemy.id, item.enemy.color)}
                image={item.enemy.imagen}
                comportamiento={item.enemy.comportamiento}
                categoria={item.enemy.categoria}
                position={isTop ? 'top' : 'bottom'}
                color={item.enemy.color}
                onRemove={onRemove}
                vida={item.enemy.vida}
                vidaMax={item.enemy.vidaMax}
                movimiento={item.enemy.movimiento}
                ataque={item.enemy.ataque}
                openEnemyModal={openEnemyModal}
                inmunidad={item.enemy.inmunidad}
                tipo_ataque={item.enemy.tipo_ataque}
                capacidades={item.enemy.capacidades}
                ringColor={item.enemy.ringColor}
                isFlipping={isEntityFlipping}
                estadosAlterados={item.enemy.estadosAlterados}
                specialBehavior={item.enemy.specialBehavior}
                cara={item.enemy.cara}
              />
            ) : type === 'rune' ? (
              <RuneCard rune={item} onRemove={removeRuneByUUID} flipped={flippedCards.includes(item.uuid)} />
            ) : (
              <CharacterCard
                name={getHeroName(item.id)}
                image={item.image}
                prof={getHeroProf(item.id)}
                heroId={item.id}
                clickable={heroManagementEnabled}
                extras={heroManagementEnabled ? getHeroExtras(item.id) : null}
                estadosLabels={tea}
                onOpen={() => setSelectedHeroId(item.id)}
              />
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div
      className={`track-slot relative w-full min-w-0 ${index === currentSlotIndex ? 'track-slot--active' : ''}`}
      style={{ height: `${slotHeight}px` }}
    >
      {/* Pilas: se anclan al 50% del propio slot y crecen hacia fuera */}
      {renderStack(stackAbove, 'top', 'hero')}
      {isRune && renderStack(enemiesAbove, 'top', 'enemy')}
      {isRuneTextSlot && renderStack(runesAbove.map((r) => r.rune), 'top', 'rune')}

      {/* Centro del slot: siempre en la misma línea */}
      <div className="track-slot__label absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center bg-slate-700 py-1">
        <div className={classNames(
          'flex min-w-0 items-center justify-center font-fantasy',
          {
            'h-10 w-10 shrink-0 rotate-45 border-[3px] gem-orange': index === 1,
            'h-10 w-10 shrink-0 rotate-45 border-[3px] gem-green': index === 3,
            'h-10 w-10 shrink-0 rotate-45 border-[3px] gem-blue': index === 5,
            'h-10 w-10 shrink-0 rotate-45 border-[3px] gem-red': index === 7,
            'h-10 w-10 shrink-0 rotate-45 border-[3px] gem-gray': index === 9,
            'h-8 w-full min-w-0 bg-slate-800 text-center text-slate-100 shadow': index % 2 === 0,
          },
        )}
        >
          <span className="block w-full truncate px-0.5 text-center text-[0.55rem] font-semibold uppercase leading-tight tracking-wide text-slate-200 sm:text-[0.65rem] md:text-xs">
            {index === 0 && tr.defensor
              || index === 2 && tr.apoyo
              || index === 4 && tr.lider
              || index === 6 && tr.agresor
              || index === 8 && tr.controlador
              || index === 10 && ti.rune}
          </span>

          {/* Icono y contador si es runa */}
          {isRune && (
            <div className="absolute z-20 flex items-center gap-0 rotate-[-45deg]">
              {(() => {
                const runeData = COLOR_RUNAS.find((r) => r.id === runeColor);
                return runeData ? (
                  <img
                    src={runeData.imagenSin}
                    alt={runeColor}
                    className="h-12 w-12 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <GiAbstract065 className="text-sm text-white" />
                );
              })()}

              <div className={classNames(
                'inline-flex items-center whitespace-nowrap border-2 border-l-0 px-1 py-0.5 text-xs font-bold text-white',
                {
                  'gem-orange2': index === 1,
                  'gem-green2': index === 3,
                  'gem-blue2': index === 5,
                  'gem-red2': index === 7,
                  'gem-gray2': index === 9,
                },
              )}
              >
                x {runes[runeColor] || 0}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pila inferior: se ancla al 50% del slot y crece hacia abajo */}
      {renderStack(stackBelow, 'bottom', 'hero')}
      {isRune && renderStack(enemiesBelow, 'bottom', 'enemy')}
      {isRuneTextSlot && renderStack(runesBelowItems, 'bottom', 'rune')}
    </div>
  );
}
