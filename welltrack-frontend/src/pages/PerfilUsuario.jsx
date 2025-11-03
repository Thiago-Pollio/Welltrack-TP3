import { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function PerfilUsuario() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [frase, setFrase] = useState("Cargando afirmación...");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) {
      setError("No hay usuario logueado.");
      return;
    }

    // 🔹 Llamada al servicio SOAP (por endpoint REST wrapper)
    fetch(`http://127.0.0.1:8000/api/usuario-soap/${usuario.email}`)
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch(() => setError("Error obteniendo datos del usuario."));

    // 🔹 Afirmación motivacional traducida
    fetch("http://127.0.0.1:8000/api/afirmacion")
      .then((res) => res.json())
      .then((data) => setFrase(data.traduccion))
      .catch(() => setFrase("Hoy es un gran día para mejorar 🌞"));
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-[1200px] min-h-[calc(100vh-120px)] bg-gradient-to-b from-green-50 to-white px-6 py-10">
        <div className="bg-white shadow-xl rounded-3xl p-10 w-[900px] h-[500px] mx-auto border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10 items-center overflow-hidden">
          {/* Columna izquierda: datos del usuario */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-green-700 mb-2">
              Mi Perfil 🌿
            </h2>
            {error ? (
              <p className="text-red-600 font-medium">{error}</p>
            ) : !datos ? (
              <p className="text-gray-500">Cargando información...</p>
            ) : (
              <div className="space-y-4 text-left text-gray-700">
                <p>
                  <strong>Nombre y Apellido:</strong> {datos.nombreApellido}
                </p>
                <p>
                  <strong>Usuario:</strong> {datos.nombreUsuario}
                </p>
                <p>
                  <strong>Email:</strong> {datos.email}
                </p>
                <p>
                  <strong>Fecha de nacimiento:</strong>{" "}
                  {new Date(datos.fechaNac).toLocaleDateString("es-AR")}
                </p>
              </div>
            )}

            <button
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition shadow-md"
              onClick={() => alert("Funcionalidad de edición próximamente. ✨")}
            >
              Editar perfil
            </button>
          </div>

          {/* Columna derecha: foto de perfil + frase motivacional */}
          <div className="flex flex-col items-center justify-center text-center space-y-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Foto de perfil"
              className="w-48 h-48 rounded-full border-4 border-green-300 shadow-md"
            />
            <p className="text-green-700 italic text-lg px-4">{frase}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
