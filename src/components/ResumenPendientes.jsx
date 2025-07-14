import { useEconomia } from "../context/EconomiaContext";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

export default function ResumenPendientes() {
  const { alumnos } = useEconomia();

  const hoy = dayjs();
  const mesActual = hoy.format("MMMM");
  const añoActual = hoy.year();

  const pendientesMesActual = [];
  const pendientesAnteriores = [];

  alumnos.forEach(alumno => {
    alumno.pagos.forEach(pago => {
      if (!pago.pagado) {
        if (
          pago.año === añoActual &&
          pago.mes.toLowerCase() === mesActual.toLowerCase()
        ) {
          pendientesMesActual.push({
            nombre: `${alumno.nombre} ${alumno.apellidos}`,
            cantidad: pago.cantidad,
          });
        } else {
          pendientesAnteriores.push({
            nombre: `${alumno.nombre} ${alumno.apellidos}`,
            cantidad: pago.cantidad,
            mes: pago.mes,
            año: pago.año,
          });
        }
      }
    });
  });

  return (
    <div className="bg-white shadow rounded-xl p-6 w-full h-full flex flex-col justify-between">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
        Pendientes de Pago
      </h2>

      {/* Mes actual */}
      <div>
        <h3 className="font-semibold text-gray-600 mb-2">{mesActual} {añoActual}</h3>
        {pendientesMesActual.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {pendientesMesActual.map((p, idx) => (
              <li key={idx}>
                {p.nombre} – {p.cantidad}€
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">✅ Todos al día</p>
        )}
      </div>

      {/* Meses anteriores */}
      <div>
        <h3 className="font-semibold text-gray-600 mt-4 mb-2">Pendientes de Meses Anteriores</h3>
        {pendientesAnteriores.length > 0 ? (
          <ul className="list-disc list-inside text-red-600">
            {pendientesAnteriores.map((p, idx) => (
              <li key={idx}>
                {p.nombre} – {p.mes} {p.año}, {p.cantidad}€
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">✅ Sin deudas pasadas</p>
        )}
      </div>
    </div>
  );
}
