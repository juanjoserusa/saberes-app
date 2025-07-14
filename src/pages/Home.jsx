import { useEffect } from "react";
import ResumenAlumnos from "../components/ResumenAlumnos";
import ResumenEconomico from "../components/ResumenEconomico";
import ResumenPendientes from "../components/ResumenPendientes";
import { useEconomia } from "../context/EconomiaContext";
import { useAlumnos } from "../context/AlumnosContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { refrescarDatos: refrescarEconomia } = useEconomia();
  const { refrescarDatos: refrescarAlumnos } = useAlumnos();

  useEffect(() => {
    refrescarEconomia();
    refrescarAlumnos();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 bg-gray-50 px-4 py-4">
      {/* 🏷️ Título */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center">
        Saberes - Panel Principal
      </h1>

      {/* 📊 Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        <ResumenAlumnos />
        <ResumenEconomico />
        <ResumenPendientes />
      </div>

      {/* 🚀 Botones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mt-4">
        <Link
          to="/panel-alumnos"
          className="bg-primary text-white py-5 px-6 rounded-xl text-lg shadow hover:bg-secondary hover:text-black transition text-center"
        >
          Gestión de Alumnos
        </Link>
        <Link
          to="/panel-economico"
          className="bg-primary text-white py-5 px-6 rounded-xl text-lg shadow hover:bg-secondary hover:text-black transition text-center"
        >
          Gestión Económica
        </Link>
      </div>
    </div>
  );
}
 