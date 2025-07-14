import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAlumnos } from "../context/AlumnosContext";
import moment from "moment";
import "moment/locale/es";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

moment.locale("es");
const localizer = momentLocalizer(moment);

const coloresNivel = {
    Primaria: "#007BFF",       // Azul
    Secundaria: "#28A745",     // Verde
    Bachillerato: "#DC3545",   // Rojo
    Extraescolares: "#FD7E14"  // Naranja
};

export default function CalendarioGeneralAlumnos() {
    const { alumnos } = useAlumnos();
    const navigate = useNavigate();

    const diasSemana = {
        "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5
    };

    const eventos = alumnos.flatMap(alumno =>
        (alumno.horario || []).map(turno => {
            const diaSemana = diasSemana[turno.dia];
            if (diaSemana === undefined) return null;

            const now = moment().startOf("week").add(diaSemana, "days");
            const [hIni, mIni] = turno.horaInicio.split(":");
            const [hFin, mFin] = turno.horaFin.split(":");

            return {
                title: `${alumno.nombre} - ${turno.asignatura}`,
                start: now.clone().hour(hIni).minute(mIni).toDate(),
                end: now.clone().hour(hFin).minute(mFin).toDate(),
                alumno,
                turno
            };
        }).filter(Boolean)
    );

    const handleSelectEvent = (event) => {
        const { alumno, turno } = event;
        Swal.fire({
            title: `<span class="text-xl font-bold">${alumno.nombre} ${alumno.apellidos}</span>`,
            html: `
    <div class="text-left space-y-2">
      <p>📚 <b>Asignatura:</b> ${turno.asignatura}</p>
      <p>📅 <b>Día:</b> ${turno.dia}</p>
      <p>⏰ <b>Hora:</b> ${turno.horaInicio} - ${turno.horaFin}</p>
      <p>📞 <b>Teléfono:</b> ${alumno.telefono}</p>
      <p>👨‍👩‍👧 <b>Responsable:</b> ${alumno.responsableNombre} (${alumno.responsableRol})</p>
    </div>
  `,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Ir al alumno",
            cancelButtonText: "Cerrar",
            customClass: {
                confirmButton:
                    "bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-secondary hover:text-black transition-colors",
                cancelButton:
                    "bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-colors",
                actions: "flex justify-center gap-4 mt-4"
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/alumno/${alumno.id}`);
            }
        });
    };

    const eventStyleGetter = (event) => {
        const color = coloresNivel[event.alumno.nivel] || "#6C757D";
        return {
            style: {
                backgroundColor: color,
                borderRadius: "6px",
                border: "1px solid #333",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                color: "white",
                opacity: 0.95,
                zIndex: 100
            }
        };
    };

    return (
        <div className="bg-white shadow rounded-xl p-4 mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                📅 Horarios Semanales de Alumnos
            </h2>

            <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 450 }}
                    views={["week"]}
                    defaultView="week"
                    step={30}
                    timeslots={2}
                    min={moment().hour(8).minute(0).toDate()}
                    max={moment().hour(20).minute(0).toDate()}
                    toolbar={false}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    formats={{
                        timeGutterFormat: "HH:mm", // ejes laterales
                        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                            `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(end, "HH:mm", culture)}`
                    }}
                />
            </div>

            {/* Leyenda */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
                {Object.entries(coloresNivel).map(([nivel, color]) => (
                    <div key={nivel} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: color }}></span> {nivel}
                    </div>
                ))}
            </div>
        </div>
    );
}
