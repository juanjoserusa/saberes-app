import { useEconomia } from "../../context/EconomiaContext";
import { useAlumnos } from "../../context/AlumnosContext";

export default function CardMetric({ filtros, title, color }) {
  const { calcularTotales, loading: loadingEconomia } = useEconomia();
  const { alumnos } = useAlumnos();

  if (loadingEconomia) {
    return (
      <div className={`rounded-xl shadow p-4 flex flex-col justify-between h-28 ${color}`}>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-3xl font-bold text-gray-400">Cargando...</p>
      </div>
    );
  }

  const { ingresos, gastos, beneficio } = calcularTotales(filtros.año, filtros.mes);

  const pagosAlumnos = alumnos.reduce((acc, alumno) => {
    alumno.pagos.forEach(pago => {
      const matchAño = !filtros.año || parseInt(pago.año) === parseInt(filtros.año);
      const matchMes = !filtros.mes || pago.mes.toLowerCase() === filtros.mes?.toLowerCase();
      if (matchAño && matchMes && pago.pagado) {
        acc += pago.cantidad;
      }
    });
    return acc;
  }, 0);

  const bgColors = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800"
  };

  let value = 0;
  const t = title.toLowerCase();
  if (t.includes("ingresos totales")) value = ingresos ?? 0;
  if (t.includes("pagos alumnos")) value = pagosAlumnos ?? 0;
  if (t.includes("gastos")) value = gastos ?? 0;
  if (t.includes("beneficio")) value = beneficio ?? 0;

  return (
    <div className={`rounded-xl shadow p-4 flex flex-col justify-between h-28 ${bgColors[color]}`}>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-3xl font-bold">€{value.toLocaleString()}</p>
    </div>
  );
}
