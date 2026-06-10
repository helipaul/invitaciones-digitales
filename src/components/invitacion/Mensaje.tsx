import type { EventData } from "@/app/demo/valentina-xv/event"

export function Mensaje({ event }: { event: EventData }) {
  return (
    <div className="py-16 px-6 max-w-sm mx-auto text-center">
      <p
        className="text-[9px] tracking-[0.35em] uppercase mb-3"
        style={{ color: "#C2185B" }}
      >
        Una invitación especial
      </p>
      <h2
        className="text-4xl text-gray-800 mb-8 leading-tight"
        style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontStyle: "italic" }}
      >
        {event.nombre}
        <br />
        <span className="text-2xl text-gray-500 font-light not-italic">{event.apellido}</span>
      </h2>

      <p className="text-gray-600 text-base leading-relaxed mb-10 font-light">{event.mensaje}</p>

      <div className="space-y-5 text-sm">
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <p className="text-[9px] tracking-[0.25em] text-rose-400 uppercase mb-2">Sus padres</p>
          {event.padres.map((p) => (
            <p key={p} className="text-gray-700">{p}</p>
          ))}
        </div>
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <p className="text-[9px] tracking-[0.25em] text-rose-400 uppercase mb-2">Sus padrinos</p>
          {event.padrinos.map((p) => (
            <p key={p} className="text-gray-700">{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
