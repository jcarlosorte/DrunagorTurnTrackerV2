// App.jsx
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import fondoDrunagor from "@/assets/PlPhfsK0-1-smaller.png";
import TopMenuLanguage from "@/components/TopMenuLanguage"; 

function Header() {
  const { translations } = useLanguage();

  return (
    <div
      className="relative w-full bg-cover bg-center bg-no-repeat py-8"
      style={{ backgroundImage: `url(${fondoDrunagor})` }}
    >
      {/* Capa oscura opcional para mejorar contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Contenido encima del fondo */}
      <div className="relative z-10 text-center">
        <img
          src={`${import.meta.env.BASE_URL}Corebox_Logo-1536x864.png`}
          alt="Drunagor Logo"
          className="mx-auto mb-4 w-1/2"
        />
        <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-md">
          {translations.home.title}
        </h1>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const hideHeader = ["/init", "/config", "/tracker"].includes(location.pathname);

  return (
    <div className="text-center mt-10">
      {!hideHeader && <Header />}
      <AnimatedRoutes />
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <TopMenuLanguage /> {/* 👈 menú de idioma siempre arriba */}
      <AppContent />
    </Router>
  );
}

export default App;


