// src/pages/RegistroDiario.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import HistorialGraficos from "../components/HistorialGraficos";

export default function RegistroDiario() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

  const [estadoAnimo, setEstadoAnimo] = useState([]);
  const [mente, setMente] = useState([]);
  const [energia, setEnergia] = useState([]);
  const [sueno, setSueno] = useState(0);
  const [vidaSocial, setVidaSocial] = useState([]);
  const [aguaTomada, setAguaTomada] = useState(0);
  const [estresNivel, setEstresNivel] = useState(5);
  const [notaOpcional, setNotaOpcional] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [ultimaFecha, setUltimaFecha] = useState(null);
  const [registroOriginal, setRegistroOriginal] = useState(null);
  const [historial, setHistorial] = useState([]);

  const opciones = {
    estadoAnimo: [
      { emoji: "😊", texto: "Feliz" },
      { emoji: "🙂", texto: "Bien" },
      { emoji: "😐", texto: "Indiferente" },
      { emoji: "😢", texto: "Triste" },
      { emoji: "😠", texto: "Enojo" },
      { emoji: "😰", texto: "Ansiedad" },
      { emoji: "😴", texto: "Apática" },
      { emoji: "🤔", texto: "Insegura" },
      { emoji: "😒", texto: "Irritable" },
      { emoji: "😌", texto: "Seguridad" },
      { emoji: "🤩", texto: "Entusiasmo" },
      { emoji: "😔", texto: "Sensible" },
    ],
    mente: [
      { emoji: "💭", texto: "Tranquilidad" },
      { emoji: "😵‍💫", texto: "Niebla mental" },
      { emoji: "🧘‍♀️", texto: "Concentración" },
      { emoji: "😩", texto: "Estrés" },
      { emoji: "🎨", texto: "Creatividad" },
      { emoji: "🚫", texto: "Sin motivación" },
      { emoji: "⚡", texto: "Motivación" },
      { emoji: "💤", texto: "Poca memoria" },
      { emoji: "😶‍🌫️", texto: "Distracción" },
    ],
    energia: [
      { emoji: "😫", texto: "Agotamiento" },
      { emoji: "😴", texto: "Cansancio" },
      { emoji: "🙂", texto: "Ok" },
      { emoji: "⚡", texto: "Vitalidad" },
      { emoji: "🔥", texto: "Alto rendimiento" },
    ],
    vidaSocial: [
      { emoji: "🗣️", texto: "Sociable" },
      { emoji: "🤝", texto: "Apoyo" },
      { emoji: "🤐", texto: "Introversión" },
      { emoji: "💢", texto: "Conflicto" },
    ],
  };

  const toggleSeleccion = (valor, setValor, listaActual) => {
    if (listaActual.includes(valor)) {
      setValor(listaActual.filter((v) => v !== valor));
    } else {
      setValor([...listaActual, valor]);
    }
  };

  useEffect(() => {
    if (estadoAnimo.includes("Triste") || estadoAnimo.includes("Ansiedad") || estadoAnimo.includes("Enojo")) {
      setEstresNivel(8);
    } else if (estadoAnimo.includes("Indiferente") || estadoAnimo.includes("Irritable")) {
      setEstresNivel(6);
    } else if (estadoAnimo.includes("Feliz") || estadoAnimo.includes("Bien") || estadoAnimo.includes("Seguridad") || estadoAnimo.includes("Entusiasmo")) {
      setEstresNivel(3);
    } else {
      setEstresNivel(5);
    }
  }, [estadoAnimo]);

  // Cargar último registro e historial
  useEffect(() => {
    if (!token) return;

    const fetchUltimo = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/registro-diario/ultimo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.registro) {
          const r = data.registro;
          const nuevoRegistro = {
            estadoAnimo: r.estadoAnimo ? (Array.isArray(r.estadoAnimo) ? r.estadoAnimo : r.estadoAnimo.split(",")) : [],
            mente: r.mente ? (Array.isArray(r.mente) ? r.mente : r.mente.split(",")) : [],
            energiaNivel: r.energiaNivel ? (Array.isArray(r.energiaNivel) ? r.energiaNivel : r.energiaNivel.split(",")) : [],
            horasSueño: r.horasSueño || 0,
            vidaSocial: r.vidaSocial ? (Array.isArray(r.vidaSocial) ? r.vidaSocial : r.vidaSocial.split(",")) : [],
            aguaTomada: r.aguaTomada || 0,
            estresNivel: r.estresNivel || 5,
            notaOpcional: r.notaOpcional || "",
          };
          setEstadoAnimo(nuevoRegistro.estadoAnimo);
          setMente(nuevoRegistro.mente);
          setEnergia(nuevoRegistro.energiaNivel);
          setSueno(nuevoRegistro.horasSueño);
          setVidaSocial(nuevoRegistro.vidaSocial);
          setAguaTomada(nuevoRegistro.aguaTomada);
          setEstresNivel(nuevoRegistro.estresNivel);
          setNotaOpcional(nuevoRegistro.notaOpcional);
          setUltimaFecha(r.fecha);
          setRegistroOriginal({ ...nuevoRegistro });
        }
      } catch (err) {
        console.error("Error al cargar último registro:", err);
      }
    };

    const fetchHistorial = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/registro-diario", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.registros) setHistorial(data.registros);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      }
    };

    fetchUltimo();
    fetchHistorial();
  }, [token]);

  // Comprobar cambios
  const hayCambios = () => {
    if (!registroOriginal) return true;

    const originalEstado = Array.isArray(registroOriginal.estadoAnimo)
      ? registroOriginal.estadoAnimo
      : (registroOriginal.estadoAnimo ? registroOriginal.estadoAnimo.split(",") : []);
    const originalMente = Array.isArray(registroOriginal.mente)
      ? registroOriginal.mente
      : (registroOriginal.mente ? registroOriginal.mente.split(",") : []);
    const originalEnergia = Array.isArray(registroOriginal.energiaNivel)
      ? registroOriginal.energiaNivel
      : (registroOriginal.energiaNivel ? registroOriginal.energiaNivel.split(",") : []);
    const originalVida = Array.isArray(registroOriginal.vidaSocial)
      ? registroOriginal.vidaSocial
      : (registroOriginal.vidaSocial ? registroOriginal.vidaSocial.split(",") : []);

    return (
      originalEstado.join(",") !== estadoAnimo.join(",") ||
      originalMente.join(",") !== mente.join(",") ||
      originalEnergia.join(",") !== energia.join(",") ||
      sueno !== (registroOriginal.horasSueño || 0) ||
      originalVida.join(",") !== vidaSocial.join(",") ||
      aguaTomada !== (registroOriginal.aguaTomada || 0) ||
      estresNivel !== (registroOriginal.estresNivel || 5) ||
      notaOpcional !== (registroOriginal.notaOpcional || "")
    );
  };

  const handleGuardar = async () => {
    if (!token || !hayCambios()) return;

    const registro = {
      fecha: new Date().toISOString().split("T")[0],
      estadoAnimo: estadoAnimo.join(","),
      mente: mente.join(","),
      energiaNivel: energia.join(","),
      horasSueño: sueno,
      vidaSocial: vidaSocial.join(","),
      aguaTomada,
      estresNivel,
      notaOpcional,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/registro-diario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registro),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.mensaje || "Error al guardar el registro");
        return;
      }

      const data = await res.json();
      setGuardado(true);
      setUltimaFecha(registro.fecha);
      setRegistroOriginal({ ...registro });
      setHistorial([registro, ...historial.filter(r => r.fecha !== registro.fecha)]);
      setTimeout(() => setGuardado(false), 1500);

    } catch (err) {
      console.error("Error al guardar registro:", err);
    }
  };

  const renderOpciones = (tipo, valores, setValores) => (
    <div className="flex flex-wrap gap-2">
      {opciones[tipo].map((op, index) => (
        <button
          key={index}
          type="button"
          onClick={() => toggleSeleccion(op.texto, setValores, valores)}
          className={`flex flex-col items-center p-2 rounded-lg border transition select-none ${
            valores.includes(op.texto)
              ? "bg-green-300 border-green-500"
              : "bg-white border-gray-300 hover:bg-green-100"
          }`}
        >
          <span className="text-2xl">{op.emoji}</span>
          <span className="text-sm">{op.texto}</span>
        </button>
      ))}
    </div>
  );

  const formatoFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Registro Diario 🧠
        </h2>

        {ultimaFecha && (
          <p className="text-sm text-gray-500 text-center mb-4">
            Último registro: {formatoFecha(ultimaFecha)}
          </p>
        )}

        {/* Barra de estrés */}
        <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-md transition-all flex flex-col items-center">
          <p className="font-semibold text-gray-700 mb-2 text-center">
            ¿Qué tanto estrés tengo hoy? 😓
          </p>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-red-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(estresNivel / 10) * 100}%` }}
            />
          </div>
          <span className="mt-1 text-gray-600 font-medium">{estresNivel}/10</span>
        </div>

        {/* Estado de ánimo */}
        <div>
          <p className="font-semibold text-gray-600 mb-1">Estado de ánimo</p>
          {renderOpciones("estadoAnimo", estadoAnimo, setEstadoAnimo)}
        </div>

        {/* Mente */}
        <div>
          <p className="font-semibold text-gray-600 mb-1">Mente</p>
          {renderOpciones("mente", mente, setMente)}
        </div>

        {/* Energía */}
        <div>
          <p className="font-semibold text-gray-600 mb-1">Nivel de energía</p>
          {renderOpciones("energia", energia, setEnergia)}
        </div>

        {/* Horas de sueño */}
        <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-md flex flex-col items-center transition-all">
          <p className="font-semibold text-gray-700 mb-3 text-center">Horas de sueño 🌙</p>
          <div className="flex gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                  sueno > i ? "bg-yellow-400" : "bg-gray-200"
                }`}
                onClick={() => setSueno(i + 1)}
              />
            ))}
          </div>
          <span className="mt-2 text-gray-600 font-medium">{sueno} h</span>
        </div>

        {/* Agua */}
        <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-md transition-all">
          <p className="font-semibold text-gray-700 mb-3 text-center">Agua 💧</p>
          <div className="flex justify-center gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-5 h-8 rounded-t-full transition-all duration-300 ${
                  aguaTomada >= (i + 1) * 100 ? "bg-blue-400" : "bg-gray-200"
                }`}
                onClick={() => setAguaTomada((i + 1) * 100)}
              />
            ))}
          </div>
          <div className="text-center text-gray-500 mt-1">{aguaTomada} ml</div>
        </div>

        {/* Vida social */}
        <div>
          <p className="font-semibold text-gray-600 mb-1">Vida social</p>
          {renderOpciones("vidaSocial", vidaSocial, setVidaSocial)}
        </div>

        {/* Nota opcional */}
        <div>
          <p className="font-semibold text-gray-600 mb-1">Nota opcional</p>
          <textarea
            value={notaOpcional}
            onChange={(e) => setNotaOpcional(e.target.value)}
            placeholder="Escribe algo extra..."
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
            rows={3}
          />
        </div>

        {/* Botón Guardar */}
        <button
          type="button"
          onClick={handleGuardar}
          disabled={!hayCambios()}
          className={`w-full mt-2 px-4 py-2 rounded-lg text-white transition ${
            hayCambios() ? "bg-green-400 hover:bg-green-500" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Guardar
        </button>

        {guardado && (
          <p className="text-green-600 font-semibold mt-3 text-center">
            ✅ ¡Registro guardado correctamente!
          </p>
        )}

        {/* Historial */}
        {historial.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Historial de registros</h3>
            <ul className="space-y-3 max-h-72 overflow-y-auto">
              {historial.map((r, i) => {
                const isHoy = r.fecha === new Date().toISOString().split("T")[0];
                const estadoAnimoArray = Array.isArray(r.estadoAnimo) ? r.estadoAnimo : (r.estadoAnimo || "").split(",");
                const menteArray = Array.isArray(r.mente) ? r.mente : (r.mente || "").split(",");
                const energiaArray = Array.isArray(r.energiaNivel) ? r.energiaNivel : (r.energiaNivel || "").split(",");
                const vidaSocialArray = Array.isArray(r.vidaSocial) ? r.vidaSocial : (r.vidaSocial || "").split(",");

                return (
                  <li
                    key={i}
                    className={`p-4 rounded-2xl shadow-md transition flex flex-col sm:flex-row sm:justify-between gap-2 ${
                      isHoy
                        ? "bg-green-100 border-2 border-green-400"
                        : "bg-white/80 dark:bg-gray-800/80"
                    }`}
                  >
                    <span className="font-semibold text-gray-700">{formatoFecha(r.fecha)}</span>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <span>Ánimo: {estadoAnimoArray.join(", ")}</span>
                      <span>Mente: {menteArray.join(", ")}</span>
                      <span>Energía: {energiaArray.join(", ")}</span>
                      <span>Social: {vidaSocialArray.join(", ")}</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Historial de gráficos */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Gráficos de historial</h3>
              <HistorialGraficos historial={historial} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}