import { useEconomia } from "../context/EconomiaContext";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

export default function ResumenEconomico() {
  const { alumnos, ingresosGenerales, gastos } = useEconomia();

  // 📆 Mes y año actual
  const mesActual = dayjs().format("MMMM");
  const añoActual = dayjs().year();

  // 🧮 Totales globales
  let pagosTotal = 0;
  let ingresosTotal = 0;
  let gastosTotal = 0;

  alumnos.forEach(alumno => {
    alumno.pagos.forEach(pago => {
      if (pago.pagado) pagosTotal += pago.cantidad;
    });
  });

  ingresosGenerales.forEach(i => {
    ingresosTotal += i.cantidad;
  });

  ingresosTotal += pagosTotal; // Suma de pagos + ingresos
  gastos.forEach(g => {
    gastosTotal += g.cantidad;
  });

  const beneficioTotal = ingresosTotal - gastosTotal;

  // 🧮 Totales del mes actual
  let pagosMes = 0;
  let ingresosMes = 0;
  let gastosMes = 0;

  alumnos.forEach(alumno => {
    alumno.pagos.forEach(pago => {
      if (
        pago.pagado &&
        pago.año === añoActual &&
        pago.mes.toLowerCase() === mesActual.toLowerCase()
      ) {
        pagosMes += pago.cantidad;
      }
    });
  });

  ingresosGenerales.forEach(i => {
    if (
      parseInt(i.año) === añoActual &&
      i.mes.toLowerCase() === mesActual.toLowerCase()
    ) {
      ingresosMes += i.cantidad;
    }
  });

  ingresosMes += pagosMes; // Suma de pagos + ingresos
  gastos.forEach(g => {
    if (
      parseInt(g.año) === añoActual &&
      g.mes.toLowerCase() === mesActual.toLowerCase()
    ) {
      gastosMes += g.cantidad;
    }
  });

  const beneficioMes = ingresosMes - gastosMes;

  return (
    <div className="bg-white shadow rounded-xl p-6 w-full h-full flex flex-col justify-between">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
        Resumen Económico
      </h2>

      {/* 📊 Histórico Total */}
      <div className="mb-6">
        <h3 className="text-md font-bold text-gray-600 mb-2">Histórico Total</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Pagos</p>
            <p className="text-lg font-bold text-green-600">{pagosTotal}€</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ingresos</p>
            <p className="text-lg font-bold text-green-600">{ingresosTotal}€</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gastos</p>
            <p className="text-lg font-bold text-red-600">{gastosTotal}€</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p
              className={`text-lg font-bold ${
                beneficioTotal >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {beneficioTotal}€
            </p>
          </div>
        </div>
      </div>

      {/* 📆 Mes actual */}
      <div>
        <h3 className="text-md font-bold text-gray-600 mb-2">
          {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)} {añoActual}
        </h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Pagos</p>
            <p className="text-lg font-bold text-green-500">{pagosMes}€</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ingresos</p>
            <p className="text-lg font-bold text-green-500">{ingresosMes}€</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gastos</p>
            <p className="text-lg font-bold text-red-500">{gastosMes}€</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p
              className={`text-lg font-bold ${
                beneficioMes >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {beneficioMes}€
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
