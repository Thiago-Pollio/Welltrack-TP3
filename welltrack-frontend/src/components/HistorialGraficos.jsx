// src/components/HistorialGraficos.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function HistorialGraficos({ historial }) {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    if (!historial || historial.length === 0) return;

    const hoy = new Date();
    const ultimos7 = historial
      .filter(r => {
        const fecha = new Date(r.fecha);
        const diff = (hoy - fecha) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      })
      .slice(-7)
      .map(r => ({
        fecha: new Date(r.fecha).toLocaleDateString("es-AR"),
        sueño: r.horasSueño || 0,
        agua: r.aguaTomada || 0,
        estres: r.estresNivel || 5,
      }));

    setDatos(ultimos7);
  }, [historial]);

  if (!datos || datos.length === 0)
    return <p className="text-center text-gray-500">No hay registros para mostrar gráficos.</p>;

  return (
    <div className="space-y-8 mt-6">
      {/* Gráfico de Sueño */}
      <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-center">Horas de Sueño 🛌</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={datos} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sueño" fill="#FACC15" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Agua */}
      <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-center">Agua 💧</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={datos} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="agua" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Estrés */}
      <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-center">Estrés 😓</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={datos} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="estres" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
