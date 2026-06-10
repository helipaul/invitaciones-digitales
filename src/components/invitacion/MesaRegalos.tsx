import type { EventData } from "@/app/demo/valentina-xv/event"

export function MesaRegalos({ event }: { event: EventData }) {
  return (
    <div className="py-14 px-5 max-w-sm mx-auto">
      <p className="text-[9px] tracking-[0.35em] text-gray-400 uppercase text-center mb-2">
        Tu regalo con cariño
      </p>
      <h2
        className="text-4xl text-gray-800 text-center mb-8"
        style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontStyle: "italic" }}
      >
        Mesa de regalos
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {event.mesaRegalos.map(({ tienda, url }) => (
          <a
            key={tienda}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm active:scale-95 transition-all"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: "var(--inv-light, #FCE4EC)" }}
            >
              🎁
            </div>
            <span className="text-sm font-medium text-gray-700">{tienda}</span>
          </a>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-5">
        Tu presencia es el mejor regalo. ¡Gracias!
      </p>
    </div>
  )
}
