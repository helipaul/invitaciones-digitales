import { ImageResponse } from "next/og"
import { event } from "./event"

export const runtime = "edge"
export const alt = `Los XV de ${event.nombre} — ${event.fecha.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  const fecha = event.fecha.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 60% 40%, #7B2D52 0%, #3D0F2A 50%, #1E0A16 100%)",
          fontFamily: "serif",
        }}
      >
        {/* Anillos decorativos */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        />

        {/* Contenido */}
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 22,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Los XV Años de
        </p>

        <p
          style={{
            color: "white",
            fontSize: 110,
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1,
            marginBottom: 28,
          }}
        >
          {event.nombre}
        </p>

        <div
          style={{
            width: 60,
            height: 1,
            background: "rgba(255,255,255,0.4)",
            marginBottom: 28,
          }}
        />

        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 26,
            textTransform: "capitalize",
            letterSpacing: "0.02em",
          }}
        >
          {fecha}
        </p>

        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 20,
            marginTop: 10,
            letterSpacing: "0.05em",
          }}
        >
          {event.misa.lugar} · {event.recepcion.lugar}
        </p>
      </div>
    ),
    { ...size }
  )
}
