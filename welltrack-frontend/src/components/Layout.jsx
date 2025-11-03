import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Menu, X } from "lucide-react";
import logo from "../assets/logo-solo.png";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const usuarioGuardado = localStorage.getItem("usuarioActual");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Error cerrando sesión", error);
    } finally {
      localStorage.removeItem("usuarioActual");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header flotante */}
      <header
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-sm z-50 transition-all duration-300 ${
          scrolling ? "py-2 scale-95 shadow-md" : "py-4"
        }`}
      >
        <div className="flex items-center justify-between px-6">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 shadow-sm p-1">
  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
</div>


            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Welltrack
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                BienestarApp
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            {/* Modo claro/oscuro placeholder */}
            <button
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title="Modo claro/oscuro (no funcional)"
            >
              <Sun className="w-5 h-5 text-yellow-400" />
            </button>

            {token && usuario ? (
              <>
                <button
                  onClick={() => navigate("/perfil")}
                  className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition transform text-sm sm:text-base"
                >
                  Mi Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition transform text-sm sm:text-base"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition text-sm sm:text-base"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate("/registro")}
                  className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition transform text-sm sm:text-base"
                >
                  Registrarse
                </button>
              </>
            )}

            {/* Botón menú hamburguesa */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-2 mt-3 px-6 pb-4 text-gray-700 dark:text-gray-200">
            <button
              onClick={() => {
                navigate("/perfil");
                setMenuOpen(false);
              }}
              className="w-full text-left py-2 hover:bg-green-100 dark:hover:bg-green-800 rounded transition"
            >
              Mi Perfil
            </button>
            {token && usuario && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left py-2 hover:bg-red-200 dark:hover:bg-red-700 rounded transition"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        )}
      </header>

      {/* Contenido principal */}
      <main className="flex-1 pt-28">{children}</main>

      {/* Footer */}
      <footer className="w-full py-5 bg-white shadow-inner mt-10">
        <div className="max-w-7xl mx-auto px-10 text-center text-gray-600">
          Welltrack — 2025
        </div>
      </footer>
    </div>
  );
}
