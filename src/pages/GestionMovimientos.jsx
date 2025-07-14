import { useEconomia } from "../context/EconomiaContext";
import { useState } from "react";

export default function GestionMovimientos() {
  const {
    alumnos,
    ingresosGenerales,
    gastos,
    addIngreso,
    addGasto,
    addPagoAlumno,
    eliminarIngreso,
    eliminarGasto,
    eliminarPagoAlumno
  } = useEconomia();

  const [tipo, setTipo] = useState("ingreso");
  const [form, setForm] = useState({
    año: "",
    mes: "",
    cantidad: "",
    concepto: "",
    categoria: "",
    alumnoId: "",
  });

  const [openYear, setOpenYear] = useState(null);
  const [openMonth, setOpenMonth] = useState({});

  const toggleYear = (year) => {
    setOpenYear(prev => (prev === year ? null : year));
    setOpenMonth({});
  };

  const toggleMonth = (year, month) => {
    setOpenMonth(prev => ({
      ...prev,
      [year]: prev[year] === month ? null : month
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.año || !form.mes || !form.cantidad) return alert("Rellena todos los campos");
    if (tipo === "ingreso") {
      addIngreso({
        año: form.año,
        mes: form.mes,
        concepto: form.concepto,
        cantidad: parseFloat(form.cantidad)
      });
    } else if (tipo === "gasto") {
      addGasto({
        año: form.año,
        mes: form.mes,
        categoria: form.categoria,
        cantidad: parseFloat(form.cantidad)
      });
    } else if (tipo === "pago") {
      const alumno = alumnos.find(a => a.id === parseInt(form.alumnoId));
      if (!alumno) return alert("Alumno no válido");
      addPagoAlumno(alumno.id, {
        año: parseInt(form.año),
        mes: form.mes,
        cantidad: parseFloat(form.cantidad),
        pagado: true
      });
    }
    setForm({ año: "", mes: "", cantidad: "", concepto: "", categoria: "", alumnoId: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">📥 Gestión de Movimientos</h1>
      <p className="text-gray-600">
        Añade, edita o elimina ingresos, gastos y pagos de alumnos.
      </p>

      {/* Selector de tipo */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTipo("ingreso")}
          className={`px-4 py-2 rounded ${tipo === "ingreso" ? "bg-green-500 text-white" : "bg-green-100 text-green-800"}`}
        >
          ➕ Ingreso
        </button>
        <button
          onClick={() => setTipo("gasto")}
          className={`px-4 py-2 rounded ${tipo === "gasto" ? "bg-red-500 text-white" : "bg-red-100 text-red-800"}`}
        >
          ➖ Gasto
        </button>
        <button
          onClick={() => setTipo("pago")}
          className={`px-4 py-2 rounded ${tipo === "pago" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"}`}
        >
          💳 Pago Alumno
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Año"
            value={form.año}
            onChange={(e) => setForm({ ...form, año: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <select
            value={form.mes}
            onChange={(e) => setForm({ ...form, mes: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Mes</option>
            {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map(mes => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Cantidad (€)"
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {tipo === "ingreso" && (
          <input
            type="text"
            placeholder="Concepto"
            value={form.concepto}
            onChange={(e) => setForm({ ...form, concepto: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
        )}

        {tipo === "gasto" && (
          <input
            type="text"
            placeholder="Categoría"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
        )}

        {tipo === "pago" && (
          <select
            value={form.alumnoId}
            onChange={(e) => setForm({ ...form, alumnoId: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Selecciona Alumno</option>
            {alumnos.map(al => (
              <option key={al.id} value={al.id}>
                {al.nombre} {al.apellidos}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white rounded py-2 hover:bg-secondary transition"
        >
          Guardar
        </button>
      </form>

      {/* Listados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ingresos */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-green-700 text-lg mb-3">Ingresos Generales</h3>
          {[...new Set(ingresosGenerales.map(i => i.año))].map(year => (
            <div key={year} className="mb-2">
              <button
                onClick={() => toggleYear(year)}
                className={`w-full text-left px-3 py-2 rounded ${openYear === year ? "bg-green-100" : "bg-green-50"} hover:bg-green-200 font-semibold`}
              >
                📅 {year}
              </button>
              {openYear === year && (
                <div className="ml-4 mt-2 space-y-2">
                  {[...new Set(ingresosGenerales.filter(i => i.año === year).map(i => i.mes))].map(month => (
                    <div key={month}>
                      <button
                        onClick={() => toggleMonth(year, month)}
                        className={`w-full text-left px-3 py-1 rounded ${openMonth[year] === month ? "bg-green-50" : "bg-green-100"} hover:bg-green-200 font-medium`}
                      >
                        📂 {month}
                      </button>
                      {openMonth[year] === month && (
                        <div className="ml-4 mt-1 space-y-1">
                          {ingresosGenerales
                            .filter(i => i.año === year && i.mes === month)
                            .map((i, idx) => (
                              <div key={idx} className="flex justify-between items-center border-b py-1">
                                <span>{i.concepto}: <strong>{i.cantidad}€</strong></span>
                                <button
                                  onClick={() => eliminarIngreso(idx)}
                                  className="text-red-500 hover:underline text-sm"
                                >
                                  Eliminar
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Gastos */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-red-700 text-lg mb-3">Gastos Generales</h3>
          {[...new Set(gastos.map(g => g.año))].map(year => (
            <div key={year} className="mb-2">
              <button
                onClick={() => toggleYear(year)}
                className={`w-full text-left px-3 py-2 rounded ${openYear === year ? "bg-red-100" : "bg-red-50"} hover:bg-red-200 font-semibold`}
              >
                📅 {year}
              </button>
              {openYear === year && (
                <div className="ml-4 mt-2 space-y-2">
                  {[...new Set(gastos.filter(g => g.año === year).map(g => g.mes))].map(month => (
                    <div key={month}>
                      <button
                        onClick={() => toggleMonth(year, month)}
                        className={`w-full text-left px-3 py-1 rounded ${openMonth[year] === month ? "bg-red-50" : "bg-red-100"} hover:bg-red-200 font-medium`}
                      >
                        📂 {month}
                      </button>
                      {openMonth[year] === month && (
                        <div className="ml-4 mt-1 space-y-1">
                          {gastos
                            .filter(g => g.año === year && g.mes === month)
                            .map((g, idx) => (
                              <div key={idx} className="flex justify-between items-center border-b py-1">
                                <span>{g.categoria}: <strong>{g.cantidad}€</strong></span>
                                <button
                                  onClick={() => eliminarGasto(idx)}
                                  className="text-red-500 hover:underline text-sm"
                                >
                                  Eliminar
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagos de Alumnos */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-blue-700 text-lg mb-3">Pagos de Alumnos</h3>
          {[...new Set(alumnos.flatMap(a => a.pagos.map(p => p.año)))].map(year => (
            <div key={year} className="mb-2">
              <button
                onClick={() => toggleYear(year)}
                className={`w-full text-left px-3 py-2 rounded ${openYear === year ? "bg-blue-100" : "bg-blue-50"} hover:bg-blue-200 font-semibold`}
              >
                📅 {year}
              </button>
              {openYear === year && (
                <div className="ml-4 mt-2 space-y-2">
                  {[...new Set(alumnos.flatMap(a => a.pagos.filter(p => p.año === year).map(p => p.mes)))].map(month => (
                    <div key={month}>
                      <button
                        onClick={() => toggleMonth(year, month)}
                        className={`w-full text-left px-3 py-1 rounded ${openMonth[year] === month ? "bg-blue-50" : "bg-blue-100"} hover:bg-blue-200 font-medium`}
                      >
                        📂 {month}
                      </button>
                      {openMonth[year] === month && (
                        <div className="ml-4 mt-1 space-y-1">
                          {alumnos.flatMap(a =>
                            a.pagos
                              .filter(p => p.año === year && p.mes === month)
                              .map((p, idx) => (
                                <div key={`${a.id}-${idx}`} className="flex justify-between items-center border-b py-1">
                                  <span>{a.nombre} {a.apellidos}: <strong>{p.cantidad}€</strong></span>
                                  <button
                                    onClick={() => eliminarPagoAlumno(a.id, idx)}
                                    className="text-red-500 hover:underline text-sm"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
