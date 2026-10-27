import classNames from 'classnames';
import { GiWingedSword, GiAbstract065 } from 'react-icons/gi';
import CommanderCard from '@/components/CommanderCard';
import EnemyCard from '@/components/track/EnemyCard';
import CharacterCard from '@/components/track/CharacterCard';
import { cardDistance, compactSlotHeight } from '@/components/track/trackLayout';

/**
 * Una posición del track de iniciativa.
 *
 * Dibuja la etiqueta central (rol o runa), la pila superior y la inferior.
 * Toda la información y las acciones llegan en `deps` para no acoplar el
 * componente al estado global del tracker.
 */
export default function TrackSlot({ index, compact = false, density = 'normal', deps }) {
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
    RuneCard,
  } = deps;

  const isRune = Object.values(runesColorMap).includes(index);
  const isRuneTextSlot = index === 10;
  const runeColor = getRuneColorFromIndex(index);

  const heroesAbove = placedHeroes.filter((h) => h.position === index && rolesOnTop.includes(h.role));
  const heroesBelow = placedHeroes.filter((h) => h.position === index && rolesOnBottom.includes(h.role));
  const enemiesAbove = placedEnemies.filter((e) => e.enemy.position === index && e.enemy.runePosition === 'arriba');
  const enemiesBelow = placedEnemies.filter((e) => e.enemy.position === index && e.enemy.runePosition === 'abajo');
  const runesAbove = placedRunes.filter((r) => r.rune.colorIndex === index && r.rune.posicion === 'arriba');
  const runesBelow = placedRunes.filter((r) => r.rune.colorIndex === index && r.rune.posicion === 'abajo');

  const totalAbove = heroesAbove.length + (isRune ? enemiesAbove.length : 0) + (isRuneTextSlot ? runesAbove.length : 0);
  const totalBelow = heroesBelow.length + (isRune ? enemiesBelow.length : 0) + (isRuneTextSlot ? runesBelow.length : 0);
  // Densidad compacta: cartas algo más pequeñas y pilas más juntas.
  const densityFactor = density === 'compact' ? 0.85 : 1;
  // En la vista de lista el slot se dibuja solo: usa su altura real y no la del tablero.
  const slotHeight = (compact ? compactSlotHeight(totalAbove, totalBelow) : boardSlotHeight) * (compact ? 1 : densityFactor);

  const renderStack = (items, side, type = 'hero') => {
    const isTop = side === 'top';
    const count = items.length;
    if (count === 0) return null;
    const ordered = isTop ? [...items].reverse() : items;

    return ordered.map((item, i) => {
      const distance = cardDistance(count, i) * densityFactor;
      const zIndex = count - i;

      const isCurrentTurn = currentTurnEntity && (
        (type === 'enemy' && item.enemy.uuid === currentTurnEntity.uuid) ||
        (type === 'rune' && item.uuid === currentTurnEntity.uuid) ||
        (type === 'hero' && item.id === currentTurnEntity.id)
      );
      const isEntityFlipping = type === 'enemy' && flippedCards.includes(item.enemy.uuid);

      return (
        <div
          key={type === 'enemy' ? item.enemy.uuid : type === 'rune' ? item.uuid : `${type}-${item.id}`}
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
            {isCurrentTurn && (
              <div className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 transform rounded-full border-2 border-white bg-purple-600">
                <GiWingedSword className="animate-bounce text-white" size={40} />
              </div>
            )}
            {type === 'enemy' && (item.enemy.tipo === 'especial' || item.enemy.tipo === 'fallenHero') ? (
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
      {renderStack(heroesAbove, 'top', 'hero')}
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
      {renderStack(heroesBelow, 'bottom', 'hero')}
      {isRune && renderStack(enemiesBelow, 'bottom', 'enemy')}
      {isRuneTextSlot && renderStack(runesBelow.map((r) => r.rune), 'bottom', 'rune')}
    </div>
  );
}
