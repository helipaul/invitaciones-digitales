import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createServiceClient } from "@/lib/supabase"

export const metadata: Metadata = {
  robots: "noindex,nofollow",
}

type Rsvp = {
  id: string
  guest_name: string
  attending: boolean
  passes: number
  message: string | null
  created_at: string
}

type Props = { params: Promise<{ host_token: string }> }

export default async function PanelPage({ params }: Props) {
  const { host_token } = await params
  const supabase = createServiceClient()

  const { data: event } = await supabase
    .from("events")
    .select("id, title, event_date, slug")
    .eq("host_token", host_token)
    .single()

  if (!event) notFound()

  const { data: rsvps = [] } = await supabase
    .from("rsvps")
    .select("id, guest_name, attending, passes, message, created_at")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false })

  const confirmados = (rsvps as Rsvp[]).filter((r) => r.attending)
  const noAsisten = (rsvps as Rsvp[]).filter((r) => !r.attending)
  const totalPases = confirmados.reduce((sum, r) => sum + r.passes, 0)
  const wishes = (rsvps as Rsvp[]).filter((r) => r.message?.trim())

  const eventDate = new Date(event.event_date).toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Panel del anfitrión</p>
        <h1 className="text-xl font-semibold text-gray-800">{event.title}</h1>
        <p className="text-sm text-gray-500 capitalize">{eventDate}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Contadores */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Confirmados" value={confirmados.length} color="#10B981" />
          <StatCard label="Pases totales" value={totalPases} color="#6366F1" />
          <StatCard label="No asisten" value={noAsisten.length} color="#F59E0B" />
          <StatCard label="Total respuestas" value={(rsvps as Rsvp[]).length} color="#6B7280" />
        </div>

        {/* Exportar + link de la invitación */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/api/panel/export?token=${host_token}`}
            download={`confirmaciones-${event.slug}.csv`}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <span>↓</span> Exportar CSV
          </a>
          <a
            href={`/demo/${event.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <span>↗</span> Ver invitación
          </a>
        </div>

        {/* Lista de confirmaciones */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Confirmaciones
          </h2>
          {(rsvps as Rsvp[]).length === 0 ? (
            <p className="text-sm text-gray-400 bg-white rounded-2xl p-6 text-center">
              Aún no hay confirmaciones. Comparte el link de la invitación.
            </p>
          ) : (
            <div className="space-y-2">
              {(rsvps as Rsvp[]).map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
                >
                  <span className="text-xl">{r.attending ? "✅" : "❌"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.guest_name}</p>
                    <p className="text-xs text-gray-400">
                      {r.attending
                        ? `${r.passes} ${r.passes === 1 ? "pase" : "pases"}`
                        : "No asistirá"}
                      {" · "}
                      {new Date(r.created_at).toLocaleDateString("es-MX", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Muro de buenos deseos */}
        {wishes.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Buenos deseos
            </h2>
            <div className="space-y-3">
              {wishes.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl px-5 py-4 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    &ldquo;{r.message}&rdquo;
                  </p>
                  <p className="text-xs text-gray-400 mt-2">— {r.guest_name}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
