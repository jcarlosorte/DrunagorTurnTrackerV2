import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import TopMenuLanguage from "@/components/TopMenuLanguage";

function AppContent() {
  const location = useLocation();
  const isTrackerRoute = ["/init", "/config", "/tracker"].includes(location.pathname);

  return (
    <div className={`min-h-screen bg-slate-950 pt-14 ${isTrackerRoute ? 'text-left' : ''}`}>
      <AnimatedRoutes />
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <TopMenuLanguage />
      <AppContent />
    </Router>
  );
}

export default App;
