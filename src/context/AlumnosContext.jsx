import React, { createContext, useContext, useEffect, useState } from "react";

const AlumnosContext = createContext();

export function AlumnosProvider({ children }) {
  const [alumnos, setAlumnos] = useState([]);

  const fetchAlumnos = async () => {
    try {
      const res = await fetch("http://localhost:5000/alumnos");
      const data = await res.json();
      setAlumnos(data);
    } catch (err) {
      console.error("Error cargando alumnos:", err);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const refrescarDatos = () => {
    fetchAlumnos();
  };

  const addAlumno = async (nuevo) => {
    const res = await fetch("http://localhost:5000/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    const obj = await res.json();
    setAlumnos(prev => [...prev, obj]);
  };

  const deleteAlumno = async (id) => {
    await fetch(`http://localhost:5000/alumnos/${id}`, {
      method: "DELETE",
    });
    setAlumnos(prev => prev.filter(a => a.id !== id));
  };

  const actualizarAlumno = async (alumnoActualizado) => {
    await fetch(`http://localhost:5000/alumnos/${alumnoActualizado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumnoActualizado),
    });
    setAlumnos(prev =>
      prev.map((a) => (a.id === alumnoActualizado.id ? alumnoActualizado : a))
    );
  };

  return (
    <AlumnosContext.Provider value={{
      alumnos,
      addAlumno,
      deleteAlumno,
      actualizarAlumno,
      refrescarDatos // 👈 Añadido aquí
    }}>
      {children}
    </AlumnosContext.Provider>
  );
}

export function useAlumnos() {
  return useContext(AlumnosContext);
}
