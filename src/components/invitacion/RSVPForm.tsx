"use client"

import { useState } from "react"

type Estado = "idle" | "enviando" | "confirmado"

export function RSVPForm() {
  const [nombre, setNombre] = useState("")
  const [pases, setPases] = useState(1)
  const [asiste, setAsiste] = useState<boolean>(true)
  const [mensaje, setMensaje] = useState("")
  const [estado, setEstado] = useState<Estado>("idle")
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setError("Por favor escribe tu nombre.")
      return
    }
    setError("")
    setEstado("enviando")
    setTimeout(() => setEstado("confirmado"), 800)
  }

  if (estado === "confirmado") {
    return (
      <div className="py-14 px-5 max-w-sm mx-auto">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #FCE4EC, #F8BBD9)" }}
        >
          <div className="text-5xl mb-4">{asiste ? "🎉" : "💌"}</div>
          <h3
            className="text-3xl mb-2"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "#7B2D52",
            }}
          >
            {asiste ? `¡Gracias, ${nombre.trim()}!` : `Gracias, ${nombre.trim()}`}
          </h3>
          {asiste ? (
            <p className="text-gray-700 text-sm leading-relaxed">
              Te esperamos con{" "}
              <strong>{pases} {pases === 1 ? "lugar" : "lugares"}</strong>.
              <br />¡Va a ser una noche inolvidable!
            </p>
          ) : (
            <p className="text-gray-700 text-sm">
              Nos dará mucho gusto tenerte en otro momento. ¡Gracias por tu cariño!
            </p>
          )}
        </div>
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
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Tu nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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
                    ? { background: "#C2185B", color: "white", borderColor: "#C2185B" }
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
            Mensaje para Valentina (opcional)
          </label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un mensaje de buenos deseos..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={estado === "enviando"}
          className="w-full py-4 rounded-full text-white font-medium text-sm tracking-wide transition-all active:scale-95 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #C2185B, #7B2D52)" }}
        >
          {estado === "enviando" ? "Enviando..." : "Confirmar asistencia"}
        </button>
      </form>
    </div>
  )
}
