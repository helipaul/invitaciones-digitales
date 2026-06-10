"use client"

import { useEffect, useRef, useState } from "react"
import { submitRSVP, getRsvp, type RsvpData } from "@/app/actions/rsvp"

type Estado = "loading" | "idle" | "submitting" | "confirmed"

function storageKey(slug: string) {
  return `rsvp_${slug}`
}

function loadStored(slug: string): { rsvp_id: string; client_id: string } | null {
  try {
    const raw = localStorage.getItem(storageKey(slug))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveStored(slug: string, rsvp_id: string, client_id: string) {
  localStorage.setItem(storageKey(slug), JSON.stringify({ rsvp_id, client_id }))
}

export function RSVPForm({ eventSlug }: { eventSlug: string }) {
  const [nombre, setNombre] = useState("")
  const [pases, setPases] = useState(1)
  const [asiste, setAsiste] = useState(true)
  const [mensaje, setMensaje] = useState("")
  const [estado, setEstado] = useState<Estado>("loading")
  const [serverError, setServerError] = useState("")
  const [existingRsvpId, setExistingRsvpId] = useState<string | undefined>()
  const clientIdRef = useRef<string>("")
  const honeypotRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function checkExisting() {
      const stored = loadStored(eventSlug)
      if (!stored) {
        clientIdRef.current = crypto.randomUUID()
        setEstado("idle")
        return
      }
      clientIdRef.current = stored.client_id
      const existing: RsvpData | null = await getRsvp(stored.rsvp_id, stored.client_id)
      if (existing) {
        setNombre(existing.guest_name)
        setAsiste(existing.attending)
        setPases(existing.passes)
        setMensaje(existing.message ?? "")
        setExistingRsvpId(existing.id)
        setEstado("confirmed")
      } else {
        clientIdRef.current = crypto.randomUUID()
        setEstado("idle")
      }
    }
    checkExisting()
  }, [eventSlug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError("")
    setEstado("submitting")

    const result = await submitRSVP({
      eventSlug,
      guestName: nombre,
      attending: asiste,
      passes: pases,
      message: mensaje,
      clientId: clientIdRef.current,
      rsvpId: existingRsvpId,
      honeypot: honeypotRef.current?.value ?? "",
    })

    if (!result.ok) {
      setServerError(result.error)
      setEstado(existingRsvpId ? "confirmed" : "idle")
      return
    }

    saveStored(eventSlug, result.rsvp_id, clientIdRef.current)
    setExistingRsvpId(result.rsvp_id)
    setEstado("confirmed")
  }

  if (estado === "loading") {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-rose-400 animate-spin" />
      </div>
    )
  }

  if (estado === "confirmed" && existingRsvpId) {
    return (
      <div className="py-14 px-5 max-w-sm mx-auto">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, var(--inv-light, #FCE4EC), #F8BBD9)" }}
        >
          <div className="text-5xl mb-4">{asiste ? "🎉" : "💌"}</div>
          <h3
            className="text-3xl mb-2"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--inv-primary-mid, #7B2D52)",
            }}
          >
            {asiste ? `¡Gracias, ${nombre}!` : `Gracias, ${nombre}`}
          </h3>
          {asiste ? (
            <p className="text-gray-700 text-sm leading-relaxed mb-5">
              Te esperamos con{" "}
              <strong>
                {pases} {pases === 1 ? "lugar" : "lugares"}
              </strong>
              .<br />
              ¡Va a ser una noche inolvidable!
            </p>
          ) : (
            <p className="text-gray-700 text-sm mb-5">
              Nos dará mucho gusto tenerte en otro momento. ¡Gracias por tu cariño!
            </p>
          )}
          <button
            onClick={() => setEstado("idle")}
            className="text-xs text-gray-400 underline underline-offset-2"
          >
            Modificar confirmación
          </button>
        </div>
        {serverError && <p className="text-xs text-red-500 mt-3 text-center">{serverError}</p>}
      </div>
    )
  }

  return (
    <div className="py-14 px-5 max-w-sm mx-auto">
      <p className="text-[9px] tracking-[0.35em] text-gray-400 uppercase text-center mb-2">
        Cuéntanos si vienes
      </p>
      <h2
        className="text-4xl text-gray-800 text-center mb-8"
        style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontStyle: "italic" }}
      >
        Confirmación
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot — oculto para humanos, bots lo llenan */}
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ display: "none" }}
        />

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Tu nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-2">¿Asistirás?</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { valor: true, etiqueta: "Sí, asistiré 🎊" },
              { valor: false, etiqueta: "No podré ir 💌" },
            ].map(({ valor, etiqueta }) => (
              <button
                key={etiqueta}
                type="button"
                onClick={() => setAsiste(valor)}
                className="py-3 rounded-xl text-sm font-medium border transition-all"
                style={
                  asiste === valor
                    ? {
                        background: "var(--inv-primary, #C2185B)",
                        color: "white",
                        borderColor: "var(--inv-primary, #C2185B)",
                      }
                    : { background: "white", color: "#6B7280", borderColor: "#E5E7EB" }
                }
              >
                {etiqueta}
              </button>
            ))}
          </div>
        </div>

        {asiste && (
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Número de pases</label>
            <select
              value={pases}
              onChange={(e) => setPases(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition bg-white"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "persona" : "personas"}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">
            Mensaje (opcional)
          </label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un mensaje de buenos deseos..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition resize-none"
          />
        </div>

        {serverError && (
          <p className="text-xs text-red-500">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={estado === "submitting"}
          className="w-full py-4 rounded-full text-white font-medium text-sm tracking-wide transition-all active:scale-95 disabled:opacity-60"
          style={{
            background:
              "linear-gradient(135deg, var(--inv-primary, #C2185B), var(--inv-hero-end, #7B2D52))",
          }}
        >
          {estado === "submitting"
            ? "Guardando..."
            : existingRsvpId
            ? "Actualizar confirmación"
            : "Confirmar asistencia"}
        </button>
      </form>
    </div>
  )
}
