import { useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useInitEnemies } from "@/context/InitEnemiesContext";
import { useInitRunes } from "@/context/initRunesContext";
import { useGame } from "@/context/GameContext";
import PageTransition from "@/components/PageTransition";
import ConfirmDialog from "@/components/ConfirmDialog";
import { clearTrackState, isPlainObject, readJsonStorage } from "@/utils/storage";
import logo from "@/assets/Corebox_Logo-1536x864.png";

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

  const startNewGame = () => {
    // La configuración (héroes, roles, enemigos) se conserva; solo se reinicia el track.
    clearTrackState();
    resetGameState();
    resetEnemySession();
    resetPlacedRunes();
    navigate('/tracker');
  };

  return (
    <PageTransition>
      <main className="relative flex min-h-[calc(100dvh-3.5rem)] items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.18),transparent_42%),linear-gradient(180deg,#0f172a_0%,#020617_100%)]" />
        <div className="relative z-10 grid w-full max-w-5xl gap-8 overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-2xl shadow-emerald-950/30 backdrop-blur sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
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
              <button
                type="button"
                onClick={() => navigate("/config")}
                className="min-h-12 rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 text-left font-bold text-slate-100 transition hover:border-slate-400 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                <span className="block">{home.configure_environment || 'Configurar entorno'}</span>
                <span className="mt-1 block text-xs font-normal text-slate-400">{home.manageSaves || 'Guardar, exportar o importar partidas'}</span>
              </button>
            </div>
          </section>

          <aside className="flex min-h-64 items-center justify-center rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-4 sm:p-8">
            <img src={logo} alt="Drunagor" className="max-h-72 w-full object-contain opacity-90 drop-shadow-2xl" loading="eager" />
          </aside>
        </div>
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
