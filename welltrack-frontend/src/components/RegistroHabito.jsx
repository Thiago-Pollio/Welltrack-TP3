import { useState, useEffect } from "react";

export default function RegistroHabito({ onClose }) {
  const [habitos, setHabitos] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHabitos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/habitos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setHabitos(data.registros || []);
      } catch (err) {
        console.error("Error al cargar hábitos:", err);
      }
    };
    fetchHabitos();
  }, [token]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white p-6 rounded-2xl w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">✖</button>
        <h2 className="text-xl font-bold mb-4">Mis Hábitos</h2>
        {habitos.length === 0 ? (
          <p className="text-gray-500">No hay hábitos aún...</p>
        ) : (
          <ul className="flex flex-col gap-2 max-h-80 overflow-auto">
            {habitos.map((h) => (
              <li key={h.idHabito} className="p-2 border rounded hover:bg-gray-50 transition">
                {h.nombre} - {h.frecuencia} {h.meta ? `(${h.meta} ${h.unidad})` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
