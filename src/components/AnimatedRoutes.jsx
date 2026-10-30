// src/components/AnimatedRoutes.jsx
import { lazy, Suspense } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { useTracker } from "@/context/TrackerContext";
import { HeroExtrasProvider } from "@/context/HeroExtrasContext";
import { AnimatePresence } from "framer-motion";

const HomeMenu = lazy(() => import("@/pages/HomeMenu"));
const Tutorial = lazy(() => import("@/pages/Tutorial"));
const Tracker = lazy(() => import("@/pages/Tracker"));
const Config = lazy(() => import("@/pages/Config"));
const Saves = lazy(() => import("@/pages/Saves"));
const InitTracker = lazy(() => import("@/pages/InitTracker"));

const LoadingRoute = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white" role="status" aria-live="polite">
    Cargando…
  </div>
);

function ProtectedTracker() {
  const { trackerData } = useTracker();
  const hasHeroes = Array.isArray(trackerData?.heroes) && trackerData.heroes.length > 0;
  return hasHeroes ? <InitTracker /> : <Navigate to="/tracker" replace />;
}

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingRoute />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomeMenu />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/config" element={<Config />} />
          <Route path="/saves" element={<Saves />} />
          <Route path="/init" element={(
            <HeroExtrasProvider>
              <ProtectedTracker />
            </HeroExtrasProvider>
          )} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
