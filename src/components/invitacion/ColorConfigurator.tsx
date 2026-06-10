"use client"

import { useRef, useState } from "react"
import { useInvitacion } from "@/context/InvitacionContext"
import { paletaDefault, type InvitacionPaleta } from "./palette"

type Estado = "idle" | "loading" | "preview" | "error"

interface PaletaPreview {
  palette: InvitacionPaleta
  mood: string
}

export function ColorConfigurator() {
  const { setPaleta } = useInvitacion()
  const [open, setOpen] = useState(false)
  const [estado, setEstado] = useState<Estado>("idle")
  const [prompt, setPrompt] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [preview, setPreview] = useState<PaletaPreview | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function handleClose() {
    setOpen(false)
    if (estado !== "loading") {
      setEstado("idle")
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setImagePreview(result)
      setImageBase64(result)
    }
    reader.readAsDataURL(file)
  }

  async function handleGenerate() {
    if (!imageBase64 && !prompt.trim()) return
    setEstado("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64 ?? undefined,
          prompt: prompt.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "Error de API")

      setPreview({
        palette: {
          primary: data.primary ?? paletaDefault.primary,
          primaryDark: data.primaryDark ?? paletaDefault.primaryDark,
          primaryMid: data.primaryMid ?? paletaDefault.primaryMid,
          primaryLight: data.primaryLight ?? paletaDefault.primaryLight,
          bg: data.bg ?? paletaDefault.bg,
          text: "#1A1A1A",
        },
        mood: data.mood ?? "",
      })
      setEstado("preview")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "No pudimos generar la paleta. Intenta de nuevo.")
      setEstado("error")
    }
  }

  function handleApply() {
    if (preview) {
      setPaleta(preview.palette)
      setOpen(false)
      setEstado("idle")
    }
  }

  function handleReset() {
    setPaleta(paletaDefault)
    setOpen(false)
    setEstado("idle")
    setPreview(null)
    setImagePreview(null)
    setImageBase64(null)
    setPrompt("")
  }

  function handleRetry() {
    setEstado("idle")
    setPreview(null)
  }

  const canGenerate = (!!imageBase64 || prompt.trim().length > 0) && estado !== "loading"

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-50 flex items-center gap-2 text-white text-sm font-medium px-4 py-3 rounded-full shadow-xl active:scale-95 transition-all"
        style={{
          background:
            "linear-gradient(135deg, var(--inv-hero-end, #5C1A3C), var(--inv-primary, #C2185B))",
        }}
      >
        ✨ Personalizar
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-w-md mx-auto ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "88vh", overflowY: "auto" }}
      >
        {/* Handle */}
        <div className="sticky top-0 bg-white pt-3 pb-4 px-6 border-b border-gray-50">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <h3
            className="text-2xl text-gray-800 text-center"
            style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}
          >
            Personaliza tu invitación
          </h3>
          <p className="text-xs text-gray-400 text-center mt-1">
            Sube una foto de tu vestido, flores o branding
          </p>
        </div>

        <div className="px-6 py-6 pb-10">
          {/* ── Estado: idle o error ── */}
          {(estado === "idle" || estado === "error") && (
            <>
              {/* Upload */}
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center gap-2 mb-4 transition-colors"
                style={{
                  borderColor: imagePreview
                    ? "var(--inv-primary, #C2185B)"
                    : "#E5E7EB",
                }}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-28 h-28 object-cover rounded-xl shadow-md"
                    />
                    <span className="text-xs text-gray-400">Toca para cambiar</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl">📷</span>
                    <span className="text-sm font-medium text-gray-600">
                      Subir foto de referencia
                    </span>
                    <span className="text-xs text-gray-400">
                      Vestido · Flores · Decoración · Moodboard
                    </span>
                  </>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">o describe tu temática</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`"vestido azul marino con plata"\n"jardín tropical con hojas verdes"\n"boda minimalista negra y dorada"`}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition resize-none mb-4"
                style={
                  {
                    "--tw-ring-color": "var(--inv-primary, #C2185B)",
                  } as React.CSSProperties
                }
              />

              {estado === "error" && (
                <p className="text-xs text-red-500 text-center mb-4 bg-red-50 rounded-xl py-2 px-3">
                  {errorMsg}
                </p>
              )}

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full py-4 rounded-full text-white font-medium text-sm transition-all active:scale-95 disabled:opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, var(--inv-primary, #C2185B), var(--inv-hero-end, #5C1A3C))",
                }}
              >
                ✨ Generar paleta con IA
              </button>
            </>
          )}

          {/* ── Estado: loading ── */}
          {estado === "loading" && (
            <div className="py-12 flex flex-col items-center gap-4 text-center">
              <div
                className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: "var(--inv-light, #FCE4EC)", borderTopColor: "var(--inv-primary, #C2185B)" }}
              />
              <p
                className="text-xl text-gray-700"
                style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}
              >
                Analizando tu paleta...
              </p>
              <p className="text-xs text-gray-400">La IA está leyendo tus colores</p>
            </div>
          )}

          {/* ── Estado: preview ── */}
          {estado === "preview" && preview && (
            <>
              {/* Muestra de colores */}
              <div className="flex gap-2 justify-center mb-5">
                {[
                  preview.palette.primaryDark,
                  preview.palette.primaryMid,
                  preview.palette.primary,
                  preview.palette.primaryLight,
                  preview.palette.bg,
                ].map((color, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full shadow-md border border-gray-100"
                    style={{ background: color }}
                    title={color}
                  />
                ))}
              </div>

              <p
                className="text-center text-xl text-gray-700 mb-1 px-4"
                style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}
              >
                "{preview.mood}"
              </p>
              <p className="text-center text-xs text-gray-400 mb-6">
                Así quedará tu invitación
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleApply}
                  className="w-full py-4 rounded-full text-white font-medium text-sm active:scale-95 transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--inv-primary, #C2185B), var(--inv-hero-end, #5C1A3C))",
                  }}
                >
                  ✅ Aplicar a mi invitación
                </button>
                <button
                  onClick={handleRetry}
                  className="w-full py-3 rounded-full text-gray-600 text-sm border border-gray-200 active:scale-95 transition-all"
                >
                  🔄 Generar otra paleta
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-full text-gray-400 text-sm active:scale-95 transition-all"
                >
                  Volver a los colores originales
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
