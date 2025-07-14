import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar-custom.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";

export default function CalendarioExamenes({ alumno, actualizarAlumno }) {
  const [temporal, setTemporal] = useState(alumno.examenes || []);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");

  const hayCambiosPendientes =
    JSON.stringify(temporal.sort((a, b) => a.fecha.localeCompare(b.fecha))) !==
    JSON.stringify((alumno.examenes || []).sort((a, b) => a.fecha.localeCompare(b.fecha)));

  const toggleFecha = (fecha) => {
    const fechaStr = dayjs(fecha).format("YYYY-MM-DD");

    // Si ya está seleccionada esa fecha → quitar
    if (temporal.some(e => e.fecha === fechaStr)) {
      setTemporal(prev => prev.filter(e => e.fecha !== fechaStr));
    } else {
      if (!asignaturaSeleccionada) {
        Swal.fire("Atención", "Debes seleccionar una asignatura antes de añadir un examen", "warning");
        return;
      }
      setTemporal(prev => [...prev, { fecha: fechaStr, asignatura: asignaturaSeleccionada }]);
    }
  };

  const handleGuardar = () => {
    const actualizado = { ...alumno, examenes: temporal };
    actualizarAlumno(actualizado);
    Swal.fire("Guardado", "Exámenes actualizados correctamente", "success");
  };

  const getClassForTile = ({ date }) => {
    const fechaStr = dayjs(date).format("YYYY-MM-DD");
    const guardado = alumno.examenes?.some(e => e.fecha === fechaStr);
    const temporalSeleccionado = temporal.some(e => e.fecha === fechaStr);

    if (guardado && temporalSeleccionado) return "highlight-day";
    if (!guardado && temporalSeleccionado) return "pending-day";
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Selector de asignatura */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Asignatura seleccionada:</label>
        <select
          value={asignaturaSeleccionada}
          onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">-- Selecciona una asignatura --</option>
          {alumno.asignaturas?.map((asig, i) => (
            <option key={i} value={asig}>{asig}</option>
          ))}
        </select>
      </div>

      <Calendar onClickDay={toggleFecha} tileClassName={getClassForTile} />

      {/* Leyenda */}
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
