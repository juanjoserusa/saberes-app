import { useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { useEconomia } from "../../context/EconomiaContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficoDistribucionGastos({ filtros }) {
  const { gastos, loading } = useEconomia();
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [filtros]);

  const gastosFiltrados = gastos.filter(g => {
    const matchAño = !filtros.año || parseInt(g.año) === parseInt(filtros.año);
    const matchMes = !filtros.mes || g.mes.toLowerCase() === filtros.mes?.toLowerCase();
    return matchAño && matchMes;
  });

  const categoriasUnicas = [...new Set(gastosFiltrados.map(g => g.categoria))];

  const data = {
    labels: categoriasUnicas,
    datasets: [{
      data: categoriasUnicas.map(cat =>
        gastosFiltrados
          .filter(g => g.categoria === cat)
          .reduce((acc, curr) => acc + curr.cantidad, 0)
      ),
      backgroundColor: [
        "#3498DB", "#1ABC9C", "#9B59B6", "#F1C40F", "#E67E22", "#E74C3C"
      ],
      hoverOffset: 10
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      tooltip: {
        bodyFont: { size: 14 },
        titleFont: { size: 16 },
        mode: "index",
        intersect: false
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Distribución de Gastos</h3>
      <div className="flex-1 flex items-center justify-center">
        {loading ? (
          <p className="text-gray-500">Cargando gráfico...</p>
        ) : gastosFiltrados.length > 0 ? (
          <div className="w-full h-full">
            <Doughnut
              ref={chartRef}
              data={data}
              options={{
                ...options,
                maintainAspectRatio: false
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500">No hay datos para mostrar.</p>
        )}
      </div>
    </div>
  );
}
