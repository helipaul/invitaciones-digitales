import type { EventData } from "@/app/demo/valentina-xv/event"

export function Mapa({ event }: { event: EventData }) {
  return (
    <div className="py-10 px-5 max-w-sm mx-auto text-center">
      <div
        className="rounded-2xl p-8"
        style={{ background: "var(--inv-light, #FCE4EC)" }}
      >
        <div className="text-3xl mb-3">📍</div>
        <p className="font-medium text-gray-800 mb-1">{event.recepcion.lugar}</p>
        <p className="text-sm text-gray-500 mb-6">{event.recepcion.direccion}</p>
        <a
          href={event.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full transition-all active:scale-95"
          style={{ background: "var(--inv-primary, #C2185B)" }}
        >
          Ver en Google Maps
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}
