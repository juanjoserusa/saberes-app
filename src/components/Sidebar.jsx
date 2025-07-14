import { Link, useLocation } from "react-router-dom";

const bloques = [
  {
    titulo: "🏠 Inicio",
    panelPath: "/",
    links: [],
  },
  {
    titulo: "Gestión de Alumnos",
    panelPath: "/panel-alumnos",
    links: [
      { name: "Añadir Alumno", path: "/gestion-alumnos" },
      { name: "Listado de Alumnos", path: "/listado-alumnos" },
    ],
  },
  {
    titulo: "Gestión Económica",
    panelPath: "/panel-economico",
    links: [
      { name: "Gestión de Movimientos", path: "/gestion-movimientos" },
      { name: "Resumen Económico", path: "/resumen-economico" }
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-primary text-white p-6 fixed top-0 left-0 shadow-lg overflow-y-auto">
      <h2 className="text-2xl font-bold mb-8">Saberes</h2>
      <nav className="space-y-6">
        {bloques.map((bloque, i) => (
          <div key={i}>
            <Link
              to={bloque.panelPath}
              className={`text-lg font-semibold block mb-2 hover:text-secondary transition ${
                location.pathname === bloque.panelPath ? "text-secondary font-bold" : ""
              }`}
            >
              {bloque.titulo}
            </Link>
            <div className="flex flex-col space-y-2 ml-3">
              {bloque.links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`hover:text-secondary transition ${
                    location.pathname === link.path ? "text-secondary font-bold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
