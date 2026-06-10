import type { EventData } from "@/app/demo/valentina-xv/event"

function formatFecha(date: Date) {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre",
  ]
  return `${dias[date.getDay()]}, ${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`
}

export function Portada({ event }: { event: EventData }) {
  return (
    <section
      className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--inv-hero-start, #1E0A16)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, var(--inv-hero-end, #5C1A3C) 0%, var(--inv-hero-start, #1E0A16) 100%)",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-white/[0.03]" />
      </div>

      <div
        className="relative z-10 text-center px-6 max-w-lg"
        style={{ animation: "fadeInUp 1.2s ease-out both" }}
      >
        <p className="text-xs tracking-[0.35em] uppercase mb-6 font-sans text-white/50">
          Los XV Años de
        </p>
        <h1
          className="text-white leading-none mb-6"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(4rem, 18vw, 6.5rem)",
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          {event.nombre}
        </h1>
        <div className="w-12 h-px bg-white/30 mx-auto mb-6" />
        <p className="text-white/80 text-base font-light capitalize">{formatFecha(event.fecha)}</p>
        <p className="text-white/50 text-sm mt-2 tracking-wide">
          {event.misa.hora} hrs · {event.misa.lugar}
        </p>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: "fadeIn 2s ease-out 1.5s both" }}
      >
        <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase">Desliza</p>
        <div className="w-px h-7 bg-gradient-to-b from-white/30 to-transparent animate-bounce" />
      </div>
    </section>
  )
}
