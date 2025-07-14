import { useState } from "react";
import { useEconomia } from "../../context/EconomiaContext";

export default function TablaPagos() {
  const { alumnos, loading, marcarPagado } = useEconomia();
  const [orden, setOrden] = useState({ campo: "alumno", asc: true });
  const [mesExpandido, setMesExpandido] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroAño, setFiltroAño] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

  if (loading) {
    return <p className="text-center text-gray-500">Cargando pagos...</p>;
  }

  // 🔥 Combinar todos los pagos en un array plano
  const pagos = alumnos.flatMap(alumno =>
    alumno.pagos.map(pago => ({
      idAlumno: alumno.id,
      alumno: `${alumno.nombre} ${alumno.apellidos}`,
      año: pago.año,
      mes: pago.mes.charAt(0).toUpperCase() + pago.mes.slice(1), // Mayúscula inicial
      pagado: pago.pagado,
      cantidad: pago.cantidad
    }))
  );

  // 🎯 Filtros y búsqueda
  const pagosFiltrados = pagos.filter(p => {
    const matchAlumno = p.alumno.toLowerCase().includes(busqueda.toLowerCase());
    const matchAño = !filtroAño || p.año === parseInt(filtroAño);
    const matchMes = !filtroMes || p.mes === filtroMes;
    return matchAlumno && matchAño && matchMes;
  });

  // 📊 Ordenar
  const pagosOrdenados = [...pagosFiltrados].sort((a, b) => {
    if (a[orden.campo] < b[orden.campo]) return orden.asc ? -1 : 1;
    if (a[orden.campo] > b[orden.campo]) return orden.asc ? 1 : -1;
    return 0;
  });

  const toggleOrden = campo => {
    if (orden.campo === campo) {
      setOrden({ campo, asc: !orden.asc });
    } else {
      setOrden({ campo, asc: true });
    }
  };

  // 📂 Agrupar por mes/año
  const pagosAgrupados = pagosOrdenados.reduce((acc, pago) => {
    const key = `${pago.mes} ${pago.año}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(pago);
    return acc;
  }, {});

  const toggleMes = (mesAño) => {
    setMesExpandido(mesExpandido === mesAño ? null : mesAño);
  };

  // 📅 Sacar lista de años y meses únicos para filtros
  const añosUnicos = [...new Set(pagos.map(p => p.año))];
  const mesesUnicos = [...new Set(pagos.map(p => p.mes))];

  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">📋 Pagos de Alumnos</h3>

      {/* 🔍 Buscador y Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar alumno..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <select
          value={filtroAño}
          onChange={e => setFiltroAño(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        >
          <option value="">Año (todos)</option>
          {añosUnicos.map(año => (
            <option key={año} value={año}>{año}</option>
          ))}
        </select>
        <select
          value={filtroMes}
          onChange={e => setFiltroMes(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        >
          <option value="">Mes (todos)</option>
          {mesesUnicos.map(mes => (
            <option key={mes} value={mes}>{mes}</option>
          ))}
        </select>
      </div>

      {/* 📦 Pagos agrupados */}
      {Object.keys(pagosAgrupados).length === 0 ? (
        <p className="text-gray-500">No hay pagos para los filtros seleccionados.</p>
      ) : (
        <div className="divide-y">
          {Object.entries(pagosAgrupados).map(([mesAño, pagos]) => {
            const pendientes = pagos.filter(p => !p.pagado).length;
            const pagados = pagos.filter(p => p.pagado).length;

            return (
              <div key={mesAño}>
                <button
                  onClick={() => toggleMes(mesAño)}
                  className="w-full text-left py-2 px-4 bg-gray-100 rounded hover:bg-gray-200 font-medium"
                >
                  {mesAño} (pendientes {pendientes}, pagados {pagados})
                </button>

                {mesExpandido === mesAño && (
                  <table className="w-full text-sm text-left mt-2">
                    <thead className="border-b text-gray-700">
                      <tr>
                        <th onClick={() => toggleOrden("alumno")} className="cursor-pointer py-2">Alumno</th>
                        <th onClick={() => toggleOrden("mes")} className="cursor-pointer">Mes</th>
                        <th onClick={() => toggleOrden("año")} className="cursor-pointer">Año</th>
                        <th>Estado</th>
                        <th onClick={() => toggleOrden("cantidad")} className="cursor-pointer">Cantidad (€)</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagos.map((pago, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2">{pago.alumno}</td>
                          <td>{pago.mes}</td>
                          <td>{pago.año}</td>
                          <td>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              pago.pagado ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                            }`}>
                              {pago.pagado ? "Pagado" : "Pendiente"}
                            </span>
                          </td>
                          <td>€{pago.cantidad}</td>
                          <td>
                            <button
                              onClick={() => marcarPagado(pago.idAlumno, pago.año, pago.mes)}
                              className={`px-3 py-1 rounded text-white text-sm transition ${
                                pago.pagado ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                              }`}
                            >
                              {pago.pagado ? "Marcar pendiente" : "Marcar pagado"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
