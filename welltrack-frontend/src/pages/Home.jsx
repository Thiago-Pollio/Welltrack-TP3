import { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function Home() {
  const usuarioGuardado = localStorage.getItem("usuarioActual");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
 // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  //const userKey = usuario ? `notas_${usuario.nombreUsuario}` : null;
  const token = localStorage.getItem("token");

  const [notas, setNotas] = useState([]);
  const [nuevaNota, setNuevaNota] = useState("");
  const [message, setMessage] = useState("");

  /*useEffect(() => {
    if (isLoggedIn && userKey) {
      const notasGuardadas = JSON.parse(localStorage.getItem(userKey)) || [];
      setNotas(notasGuardadas);
    }
  }, [isLoggedIn, userKey]);*/

  useEffect(() => {
    if (!usuario || !token) return;

    const fetchNotas = async () => {
      try {

    const response = await fetch("http://127.0.0.1:8000/api/nota", {
      headers: {
          "Content-Type" : "application/json",
          Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.mensaje || "Error al obtener las notas");
      return;
    }

    setNotas(data.notas);
  } catch (error) {
    console.error("Error al cargar notas:", error);
    setMessage("Hubo un problema");
  }
};

fetchNotas();
}, [usuario, token]);


  const agregarNota = async () => {
    if (!nuevaNota.trim() || !token) return;

    try {

    const response = await fetch("http://127.0.0.1:8000/api/nota", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contenido: nuevaNota,
        estadoNota: "activa",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.mensaje || "Error al crear la nota");
      return;
    }

    setNotas([data.nota, ...notas]);
    setNuevaNota("");
  } catch (error) {
    console.error("Error al agregar nota:", error);
    setMessage("Hubo un problema.");
  }
  };

  /*const eliminarNota = (id) => {
    const nuevasNotas = notas.filter((n) => n.id !== id);
    setNotas(nuevasNotas);
    localStorage.setItem(userKey, JSON.stringify(nuevasNotas));
  };*/

  if (!usuario || !token) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-gray-600">
          <h2 className="text-2xl">Bienvenido a BienestarApp 🌿</h2>
          <p className="mt-2">
            Inicia sesión o regístrate para comenzar a usar el planner.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Hola, {usuario.nombreUsuario} 👋</h2>

        {/* agregar nota */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            placeholder="Escribe una nota rápida..."
            className="flex-1 border rounded-lg p-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-300 transition"
          />
          <button
            onClick={agregarNota}
            className="bg-green-400 text-white px-6 py-3 rounded-lg shadow hover:bg-green-500 transition transform hover:scale-105"
          >
            Agregar
          </button>
        </div>

        {/* vista de notas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notas.map((n) => (
            <div
              key={n.id}
              className="group bg-gradient-to-br from-yellow-100 via-green-50 to-purple-100 p-5 rounded-2xl shadow-lg relative flex flex-col justify-between w-60 h-60 transform transition hover:scale-105"
            >
              <div className="overflow-y-auto flex-1 mb-2">
                <p className="text-gray-800 whitespace-pre-wrap break-words">{n.contenido}</p>
              </div>

              <div className="flex justify-center opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => eliminarNota(n.id)}
                  className="p-0 m-0 bg-transparent border-none"
                >
                  <span className="text-gray-700 hover:text-gray-900 font-bold text-lg select-none">
                    ✖
                  </span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
