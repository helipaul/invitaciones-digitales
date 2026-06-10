"use client"

import { createContext, useContext, useState } from "react"
import {
  paletaDefault,
  paletaToVars,
  type InvitacionPaleta,
} from "@/components/invitacion/palette"

interface InvitacionContextType {
  paleta: InvitacionPaleta
  setPaleta: (p: InvitacionPaleta) => void
}

const InvitacionContext = createContext<InvitacionContextType>({
  paleta: paletaDefault,
  setPaleta: () => {},
})

export function InvitacionProvider({ children }: { children: React.ReactNode }) {
  const [paleta, setPaleta] = useState<InvitacionPaleta>(paletaDefault)

  return (
    <InvitacionContext.Provider value={{ paleta, setPaleta }}>
      {/* Este div inyecta las CSS vars en todo el árbol de la invitación */}
      <div style={paletaToVars(paleta) as React.CSSProperties}>{children}</div>
    </InvitacionContext.Provider>
  )
}

export function useInvitacion() {
  return useContext(InvitacionContext)
}
