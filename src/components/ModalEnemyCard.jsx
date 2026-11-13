import React, { useState, useEffect, useId, useRef } from 'react';
import { FiInfo } from "react-icons/fi";
import { useLanguage } from '@/context/LanguageContext';
import useFocusTrap from '@/hooks/useFocusTrap';
import useGlossary from '@/hooks/useGlossary';
import { useRules } from '@/context/RulesContext';
import { getEstadoLogo2 } from '@/data/estados2';
import { ESTADOS_ALTERADOS, getEnemyStatusCatalog } from '@/data/estadosAlterados';
import { appConfirm } from '@/utils/appDialogs';
import { adjustCapabilitiesByRunes } from '@/components/adjustCapabilitiesByRunes';
import { resolveCapabilityLabel } from '@/utils/enemyCapability';
import { getAbilityColor } from '@/components/track/enemyVisuals';
import { useGame } from '@/context/GameContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import EnemyRingControl from '@/components/EnemyRingControl';
import EnemyPortraitBackdrop from '@/components/track/EnemyPortraitBackdrop';
import ResponsiveImage from '@/components/track/ResponsiveImage';
import { applyBossRuneEffect } from '@/utils/bossRunes';
import { resolveSoulHarvesterTimeZero, formatEstadoAlterado } from '@/utils/soulHarvester';
import { appendGameLog } from '@/utils/gameLog';
import BossRunesColumn from '@/components/track/BossRunesColumn';
import boarBackground from '@/assets/interactions/runic.avif';
import { GiHealthPotion, GiRunningNinja, GiSwordClash, GiShieldReflect, GiSteeltoeBoots, GiBloodySword, GiArcheryTarget, GiMoebiusTrefoil } from "react-icons/gi";
import { MdLooksOne,  MdLooksTwo,  MdLooks3,  MdLooks4,  MdLooks5,  MdLooks6,} from 'react-icons/md';


