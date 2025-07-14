import { useState } from "react";
import Swal from "sweetalert2";

export default function InformacionRelevante({ alumno, actualizarAlumno }) {
  const [texto, setTexto] = useState(alumno.infoRelevante || "");
  const [editando, setEditando] = useState(false);

  const handleGuardar = () => {
    const actualizado = { ...alumno, infoRelevante: texto };
    actualizarAlumno(actualizado);
    setEditando(false);
    Swal.fire("Guardado", "Información relevante actualizada correctamente", "success");
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <h3 className="font-bold text-lg mb-2">📌 Información relevante</h3>
      
      {editando ? (
        <textarea
          rows="5"
          className="w-full border rounded p-2 mb-2"
          placeholder="Ej: Alergias, problemas de aprendizaje, etc..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap mb-2">
          {texto || "Sin información relevante"}
        </p>
      )}

      <div className="flex justify-end gap-2">
        {editando ? (
          <>
            <button
              onClick={handleGuardar}
              className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary hover:text-black transition"
            >
              Guardar
            </button>
            <button
              onClick={() => { setTexto(alumno.infoRelevante || ""); setEditando(false); }}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditando(true)}
            className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary hover:text-black transition"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}
