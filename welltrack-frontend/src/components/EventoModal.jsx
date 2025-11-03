import { useState, useEffect } from "react";

const etiquetasDisponibles = ["evento", "tarea", "trabajo", "cumpleaños", "personal"];

export default function EventoModal({ token, evento, onClose, onGuardar, diaSeleccionado }) {
  const [titulo, setTitulo] = useState(evento?.title || "");
  const [descripcion, setDescripcion] = useState(evento?.extendedProps?.descripcion || "");
  const [fechaInicio, setFechaInicio] = useState(evento?.start || "");
  const [horaInicio, setHoraInicio] = useState(evento?.start ? evento.start.slice(11,16) : "09:00");
  const [fechaFin, setFechaFin] = useState(evento?.end || "");
  const [horaFin, setHoraFin] = useState(evento?.end ? evento.end.slice(11,16) : "10:00");
  const [etiqueta, setEtiqueta] = useState(evento?.extendedProps?.etiqueta || etiquetasDisponibles[0]);

  // Si se abre desde un día del calendario
  useEffect(() => {
    if (diaSeleccionado) {
      const diaStr = diaSeleccionado.toISOString().slice(0,10); // yyyy-mm-dd
      setFechaInicio(diaStr);
      setHoraInicio("09:00");
      setFechaFin(diaStr);
      setHoraFin("10:00");
    }
  }, [diaSeleccionado]);

  const guardar = async () => {
    try {
      const inicioISO = `${fechaInicio}T${horaInicio}`;
      const finISO = `${fechaFin}T${horaFin}`;

      const metodo = evento?.id ? "PUT" : "POST";
      const url = evento?.id
        ? `http://127.0.0.1:8000/api/eventos/${evento.id}`
        : "http://127.0.0.1:8000/api/eventos";

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          fecha_inicio: inicioISO,
          fecha_fin: finISO,
          etiqueta
        }),
      });

      if (!res.ok) throw new Error("Error al guardar evento");
      const data = await res.json();
      onGuardar(data.evento);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar evento");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h3 className="text-xl font-bold mb-4">{evento?.id ? "Editar Evento" : "Nuevo Evento"}</h3>

        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="w-full mb-2 border rounded px-2 py-1"
        />

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          className="w-full mb-2 border rounded px-2 py-1"
        />

        {/* Fecha fija */}
        <label className="block text-gray-600 text-sm mb-1">Fecha inicio (fija)</label>
        <input
          type="date"
          value={fechaInicio}
          disabled
          className="w-full mb-2 border rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
        />

        {/* Hora inicio */}
        <label className="block text-gray-600 text-sm mb-1">Hora inicio</label>
        <input
          type="time"
          value={horaInicio}
          onChange={e => setHoraInicio(e.target.value)}
          className="w-full mb-2 border rounded px-2 py-1"
        />

        {/* Fecha y hora fin */}
        <label className="block text-gray-600 text-sm mb-1">Fecha fin</label>
        <input
          type="date"
          value={fechaFin}
          onChange={e => setFechaFin(e.target.value)}
          className="w-full mb-2 border rounded px-2 py-1"
        />

        <label className="block text-gray-600 text-sm mb-1">Hora fin</label>
        <input
          type="time"
          value={horaFin}
          onChange={e => setHoraFin(e.target.value)}
          className="w-full mb-4 border rounded px-2 py-1"
        />

        {/* Etiqueta */}
        <label className="block text-gray-600 text-sm mb-1">Etiqueta</label>
        <select
          value={etiqueta}
          onChange={e => setEtiqueta(e.target.value)}
          className="w-full mb-4 border rounded px-2 py-1"
        >
          {etiquetasDisponibles.map((et, i) => (
            <option key={i} value={et}>{et}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
          <button onClick={guardar} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Guardar</button>
        </div>
      </div>
    </div>
  );
}