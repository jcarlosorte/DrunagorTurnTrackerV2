// src/components/AnimatedRoutes.jsx
import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const HomeMenu = lazy(() => import("@/pages/HomeMenu"));
const Tracker = lazy(() => import("@/pages/Tracker"));
const Config = lazy(() => import("@/pages/Config"));
const InitTracker = lazy(() => import("@/pages/InitTracker"));

const LoadingRoute = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-700 text-white" role="status">
    Cargando…
  </div>
);

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingRoute />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomeMenu />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/config" element={<Config />} />
          <Route path="/init" element={<InitTracker />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
