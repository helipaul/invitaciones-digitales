import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) return new NextResponse("Forbidden", { status: 403 })

  const supabase = createServiceClient()

  const { data: event } = await supabase
    .from("events")
    .select("id, slug")
    .eq("host_token", token)
    .single()

  if (!event) return new NextResponse("Not Found", { status: 404 })

  const { data: rsvps = [] } = await supabase
    .from("rsvps")
    .select("guest_name, attending, passes, message, created_at")
    .eq("event_id", event.id)
    .order("created_at", { ascending: true })

  const rows = [
    ["Nombre", "Asiste", "Pases", "Mensaje", "Fecha"],
    ...(rsvps ?? []).map((r) => [
      r.guest_name,
      r.attending ? "Sí" : "No",
      r.attending ? String(r.passes) : "0",
      r.message ?? "",
      new Date(r.created_at).toLocaleString("es-MX"),
    ]),
  ]

  // BOM UTF-8 para que Excel en español abra los acentos bien
  const BOM = "﻿"
  const csv =
    BOM +
    rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="confirmaciones-${event.slug}.csv"`,
    },
  })
}