export const ModalEnemyCard = ({ uuid, enemy, onClose, onDelete, onVidaChange, overhealedEnemies, setOverhealedEnemies, onEstadoChange, getEffectiveStats, onFlip }) => {
  const [vidaLocal, setVidaLocal] = useState(enemy?.vida || 0);
  const [vidaMaxLocal, setVidaMaxLocal] = useState(enemy?.vidaMax || 0);
  const [estadosLocal, setEstadosLocal] = useState(enemy?.estadosAlterados || []);
  const [boarFlipping, setBoarFlipping] = useState(false);
  const { translations } = useLanguage();
  const [avisos, setAvisos] = useState([]);

  const ti = translations.trackerInit || {};
  const tc = translations.enemies?.categoria || {};
  const tb = translations.trackerSelect?.comportamientos || {};
  const { labels: tt, descriptions: tte } = useGlossary();
  const { rulesVersion } = useRules();
  const tea = translations.estadosAlterados || {};
  const tca = translations.cartas_ataque || {};
  const ttr = translations.defensaCard.cartas_trad || {};
  const { getRuneCount } = useGame();
  const { setPlacedEnemies } = useInitEnemies();
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const titleId = useId();

  useFocusTrap(dialogRef, true);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (enemy) {
      setVidaLocal(enemy.vida);
      setVidaMaxLocal(enemy.vidaMax);
      setEstadosLocal(enemy.estadosAlterados || []);
    }
  }, [enemy]);

    if (!enemy) {
    //console.log(enemy);
    //return (
    return;
      //<div className="modal">
        //<p>{ti.enemyNotFound}</p>
        //<button onClick={onClose}>{ti.close}</button>
      //</div>
    //);
  }

  const { id, name, rune, imagen, vidaMax, movimiento, ataque, color, comportamiento, categoria, inmunidad, tipo_ataque, capacidadesOriginales } = enemy;
  const isSoulHarvester = enemy.id === 'soul_harvester_boss';
  const activeBossRune = enemy.bossRune || 'gris';
  const isBoar = enemy.specialBehavior === 'flickering_boar' || id === 'flickering_boar';
  const boarCardSide = isBoar && enemy.cara === 'B';

  const flipBoar = () => {
    setBoarFlipping(true);
    onFlip?.(uuid);
    window.setTimeout(() => {
      setBoarFlipping(false);
      onClose?.();
    }, 650);
  };

  if (boarCardSide) {
    return (
      <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ti.boarCardTitle || 'Jabalí Parpadeante'}
          className={`modal-enter relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-y-auto rounded-2xl border-4 border-amber-500 bg-slate-950 p-5 text-amber-50 shadow-2xl ${boarFlipping ? 'card-flip' : ''}`}
        >
          <img src={boarBackground} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" aria-hidden="true" />
          <div className="relative">
            <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-300">Cara B</p>
            <h2 className="mt-1 text-center text-2xl font-black text-amber-100">{ti.boarCardTitle || 'JABALÍ PARPADEANTE'}</h2>
            <div className="my-4 rounded-xl border border-amber-500/50 bg-black/30 p-3 text-sm leading-relaxed">
              {(ti.boarCardText || 'Primero, Manifiesta 1 Runa.\nLuego, Coloca de nuevo al Jabalí Parpadeante adyacente a una Pila de Runas en el Tablero.')
                .split('\n').map((line) => <p key={line} className="mb-2 last:mb-0">{line}</p>)}
            </div>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={flipBoar}
                className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white hover:bg-purple-600"
              >
                🔄 {ti.boarCardOpen || 'Voltear al monstruo'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-10 rounded-lg bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600"
              >
                {ti.close || 'Cerrar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const numeroIconos = [    <MdLooksOne key="1" />,    <MdLooksTwo key="2" />,    <MdLooks3 key="3" />,    <MdLooks4 key="4" />,    <MdLooks5 key="5" />,    <MdLooks6 key="6" />,  ];
  const capacidadesAjustadas = adjustCapabilitiesByRunes(capacidadesOriginales, rune, getRuneCount);
  const effectiveStats = getEffectiveStats(uuid);
  const todasInmunidades = Array.from(new Set([...(inmunidad || []), ...(effectiveStats.inmunidades || [])]));

  // Función para mostrar aviso
  const mostrarAviso = (mensaje) => {
    setAvisos((prev) => [...prev, mensaje]);
    setTimeout(() => {
      setAvisos((prev) => prev.slice(1)); // Elimina el primer aviso después de 2s
    }, 2000);
  };

  const traducirCapacidad = (capacidadOriginal, runeColor, getRuneCount) => {
    const numRunasColor = getRuneCount(runeColor);
    let capacidad = tca.capacidad?.[capacidadOriginal];
  
    if (capacidad) {
      capacidad = capacidad
        .replaceAll('{X}', numRunasColor)
        .replaceAll('{2*X}', numRunasColor * 2)
        .replaceAll('{3*X}', numRunasColor * 3)
        .replaceAll('{4*X}', numRunasColor * 4)
        .replaceAll('{X+1}', numRunasColor + 1)
        .replaceAll('{X+2}', numRunasColor + 2);
  
      // Eliminamos las llaves y traducimos
      return capacidad.replace(/\{([^}]+)\}/g, (_, key) => ttr[key] || key);
    }
  
    return '';
  };
  
  const interpretarValorRuna = (valor, runeColor, getRuneCount, categoria, tipeCap) => {
    const count = getRuneCount(runeColor);
    
    if (valor === "X") {
      return count;
    }

    if (typeof valor === "string" && valor.startsWith("X+")) {
      const extra = parseInt(valor.slice(2), 10); // ej: "X+3" → 3
      if (categoria === "esbirro"){
        if (tipeCap === "M"){
          if (count <= 1) return 3;  // 0 o 1 runa → 3
          if (count >= 2) return 4; // 2 runas → 4
        } else if (tipeCap === "A") {
          return Math.min(count, 3);
        }

      } else {
        return extra + count;
      } 
    }
  
    return valor; // Si es un número directo o no aplicable
  };

  const valorMovimiento = interpretarValorRuna(effectiveStats.movimiento ?? movimiento, rune, getRuneCount, categoria, "M");
  const valorAtaque = interpretarValorRuna(effectiveStats.ataqueModificado ?? ataque, rune, getRuneCount, categoria, "A");
  

  const borderColorMap = {
    blanco: 'border-blanco',
    gris: 'border-gris',
    negro: 'border-negro',
    comandante: 'border-dorado',
    hero: 'border-dorado',
    jefe: '',
    overlord: 'border-morado',
    esbirro: 'border-cyan',
    escenario: 'border-blue',
  };

  // Colores de facción desde tokens (D9).
  const bgColorMap = {
    esbirro: 'faction-bg-cyan',
    blanco: 'faction-bg-blanco',
    gris: 'faction-bg-gris',
    negro: 'faction-bg-negro',
    comandante: 'faction-bg-dorado',
    hero: 'faction-bg-naranja',
    jefe: 'faction-bg-morado',
    overlord: 'faction-bg-morado-oscuro',
    escenario: 'faction-bg-cyan',
  };

  const categoryTextGlowMap = {
    bisoño: 'glow-bisono',
    soldado: 'glow-soldado',
    veterano: 'glow-veterano',
    campeon: 'glow-campeon',
    comandante: 'glow-commander',
    esbirro: 'glow-escenario',
    escenario: 'glow-escenario',
    overlord: 'glow-commander',
    jefe: 'glow-commander',
  };

  const handleVidaChange = async (delta) => {
    if (delta < 0 && enemy.kingInvulnerable) {
      mostrarAviso(ti.kingNoDamage || 'El Rey Avivado no puede recibir daño ahora mismo.');
      return;
    }
    let vidaTentativa = vidaLocal + delta;
  
    if (delta < 0) {
      // 🔍 Buscar ESCUDO
      const estadoEscudo = enemy.estadosAlterados.find(e => e.id === "ESCUDO");
      let escudosConsumidos = 0;
  
      if (estadoEscudo && estadoEscudo.count > 0) {
        let damageToApply = Math.abs(delta); // daño positivo
        let remainingShields = estadoEscudo.count;
  
        // Reducir daño con escudos
        while (damageToApply > 0 && remainingShields > 0) {
          remainingShields--;
          damageToApply--;
          escudosConsumidos++;
        }
  
        // Generamos nuevo array de estados
        const nuevosEstados = enemy.estadosAlterados.map(e =>
          e.id === "ESCUDO" ? { ...e, count: remainingShields } : e
        );
  
        // ✅ Aviso visual
        if (escudosConsumidos > 0) {
          mostrarAviso(`${ti.consume} ${escudosConsumidos} ${ti.escudos}`);
        }
  
        // ✅ Aplicar nuevos estados usando la prop
        if (onEstadoChange) {
          onEstadoChange(enemy.uuid, nuevosEstados);
        }
  
        // ✅ Si todavía queda daño, lo aplicamos a la vida
        vidaTentativa = vidaLocal - damageToApply;
      }
    }
  
    if (vidaTentativa < 0) vidaTentativa = 0;
  
    // ✅ Vida mayor que máximo (overheal)
    if (vidaTentativa > enemy.vidaMax && !overhealedEnemies.has(uuid)) {
      const confirm = await appConfirm(
        `${vidaTentativa} ${ti?.vidaExcedida || 'supera la vida máxima. ¿Quieres aplicar el exceso?'}`,
        { title: ti?.vidaExcedidaTitulo || 'Vida excedida' },
      );
      if (!confirm) return;
  
      setOverhealedEnemies(prev => new Set(prev).add(uuid));
  
      if (onVidaChange) {
        onVidaChange(enemy.uuid, vidaTentativa, vidaTentativa);
      }
    } else {
      setVidaLocal(vidaTentativa);
      if (onVidaChange) {
        onVidaChange(enemy.uuid, vidaTentativa);
      }
    }
  };

  const tipoAtaqueIconMap = {
    "cuerpo": <GiBloodySword className="text-white text-2xl cursor-help" title={ti.tipo_ataque.cuerpo || ''} />,
    "distancia": <GiArcheryTarget className="text-white text-2xl cursor-help" title={ti.tipo_ataque.distancia || ''} />,
    "magia": <GiMoebiusTrefoil className="text-white text-2xl cursor-help" title={ti.tipo_ataque.magia || ''} />
  };

  const tipoAtaqueCircleClass = {
    "distancia": "bg-red-600",
    "cuerpo": "bg-orange-500",
    "magia": "bg-blue-600"
  };

  const traducirClaveConNumero = (clave, base, detalles) => (
    resolveCapabilityLabel(clave, base, detalles)
  );

  const mostrarAccionesCapacidad = (capacidadesAjustadas, tt, tte, ti) => {
    if (!Array.isArray(capacidadesAjustadas) || capacidadesAjustadas.length === 0) return null;
  
    // Agrupar acciones por ";"
    const acciones = [];
    let actual = [];
  
    capacidadesAjustadas.forEach(clave => {
      if (clave === ';') {
        if (actual.length > 0) {
          acciones.push(actual);
          actual = [];
        }
      } else if (![':', ',', 'Y'].includes(clave)) {
        actual.push(clave);
      }
    });
  
    if (actual.length > 0) {
      acciones.push(actual);
    }
    
    return (
      <div className="flex items-start gap-2 mt-1">
        <GiRunningNinja className="text-green-700 mt-1 text-2xl cursor-help" title={ti.capacidades || ''} />
        <div className="flex flex-col gap-1">
          {acciones.map((accion, index) => (
            <div key={`accion-${index}`} className="flex items-start gap-2">
              <span className="text-xl text-gray-600">{numeroIconos[index] || `${index + 1}.`}</span>
              <div className="flex flex-wrap gap-2">
                {accion.map((clave, idx) => {
                  const { claveGeneral, texto, detalle } = traducirClaveConNumero(clave, tt, tte);
                  const classColor = getAbilityColor(claveGeneral);
  
                  return (
                    <span key={clave + idx} className={`inline-flex items-center gap-1 mr-2 ${classColor}`}>
                      {texto}
                      {detalle && (
                        <FiInfo
                          title={detalle}
                          className="text-gray-500 hover:text-gray-800 cursor-help"
                        />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const getEnemyName = () => {
    if (color === 'escenario') {
      return translations.enemies?.escenario?.[id];
    }
    return translations.enemies?.[id];
  };

  const handleEstadoChangeLocal = async (estadoId, delta) => {
    if (delta > 0 && (enemy.kingInvulnerable || enemy.kingStateImmune)) {
      mostrarAviso(ti.kingNoStates || 'El Rey Avivado es inmune a estados alterados ahora mismo.');
      return;
    }
    // Si el estado ya no está activo (se consumió en el turno) el botón + debe
    // poder volver a añadirlo; antes solo se recorrían los estados existentes.
    if (!estadosLocal.some((estado) => estado.id === estadoId)) {
      if (delta <= 0) return;
      const estadoConfig = ESTADOS_ALTERADOS.find((item) => item.id === estadoId);
      if (!estadoConfig) return;
      const updated = [...estadosLocal, { id: estadoId, count: 1, texto: estadoConfig.texto }];
      setEstadosLocal(updated);
      onEstadoChange?.(enemy.uuid, updated);
      return;
    }

    const target = estadosLocal.find((estado) => estado.id === estadoId);
    const estadoConfig = ESTADOS_ALTERADOS.find((item) => item.id === estadoId);
    const currentMax = target?.max || estadoConfig?.max || 1;
    const newCount = (target?.count || 0) + delta;
    if (delta > 0 && newCount > currentMax) {
      const confirm = await appConfirm(
        `${tea[target?.texto] || estadoConfig?.texto || estadoId} ${ti?.estadoExcedido_1 || 'supera el máximo'} (${currentMax}). ${ti?.estadoExcedido_2 || '¿Quieres aumentarlo?'}`,
        { title: ti?.estadoExcedidoTitulo || 'Límite de estado superado' },
      );
      if (!confirm) return;
    }

    const updatedStates = estadosLocal.map((estado) => {
      if (estado.id !== estadoId) return estado;
      return {
        ...estado,
        count: Math.max(0, (estado.count || 0) + delta),
        ...(delta > 0 && newCount > currentMax ? { max: newCount } : {}),
      };
    });

    const timeZero = enemy.id === 'soul_harvester_boss'
      && estadoId === 'TIEMPO'
      && (target?.count || 0) > 0
      && newCount === 0
      ? resolveSoulHarvesterTimeZero({ ...enemy, estadosAlterados: updatedStates })
      : null;
    const finalStates = timeZero?.enemy.estadosAlterados || updatedStates;

    setEstadosLocal(finalStates);

    if (onEstadoChange) {
      onEstadoChange(enemy.uuid, finalStates);
    }

    if (timeZero?.triggered) {
      setPlacedEnemies((prev) => prev.map((entry) => (
        entry.enemy.uuid === enemy.uuid ? { ...entry, enemy: timeZero.enemy } : entry
      )));
      const statesText = timeZero.states.length > 0
        ? timeZero.states.map((estado) => `${formatEstadoAlterado(estado.id, tea)} ×${estado.count}`).join(', ')
        : 'sin estados alterados';
      appendGameLog(
        'event',
        `⏳ Cosechador de Almas: Ficha de Tiempo a 0. Estados: ${statesText}. Pierde ${timeZero.damage} de vida (${timeZero.vidaAntes} → ${timeZero.vidaDespues}). Se selecciona la runa gris.`,
      );
    }
  };


    
  return (
    <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        role="dialog"
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby={titleId}
        className={`${bgColorMap[color] || ''} modal-enter relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border-4 shadow-2xl ${borderColorMap[color] || ''} ${boarFlipping ? 'card-flip' : ''}`}
      >
        
        {/* Franja superior con el color de facción */}
        <div className={`h-1.5 w-full shrink-0 ${bgColorMap[color] || 'bg-slate-600'}`} aria-hidden="true" />

        <div className="flex min-h-0 flex-1 flex-col gap-1 items-center overflow-y-auto px-4 pb-6 pt-2">

          {/* Cabecera: nombre, categoría y comportamiento */}
          <header className="sticky top-0 z-10 mb-1 w-full rounded-lg bg-slate-950/80 px-2 py-1.5 backdrop-blur-sm">
            <h2 id={titleId} className={`text-center text-2xl font-bold text-white ${categoryTextGlowMap[categoria] || ''}`}>
              {getEnemyName()}
            </h2>

            <div className="mt-1 flex flex-wrap items-center justify-center gap-1 text-xs">
              {categoria && categoria !== 'jefe' && (
                <span className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide text-slate-900 ${bgColorMap[color] || 'bg-slate-500'}`}>
                  {tc[categoria] || categoria}
                </span>
              )}
              {comportamiento && categoria !== 'jefe' && (
                <span className="rounded-full border border-white/30 px-2 py-0.5 italic text-white/90">
                  {tb[comportamiento] || comportamiento}
                </span>
              )}
            </div>
          </header>

          {/* Imagen y stats */}
          <div className={categoria === 'jefe'
            ? 'mt-2 grid grid-cols-[1.1fr_0.9fr] items-start gap-2'
            : 'mt-2'}>
            <div className={`flex w-full gap-1 ${categoria === 'jefe' ? 'contents' : 'items-center'}`}>
              <EnemyPortraitBackdrop
                color={color}
                categoria={categoria}
                className={`relative shrink-0 rounded-lg border-2 ${
                  categoria === 'jefe' ? 'w-full' : 'w-40 sm:w-48'
                } ${borderColorMap[color] || 'border-slate-600'}`}
              >
                <div className={categoria === 'jefe' ? 'h-56 sm:h-64' : 'aspect-[567/827]'}>
                <ResponsiveImage 
                  src={imagen}
                  alt={name}
                  sizes="220px"
                  className={`absolute inset-0 h-full w-full ${
                    categoria === 'jefe'
                      ? 'scale-110 object-cover object-top'
                      : 'object-contain object-bottom p-1'
                  }`} loading="lazy" decoding="async" />
              </div>
              {/* Estados alterados sobre la imagen */}
              <div className="absolute top-1 left-1 grid grid-rows-4 grid-flow-col gap-1">
                {estadosLocal
                  .filter(estado => estado.count > 0)
                  .map((estado) => {
                    const estadoConfig = ESTADOS_ALTERADOS.find(e => e.id === estado.id);
                    if (!estadoConfig) return null;
                    const logo = rulesVersion === '2.0' ? getEstadoLogo2(estado.id) : null;
                    return (
                      <div key={estado.id} className="relative">
                        <img 
                          src={logo || estadoConfig.imagen}
                          alt={estadoConfig.texto}
                          className="w-6 h-6 border border-white rounded-full shadow-md" loading="lazy" decoding="async" />
                        {(estado.count > 1 || (categoria === 'jefe' && estado.id === 'ATURDIMIENTO_I')) && (
                          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                            {estado.count}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

            </EnemyPortraitBackdrop>
              
            <div className={`flex-1 grid grid-cols-1 gap-1 text-gray-800 font-semibold text-sm bg-gray-200 rounded-lg`}>
              {/* Vida + Movimiento + Ataque en la misma línea */}
              {categoria !== "jefe" && (
                <div className="flex items-center text-center gap-4">
                  <div className="flex items-center gap-2" >
                    <GiHealthPotion className="text-red-600 text-2xl cursor-help" title={ti.health || ''}/>
                    {vidaMaxLocal}
                  </div>
                  
                    <span className="flex items-center gap-1">
                      <GiSteeltoeBoots className="text-blue-600 text-2xl cursor-help"
                        title={typeof movimiento === "string" && movimiento.includes("X") ? `${ti.runeBasedValue}: ${valorMovimiento}` : ti.movement}
                         />
                      {valorMovimiento}
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-7 h-7 flex items-center justify-center rounded-full border-2 border-white ${
                          tipoAtaqueCircleClass[tipo_ataque] || "bg-gray-500"
                        }`}
                        title={typeof ataque === "string" && ataque.includes("X") ? `${ti.runeBasedValue}: ${valorAtaque}` : ti.tipo_ataque?.label}
                      >
                        {tipoAtaqueIconMap[tipo_ataque] || <GiSwordClash className="text-white text-lg" />}
                      </span>
                      {valorAtaque}
                      {effectiveStats.ataqueModificado !== valorAtaque && effectiveStats.categoria !== "esbirro" && (
                        <span>
                          /
                          <span className="text-blue-500 font-bold cursor-help" title={traducirCapacidad(effectiveStats.idCartaEspecial, rune, getRuneCount)}>
                            {effectiveStats.ataqueModificado}
                          </span>
                        </span>
                      )}
                    </span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <GiShieldReflect className="text-purple-700 mt-1 text-2xl cursor-help" title={ti.inmunidad || ''} />
                <div className="grid max-h-20 flex-1 grid-cols-2 gap-1 overflow-y-auto pr-1 text-[0.62rem] leading-tight sm:grid-cols-3">
                  {Array.isArray(todasInmunidades) && todasInmunidades.length > 0
                    ? todasInmunidades.map((clave) => (
                        <span key={clave} className="inline-flex min-w-0 items-center gap-1 rounded bg-slate-800/60 px-1 py-0.5">
                          <span className="truncate">{tt[clave] || clave}</span>
                          <FiInfo
                            title={tte[clave] || ''}
                            className="shrink-0 text-gray-500 hover:text-gray-800 cursor-help"
                          />
                        </span>
                      ))
                    : tt.none}
                </div>
              </div>
              {/* Capacidades */}
              {mostrarAccionesCapacidad(capacidadesAjustadas, tt, tte, ti)}

              {categoria === 'jefe' && (
                <div className="mt-2 min-w-0 rounded-xl border border-slate-700 bg-slate-900/60 p-2">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-300">{ti.estados || 'Estados alterados'}</p>
                  <div className="flex flex-wrap items-stretch justify-center gap-1">
                    {getEnemyStatusCatalog(rulesVersion)
                      .filter((config) => config.mostrar === 'si' || config.id === 'TIEMPO')
                      .filter((config) => !todasInmunidades?.includes(config.id) && !(todasInmunidades?.includes('GRANDE') && ['DERRIBO_I', 'ATURDIMIENTO_I'].includes(config.id)))
                      .map((estadoConfig) => {
                        const activo = estadosLocal.find((item) => item.id === estadoConfig.id);
                        const estado = activo || { id: estadoConfig.id, count: 0 };
                        const maxCount = estado.max || estadoConfig.max || 1;
                        const nombre = tea[estadoConfig.texto] || estadoConfig.texto;
                        return (
                          <div key={estado.id} className="state-chip flex min-w-[2.1rem] max-w-[3.5rem] flex-1 basis-0 flex-col items-center rounded-lg border py-0.5">
                            <button
                              type="button"
                              onClick={() => handleEstadoChangeLocal(estado.id, +1)}
                              disabled={maxCount === 1 && (estado.count || 0) >= maxCount}
                              aria-label={`${nombre}: +1`}
                              className="state-btn-add flex h-5 w-8 items-center justify-center rounded text-xs font-bold leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
                            >
                              +
                            </button>
                            <div className="relative flex flex-col items-center py-0.5" title={`${nombre} ×${estado.count || 0}${tte[estadoConfig.id] ? `\n${tte[estadoConfig.id]}` : ''}`}>
                              <img src={estadoConfig.imagen} alt={nombre} className="h-6 w-6 flex-shrink" loading="lazy" decoding="async" />
                              <span className="text-[0.6rem] font-bold leading-none text-white">{estado.count || 0}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEstadoChangeLocal(estado.id, -1)}
                              disabled={(estado.count || 0) <= 0}
                              aria-label={`${nombre}: −1`}
                              className="state-btn-remove flex h-5 w-8 items-center justify-center rounded text-xs font-bold leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
                            >
                              −
                            </button>
                          </div>
                        );
                      })}
                  </div>
                  {isSoulHarvester && (
                    <BossRunesColumn
                      selected={activeBossRune}
                      labels={ti}
                      texts={enemy.bossRuneTexts || {}}
                      className="mt-2"
                      onSelect={(runeId) => {
                        setPlacedEnemies((prev) => prev.map((entry) => (
                          entry.enemy.uuid === enemy.uuid
                            ? { ...entry, enemy: applyBossRuneEffect(entry.enemy, runeId) }
                            : entry
                        )));
                        setEstadosLocal((prev) => {
                          if (runeId !== 'azul') return prev;
                          const index = prev.findIndex((estado) => estado.id === 'ATURDIMIENTO_I');
                          if (index === -1) return [...prev, { id: 'ATURDIMIENTO_I', count: 1 }];
                          return prev.map((estado, i) => (i === index ? { ...estado, count: 1 } : estado));
                        });
                      }}
                    />
                  )}
                </div>
              )}
              
            </div>
          </div>

          <div className={categoria === 'jefe'
            ? 'hidden'
            : 'mt-2 flex flex-col gap-2 sm:flex-row sm:items-start'}>
            {/* Submenú Estados Alterados: paleta fija, siempre visible */}
            <div className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900/60 p-2">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-300">{ti.estados || 'Estados alterados'}</p>
            <div className="flex flex-wrap items-stretch justify-center gap-1">
            {getEnemyStatusCatalog(rulesVersion)
              .filter((config) => config.mostrar === 'si' || (categoria === 'jefe' && config.id === 'TIEMPO'))
              .filter((config) => !todasInmunidades?.includes(config.id) && !(todasInmunidades?.includes('GRANDE') && ['DERRIBO_I', 'ATURDIMIENTO_I'].includes(config.id)))
              .map((estadoConfig) => {
                const activo = estadosLocal.find((item) => item.id === estadoConfig.id);
                const estado = activo || { id: estadoConfig.id, count: 0 };
                const maxCount = estado.max || estadoConfig.max || 1;
                const nombre = tea[estadoConfig.texto] || estadoConfig.texto;
            
                return (
                  <div
                    key={estado.id}
                    className="state-chip flex min-w-[2.1rem] max-w-[3.5rem] flex-1 basis-0 flex-col items-center rounded-lg border py-0.5"
                  >
                    <button
                      type="button"
                      onClick={() => handleEstadoChangeLocal(estado.id, +1)}
                      disabled={maxCount === 1 && (estado.count || 0) >= maxCount}
                      aria-label={`${nombre}: +1`}
                      className="state-btn-add flex h-5 w-8 items-center justify-center rounded text-xs font-bold leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
                    >
                      +
                    </button>

                    <div className="relative flex flex-col items-center py-0.5" title={`${nombre} ×${estado.count || 0}${tte[estadoConfig.id] ? `\n${tte[estadoConfig.id]}` : ''}`}>
                      <img src={estadoConfig.imagen} alt={nombre} className="h-6 w-6 flex-shrink" loading="lazy" decoding="async" />
                      <span className="text-[0.6rem] font-bold leading-none text-white">{estado.count || 0}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEstadoChangeLocal(estado.id, -1)}
                      disabled={(estado.count || 0) <= 0}
                      aria-label={`${nombre}: −1`}
                      className="state-btn-remove flex h-5 w-8 items-center justify-center rounded text-xs font-bold leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
                    >
                      −
                    </button>
                  </div>
                );
              })
            }
            </div>
          </div>

          {isSoulHarvester && (
            <BossRunesColumn
              selected={activeBossRune}
              labels={ti}
              texts={enemy.bossRuneTexts || {}}
              className="sm:ml-2"
              onSelect={(runeId) => {
                setPlacedEnemies((prev) => prev.map((entry) => (
                  entry.enemy.uuid === enemy.uuid
                    ? { ...entry, enemy: applyBossRuneEffect(entry.enemy, runeId) }
                    : entry
                )));
                setEstadosLocal((prev) => {
                  if (runeId !== 'azul') return prev;
                  const index = prev.findIndex((estado) => estado.id === 'ATURDIMIENTO_I');
                  if (index === -1) return [...prev, { id: 'ATURDIMIENTO_I', count: 1 }];
                  return prev.map((estado, i) => (i === index ? { ...estado, count: 1 } : estado));
                });
              }}
            />
          )}
          </div>
          </div>

          
            {/* Bloque de vida dominante */}
            <section className="mt-3 w-full rounded-xl border border-red-900/60 bg-red-950/40 p-2" aria-label={ti.vida || 'Vida'}>
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-red-200">
                <span>{ti.vida || 'Vida'}</span>
                <span className="tabular-nums text-base text-white">{vidaLocal} / {vidaMax}</span>
              </div>

              <div className="h-4 w-full overflow-hidden rounded-full bg-red-950">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-[width] duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, (vidaLocal / Math.max(vidaMaxLocal, 1)) * 100))}%` }}
                />
              </div>

              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {[
                  { delta: -5, label: '−5', tone: 'border-red-800 bg-red-900/70 text-red-100 hover:bg-red-800' },
                  { delta: -1, label: '−1', tone: 'border-red-800 bg-red-900/70 text-red-100 hover:bg-red-800' },
                  { delta: 1, label: '+1', tone: 'border-emerald-800 bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800' },
                  { delta: 5, label: '+5', tone: 'border-emerald-800 bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800' },
                ].map(({ delta, label, tone }) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => handleVidaChange(delta)}
                    aria-label={`${ti.vida || 'Vida'} ${label}`}
                    className={`min-h-11 rounded-lg border text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${tone}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <EnemyRingControl enemy={enemy} labels={ti} />

          
        </div>

        {/* Pie fijo de acciones */}
        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-700/60 bg-slate-950/70 px-3 py-2">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(uuid);
                onClose();
              }}
              className="min-h-11 rounded-xl border border-red-700 bg-red-900/60 px-4 text-sm font-semibold text-red-100 hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              🗑 {ti.remove || 'Eliminar'}
            </button>
          ) : <span />}
          {isBoar && onFlip && (
            <button
              type="button"
              onClick={flipBoar}
              className="min-h-11 rounded-xl border border-purple-500/60 bg-purple-900/70 px-4 text-sm font-bold text-purple-100 hover:bg-purple-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
            >
              🔄 {ti.boarCardFlip || 'Voltear carta'}
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl bg-slate-700 px-5 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {ti.close || 'Cerrar'}
          </button>
        </footer>
      </div>

      {/* Avisos flotantes centrados */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
        {avisos.map((aviso, i) => (
          <div
            key={i}
            className="bg-black/90 text-white text-sm px-4 py-2 rounded shadow-lg animate-fade-in"
          >
            {aviso}
          </div>
        ))}
      </div>
    </div>
  
  );
};

