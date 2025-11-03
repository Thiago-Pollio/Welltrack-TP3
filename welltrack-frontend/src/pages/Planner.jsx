import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PanelNotas from "../components/PanelNotas";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventoModal from "../components/EventoModal";
import CalendarioEventos from "../components/CalendarioEventos";

export default function Planner() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [modalEvento, setModalEvento] = useState({
    abierto: false,
    evento: null,
  });

  // ==================== CARGAR SESIÓN DEL BACKEND =====================
  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioActual");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // ==================== CARGAR EVENTOS DEL USUARIO ====================
  useEffect(() => {
    if (!token) return;

    const fetchEventos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/eventos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar eventos");
        const data = await res.json();
        setEventos(
          data.map((e) => ({
            id: e.id,
            title: e.titulo,
            start: e.fecha_inicio,
            end: e.fecha_fin,
            extendedProps: {
              descripcion: e.descripcion,
              etiqueta: e.etiqueta,
            },
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchEventos();
  }, [token]);

  const abrirModal = (evento = null, diaSeleccionado = null) =>
    setModalEvento({ abierto: true, evento, diaSeleccionado });

  const cerrarModal = () => setModalEvento({ abierto: false, evento: null });

  const guardarEvento = (evento) => {
    // Después de guardar en backend, recargar eventos
    setEventos((prev) => {
      const sinEl = prev.filter((e) => e.id !== evento.id);
      return [
        ...sinEl,
        {
          id: evento.id,
          title: evento.titulo,
          start: evento.fecha_inicio,
          end: evento.fecha_fin,
          extendedProps: {
            descripcion: evento.descripcion,
            etiqueta: evento.etiqueta,
          },
        },
      ];
    });
  };

  if (!usuario || !token) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-gray-600 text-center">
          <h2 className="text-3xl font-semibold mb-2 text-green-700">
            Debes iniciar sesión
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PanelNotas
        abierto={panelAbierto}
        usuario={usuario}
        token={token}
        onToggle={() => setPanelAbierto(!panelAbierto)}
      />

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
          Planner 📅
        </h2>

        {/* === Sección principal: calendario + API externa === */}
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* Calendario principal */}
          <div className="flex-1 bg-white shadow-lg rounded-3xl p-6 border border-green-100 text-green-800">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={eventos}
              height="auto"
              selectable={true}
              eventClick={(info) =>
                abrirModal(
                  eventos.find((e) => e.id === parseInt(info.event.id))
                )
              }
              select={(selectionInfo) =>
                abrirModal({
                  start: selectionInfo.startStr,
                  end: selectionInfo.endStr,
                  diaSeleccionado: selectionInfo.start,
                })
              }
              contentHeight="auto"
              eventTextColor="#166534"
              eventBackgroundColor="#dcfce7"
              eventBorderColor="#86efac"
            />
          </div>

          {/* Tarjeta con eventos externos (API Google Calendar) */}
          <div className="w-full lg:w-1/3">
            <CalendarioEventos />
          </div>
        </div>
      </div>

      {modalEvento.abierto && (
        <EventoModal
          token={token}
          evento={modalEvento.evento}
          diaSeleccionado={modalEvento.diaSeleccionado}
          onClose={cerrarModal}
          onGuardar={guardarEvento}
        />
      )}
    </Layout>
  );
}
