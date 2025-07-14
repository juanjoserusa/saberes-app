import React, { createContext, useContext, useEffect, useState } from "react";
import dayjs from "dayjs";

const EconomiaContext = createContext();

export function EconomiaProvider({ children }) {
  const [alumnos, setAlumnos] = useState([]);
  const [economia, setEconomia] = useState({ ingresosGenerales: [], gastos: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const resAlumnos = await fetch("http://localhost:5000/alumnos");
      const alumnosData = await resAlumnos.json();

      const resEconomia = await fetch("http://localhost:5000/economia");
      const economiaData = await resEconomia.json();

      setAlumnos(alumnosData);
      setEconomia(economiaData);

      generarPagosPendientes(alumnosData);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refrescarDatos = () => {
    fetchData();
  };

  const generarPagosPendientes = async (alumnosData) => {
    const hoy = dayjs();
    const añoActual = hoy.year();
    const mesActual = hoy.locale("es").format("MMMM").charAt(0).toUpperCase() + hoy.locale("es").format("MMMM").slice(1);

    if (false) return; // ⚡ Para pruebas: siempre genera

    const alumnosActualizados = await Promise.all(alumnosData.map(async alumno => {
      const yaTienePago = alumno.pagos.some(p => p.año === añoActual && p.mes === mesActual);
      if (!yaTienePago) {
        const nuevoPago = {
          año: añoActual,
          mes: mesActual,
          cantidad: alumno.cuota || 50,
          pagado: false
        };
        const updatedPagos = [...alumno.pagos, nuevoPago];
        const updatedAlumno = { ...alumno, pagos: updatedPagos };

        await fetch(`http://localhost:5000/alumnos/${alumno.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAlumno)
        });

        return updatedAlumno;
      }
      return alumno;
    }));

    setAlumnos(alumnosActualizados);
  };

  const marcarPagado = async (alumnoId, año, mes) => {
    const alumno = alumnos.find(a => a.id === alumnoId);
    if (!alumno) return;

    const updatedPagos = alumno.pagos.map(pago =>
      pago.año === año && pago.mes === mes
        ? { ...pago, pagado: !pago.pagado }
        : pago
    );

    const updatedAlumno = { ...alumno, pagos: updatedPagos };

    try {
      await fetch(`http://localhost:5000/alumnos/${alumnoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAlumno),
      });

      setAlumnos(prev => prev.map(a => (a.id === alumnoId ? updatedAlumno : a)));
    } catch (err) {
      console.error("Error actualizando pago:", err);
    }
  };

  const calcularTotales = (año, mes) => {
    let ingresos = 0;
    let pagosAlumnos = 0;
    let gastos = 0;

    const filtroAño = año === "Histórico" ? null : parseInt(año);
    const filtroMes = mes === "Todos" ? null : mes;

    alumnos.forEach(alumno => {
      alumno.pagos.forEach(pago => {
        const matchAño = !filtroAño || pago.año === filtroAño;
        const matchMes = !filtroMes || pago.mes.toLowerCase() === filtroMes?.toLowerCase();
        if (matchAño && matchMes && pago.pagado) {
          ingresos += pago.cantidad;
          pagosAlumnos += pago.cantidad;
        }
      });
    });

    economia.ingresosGenerales.forEach(i => {
      const matchAño = !filtroAño || parseInt(i.año) === filtroAño;
      const matchMes = !filtroMes || i.mes.toLowerCase() === filtroMes?.toLowerCase();
      if (matchAño && matchMes) {
        ingresos += i.cantidad;
      }
    });

    economia.gastos.forEach(g => {
      const matchAño = !filtroAño || parseInt(g.año) === filtroAño;
      const matchMes = !filtroMes || g.mes.toLowerCase() === filtroMes?.toLowerCase();
      if (matchAño && matchMes) {
        gastos += g.cantidad;
      }
    });

    return {
      ingresos,
      gastos,
      beneficio: ingresos - gastos,
      pagosAlumnos
    };
  };

  const getDistribucionGastos = (año, mes) => {
    const categorias = {};
    const filtroAño = año === "Histórico" ? null : parseInt(año);
    const filtroMes = mes === "Todos" ? null : mes;

    economia.gastos.forEach(g => {
      const matchAño = !filtroAño || parseInt(g.año) === filtroAño;
      const matchMes = !filtroMes || g.mes.toLowerCase() === filtroMes?.toLowerCase();
      if (matchAño && matchMes) {
        categorias[g.categoria] = (categorias[g.categoria] || 0) + g.cantidad;
      }
    });

    return categorias;
  };

  const agregarIngreso = async (nuevo) => {
    await fetch("http://localhost:5000/ingresosGenerales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    setEconomia(prev => ({
      ...prev,
      ingresosGenerales: [...prev.ingresosGenerales, nuevo]
    }));
  };

  const agregarGasto = async (nuevo) => {
    await fetch("http://localhost:5000/gastos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    setEconomia(prev => ({
      ...prev,
      gastos: [...prev.gastos, nuevo]
    }));
  };

  return (
    <EconomiaContext.Provider
      value={{
        alumnos,
        ingresosGenerales: economia.ingresosGenerales,
        gastos: economia.gastos,
        marcarPagado,
        calcularTotales,
        getDistribucionGastos,
        agregarGasto,
        agregarIngreso,
        refrescarDatos, // 👈 Añadido aquí
        loading,
        economia
      }}
    >
      {children}
    </EconomiaContext.Provider>
  );
}

export function useEconomia() {
  return useContext(EconomiaContext);
}
