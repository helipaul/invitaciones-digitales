"use server"

import { headers } from "next/headers"
import { createServiceClient } from "@/lib/supabase"
import { isRateLimited } from "@/lib/rate-limit"

export type RsvpResult =
  | { ok: true; rsvp_id: string }
  | { ok: false; error: string }

export type RsvpData = {
  id: string
  guest_name: string
  attending: boolean
  passes: number
  message: string | null
}

export async function submitRSVP(input: {
  eventSlug: string
  guestName: string
  attending: boolean
  passes: number
  message: string
  clientId: string
  rsvpId?: string
  honeypot: string
}): Promise<RsvpResult> {
  if (input.honeypot) return { ok: false, error: "Solicitud rechazada." }

  const hdrs = await headers()
  const ip =
    hdrs.get("cf-connecting-ip") ??
    hdrs.get("x-real-ip") ??
    hdrs.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"

  if (isRateLimited(ip)) {
    return { ok: false, error: "Demasiadas solicitudes. Intenta más tarde." }
  }

  if (!input.guestName.trim()) {
    return { ok: false, error: "El nombre es requerido." }
  }
  if (input.attending && (input.passes < 1 || input.passes > 10)) {
    return { ok: false, error: "El número de pases debe ser entre 1 y 10." }
  }

  const supabase = createServiceClient()

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("slug", input.eventSlug)
    .single()

  if (!event) return { ok: false, error: "Evento no encontrado." }

  const payload = {
    guest_name: input.guestName.trim(),
    attending: input.attending,
    passes: input.attending ? input.passes : 1,
    message: input.message.trim() || null,
    updated_at: new Date().toISOString(),
  }

  if (input.rsvpId) {
    const { error } = await supabase
      .from("rsvps")
      .update(payload)
      .eq("id", input.rsvpId)
      .eq("client_id", input.clientId)

    if (error) return { ok: false, error: "No se pudo actualizar tu confirmación." }
    return { ok: true, rsvp_id: input.rsvpId }
  }

  const { data, error } = await supabase
    .from("rsvps")
    .insert({ ...payload, event_id: event.id, client_id: input.clientId })
    .select("id")
    .single()

  if (error || !data) return { ok: false, error: "No se pudo guardar tu confirmación." }
  return { ok: true, rsvp_id: data.id }
}

export async function getRsvp(
  rsvpId: string,
  clientId: string
): Promise<RsvpData | null> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from("rsvps")
    .select("id, guest_name, attending, passes, message")
    .eq("id", rsvpId)
    .eq("client_id", clientId)
    .single()
  return data ?? null
}
