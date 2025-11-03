import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { ChevronRight, ChevronLeft, Smile, Dumbbell, Eye } from "lucide-react";
import PanelNotas from "../components/PanelNotas";
import RegistroDiario from "./RegistroDiario";
import Habito from "../components/Habito";
import RegistroHabito from "../components/RegistroHabito";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [panelAbierto, setPanelAbierto] = useState(false);
  const [abrirRegistroAnimo, setAbrirRegistroAnimo] = useState(false);
  const [abrirHabito, setAbrirHabito] = useState(false);
  const [abrirRegistroHabito, setAbrirRegistroHabito] = useState(false);

  const [frase, setFrase] = useState("Cargando afirmación...");

  const navigate = useNavigate();

  // ==================== CARGAR SESIÓN DEL BACKEND ====================
  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioActual");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setCargando(false);

    // Llamada al endpoint local del backend (sin CORS)
    fetch("http://127.0.0.1:8000/api/afirmacion")
      .then((res) => res.json())
      .then((data) => {
        setFrase(
          data.traduccion ||
            data.affirmation ||
            "Hoy es un gran día para mejorar 🌞"
        );
      })
      .catch(() => setFrase("Hoy es un gran día para mejorar 🌞"));
  }, []);

  if (cargando) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)] text-gray-600">
          <p>Cargando...</p>
        </div>
      </Layout>
    );
  }

  if (!usuario || !token) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-gray-600 text-center">
          <h2 className="text-3xl font-semibold mb-2 text-green-700">
            Bienvenido a BienestarApp 🌿
          </h2>
          <p className="text-gray-500">
            Inicia sesión o regístrate para comenzar tu camino de bienestar.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Panel de notas */}
      <PanelNotas
        abierto={panelAbierto}
        usuario={usuario}
        token={token}
        onToggle={() => setPanelAbierto(!panelAbierto)}
      />

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-8 p-8">
        {/* Columna izquierda */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-3 text-green-700">
            Hola, {usuario.nombreUsuario} 👋
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Bienvenido a tu espacio de bienestar diario. 🌿 Respira profundo y
            comencemos.
          </p>

          {/* Tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Registrar Ánimo */}
            <div className="bg-gradient-to-br from-green-200 to-green-400 p-6 rounded-3xl shadow-lg flex flex-col justify-between transition transform hover:scale-[1.02] hover:shadow-xl">
              <div>
                <Smile className="w-8 h-8 mb-2 text-green-800" />
                <h3 className="text-xl font-semibold text-green-900">
                  Registrar Ánimo
                </h3>
                <p className="text-green-800/80 text-sm mt-1">
                  Registra tu estado de ánimo diario y observa tus cambios.
                </p>
              </div>
              <button
                onClick={() => navigate("/registro-diario")}
                className="mt-4 bg-green-700 text-white py-2 rounded-xl hover:bg-green-800 transition"
              >
                Ver más
              </button>
            </div>

            {/* Habito */}
            <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-6 rounded-3xl shadow-lg flex flex-col justify-between transition transform hover:scale-[1.02] hover:shadow-xl">
              <div>
                <Dumbbell className="w-8 h-8 mb-2 text-blue-800" />
                <h3 className="text-xl font-semibold text-blue-900">
                  Registrar Hábito
                </h3>
                <p className="text-blue-800/80 text-sm mt-1">
                  Crea un hábito y regístralo diariamente para mejorar tu
                  rutina.
                </p>
              </div>
              <button
                onClick={() => setAbrirHabito(true)}
                className="mt-4 bg-blue-700 text-white py-2 rounded-xl hover:bg-blue-800 transition"
              >
                Ver más
              </button>
            </div>

            {/* Registro Hábito */}
            <div className="bg-gradient-to-br from-purple-200 to-purple-400 p-6 rounded-3xl shadow-lg flex flex-col justify-between transition transform hover:scale-[1.02] hover:shadow-xl">
              <div>
                <Eye className="w-8 h-8 mb-2 text-purple-800" />
                <h3 className="text-xl font-semibold text-purple-900">
                  Marcar Hábito
                </h3>
                <p className="text-purple-800/80 text-sm mt-1">
                  Visualiza tus hábitos y marca los días completados.
                </p>
              </div>
              <button
                onClick={() => setAbrirRegistroHabito(true)}
                className="mt-4 bg-purple-700 text-white py-2 rounded-xl hover:bg-purple-800 transition"
              >
                Ver más
              </button>
            </div>

            {/* Próximamente */}
            <div className="bg-gradient-to-br from-pink-200 to-pink-400 p-6 rounded-3xl shadow-lg flex flex-col justify-between transition transform hover:scale-[1.02] hover:shadow-xl">
              <h3 className="text-xl font-semibold text-pink-900 mb-2">
                Próximamente ✨
              </h3>
              <p className="text-pink-800/80 text-sm mb-4">
                Nuevas herramientas de bienestar estarán disponibles pronto.
              </p>
              <button className="bg-pink-700 text-white py-2 rounded-xl hover:bg-pink-800 transition">
                Ver más
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="w-full lg:w-[35%] flex flex-col items-center gap-6">
          {/* Frase motivacional */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-3xl shadow-lg text-center w-full">
            <h3 className="text-2xl font-semibold text-green-800 mb-2">
              🌟 Tu afirmación de hoy
            </h3>
            <p className="text-green-700 italic text-lg">{frase}</p>
          </div>

          {/* Mini calendario */}
          <div className="bg-white rounded-3xl shadow-lg p-2 w-full">
            <iframe
              src="http://localhost:5173/planner-mini"
              title="Mini Calendar"
              className="w-full h-[365px]  border-0 rounded-2xl overflow-hidden bg-white"
              scrolling="no"
            />

            <button
              onClick={() => navigate("/planner")}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition shadow-md"
            >
              Ir al Planner
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {abrirRegistroAnimo && (
        <RegistroDiario
          onClose={() => setAbrirRegistroAnimo(false)}
          token={token}
        />
      )}
      {abrirHabito && (
        <Habito onClose={() => setAbrirHabito(false)} token={token} />
      )}
      {abrirRegistroHabito && (
        <RegistroHabito
          onClose={() => setAbrirRegistroHabito(false)}
          token={token}
        />
      )}
    </Layout>
  );
}
