import { Link } from "react-router-dom";

export default function PanelGestionEconomica() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">💰 Panel de Gestión Económica</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/gestion-movimientos"
          className="bg-primary text-white py-6 px-4 rounded-lg text-lg shadow hover:bg-secondary hover:text-black transition text-center"
        >
          Gestión de Movimientos
        </Link>
        <Link
          to="/resumen-economico"
          className="bg-primary text-white py-6 px-4 rounded-lg text-lg shadow hover:bg-secondary hover:text-black transition text-center"
        >
          Resumen Económico
        </Link>
       
      </div>
    </div>
  );
}
