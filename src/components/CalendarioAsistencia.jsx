import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar-custom.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";

export default function CalendarioAsistencia({ alumno, actualizarAlumno }) {
  const [temporal, setTemporal] = useState(alumno.asistencia || []);

  const hayCambiosPendientes =
    JSON.stringify(temporal.sort()) !== JSON.stringify((alumno.asistencia || []).sort());

  const toggleFecha = (fecha) => {
    const fechaStr = dayjs(fecha).format("YYYY-MM-DD");
    setTemporal((prev) =>
      prev.includes(fechaStr)
        ? prev.filter((f) => f !== fechaStr)
        : [...prev, fechaStr]
    );
  };

  const handleGuardar = () => {
    const actualizado = { ...alumno, asistencia: temporal };
    actualizarAlumno(actualizado);
    Swal.fire("Guardado", "Asistencia actualizada correctamente", "success");
  };

  const getClassForTile = ({ date }) => {
    const fechaStr = dayjs(date).format("YYYY-MM-DD");
    const estaGuardado = alumno.asistencia?.includes(fechaStr);
    const estaSeleccionado = temporal.includes(fechaStr);

    if (estaGuardado && estaSeleccionado) return "highlight-day";
    if (!estaGuardado && estaSeleccionado) return "pending-day";
    return null;
  };

  return (
    <div className="space-y-4">
      <Calendar onClickDay={toggleFecha} tileClassName={getClassForTile} />
      <div className="flex items-center gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-300 rounded-full inline-block"></span>
          <span>Guardado</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded-full inline-block"></span>
          <span>Pendiente de guardar</span>
        </div>
      </div>
      <button
        onClick={handleGuardar}
        disabled={!hayCambiosPendientes}
        className={`w-full px-4 py-2 rounded transition ${
          hayCambiosPendientes
            ? "bg-primary text-white hover:bg-secondary hover:text-black"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Guardar cambios
      </button>
    </div>
  );
}
