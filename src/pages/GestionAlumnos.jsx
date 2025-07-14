import { useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import { useAlumnos } from "../context/AlumnosContext";
import { Link } from "react-router-dom";

const niveles = ["Primaria", "Secundaria", "Bachillerato", "Extraescolar"];
const extraAsignaturas = ["Robótica", "Informática", "Programación"];
const bachModos = {
  "Ciencias y Tecnología": ["Matemáticas II", "Física", "Biología", "Tecnología"],
  "Humanidades y CCSS": ["Latín", "Griego", "Economía", "Historia"],
  "Artes": ["Dibujo Técnico", "Análisis Musical", "Cultura Audiovisual"]
};
const asignaturasPorNivel = {
  Primaria: ["Lengua", "Matemáticas", "Ciencias Naturales", "Ciencias Sociales", "Educación Física", "Inglés"],
  Secundaria: ["Lengua", "Matemáticas", "Física y Química", "Biología y Geología", "Tecnología", "Inglés"],
};

export default function GestionAlumnos() {
  const { addAlumno } = useAlumnos();
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    responsableNombre: "",
    responsableRol: "",
    nivel: "",
    curso: "",
    ramaBach: "",
    asignaturas: []
  });

  const roles = ["Padre", "Madre", "Tutor legal"];
  const isExtraescolar = form.nivel === "Extraescolar";
  const isBachillerato = form.nivel === "Bachillerato";
  const camposBasicosCompletos = form.nombre && form.apellidos && form.telefono && form.responsableNombre;
  const puedeMostrarNivel = camposBasicosCompletos;
  const puedeMostrarRama = isBachillerato;
  const puedeMostrarCurso = form.nivel && !isExtraescolar;
  const puedeMostrarAsignaturas = isExtraescolar || form.curso;

  const asignaturasOptions =
    isExtraescolar
      ? extraAsignaturas
      : isBachillerato && form.ramaBach
        ? bachModos[form.ramaBach]
        : form.nivel && asignaturasPorNivel[form.nivel]
          ? asignaturasPorNivel[form.nivel]
          : [];

  const isFormValid =
    camposBasicosCompletos &&
    form.nivel &&
    (isExtraescolar || form.curso) &&
    form.asignaturas.length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nivel") {
      setForm(prev => ({
        ...prev,
        nivel: value,
        curso: "",
        ramaBach: "",
        asignaturas: []
      }));
    } else if (name === "curso") {
      setForm(prev => ({
        ...prev,
        curso: value,
        asignaturas: []
      }));
    } else if (name === "ramaBach") {
      setForm(prev => ({
        ...prev,
        ramaBach: value,
        asignaturas: []
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelectChange = (selected) => {
    setForm({ ...form, asignaturas: selected.map(s => s.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAlumno(form);
    setForm({
      nombre: "", apellidos: "", telefono: "", responsableNombre: "",
      responsableRol: "", nivel: "", curso: "", ramaBach: "", asignaturas: []
    });
    Swal.fire("Añadido", "Alumno registrado", "success");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Gestión de Alumnos</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 mb-8">
        {/* Datos personales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Apellidos</label>
            <input name="apellidos" value={form.apellidos} onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
        </div>

        {/* Responsable */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Nombre del Responsable</label>
            <input name="responsableNombre" value={form.responsableNombre} onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Rol</label>
            <select name="responsableRol" value={form.responsableRol} onChange={handleChange} className="border rounded p-2 w-full">
              <option value="">Selecciona rol</option>
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Teléfono del Responsable</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
        </div>

        {/* Nivel, Curso, Rama */}
        {(puedeMostrarNivel || form.nivel || puedeMostrarCurso || puedeMostrarAsignaturas) && (
          <>
            <div className={`grid gap-4 ${
              isBachillerato ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {puedeMostrarNivel && (
                <div>
                  <label className="block mb-1 font-medium">Nivel Educativo</label>
                  <select name="nivel" value={form.nivel} onChange={handleChange} className="border rounded p-2 w-full">
                    <option value="">Selecciona nivel</option>
                    {niveles.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              )}

              {puedeMostrarCurso && (
                <div>
                  <label className="block mb-1 font-medium">Curso</label>
                  <input name="curso" value={form.curso} onChange={handleChange} className="border rounded p-2 w-full" />
                </div>
              )}

              {puedeMostrarRama && (
                <div>
                  <label className="block mb-1 font-medium">Rama Bachillerato</label>
                  <select name="ramaBach" value={form.ramaBach} onChange={handleChange} className="border rounded p-2 w-full">
                    <option value="">Selecciona rama</option>
                    {Object.keys(bachModos).map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Asignaturas */}
            {puedeMostrarAsignaturas && (
              <div>
                <label className="block font-medium mb-2 mt-4">Asignaturas</label>
                <Select
                  isMulti
                  name="asignaturas"
                  options={asignaturasOptions.map(a => ({ value: a, label: a }))}
                  value={form.asignaturas.map(a => ({ value: a, label: a }))}
                  onChange={handleSelectChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={!isFormValid}
          className={`px-6 py-2 rounded transition w-full ${
            isFormValid
              ? 'bg-primary text-white hover:bg-secondary hover:text-black'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Añadir Alumno
        </button>
      </form>

      {/* Enlace a listado */}
      <div className="text-center">
        <Link
          to="/listado-alumnos"
          className="text-primary underline hover:text-secondary"
        >
          Ver listado de alumnos
        </Link>
      </div>
    </div>
  );
}
