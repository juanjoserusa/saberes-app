import { useAlumnos } from "../context/AlumnosContext";

export default function ResumenAlumnos() {
  const { alumnos } = useAlumnos();

  const total = alumnos.length;

  // Contamos alumnos por nivel
  const niveles = {
    Primaria: alumnos.filter(a => a.nivel === "Primaria").length,
    Secundaria: alumnos.filter(a => a.nivel === "Secundaria").length,
    Bachillerato: alumnos.filter(a => a.nivel === "Bachillerato").length,
    Extraescolares: alumnos.filter(a => a.nivel === "Extraescolares").length,
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 w-full max-w-3xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        👩‍🎓 Resumen de Alumnos
      </h2>

      {/* Total alumnos */}
      <div className="text-center mb-4">
        <p className="text-gray-500 text-sm">Total de alumnos</p>
        <p className="text-5xl font-bold text-primary">{total}</p>
      </div>

      {/* Distribución por niveles */}
      <div>
        <h3 className="text-md font-semibold text-gray-600 mb-2">
          📊 Distribución por Niveles
        </h3>
        <ul className="space-y-2 text-gray-700">
          {Object.entries(niveles).map(([nivel, count], idx) => (
            <li
              key={idx}
              className="flex justify-between px-4 py-2 bg-gray-50 rounded"
            >
              <span className="font-medium">{nivel}</span>
              <span className="font-bold text-primary">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
