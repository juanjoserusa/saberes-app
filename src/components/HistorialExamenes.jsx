import { useMemo } from "react";
import dayjs from "dayjs";

export default function HistorialExamenes({ examenes }) {
  const listaOrdenada = useMemo(() => {
    return [...examenes].sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [examenes]);

  if (!examenes?.length) {
    return (
      <p className="text-sm text-gray-500 italic">Aún no hay exámenes guardados</p>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[400px] pr-2 text-sm text-gray-700 space-y-1">
      {listaOrdenada.map((ex, i) => (
        <div key={i} className="flex items-center gap-2">
          <span>📅 {dayjs(ex.fecha).format("YYYY-MM-DD")} – {ex.asignatura}</span>
        </div>
      ))}
    </div>
  );
}
