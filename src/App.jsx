import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import TopMenuLanguage from "@/components/TopMenuLanguage";
import ErrorBoundary from "@/components/ErrorBoundary";
import StorageWarning from "@/components/StorageWarning";
import { SavesUiProvider } from "@/context/SavesUiContext";

function AppContent() {
  const location = useLocation();
  // El track monta su propia barra completa: así solo hay una cabecera.
  const hasOwnHeader = location.pathname === "/init";
  const isTrackerRoute = ["/init", "/config", "/tracker", "/saves"].includes(location.pathname);

  return (
    <div className={`min-h-screen bg-slate-950 ${hasOwnHeader ? "" : "pt-14"} ${isTrackerRoute ? "text-left" : ""}`}>
      <AnimatedRoutes />
      <StorageWarning />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router basename={import.meta.env.BASE_URL}>
        <SavesUiProvider>
          <TopMenuLanguage />
          <AppContent />
        </SavesUiProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
