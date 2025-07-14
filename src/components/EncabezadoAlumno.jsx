export default function EncabezadoAlumno({ alumno }) {
  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary text-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Info principal */}
      <div>
        <h2 className="text-3xl font-extrabold">
          {alumno.nombre} {alumno.apellidos}
        </h2>
        <p className="text-white/80 mt-1 text-base">
          {alumno.nivel}
          {alumno.ramaBach ? ` – ${alumno.ramaBach}` : ""}, Curso {alumno.curso}
        </p>
      </div>

      {/* Info secundaria */}
      <div className="bg-white text-gray-800 rounded-lg shadow px-4 py-2">
        <p className="text-sm">
          <strong>Responsable:</strong> {alumno.responsableNombre} ({alumno.responsableRol})
        </p>
        <p className="text-sm">
          <strong>Teléfono:</strong> {alumno.telefono}
        </p>
      </div>
    </div>
  );
}
