import type { EventData } from "@/app/demo/valentina-xv/event"

export function DressCode({ event }: { event: EventData }) {
  const { vestimenta } = event
  return (
    <div className="py-14 px-5 max-w-sm mx-auto">
      <p className="text-[9px] tracking-[0.35em] text-gray-400 uppercase text-center mb-2">
        Para la ocasión
      </p>
      <h2
        className="text-4xl text-gray-800 text-center mb-8"
        style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontStyle: "italic" }}
      >
        Código de vestimenta
      </h2>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
        <p className="text-lg font-medium text-gray-800 mb-4">{vestimenta.descripcion}</p>
        <div className="flex justify-center gap-3 mb-5">
          {vestimenta.colores.map((color) => (
            <span
              key={color}
              className="px-3 py-1 rounded-full text-xs font-medium border text-white"
              style={{
                background: "var(--inv-primary, #C2185B)",
                borderColor: "var(--inv-primary, #C2185B)",
              }}
            >
              {color}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">{vestimenta.notas}</p>
      </div>
    </div>
  )
}
