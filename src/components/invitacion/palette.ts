export interface InvitacionPaleta {
  primary: string
  primaryDark: string
  primaryMid: string
  primaryLight: string
  bg: string
  text: string
}

export const paletaDefault: InvitacionPaleta = {
  primary: "#C2185B",
  primaryDark: "#1E0A16",
  primaryMid: "#5C1A3C",
  primaryLight: "#FCE4EC",
  bg: "#FDFBFC",
  text: "#1A1A1A",
}

export function paletaToVars(p: InvitacionPaleta): Record<string, string> {
  return {
    "--inv-primary": p.primary,
    "--inv-hero-start": p.primaryDark,
    "--inv-hero-end": p.primaryMid,
    "--inv-light": p.primaryLight,
    "--inv-bg": p.bg,
    "--inv-text": p.text,
  }
}
