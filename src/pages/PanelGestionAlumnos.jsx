import { Link } from "react-router-dom";
import CalendarioGeneralAlumnos from "../components/CalendarioGeneralAlumnos";

export default function PanelGestionAlumnos() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">👩‍🎓 Gestión de Alumnos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/add-alumno"
          className="bg-primary text-white py-6 px-4 rounded-lg text-lg shadow hover:bg-secondary hover:text-black transition text-center"
        >
          Añadir Nuevo Alumno
        </Link>
        <Link
          to="/listado-alumnos"
          className="bg-primary text-white py-6 px-4 rounded-lg text-lg shadow hover:bg-secondary hover:text-black transition text-center"
        >
          Ver Listado de Alumnos
        </Link>
      </div>
      <div className="bg-white shadow rounded-xl p-4 mt-6">
        <CalendarioGeneralAlumnos />
      </div>
    </div>
  );
}
