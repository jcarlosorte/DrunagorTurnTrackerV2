import React, { useState, useEffect, useId, useRef } from 'react';
import { FiInfo } from "react-icons/fi";
import { useLanguage } from '@/context/LanguageContext';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import { adjustCapabilitiesByRunes } from '@/components/adjustCapabilitiesByRunes';
import { useGame } from '@/context/GameContext';
import { GiHealthPotion, GiRunningNinja, GiSwordClash, GiShieldReflect, GiSteeltoeBoots, GiBloodySword, GiArcheryTarget, GiMoebiusTrefoil } from "react-icons/gi";
import { MdLooksOne,  MdLooksTwo,  MdLooks3,  MdLooks4,  MdLooks5,  MdLooks6,} from 'react-icons/md';


export const ModalEnemyCard = ({ uuid, enemy, onClose, onDelete, onVidaChange, overhealedEnemies, setOverhealedEnemies, onEstadoChange, getEffectiveStats }) => {
  const [vidaLocal, setVidaLocal] = useState(enemy?.vida || 0);
  const [vidaMaxLocal, setVidaMaxLocal] = useState(enemy?.vidaMax || 0);
  const [estadosLocal, setEstadosLocal] = useState(enemy?.estadosAlterados || []);
  const { language, translations } = useLanguage();
  const hasConfirmedOverheal = overhealedEnemies?.has(uuid) ?? false;
  const [avisos, setAvisos] = useState([]);

  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};
  const te = translations.enemies || {};
  const tc = translations.enemies?.categoria || {};
  const tb = translations.trackerSelect?.comportamientos || {};
  const tt = translations.condiciones_t || {};
  const tte = translations.condiciones_d || {};
  const tea = translations.estadosAlterados || {};
  const tca = translations.cartas_ataque || {};
  const ttr = translations.defensaCard.cartas_trad || {};
  const { getRuneCount } = useGame();
  const closeRef = useRef(null);
  const titleId = useId();

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

  const { id, name, rune, imagen, vida, vidaMax, movimiento, ataque, color, comportamiento, categoria, inmunidad, tipo_ataque, capacidades, capacidadesOriginales, estadosAlterados } = enemy;
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

  const valorMovimiento = interpretarValorRuna(movimiento, rune, getRuneCount, categoria, "M");
  const valorAtaque = interpretarValorRuna(ataque, rune, getRuneCount, categoria, "A");
  

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

  const bgColorMap = {
    esbirro: 'bg-cyan-300',
    blanco: 'bg-white',
    gris: 'bg-gray-500',
    negro: 'bg-black',
    comandante: 'bg-yellow-400',
    hero: 'bg-orange-400',
    jefe: 'bg-purple-500',
    overlord: 'bg-purple-800',
    escenario: 'bg-cyan-600',
  };
  
  const textBgColorMap = {
    blanco: 'bg-white/70',
    gris: 'bg-gray-500/70',
    negro: 'bg-black/70',
    comandante: 'bg-yellow-400/70',
    hero: 'bg-orange-400/70',
    jefe: 'bg-purple-500/70',
    overlord: 'bg-purple-700/70',
  };

  const categoryGlowMap = {
    bisoño: 'drop-shadow-[0_0_6px_rgba(59,130,246,1)]',
    soldado: 'drop-shadow-[0_0_6px_rgba(234,179,8,1)]',
    veterano: 'drop-shadow-[0_0_6px_rgba(251,146,60,1)]',
    campeon: 'drop-shadow-[0_0_6px_rgba(239,68,68,1)]',
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

  const handleVidaChange = (delta) => {
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
      const confirm = window.confirm(`${vidaTentativa} ${ti?.vidaExcedida}`);
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

  const traducirClaveConNumero = (clave, base, detalles) => {
    const match = clave.match(/^([A-Z_ ]+?)\s+(\d+)$/);
    if (match) {
      const nombre = match[1].trim().replace(/\s+/g, '_');
      const numero = match[2];
      const claveGeneral = `${nombre}_X`;
      const texto = base[claveGeneral]?.replace('{x}', numero) || clave;
      const detalle = detalles[claveGeneral]?.replace('{x}', numero) || '';
      return { claveGeneral, texto, detalle };
    }
  
    return { claveGeneral: clave, texto: base[clave] || clave, detalle: detalles[clave] || '' };
  };

  const clavesRosa = ['ESCUDO_X', 'REGENERACION_X', 'MANDO', 'EVOLUCION', 'SANAR_X', 'VORAGINE', 'HASTA 2 MOSTRUOS MAS DEBILES'];
  const clavesAzul = ['SANGUINARIO', 'IMPLACABLE', 'DESAFIO', 'SALTO', 'VENGATIVO', 'CODICIA', 'BRUTAL'];

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
                  const classColor = clavesRosa.includes(claveGeneral)
                    ? 'text-pink-500 font-semibold'
                    : clavesAzul.includes(claveGeneral)
                      ? 'text-blue-500 font-semibold'
                      : '';
  
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

  const handleEstadoChangeLocal = (estadoId, delta) => {
    const updatedStates = estadosLocal.map((estado) => {
      if (estado.id === estadoId) {
        const estadoConfig = ESTADOS_ALTERADOS.find(e => e.id === estado.id);
        const currentMax = estado.max || estadoConfig?.max || 1;
        const currentCount = estado.count || 0;
        const newCount = currentCount + delta;
  
        if (delta > 0 && newCount > currentMax) {
          const confirm = window.confirm(
            `${tea[estado.texto]} ${ti?.estadoExcedido_1} (${currentMax}). ${ti?.estadoExcedido_2}`
          );
          if (!confirm) return estado;
  
          // ✅ Aumentamos el límite dinámicamente
          return {
            ...estado,
            count: newCount,
            max: newCount // Nuevo límite
          };
        }
  
        return {
          ...estado,
          count: Math.max(0, newCount)
        };
      }
      return estado;
    });
  
    setEstadosLocal(updatedStates);
  
    if (onEstadoChange) {
      onEstadoChange(enemy.uuid, updatedStates);
    }
  };


    
  return (
    <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`${bgColorMap[color] || ''} relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border-4 shadow-2xl ${borderColorMap[color] || ''}`}
      >
        
        {/* Botón cerrar */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={ti.close || 'Cerrar'}
        >
          X
        </button>

        {/* Botón eliminar */}
        {onDelete && (
          <button
            type="button"
            onClick={() => {
              onDelete(uuid);
              onClose();
            }}
            className="absolute left-2 top-2 rounded-full bg-red-600 px-3 py-2 text-xs text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            🗑 {ti.remove || 'Eliminar'}
          </button>
        )}

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
          <div className="flex w-full items-center gap-1 mt-2">
            <div className="relative">
              <img
                src={imagen}
                alt={name}
                className={`w-32 h-32 object-cover rounded border-2 ${borderColorMap[color] || ''}`}
              />
              {/* Estados alterados sobre la imagen */}
              <div className="absolute top-1 left-1 grid grid-rows-4 grid-flow-col gap-1">
                {estadosLocal
                  .filter(estado => estado.count > 0)
                  .map((estado) => {
                    const estadoConfig = ESTADOS_ALTERADOS.find(e => e.id === estado.id);
                    if (!estadoConfig) return null;
                    return (
                      <div key={estado.id} className="relative">
                        <img
                          src={estadoConfig.imagen}
                          alt={estadoConfig.texto}
                          className="w-6 h-6 border border-white rounded-full shadow-md"
                        />
                        {estado.count > 1 && (
                          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                            {estado.count}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

            </div>
              
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
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(todasInmunidades) && todasInmunidades.length > 0
                    ? todasInmunidades.map((clave, idx) => (
                        <span key={clave} className="inline-flex items-center gap-1 mr-2">
                          {tt[clave] || clave}
                          <FiInfo
                            title={tte[clave] || ''}
                            className="text-gray-500 hover:text-gray-800 cursor-help"
                          />
                        </span>
                      ))
                    : tt.none}
                </div>
              </div>
              {/* Capacidades */}
              {mostrarAccionesCapacidad(capacidadesAjustadas, tt, tte, ti)}
              
            </div>
          </div>

          {/* Submenú Estados Alterados */}
          <div className="w-full bg-gray-800 rounded-lg p-2 mt-2 flex flex-row flex-nowrap gap-2 justify-around items-center">
            {estadosLocal
              .filter((estado) => !todasInmunidades?.includes(estado.id) && !(todasInmunidades?.includes("GRANDE") && ["DERRIBO_I", "ATURDIMIENTO_I"].includes(estado.id)))
              .filter((estado) => {
                const estadoConfig = ESTADOS_ALTERADOS.find(e => e.id === estado.id);
                return estadoConfig && estadoConfig.mostrar === "si";
              })
              .map((estado) => {
                const estadoConfig = ESTADOS_ALTERADOS.find(e => e.id === estado.id);
                if (!estadoConfig) return null;
                const [hover, setHover] = React.useState(false);
                const maxCount = estado.max || estadoConfig.max || 1;
            
                // 🔹 Ajuste de tamaño dinámico
                const totalEstados = estadosLocal.length;
                let iconSize = "w-8 h-8";
                if (totalEstados > 6 && totalEstados <= 10) iconSize = "w-6 h-6";
                if (totalEstados > 10) iconSize = "w-5 h-5";
            
                return (
                  <div key={estado.id} className="flex flex-col items-center w-14">
                    <button
                      type="button"
                      onClick={() => handleEstadoChangeLocal(estado.id, +1)}
                      disabled={maxCount === 1 && (estado.count || 0) >= maxCount}
                      aria-label={`${tea[estadoConfig.texto] || estadoConfig.texto}: +1`}
                      className="mb-1 flex h-11 w-11 items-center justify-center rounded bg-green-600 text-lg text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
                    >
                      +
                    </button>
            
                    {/* Icono con tooltip */}
                    <div
                      className="relative flex cursor-help items-center justify-center"
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                      onFocus={() => setHover(true)}
                      onBlur={() => setHover(false)}
                      tabIndex={0}
                      aria-label={tea[estadoConfig.texto] || estadoConfig.texto}
                    >
                      <img
                        src={estadoConfig.imagen}
                        alt={estadoConfig.texto}
                        className={`${iconSize} flex-shrink`}
                      />
                      {/* Tooltip */}
                      {hover && (
                        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 
                                        bg-black text-white text-[0.65rem] rounded px-2 py-1 
                                        whitespace-nowrap z-20">
                          <strong>{tea[estadoConfig.texto]}</strong>
                        </div>
                      )}
                    </div>
                    
                    {maxCount > 1 && (
                      <div className="text-white text-sm font-bold">{estado.count || 0}</div>
                    )}
            
                    <button
                      type="button"
                      onClick={() => handleEstadoChangeLocal(estado.id, -1)}
                      disabled={(estado.count || 0) <= 0}
                      aria-label={`${tea[estadoConfig.texto] || estadoConfig.texto}: −1`}
                      className="mt-1 flex h-11 w-11 items-center justify-center rounded bg-red-600 text-lg text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
                    >
                      −
                    </button>
                  </div>
                );
              })
            }
          </div>

          
            {/* Barra de vida con botones a los lados */}
            <div className="flex items-center w-full h-5 mt-2 gap-2">
              {/* Botón − */}
              <button
                type="button"
                onClick={() => handleVidaChange(-1)}
                aria-label={`${ti.vida || 'Vida'}: −1`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-lg text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                −
              </button>
            
              {/* Barra de vida */}
              <div className="flex-1 relative h-full">
                <div className="absolute inset-0 flex items-center justify-center text-white text-[0.65rem] font-bold z-10">
                  {vidaLocal} / {vidaMax}
                </div>
                <div className="w-full h-full bg-red-900 rounded">
                  <div
                    className="h-full bg-red-500 rounded"
                    style={{ width: `${(vidaLocal / vidaMax) * 100}%` }}
                  />
                </div>
              </div>
            
              {/* Botón + */}
              <button
                type="button"
                onClick={() => handleVidaChange(1)}
                aria-label={`${ti.vida || 'Vida'}: +1`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-lg text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                +
              </button>
            </div>

          
        </div>
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

