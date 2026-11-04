import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { useLanguage } from "@/context/LanguageContext";
import { useInitEnemies } from "@/context/InitEnemiesContext";
import { useInitRunes } from "@/context/initRunesContext";
import { useGame } from "@/context/GameContext";
import PageTransition from "@/components/PageTransition";
import ConfirmDialog from "@/components/ConfirmDialog";
import { clearTrackState, isPlainObject, readJsonStorage, writeJsonStorage } from "@/utils/storage";
import { clearCampFollowers } from "@/utils/campFollowers";
import logo from "@/assets/Corebox_Logo-1536x864.avif";
import logoApocalypse from "@/assets/home/logo-apocalypse-transparent.webp";
import logoAwakenings from "@/assets/home/logo-awakenings-transparent.webp";
import reyRedivivo from "@/assets/home/rey-redivivo.webp";
import bg from "@/assets/home/dungeon-bg.webp";
import SiteFooter from "@/components/SiteFooter";

const HOME_LOGOS = [
  { src: logo, alt: 'Drunagor', tone: '#fbbf24' },
  { src: logoApocalypse, alt: 'Apocalipsis', tone: '#f87171' },
  { src: logoAwakenings, alt: 'Awakenings', tone: '#a78bfa' },
];

export default function HomeMenu() {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { resetEnemySession } = useInitEnemies();
  const { resetPlacedRunes } = useInitRunes();
  const { resetGameState } = useGame();
  const home = translations.home || {};
  const savedSession = useMemo(() => {
    const trackerData = readJsonStorage('trackerData', {}, isPlainObject);
    const gameState = readJsonStorage('gameState', {}, isPlainObject);
    return Boolean(
      trackerData.placedHeroes?.length ||
      trackerData.enemies?.length ||
      gameState.usedTiles?.length ||
      gameState.pilas?.length ||
      gameState.pilasConcentrada?.length
    );
  }, []);

  const [confirmNewGame, setConfirmNewGame] = useState(false);
  const [activeLogo, setActiveLogo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLogo((index) => (index + 1) % HOME_LOGOS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const startNewGame = () => {
    // La configuración (héroes, roles, enemigos) se conserva; solo se reinicia el track.
    clearTrackState();
    const trackerData = readJsonStorage('trackerData', {}, isPlainObject);
    if (isPlainObject(trackerData) && trackerData.followers !== undefined) {
      writeJsonStorage('trackerData', { ...trackerData, followers: [] });
    }
    clearCampFollowers();
    resetGameState();
    resetEnemySession();
    resetPlacedRunes();
    navigate('/tracker');
  };

  return (
    <PageTransition>
      <main className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-slate-950 text-white">
        <img
          src={bg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-80"
          loading="eager"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.14),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.58)_0%,rgba(2,6,23,0.86)_100%)]" />

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full max-w-5xl gap-8 overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-2xl shadow-emerald-950/30 backdrop-blur sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:p-10">
          <section className="flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-12 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Drunagor</span>
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-slate-50 sm:text-5xl">
              {home.title || 'Control de turnos para tu campaña'}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              {home.subtitle || 'Organiza héroes, enemigos, runas y niebla desde cualquier dispositivo.'}
            </p>

            <div className="mt-8 grid gap-3 sm:max-w-md">
              {savedSession && (
                <button
                  type="button"
                  onClick={() => navigate('/init')}
                  className="min-h-12 rounded-xl bg-emerald-600 px-5 py-3 text-left font-bold text-white shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                >
                  <span className="block">{home.resume_tracker || 'Continuar partida'}</span>
                  <span className="mt-1 block text-xs font-normal text-emerald-100">{home.resume_hint || 'Recuperar el estado guardado en este dispositivo'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setConfirmNewGame(true)}
                className="min-h-12 rounded-xl bg-emerald-700 px-5 py-3 text-left font-bold text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                {home.start_tracker || 'Nueva partida'}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/config")}
                  className="min-h-12 rounded-xl border border-slate-600 bg-slate-800 px-3 py-3 text-left font-bold text-slate-100 transition hover:border-slate-400 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <span className="block text-sm">{home.configure_environment || 'Configurar entorno'}</span>
                  <span className="mt-1 block text-[0.65rem] font-normal leading-snug text-slate-400">{home.configure_hint || 'Idioma, expansiones y versión de reglas'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/saves")}
                  className="min-h-12 rounded-xl border border-slate-600 bg-slate-800 px-3 py-3 text-left font-bold text-slate-100 transition hover:border-slate-400 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <span className="block text-sm">{home.saves || 'Partidas'}</span>
                  <span className="mt-1 block text-[0.65rem] font-normal leading-snug text-slate-400">{home.saves_hint || 'Guardar, exportar o importar'}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => navigate("/tutorial")}
                className="min-h-12 rounded-xl border border-emerald-700/60 bg-emerald-950/30 px-5 py-3 text-left font-bold text-emerald-100 transition hover:border-emerald-400 hover:bg-emerald-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <span className="block">{home.tutorial || 'Tutorial'}</span>
                <span className="mt-1 block text-xs font-normal text-emerald-200/80">{home.tutorial_hint || 'Cómo usar la aplicación'}</span>
              </button>
            </div>
          </section>

          <aside className="relative flex min-h-[18rem] items-end justify-center overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-950/60 sm:min-h-[22rem] lg:h-[24rem] lg:self-center">
            <div
              className="absolute inset-0 z-0 bg-cover bg-top"
              style={{ backgroundImage: `url(${reyRedivivo})` }}
              role="img"
              aria-label="Rey Redivivo"
            />
            <div
              className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(2,6,23,0.35)_0%,rgba(2,6,23,0.12)_18%,rgba(2,6,23,0.18)_55%,rgba(2,6,23,0.94)_100%)]"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 z-30">
              {HOME_LOGOS.map((item, index) => {
                const active = index === activeLogo;
                return (
                  <motion.div
                    key={item.alt}
                    className="absolute inset-0 flex items-center justify-start p-3"
                    style={{
                      background: `linear-gradient(135deg, ${item.tone}66 0%, ${item.tone}33 45%, transparent 78%)`,
                    }}
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={{ duration: active ? 0.6 : 0.5 }}
                    aria-hidden={!active}
                  >
                    <motion.img
                      src={item.src}
                      alt={item.alt}
                      className="h-[62%] w-auto max-w-[48%] object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]"
                      loading="lazy"
                      decoding="async"
                      animate={{ scale: active ? [1, 1.05, 1] : 0.95 }}
                      transition={active
                        ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.4 }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </aside>
        </div>
        </div>

        <SiteFooter />
      </main>

      <ConfirmDialog
        open={confirmNewGame}
        title={home.newGameConfirmTitle || 'Empezar una nueva partida'}
        description={home.newGameConfirm || 'Se reiniciará el track actual. Tu configuración de héroes y enemigos se conservará. Exporta antes si quieres conservar esta partida.'}
        confirmLabel={home.newGameConfirmAction || 'Nueva partida'}
        cancelLabel={translations.trackerSelect?.cancel || 'Cancelar'}
        onCancel={() => setConfirmNewGame(false)}
        onConfirm={() => {
          setConfirmNewGame(false);
          startNewGame();
        }}
      />
    </PageTransition>
  );
}
