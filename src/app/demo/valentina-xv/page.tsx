import type { Metadata } from "next"
import { event } from "./event"
import { InvitacionProvider } from "@/context/InvitacionContext"
import { Portada } from "@/components/invitacion/Portada"
import { Countdown } from "@/components/invitacion/Countdown"
import { Mensaje } from "@/components/invitacion/Mensaje"
import { Itinerario } from "@/components/invitacion/Itinerario"
import { Mapa } from "@/components/invitacion/Mapa"
import { DressCode } from "@/components/invitacion/DressCode"
import { MesaRegalos } from "@/components/invitacion/MesaRegalos"
import { RSVPForm } from "@/components/invitacion/RSVPForm"
import { FooterViral } from "@/components/invitacion/FooterViral"
import { AnimatedSection } from "@/components/invitacion/AnimatedSection"
import { ColorConfigurator } from "@/components/invitacion/ColorConfigurator"

export const metadata: Metadata = {
  title: "Los XV de Valentina — 15 de agosto 2026",
  description:
    "Estás invitada a celebrar los XV años de Valentina Ramírez. Una noche llena de alegría y recuerdos que durarán toda la vida.",
  openGraph: {
    title: "Los XV de Valentina 🌹",
    description: "Acompáñanos a celebrar esta noche tan especial. ¡Te esperamos!",
    type: "website",
    locale: "es_MX",
  },
}

export default function ValentinaXV() {
  return (
    <InvitacionProvider>
      {/* Portada y countdown full-width */}
      <Portada event={event} />
      <Countdown fechaISO={event.fecha.toISOString()} />

      {/* Tarjeta central */}
      <main
        className="max-w-md mx-auto shadow-2xl"
        style={{ background: "var(--inv-bg, #FDFBFC)" }}
      >
        <AnimatedSection>
          <Mensaje event={event} />
        </AnimatedSection>

        <Separador />

        <AnimatedSection>
          <Itinerario event={event} />
        </AnimatedSection>

        <AnimatedSection>
          <div style={{ background: "var(--inv-light, #FCE4EC)" }}>
            <Mapa event={event} />
          </div>
        </AnimatedSection>

        <Separador />

        <AnimatedSection>
          <DressCode event={event} />
        </AnimatedSection>

        <AnimatedSection>
          <div style={{ background: "var(--inv-light, #FCE4EC)" }}>
            <MesaRegalos event={event} />
          </div>
        </AnimatedSection>

        <Separador />

        <RSVPForm eventSlug="valentina-xv" />

        <FooterViral />
      </main>

      {/* Botón flotante para personalizar colores */}
      <ColorConfigurator />
    </InvitacionProvider>
  )
}

function Separador() {
  return (
    <div className="flex items-center justify-center py-3 px-8">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="mx-3 text-gray-300 text-sm">✦</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}
