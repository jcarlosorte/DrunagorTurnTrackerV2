import React, { useState, useEffect } from 'react';
import { GiSwordClash, GiAttachedShield, GiBadGnome, GiShadowFollower, GiSharpedTeethSkull } from 'react-icons/gi';
import { useNavigate } from "react-router-dom";
import { EXPANSIONS } from '@/data/expansions';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';
import { COLORS } from '@/data/color';
import { useLanguage } from '@/context/LanguageContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useTracker } from '@/context/TrackerContext';
import classNames from 'classnames';
import PageTransition from "@/components/PageTransition";

const TrackerSelect = () => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState(["estandar", "alternativo", "complejo"]);
  const [showHeroes, setShowHeroes] = useState(false);
  const [showEnemies, setShowEnemies] = useState(false);
  const { selectedExpansions } = useExpansions();
  const { language, translations } = useLanguage();
  const { trackerData, setTrackerData } = useTracker();
  const t = translations?.trackerSelect || {};
  const navigate = useNavigate();
  const heroesInSelectedExpansions = HEROES.filter(h => selectedExpansions.includes(h.expansionId));
  const enemiesInSelectedExpansions = ENEMIES.filter(e => selectedExpansions.includes(e.expansionId));
  //const enemiesInSelectedExpansions = ENEMIES.filter(e => selectedExpansions.includes(e.expansionId) && e.color !== "jefe" && e.color !== "hero" && e.color !== "esbirro");
  
  useEffect(() => {
    const validHeroIds = new Set(heroesInSelectedExpansions.map((hero) => hero.id));
    const validEnemyIds = new Set(enemiesInSelectedExpansions.map((enemy) => enemy.id));
    const validRoleIds = new Set(ROLES.map((role) => role.id));
    const validBehaviorIds = new Set(["estandar", "alternativo", "complejo"]);
    const heroes = (Array.isArray(trackerData.heroes) ? trackerData.heroes : [])
      .filter((id) => validHeroIds.has(id));
    const roles = Object.fromEntries(
      Object.entries(trackerData.roles || {})
        .filter(([heroId, roleId]) => heroes.includes(heroId) && validRoleIds.has(roleId))
    );
    const enemies = (Array.isArray(trackerData.enemies) ? trackerData.enemies : [])
      .filter((id) => validEnemyIds.has(id));
    const behaviors = (Array.isArray(trackerData.behaviors) ? trackerData.behaviors : [])
      .filter((behavior) => validBehaviorIds.has(behavior));

    setSelectedHeroes(heroes);
    setHeroRoles(roles);
    setSelectedEnemies(enemies);
    setSelectedBehaviors(behaviors.length > 0 ? behaviors : ["estandar", "alternativo", "complejo"]);
  }, [selectedExpansions.join(','), trackerData]);


  const getHeroName = (heroId) => translations.heroes?.[heroId] || heroId;
  const getEnemyName = (enemyId) => translations.enemies?.[enemyId] || enemyId;
  const getRoleName = (roleId) => translations.roles?.[roleId] || roleId;

  const handleRoleSelect = (heroId, roleId) => {
    setHeroRoles(prev => ({ ...prev, [heroId]: roleId }));
  };

  const handleHeroSelect = heroId => {
    setHeroRoles(prev => {
      const roles = { ...prev };
      if (roles[heroId]) delete roles[heroId];
      return roles;
    });
    setSelectedHeroes(prev =>
      prev.includes(heroId)
        ? prev.filter(id => id !== heroId)
        : prev.length < 5
        ? [...prev, heroId]
        : prev
    );
    if (selectedHeroes.length >= 5 && !selectedHeroes.includes(heroId)) {
      alert(t.maxHeroes || 'Máximo 5 héroes');
    }
  };

  const handleEnemySelect = (enemyId) => {
    setSelectedEnemies(prev =>
      prev.includes(enemyId)
        ? prev.filter(id => id !== enemyId)
        : [...prev, enemyId]
    );
  };

  const handleConfirm = () => {
    if (selectedHeroes.length === 0) {
      alert(t.noHeroesSelected || "Debes seleccionar al menos un héroe.");
      return;
    }
  
    const validHeroIds = new Set(heroesInSelectedExpansions.map((hero) => hero.id));
    const validEnemyIds = new Set(enemiesInSelectedExpansions.map((enemy) => enemy.id));
    const validRoleIds = new Set(ROLES.map((role) => role.id));
    const validBehaviorIds = new Set(["estandar", "alternativo", "complejo"]);
    const heroes = selectedHeroes.filter((id) => validHeroIds.has(id));
    const roles = Object.fromEntries(
      Object.entries(heroRoles)
        .filter(([heroId, roleId]) => heroes.includes(heroId) && validRoleIds.has(roleId))
    );
    const heroesWithoutRole = heroes.filter((heroId) => !roles[heroId]);
    if (heroesWithoutRole.length > 0) {
      const names = heroesWithoutRole.map(getHeroName).join(', ');
      alert(
        t.heroesWithoutRoles?.replace('{heroes}', names) ||
        `Todos los héroes deben tener un rol asignado. Faltan: ${names}`
      );
      return;
    }

    const validEnemies = selectedEnemies.filter((id) => validEnemyIds.has(id));
    const behaviors = selectedBehaviors.filter((behavior) => validBehaviorIds.has(behavior));
    const nextTrackerData = {
      heroes,
      roles,
      enemies: validEnemies,
      behaviors: behaviors.length > 0 ? behaviors : ["estandar"],
    };

    setTrackerData(nextTrackerData);
    navigate("/init", { replace: true });
  };
  
  const handleReset = () => {
    const validEnemies = Array.from(new Set(enemiesInSelectedExpansions.map(e => e.id)));
    setSelectedHeroes([]);
    setHeroRoles({});
    setSelectedEnemies(validEnemies);
    setSelectedBehaviors(["estandar", "alternativo", "complejo"]);
    setTrackerData({
      heroes: [],
      roles: {},
      enemies: validEnemies,
      behaviors: ["estandar", "alternativo", "complejo"],
    });
  };


  const handleBack = () => {
    navigate("/", { replace: true });
  };

  // Función para manejar la selección de comportamientos
  const handleBehaviorSelect = (behavior) => {
    setSelectedBehaviors(prev => {
      if (prev.includes(behavior)) {
        // Si el comportamiento ya está seleccionado, lo eliminamos
        const newBehaviors = prev.filter(b => b !== behavior);
        // Si no hay ningún comportamiento seleccionado, restauramos el comportamiento
        if (newBehaviors.length === 0) {
          return prev; // No dejamos que se deseleccione el último comportamiento
        }
        return newBehaviors;
      } else {
        // Si el comportamiento no está seleccionado, lo añadimos
        return [...prev, behavior];
      }
    });
  };

  const toggleExpansionEnemies = (expansionId) => {
    const enemiesOfExpansion = ENEMIES.filter(e => e.expansionId === expansionId).map(e => e.id);
  
    const allSelected = enemiesOfExpansion.every(id => selectedEnemies.includes(id));
  
    if (allSelected) {
      // Si todos están seleccionados, los desmarcamos
      setSelectedEnemies(prev => prev.filter(id => !enemiesOfExpansion.includes(id)));
    } else {
      // Si alguno no está seleccionado, los añadimos todos
      setSelectedEnemies(prev => [...new Set([...prev, ...enemiesOfExpansion])]);
    }
  };

  
   const RuneTitle = ({ children, color = "yellow" }) => {
    const colors = {
      yellow: {
        border: "border-yellow-800",
        bg: "bg-yellow-100",
        text: "text-yellow-900 font-fantasy",
        dot: "bg-yellow-800",
      },
      green: {
        border: "border-green-700",
        bg: "bg-green-100",
        text: "text-green-900 font-fantasy",
        dot: "bg-green-700",
      },
      red: {
        border: "border-red-700",
        bg: "bg-red-100",
        text: "text-red-900 font-fantasy",
        dot: "bg-red-700",
      },
      blue: {
        border: "border-blue-700",
        bg: "bg-blue-100",
        text: "text-blue-900 font-fantasy",
        dot: "bg-blue-700",
      },
    };
  
    const c = colors[color] || colors.yellow;
  
    return (
      <div className={`flex items-center justify-start gap-2 mb-2 px-3 py-1 border-l-8 rounded-r-xl ${c.bg} ${c.border}`}>
        <div className={`w-3 h-3 rounded-full ${c.dot}`} />
        <span className={`flex items-center gap-2 text-lg font-bold ${c.text}`}>{children}</span>
      </div>
    );
  };
  
  return (
  <PageTransition>
    <div className="mx-auto min-h-screen max-w-7xl space-y-8 bg-slate-950 px-3 py-6 font-sans text-slate-100 sm:px-6 lg:px-8">
      <div className="no-header" />
      <h1 className="flex justify-center items-center gap-3 text-4xl font-extrabold text-yellow-300 drop-shadow-lg uppercase tracking-wider">
        <GiBadGnome className="text-yellow-400 text-5xl" />
        {t.title}
      </h1>
      
      {/* Selección de héroes */}
      <div className="border-0 rounded-3xl p-2 bg-slate-600 shadow-2xl border-yellow-700 text-black">
        <button
          type="button"
          aria-expanded={showHeroes}
          aria-controls="heroes-selection"
          className="flex min-h-11 w-full items-center gap-2 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          onClick={() => setShowHeroes(!showHeroes)}
        >
          <RuneTitle color="yellow"> <GiAttachedShield className="text-yellow-800 text-2xl" aria-hidden="true" />{t.selectHeroes}</RuneTitle>
        </button>
        {showHeroes && (
          <div id="heroes-selection" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {heroesInSelectedExpansions.map((hero) => {
              const isSelected = selectedHeroes.includes(hero.id);
              return (
         
                <label
                  key={hero.id}
                  className={`cursor-pointer border-2 rounded-lg p-2 flex flex-col items-center text-center transition w-full max-w-[150px] mx-auto
                    ${isSelected ? 'border-green-600 bg-green-100/80 shadow-lg' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleHeroSelect(hero.id)}
                    disabled={!isSelected && selectedHeroes.length >= 5}
                    className="sr-only peer"
                    aria-label={getHeroName(hero.id)}
                  />
                  {hero.image && (
                    <div className="relative w-full max-w-[150px] mx-auto">
                      <img
                        src={hero.image}
                        alt={getHeroName(hero.id)}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto object-contain"
                      />
                      <span className="absolute bottom-1 left-0 right-0 text-xs text-white bg-black bg-opacity-60 p-1 text-center">
                        {getHeroName(hero.id)}
                      </span>
                    </div>
                  )}
                  
                </label>
      
              );
            })}
          </div>
      )}  
      </div>

      {/* Asignación de roles */}
      {selectedHeroes.length > 0 && (
        <div className="border-0 rounded-3xl p-2 bg-slate-600 shadow-2xl border-green-600 text-black">
          <RuneTitle color="green"><GiShadowFollower className="text-green-700 text-2xl" />{t.assignRoles}</RuneTitle>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
            {selectedHeroes.map((heroId) => {
              const heroData = HEROES.find((h) => h.id === heroId);
              const usedRoles = Object.values(heroRoles);
              return (
                <div key={heroId} className="flex flex-col items-center gap-2 p-4 bg-green-100/80 rounded-2xl border-0 border-green-600 shadow-md">
                  <div className="relative w-full max-w-[150px] mx-auto">
                    <img
                      src={heroData.image}
                      alt={getHeroName(heroId)}
                      className="w-full h-auto object-contain"
                    />
                    <span className="absolute bottom-1 left-0 right-0 text-xs text-white bg-black bg-opacity-60 p-1 text-center">{getHeroName(heroId)}</span>
                  </div>
                  <span>
                    {heroRoles[heroId]
                      ? `- ${getRoleName(heroRoles[heroId])} -`
                      : <em>- {t.chooseRole} -</em>}
                  </span>
                  <select
                    value={heroRoles[heroId] || ""}
                    onChange={(e) => handleRoleSelect(heroId, e.target.value)}
                    className="mt-1 p-1 border border-gray-400 rounded text-sm"
                  >
                    <option value="">{t.chooseRole}</option>
                    {ROLES.filter(role => !usedRoles.includes(role.id)).map(role => (
                      <option key={role.id} value={role.id}>
                        {getRoleName(role.id)}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enemigos agrupados por color */}
      <div className="border-0 rounded-3xl p-2 bg-slate-600 shadow-2xl border-yellow-700 text-black">
        <button
          type="button"
          aria-expanded={showEnemies}
          aria-controls="enemies-selection"
          className="flex min-h-11 w-full items-center gap-2 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          onClick={() => setShowEnemies(!showEnemies)}
        >
          <RuneTitle color="red"><GiSharpedTeethSkull className="text-red-700 text-2xl" aria-hidden="true" />{t.selectEnemies}</RuneTitle>
        </button>
        
        {/* Comportamientos Generales */}
        {showEnemies && (
        <div id="enemies-selection">
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-start sm:gap-4 mb-4">

          {/* Comportamientos */}
          <div className="bg-white/70 rounded-lg p-4 w-full sm:w-1/3 text-center">
            <p className="text-lg font-semibold mb-2 text-center">{t?.comportamientos?.comportamiento}</p>
            <div className="flex flex-col text-center items-center gap-2">
              {["estandar", "alternativo", "complejo"].map(tipo => (
                <label key={tipo} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedBehaviors.includes(tipo)}
                    onChange={() => handleBehaviorSelect(tipo)}
                    className="form-checkbox"
                  />
                  <span className="text-sm">{t?.comportamientos?.[tipo]}</span>
                </label>
              ))}
            </div>
          </div>
      
          {/* Expansiones */}
          <div className="bg-white/70 rounded-lg p-4 w-full sm:w-2/3">
            <p className="text-lg font-semibold mb-2">{t?.selectExpansions || 'Seleccionar enemigos por expansión'}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedExpansions
                .filter(exp => {
                  const expData = EXPANSIONS.find(e => e.id === exp);
                  return expData?.enemies?.length > 0; // 👈 Filtra las expansiones con enemigos
                })
                .map(exp => {
                  const expData = EXPANSIONS.find(e => e.id === exp);
                  return (
                    <button
                      key={exp}
                      onClick={() => toggleExpansionEnemies(exp)}
                      className="px-3 py-1 rounded-full border bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                    >
                      {translations.expansions?.[exp] || expData?.name || exp}
                    </button>
                  );
                })}
            </div>
          </div>
      
        </div>

        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {COLORS.map(color => {
            const enemiesOfColorMap = new Map();
            enemiesInSelectedExpansions.forEach(e => {
              if (e.color === color.id && !enemiesOfColorMap.has(e.id)) {
                enemiesOfColorMap.set(e.id, e);
              }
            });
            const enemiesOfColor = Array.from(enemiesOfColorMap.values());
            if (enemiesOfColor.length === 0) return null;
      
            let areaBg = "bg-white";
            let textColor = "";
            if (color.id === "gris") areaBg = "bg-gray-300";
            else if (color.id === "negro") {
              areaBg = "bg-black/60";
              textColor = "text-white";
            } else if (color.id === "comandante") areaBg = "bg-yellow-200";
      
            const isCompact = enemiesOfColor.length <= 4;
      
            return (
              <div
                  key={color.id}
                  className={`flex flex-col p-4 rounded-lg shadow items-center ${areaBg} ${textColor}
                    ${isCompact ? 'max-w-[800px] flex-1' : 'w-full'}
                  `}
                >
                  <h3 className="text-xl font-bold mb-4 text-center">
                    {t.colors?.[color.id] || color.id}
                  </h3>
              
                  <div
                    className={
                      ['blanco', 'gris'].includes(color.id)
                        ? 'grid gap-4 w-full justify-center'
                        : 'flex flex-wrap gap-4 justify-center w-full'
                    }
                    style={
                      ['blanco', 'gris'].includes(color.id)
                        ? { gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }
                        : {}
                    }
                  >
                  {enemiesOfColor.map(enemy => {
                    const isSelected = selectedEnemies.includes(enemy.id);
                    return (
                      <label
                        key={enemy.id}
                        className={`relative fantasy-frame flex flex-col items-center space-y-2 p-2 rounded-lg cursor-pointer border transition 
                          w-full max-w-[150px]
                          ${isSelected ? 'border-green-600 bg-green-100/80' : 'border-red-600 bg-white hover:bg-gray-100'}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleEnemySelect(enemy.id)}
                          className="sr-only peer"
                          aria-label={getEnemyName(enemy.id)}
                        />
                        {enemy.imagen && (
                          <div className="relative w-full max-w-[120px] mx-auto">
                          <img src={enemy.imagen} alt={getEnemyName(enemy.id)} className="w-full h-auto object-contain" />
                          <span className="absolute bottom-1 left-0 right-0 text-xs text-white bg-black bg-opacity-60 p-1 text-center">
                            {getEnemyName(enemy.id)}
                          </span>
                          </div>
                        )}
                        
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}
      </div>


      {/* Botones */}
      <div className="sticky bottom-0 z-20 -mx-3 flex flex-col gap-3 border-t border-slate-700 bg-slate-950/95 px-3 py-4 text-black backdrop-blur sm:mx-0 sm:flex-row sm:justify-between sm:gap-4 sm:px-0">
        <button
          onClick={handleBack}
          className="min-h-11 rounded-lg bg-blue-200 px-4 py-2 font-bold shadow hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          {t.back}
        </button>
        <button
          onClick={handleReset}
          className="min-h-11 rounded bg-red-500 px-4 py-2 font-bold text-white shadow transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
        >
          {t.reset}
        </button>
        <button
          onClick={handleConfirm}
          className="min-h-11 rounded-lg bg-green-200 px-4 py-2 font-bold shadow hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          {t.confirm}
        </button>
      </div>
      </div>
    </PageTransition>
  );

};

export default TrackerSelect;

