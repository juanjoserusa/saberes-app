import { useState } from "react";
import { useAlumnos } from "../context/AlumnosContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';

export default function ListadoAlumnos() {
  const { alumnos } = useAlumnos();
  const [searchTerm, setSearchTerm] = useState("");
  const [ordenColumna, setOrdenColumna] = useState("nombre");
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const navigate = useNavigate();


  const handleOrdenar = (columna) => {
    if (ordenColumna === columna) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenColumna(columna);
      setOrdenAscendente(true);
    }
  };

  const alumnosFiltrados = alumnos
    .filter(a =>
      `${a.nombre} ${a.apellidos} ${a.responsableNombre} ${a.nivel} ${a.curso}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[ordenColumna]?.toString().toLowerCase();
      const bVal = b[ordenColumna]?.toString().toLowerCase();
      if (aVal < bVal) return ordenAscendente ? -1 : 1;
      if (aVal > bVal) return ordenAscendente ? 1 : -1;
      return 0;
    });

  const renderAsignaturas = (asignaturas) => {
    const visibles = asignaturas.slice(0, 2);
    const ocultas = asignaturas.slice(2);

    return (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {visibles.map((asig, i) => (
          <span key={i} className="bg-yellow-300 text-black text-xs px-2 py-1 rounded-full whitespace-nowrap">
            {asig}
          </span>
        ))}

        {ocultas.length > 0 && (
          <Tippy
            content={
              <div className="text-sm">
                {ocultas.map((asig, i) => (
                  <div key={i}>• {asig}</div>
                ))}
              </div>
            }
            placement="top"
            arrow={true}
            theme="light-border"
          >
            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full cursor-pointer whitespace-nowrap">
              +{ocultas.length}
            </span>
          </Tippy>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Listado de Alumnos</h2>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, nivel, responsable..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      {alumnosFiltrados.length === 0 ? (
        <p className="text-gray-500">No hay resultados.</p>
      ) : (
        <div className="overflow-auto rounded shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-primary text-white text-left">
                {["nombre", "apellidos", "nivel", "curso", "responsableNombre"].map((campo) => (
                  <th key={campo} className="p-3 cursor-pointer" onClick={() => handleOrdenar(campo)}>
                    {campo.charAt(0).toUpperCase() + campo.slice(1)}
                    {" "}
                    {ordenColumna === campo &&
                      (ordenAscendente ? <FaSortAlphaDown className="inline" /> : <FaSortAlphaUp className="inline" />)}
                  </th>
                ))}
                <th className="p-3">Asignaturas</th>
              </tr>
            </thead>
            <tbody>
              {alumnosFiltrados.map((a) => (
                <tr key={a.id} onClick={() => navigate(`/alumno/${a.id}`)} className="cursor-pointer hover:bg-gray-50">

                  <td className="p-2">{a.nombre}</td>
                  <td className="p-2">{a.apellidos}</td>
                  <td className="p-2">{a.nivel}{a.ramaBach ? ` - ${a.ramaBach}` : ""}</td>
                  <td className="p-2">{a.curso}</td>
                  <td className="p-2">{a.responsableNombre} ({a.responsableRol})</td>
                  <td className="p-2">{renderAsignaturas(a.asignaturas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
