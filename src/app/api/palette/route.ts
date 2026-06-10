import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic()

const SYSTEM = `Eres un diseñador de eventos de lujo especializado en invitaciones digitales con degradados elegantes.
Genera una paleta de 5 colores para una invitación basada en la imagen o temática recibida.

Reglas estrictas de la paleta:
- primaryDark: muy oscuro (luminosidad HSL < 20%), para el fondo hero oscuro
- primaryMid: oscuro-medio (luminosidad 25-45%), punto medio del degradado hero
- primary: color vibrante y representativo del evento, contraste mínimo 4.5:1 con blanco puro
- primaryLight: muy pálido (luminosidad > 88%), para fondos sutiles y chips
- bg: blanco cálido o crema (luminosidad > 97%), entre #FFFFFF y #FFF8F0
- mood: 5-7 palabras en español describiendo el estilo y emoción

Responde ÚNICAMENTE con JSON válido, sin markdown, sin texto adicional:
{"primaryDark":"#XXXXXX","primaryMid":"#XXXXXX","primary":"#XXXXXX","primaryLight":"#XXXXXX","bg":"#XXXXXX","mood":"..."}`

export async function POST(req: NextRequest) {
  try {
    const { image, prompt } = await req.json() as { image?: string; prompt?: string }

    if (!image && !prompt) {
      return NextResponse.json({ error: "Se requiere imagen o descripción." }, { status: 400 })
    }

    type ContentBlock = Anthropic.ImageBlockParam | Anthropic.TextBlockParam

    let content: string | ContentBlock[]

    if (image) {
      const base64Data = image.replace(/^data:image\/[a-z+]+;base64,/, "")
      const match = image.match(/^data:(image\/[a-z+]+);base64,/)
      const mediaType = (match?.[1] ?? "image/jpeg") as
        | "image/jpeg"
        | "image/png"
        | "image/gif"
        | "image/webp"

      content = [
        {
          type: "image" as const,
          source: { type: "base64" as const, media_type: mediaType, data: base64Data },
        },
        {
          type: "text" as const,
          text: prompt
            ? `Usa la imagen y esta descripción adicional: "${prompt}". Genera la paleta JSON.`
            : "Analiza los colores dominantes de esta imagen y genera la paleta JSON.",
        },
      ]
    } else {
      content = `Genera una paleta para esta temática de evento: "${prompt}"`
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      system: SYSTEM,
      messages: [{ role: "user", content }],
    })

    const raw = message.content[0].type === "text" ? message.content[0].text.trim() : ""

    // Extrae el JSON aunque el modelo ponga texto extra
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Respuesta no contiene JSON válido")

    const palette = JSON.parse(jsonMatch[0])
    return NextResponse.json(palette)
  } catch (err) {
    console.error("[/api/palette]", err)
    return NextResponse.json(
      { error: "No pudimos generar la paleta. Intenta de nuevo." },
      { status: 500 }
    )
  }
}
