import { useState } from "react";
import CardMetric from "../components/economia/CardMetric";
import GraficoIngresosGastos from "../components/economia/GraficoIngresosGastos";
import GraficoDistribucionGastos from "../components/economia/GraficoDistribucionGastos";
import TablaPagos from "../components/economia/TablaPagos";

export default function ResumenEconomico() {
  const [añoSeleccionado, setAñoSeleccionado] = useState("Histórico");
  const [mesSeleccionado, setMesSeleccionado] = useState("Todos");

  const años = ["Histórico", "2025", "2026"];
  const meses = ["Todos", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const filtros = {
    año: añoSeleccionado === "Histórico" ? null : parseInt(añoSeleccionado),
    mes: mesSeleccionado !== "Todos" ? mesSeleccionado : null
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">📊 Resumen Económico</h1>
        <div className="flex gap-3">
          <select
            value={añoSeleccionado}
            onChange={(e) => setAñoSeleccionado(e.target.value)}
            className="border rounded px-3 py-2 shadow"
          >
            {años.map((año) => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="border rounded px-3 py-2 shadow"
            disabled={añoSeleccionado === "Histórico"}
          >
            {meses.map((mes) => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardMetric filtros={filtros} title="Ingresos Totales" color="green" />
        <CardMetric filtros={filtros} title="Pagos Alumnos" color="yellow" />
        <CardMetric filtros={filtros} title="Gastos Totales" color="red" />
        <CardMetric filtros={filtros} title="Beneficio Neto" color="blue" />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4 h-[430px]">
          <GraficoIngresosGastos filtros={filtros} />
        </div>
        <div className="bg-white rounded-xl shadow p-4 h-[430px]">
          <GraficoDistribucionGastos filtros={filtros} />
        </div>
      </div>

      {/* Tabla pagos */}
      <TablaPagos filtros={filtros} />
    </div>
  );
}
