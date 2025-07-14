import { useParams } from "react-router-dom";
import { useAlumnos } from "../context/AlumnosContext";
import { useEffect, useState } from "react";
import CalendarioAsistencia from "../components/CalendarioAsistencia";
import CalendarioExamenes from "../components/CalendarioExamenes";
import HistorialExamenes from "../components/HistorialExamenes";
import InformacionRelevante from "../components/InformacionRelevante";
import NotasInternas from "../components/NotasInternas";
import CalificacionesAlumno from "../components/CalificacionesAlumno";
import HorarioAlumno from "../components/HorarioAlumno";
import "../styles/calendar-custom.css";
import EncabezadoAlumno from "../components/EncabezadoAlumno";

export default function DetalleAlumno() {
  const { id } = useParams();
  const { alumnos, actualizarAlumno } = useAlumnos();
  const [alumno, setAlumno] = useState(null);

  useEffect(() => {
    const encontrado = alumnos.find((a) => a.id.toString() === id.toString());
    if (encontrado) {
      setAlumno(encontrado);
    }
  }, [id, alumnos]);

  const actualizarAlumnoLocal = (actualizado) => {
    actualizarAlumno(actualizado); // usa el del contexto
    setAlumno(actualizado);        // actualiza el estado local
  };

  if (!alumno) return <p className="p-6">Cargando datos del alumno...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Encabezado */}
      <EncabezadoAlumno alumno={alumno} />

      {/* Fila 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded-xl flex flex-col justify-between min-h-[460px]">
          <h3 className="font-bold text-lg mb-2">📅 Asistencia</h3>
          <CalendarioAsistencia
            alumno={alumno}
            actualizarAlumno={actualizarAlumnoLocal}
          />
        </div>

        <div className="bg-white p-4 shadow rounded-xl flex flex-col justify-between min-h-[460px]">
          <h3 className="font-bold text-lg mb-2">📝 Próximos exámenes</h3>
          <CalendarioExamenes
            alumno={alumno}
            actualizarAlumno={actualizarAlumnoLocal}
          />
        </div>

        <div className="bg-white p-4 shadow rounded-xl flex flex-col min-h-[460px]">
          <h3 className="font-bold text-lg mb-2">📚 Historial de exámenes</h3>
          <HistorialExamenes examenes={alumno.examenes || []} />
        </div>
      </div>

    {/* Fila 2 */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="bg-white p-4 shadow rounded-xl">
    <h3 className="font-bold text-lg mb-2">📊 Calificaciones por asignatura</h3>
    <CalificacionesAlumno alumno={alumno} actualizarAlumno={actualizarAlumno} />
  </div>

  <div className="bg-white p-4 shadow rounded-xl flex flex-col min-h-[460px]">
    <h3 className="font-bold text-lg mb-2">⏰ Horario en la academia</h3>
    <HorarioAlumno alumno={alumno} actualizarAlumno={actualizarAlumno} />
  </div>
</div>

      {/* Fila 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="bg-white p-4 shadow rounded-xl flex flex-col justify-between min-h-[250px]">
    <InformacionRelevante alumno={alumno} actualizarAlumno={actualizarAlumno} />
  </div>

  <div className="bg-white p-4 shadow rounded-xl flex flex-col justify-between min-h-[250px]">
    <NotasInternas alumno={alumno} actualizarAlumno={actualizarAlumno} />
  </div>
</div>
    </div>
  );
}
