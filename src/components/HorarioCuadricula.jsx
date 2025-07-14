export default function HorarioCuadricula({ horarios }) {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  return (
    <div className="grid grid-cols-5 gap-2 text-sm">
      {dias.map((dia, idx) => (
        <div key={idx} className="border rounded shadow">
          <h4 className="bg-primary text-white text-center py-1 rounded-t">{dia}</h4>
          <div className="p-2 space-y-1 min-h-[150px]">
            {horarios.filter(h => h.dia === dia).length > 0 ? (
              horarios.filter(h => h.dia === dia).map((turno, i) => (
                <div key={i} className="bg-blue-100 rounded p-1">
                  <span className="block font-semibold">{turno.hora}</span>
                  <span>{turno.asignatura}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">Sin turnos</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
