import { Line } from "react-chartjs-2";
import { useEconomia } from "../../context/EconomiaContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function GraficoIngresosGastos({ filtros }) {
  const { alumnos, ingresosGenerales, gastos, loading } = useEconomia();

  if (loading) {
    return <p className="text-center text-gray-500">Cargando gráfico...</p>;
  }

  const mesesOrdenados = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const ingresosPorMes = mesesOrdenados.map(mes => {
    let total = 0;

    alumnos.forEach(alumno => {
      alumno.pagos.forEach(pago => {
        const matchAño = !filtros.año || pago.año === parseInt(filtros.año);
        const matchMes = !filtros.mes || pago.mes.toLowerCase() === filtros.mes?.toLowerCase();
        if (matchAño && matchMes && pago.pagado && pago.mes === mes) {
          total += pago.cantidad;
        }
      });
    });

    ingresosGenerales.forEach(i => {
      const matchAño = !filtros.año || parseInt(i.año) === parseInt(filtros.año);
      const matchMes = !filtros.mes || i.mes.toLowerCase() === filtros.mes?.toLowerCase();
      if (matchAño && matchMes && i.mes === mes) {
        total += i.cantidad;
      }
    });

    return total;
  });

  const gastosPorMes = mesesOrdenados.map(mes =>
    gastos
      .filter(g => {
        const matchAño = !filtros.año || parseInt(g.año) === parseInt(filtros.año);
        const matchMes = !filtros.mes || g.mes.toLowerCase() === filtros.mes?.toLowerCase();
        return matchAño && matchMes && g.mes === mes;
      })
      .reduce((acc, curr) => acc + curr.cantidad, 0)
  );

  const data = {
    labels: mesesOrdenados,
    datasets: [
      {
        label: "Ingresos (€)",
        data: ingresosPorMes,
        borderColor: "#28B463",
        backgroundColor: "#28B463",
        tension: 0.3,
        fill: false
      },
      {
        label: "Gastos (€)",
        data: gastosPorMes,
        borderColor: "#E74C3C",
        backgroundColor: "#E74C3C",
        tension: 0.3,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        bodyFont: { size: 14 },
        titleFont: { size: 16 },
        mode: "index",
        intersect: false
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Ingresos y Gastos Mensuales</h3>
      <div className="flex-1">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
