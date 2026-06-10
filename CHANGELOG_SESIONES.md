# Changelog de Sesiones

> Más recientes primero. Formato: `## YYYY-MM-DD — [resumen de la sesión]`

---

## 2026-06-09 (2) — Roadmap completo: specs 004–010 y reordenamiento de fases

### Creados
- `specs/SPEC-004-configurador-conversacional.md` — dashboard + chat IA que configura el evento con preview en vivo (Borrador)
- `specs/SPEC-005-dictado-por-voz.md` — entrada por voz en el configurador (Borrador)
- `specs/SPEC-006-ubicaciones-inteligentes.md` — resolución de lugares con Google Places, fotos y mapa (Borrador)
- `specs/SPEC-007-compartir-whatsapp.md` — preview rico OG + link permanente y dinámico (Borrador)
- `specs/SPEC-008-recordatorios-invitados.md` — recordatorios automáticos email/WhatsApp estilo webinar (Borrador)
- `specs/SPEC-009-agendar-calendario.md` — botón agendar Google/Apple (.ics) (Borrador)
- `specs/SPEC-010-album-colaborativo.md` — fotos de invitados en tiempo real + collage proyectable (Borrador)

### Modificados
- `PROGRAMA.md` — Fase 3 pasa de "editor manual" a "Configurador conversacional con IA" (SPEC-004 a 006); nuevas Fase 4 "Difusión y engagement" (SPEC-007 a 009) y Fase 5 "Experiencia del evento en vivo" (SPEC-010); Monetización → Fase 6, Crecimiento → Fase 7; Fase 1.5 (SPEC-003) insertada en orden.

### Decisiones tomadas
- La invitación demo (SPEC-001) se mantiene como prueba de concepto y plantilla que el configurador IA generará; no se reemplaza por un dashboard inicial.
- Prioridad: SPEC-002 (RSVP) antes que el configurador — da la base de invitados que requieren recordatorios, calendario y álbum.
- Branding desde imagen/prompt queda cubierto por SPEC-003 existente; se integra como paso del chat en SPEC-004.
- Recordatorios: email primero (Resend); WhatsApp Business después por costos y verificación Meta.

### Pendientes
- Aprobar specs 004–010 (todas en Borrador).
- Sigue activa la ruta SPEC-001 → SPEC-002.

---

## 2026-06-09 — Fase 0: Setup inicial del proyecto

### Creados
- `CLAUDE.md` — contexto del proyecto para Claude Code (renombrado desde "CLAUDE (1).md")
- `PROGRAMA.md` — fases, milestones y reglas del proyecto
- `specs/SPEC-001-invitacion-demo.md` — spec de la invitación demo de XV años (estado: Borrador)
- `specs/SPEC-002-rsvp-real.md` — spec del RSVP real con Supabase (estado: Borrador)
- `specs/SPEC-TEMPLATE.md` — plantilla para specs futuras
- `CHANGELOG_SESIONES.md` — este archivo
- Proyecto Next.js 15.5.19 inicializado con TypeScript, Tailwind CSS v4, App Router, `src/`

### Estructura del repo establecida
- `/specs` — todas las especificaciones
- `/src/app` — código Next.js (App Router)

### Pendientes
- Crear repositorio en GitHub y conectar Vercel (lo hace el usuario)
- Aprobar SPEC-001 para iniciar implementación de la invitación demo
- Decidir: paleta/estilo de la plantilla (clásica dorada, floral, moderna minimalista)
- Definir nombre del producto y comprar dominio

### Decisiones tomadas
- Next.js 15 (no 16 preview — no tiene binario SWC para Windows aún)
- Tailwind CSS v4 (viene por defecto con Next.js 15 en 2026)
- Turbopack para dev server
