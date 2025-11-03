import { useEffect, useState } from "react";

export default function CalendarioEventos() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 🗓️ Calendario público de dprueba
    const calendarId = "en.argentina#holiday@group.v.calendar.google.com"; // feriados de Argentina 🇦🇷

    const url = `https://www.googleapis.com/calendar/ical/en.argentina%23holiday%40group.v.calendar.google.com/public/full?alt=json`;

    fetch("http://127.0.0.1:8000/api/eventos-google")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setEventos(data.items.slice(0, 6));
        }
      })
      .catch((err) => console.error("Error cargando eventos:", err))
      .finally(() => setCargando(false));
  }, []);

  return (
 <div className="bg-white rounded-3xl shadow-lg p-6 mt-8 border border-green-100">
  <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
    🗓️ Próximos eventos
  </h3>

  {cargando ? (
    <p className="text-gray-500 text-center">Cargando eventos...</p>
  ) : eventos.length === 0 ? (
    <p className="text-gray-500 text-center">No hay eventos próximos.</p>
  ) : (
    <ul className="space-y-3">
      {eventos.map((evento, index) => (
        <li
          key={index}
          className="bg-green-50 border border-green-100 rounded-xl p-3 hover:shadow-md transition"
        >
          <p className="font-semibold text-green-800 text-center">
            {evento.summary}
          </p>
          <p className="text-gray-600 text-sm text-center">
            📅{" "}
            {new Date(evento.start.date).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </li>
      ))}
    </ul>
  )}
</div>

  );
}
