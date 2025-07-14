import { useState } from "react";
import Swal from "sweetalert2";

export default function HorarioAlumno({ alumno, actualizarAlumno }) {
  const [nuevoTurno, setNuevoTurno] = useState({ dia: "", hora: "", asignatura: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoTurno(prev => ({ ...prev, [name]: value }));
  };

  const añadirTurno = () => {
    if (!nuevoTurno.dia || !nuevoTurno.hora || !nuevoTurno.asignatura) {
      Swal.fire("Error", "Rellena todos los campos", "error");
      return;
    }
    const actualizados = [...(alumno.horario || []), nuevoTurno];
    actualizarAlumno({ ...alumno, horario: actualizados });
    setNuevoTurno({ dia: "", hora: "", asignatura: "" });
    Swal.fire("Guardado", "Turno añadido correctamente", "success");
  };

  const eliminarTurno = (index) => {
    Swal.fire({
      title: "¿Eliminar turno?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const actualizados = alumno.horario.filter((_, i) => i !== index);
        actualizarAlumno({ ...alumno, horario: actualizados });
        Swal.fire("Eliminado", "Turno eliminado correctamente", "success");
      }
    });
  };

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  return (
    <div className="space-y-4 flex flex-col justify-between min-h-[500px]">
      {/* Formulario añadir turno */}
      <div className="flex flex-col md:flex-row gap-2 mt-5">
        <select
          name="dia"
          value={nuevoTurno.dia}
          onChange={handleInputChange}
          className="border rounded px-2 py-1 flex-1"
        >
          <option value="">Día</option>
          {dias.map((dia, i) => (
            <option key={i} value={dia}>{dia}</option>
          ))}
        </select>
        <input
    type="time"
    name="horaInicio"
    value={nuevoTurno.horaInicio || ""}
    onChange={e =>
      setNuevoTurno(prev => ({
        ...prev,
        hora: `${e.target.value}-${prev.horaFin || ""}`,
        horaInicio: e.target.value
      }))
    }
    className="border rounded px-2 py-1 flex-1"
  />

  {/* Hora fin */}
  <input
    type="time"
    name="horaFin"
    value={nuevoTurno.horaFin || ""}
    onChange={e =>
      setNuevoTurno(prev => ({
        ...prev,
        hora: `${prev.horaInicio || ""}-${e.target.value}`,
        horaFin: e.target.value
      }))
    }
    className="border rounded px-2 py-1 flex-1"
  />
        <select
          name="asignatura"
          value={nuevoTurno.asignatura}
          onChange={handleInputChange}
          className="border rounded px-2 py-1 flex-1"
        >
          <option value="">Asignatura</option>
          {alumno.asignaturas.map((asig, i) => (
            <option key={i} value={asig}>{asig}</option>
          ))}
        </select>
        </div>
        <button
          onClick={añadirTurno}
          className="bg-primary text-white px-4 py-1 rounded hover:bg-secondary hover:text-black transition"
        >
          Añadir
        </button>

      {/* Lista de turnos */}
      <div className="grid grid-cols-1 gap-2">
        {dias.map((dia, i) => (
          <div key={i} className="border rounded p-2">
            <h4 className="font-semibold text-primary mb-1">{dia}</h4>
            <div className="space-y-1">
              {alumno.horario?.filter(t => t.dia === dia).length > 0 ? (
                alumno.horario.filter(t => t.dia === dia).map((turno, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-100 rounded px-2 py-1 text-sm"
                  >
                    <span>{turno.hora} – {turno.asignatura}</span>
                    <button
                      onClick={() => eliminarTurno(
                        alumno.horario.findIndex(t =>
                          t.dia === dia && t.hora === turno.hora && t.asignatura === turno.asignatura
                        )
                      )}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Sin turnos asignados</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
