import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-moment";
import Swal from "sweetalert2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  annotationPlugin
);

export default function CalificacionesAlumno({ alumno, actualizarAlumno }) {
  const [nuevaNota, setNuevaNota] = useState({ asignatura: "", fecha: "", nota: "" });
  const [editando, setEditando] = useState(null);
  const [tempNota, setTempNota] = useState({ asignatura: "", fecha: "", nota: "" });
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");

  const notas = alumno.calificaciones || [];

  const handleInputChange = (e, stateSetter) => {
    const { name, value } = e.target;
    stateSetter(prev => ({ ...prev, [name]: value }));
  };

  const guardarNuevaNota = () => {
    if (!nuevaNota.asignatura || !nuevaNota.fecha || !nuevaNota.nota) {
      Swal.fire("Error", "Rellena todos los campos", "error");
      return;
    }
    const actualizadas = [...notas, nuevaNota];
    actualizarAlumno({ ...alumno, calificaciones: actualizadas });
    setNuevaNota({ asignatura: "", fecha: "", nota: "" });
    Swal.fire("Guardado", "Nota añadida correctamente", "success");
  };

  const guardarEdicion = (index) => {
    const actualizadas = notas.map((n, i) => (i === index ? tempNota : n));
    actualizarAlumno({ ...alumno, calificaciones: actualizadas });
    setEditando(null);
    Swal.fire("Guardado", "Nota actualizada correctamente", "success");
  };

  const eliminarNota = (index) => {
    Swal.fire({
      title: "¿Eliminar nota?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const actualizadas = notas.filter((_, i) => i !== index);
        actualizarAlumno({ ...alumno, calificaciones: actualizadas });
        Swal.fire("Eliminado", "Nota eliminada correctamente", "success");
      }
    });
  };

  const colores = useMemo(() => {
    const palette = ["#2500FF", "#FF5733", "#28B463", "#FFC300", "#8E44AD", "#E67E22", "#1ABC9C"];
    const map = {};
    alumno.asignaturas.forEach((asig, idx) => {
      map[asig] = palette[idx % palette.length];
    });
    return map;
  }, [alumno.asignaturas]);

  const datasets = useMemo(() => {
    if (asignaturaSeleccionada) {
      const filtered = notas.filter(n => n.asignatura === asignaturaSeleccionada);
      return [{
        label: asignaturaSeleccionada,
        data: filtered.map(n => ({ x: n.fecha, y: parseFloat(n.nota) })),
        borderColor: colores[asignaturaSeleccionada],
        backgroundColor: colores[asignaturaSeleccionada],
        fill: false,
        tension: 0.3
      }];
    }
    return alumno.asignaturas.map(asig => ({
      label: asig,
      data: notas
        .filter(n => n.asignatura === asig)
        .map(n => ({ x: n.fecha, y: parseFloat(n.nota) })),
      borderColor: colores[asig],
      backgroundColor: colores[asig],
      fill: false,
      tension: 0.3
    }));
  }, [asignaturaSeleccionada, notas, colores, alumno.asignaturas]);

  const data = { datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { callbacks: { label: ctx => `Nota: ${ctx.parsed.y}` } },
      annotation: {
        annotations: {
          aprobadoLine: {
            type: "line",
            yMin: 5,
            yMax: 5,
            borderColor: "#28B463", // Verde
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: "Aprobado (5)",
              enabled: true,
              position: "start",
              backgroundColor: "rgba(40, 180, 99, 0.1)",
              color: "#28B463",
              font: { weight: "bold" },
              padding: 4
            }
          }
        }
      }
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "DD/MM/YYYY",
          displayFormats: {
            day: "DD/MM/YYYY"
          }
        },
        title: { display: true, text: "Fecha" }
      },
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
          callback: (value) => value === 5 ? "5 (Aprobado)" : value
        },
        title: { display: true, text: "Nota" }
      }
    }
  };

  return (
    <div className="space-y-4 flex flex-col justify-between min-h-[460px]">
      {/* Selector de asignatura */}
      <div className="mb-2">
        <select
          value={asignaturaSeleccionada}
          onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">-- Todas las asignaturas --</option>
          {alumno.asignaturas.map((asig, i) => (
            <option key={i} value={asig}>{asig}</option>
          ))}
        </select>
      </div>

      {/* Gráfico */}
      <div className="w-full h-80">
        {datasets.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Sin datos de calificaciones
          </div>
        )}
      </div>

      {/* Formulario añadir nota */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <select
          name="asignatura"
          value={nuevaNota.asignatura}
          onChange={e => handleInputChange(e, setNuevaNota)}
          className="border rounded px-2 py-1"
        >
          <option value="">Asignatura</option>
          {alumno.asignaturas.map((asig, i) => (
            <option key={i} value={asig}>{asig}</option>
          ))}
        </select>
        <input
          type="date"
          name="fecha"
          value={nuevaNota.fecha}
          onChange={e => handleInputChange(e, setNuevaNota)}
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          name="nota"
          placeholder="Nota (0-10)"
          value={nuevaNota.nota}
          onChange={e => handleInputChange(e, setNuevaNota)}
          className="border rounded px-2 py-1"
          min="0" max="10" step="0.1"
        />
        <button
          onClick={guardarNuevaNota}
          className="bg-primary text-white px-2 py-1 rounded hover:bg-secondary hover:text-black transition md:col-span-3"
        >
          Añadir nota
        </button>
      </div>

      {/* Lista de notas */}
      <div className="overflow-y-auto max-h-32 text-sm">
        {notas.map((n, i) => (
          <div key={i} className="flex justify-between items-center border-b py-1">
            {editando === i ? (
              <div className="flex gap-2 w-full">
                <select
                  name="asignatura"
                  value={tempNota.asignatura}
                  onChange={e => handleInputChange(e, setTempNota)}
                  className="border rounded px-1 py-0.5"
                >
                  {alumno.asignaturas.map((asig, idx) => (
                    <option key={idx} value={asig}>{asig}</option>
                  ))}
                </select>
                <input
                  type="date"
                  name="fecha"
                  value={tempNota.fecha}
                  onChange={e => handleInputChange(e, setTempNota)}
                  className="border rounded px-1 py-0.5"
                />
                <input
                  type="number"
                  name="nota"
                  value={tempNota.nota}
                  onChange={e => handleInputChange(e, setTempNota)}
                  className="border rounded px-1 py-0.5"
                  min="0" max="10" step="0.1"
                />
                <button
                  onClick={() => guardarEdicion(i)}
                  className="text-green-600 hover:underline"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <>
                <span>{dayjs(n.fecha).format("DD/MM/YYYY")} – {n.asignatura} – {n.nota}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditando(i); setTempNota(n); }} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => eliminarNota(i)} className="text-red-600 hover:underline">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
