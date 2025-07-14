import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import GestionAlumnos from "./pages/GestionAlumnos";
import { AlumnosProvider } from "./context/AlumnosContext";
import ListadoAlumnos from "./pages/ListadoAlumno";
import DetalleAlumno from "./pages/AlumnoDetalle";
import PanelGestionAlumnos from "./pages/PanelGestionAlumnos";
import PanelGestionEconomica from "./pages/PanelGestionEconomica";
import ResumenEconomico from "./pages/ResumenEconomico";
import { EconomiaProvider } from "./context/EconomiaContext";
import ControlPagos from "./pages/ControlPagos";
import ListadoFacturas from "./pages/ListadoFacturas";
import GestionMovimientos from "./pages/GestionMovimientos";


function App() {
  return (
    <AlumnosProvider>
      <EconomiaProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/panel-alumnos" element={<PanelGestionAlumnos />} />
            <Route path="/gestion-alumnos" element={<GestionAlumnos />} />
            <Route path="/listado-alumnos" element={<ListadoAlumnos />} />
            <Route path="/alumno/:id" element={<DetalleAlumno />} />
            <Route path="/panel-economico" element={<PanelGestionEconomica />} />
            <Route path="/resumen-economico" element={<ResumenEconomico />} />
            <Route path="/control-pagos" element={<ControlPagos />} />
            <Route path="/listado-facturas" element={<ListadoFacturas />} />
              <Route path="/gestion-movimientos" element={<GestionMovimientos />} />


          </Routes>
        </Layout>
      </Router>
      </EconomiaProvider>
    </AlumnosProvider>
  );
}
export default App;
