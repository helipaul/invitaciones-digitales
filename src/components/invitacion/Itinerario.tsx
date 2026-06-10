import type { EventData } from "@/app/demo/valentina-xv/event"

interface EventoProps {
  hora: string
  icono: string
  titulo: string
  lugar: string
  direccion: string
}

function EventoCard({ hora, icono, titulo, lugar, direccion }: EventoProps) {
  return (
    <div className="relative flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
        style={{ background: "linear-gradient(135deg, #FCE4EC, #F8BBD9)" }}
      >
        {icono}
      </div>
      <div className="min-w-0">
        <p
          className="text-[9px] tracking-[0.2em] uppercase font-medium mb-0.5"
          style={{ color: "#C2185B" }}
        >
          {hora} hrs
        </p>
        <p className="font-semibold text-gray-800 mb-0.5">{titulo}</p>
        <p className="text-sm text-gray-600">{lugar}</p>
        <p className="text-xs text-gray-400 mt-0.5">{direccion}</p>
      </div>
    </div>
  )
}

export function Itinerario({ event }: { event: EventData }) {
  return (
    <div className="py-14 px-5 max-w-sm mx-auto">
      <p className="text-[9px] tracking-[0.35em] text-gray-400 uppercase text-center mb-2">
        Programa del día
      </p>
      <h2
        className="text-4xl text-gray-800 text-center mb-8"
        style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontStyle: "italic" }}
      >
        Itinerario
      </h2>

      {/* Línea de tiempo */}
      <div className="relative">
        <div className="absolute left-6 top-12 bottom-12 w-px bg-rose-100" />
        <div className="space-y-4">
          <EventoCard
            hora={event.misa.hora}
            icono="⛪"
            titulo="Misa de quinceaños"
            lugar={event.misa.lugar}
            direccion={event.misa.direccion}
          />
          <EventoCard
            hora={event.recepcion.hora}
            icono="🎊"
            titulo="Recepción y festejo"
            lugar={event.recepcion.lugar}
            direccion={event.recepcion.direccion}
          />
        </div>
      </div>
    </div>
  )
}
