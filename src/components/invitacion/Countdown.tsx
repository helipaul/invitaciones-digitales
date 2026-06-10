"use client"

import { useEffect, useState } from "react"

interface TimeLeft { dias: number; horas: number; minutos: number; segundos: number }

function calcularTiempo(fecha: Date): TimeLeft {
  const diff = fecha.getTime() - Date.now()
  if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 }
  return {
    dias: Math.floor(diff / 86_400_000),
    horas: Math.floor((diff % 86_400_000) / 3_600_000),
    minutos: Math.floor((diff % 3_600_000) / 60_000),
    segundos: Math.floor((diff % 60_000) / 1_000),
  }
}

function Bloque({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[60px]">
      <span
        className="text-5xl md:text-6xl font-light tabular-nums leading-none text-white"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        {String(valor).padStart(2, "0")}
      </span>
      <span className="text-[9px] tracking-[0.25em] text-white/50 uppercase mt-1">{etiqueta}</span>
    </div>
  )
}

export function Countdown({ fechaISO }: { fechaISO: string }) {
  const [tiempo, setTiempo] = useState<TimeLeft>(() => calcularTiempo(new Date(fechaISO)))
  useEffect(() => {
    const id = setInterval(() => setTiempo(calcularTiempo(new Date(fechaISO))), 1000)
    return () => clearInterval(id)
  }, [fechaISO])

  return (
    <div
      className="py-14 px-6 text-center"
      style={{
        background: "linear-gradient(135deg, var(--inv-hero-start, #1E0A16) 0%, var(--inv-hero-end, #5C1A3C) 100%)",
      }}
    >
      <p className="text-[9px] tracking-[0.35em] text-white/40 uppercase mb-8">Cuenta regresiva</p>
      <div className="flex items-start justify-center gap-5 md:gap-8">
        <Bloque valor={tiempo.dias} etiqueta="días" />
        <span className="text-2xl text-white/20 mt-3 select-none">:</span>
        <Bloque valor={tiempo.horas} etiqueta="horas" />
        <span className="text-2xl text-white/20 mt-3 select-none">:</span>
        <Bloque valor={tiempo.minutos} etiqueta="min" />
        <span className="text-2xl text-white/20 mt-3 select-none">:</span>
        <Bloque valor={tiempo.segundos} etiqueta="seg" />
      </div>
    </div>
  )
}
