# CLAUDE.md — Contexto del proyecto

## Qué es este proyecto
Plataforma autoservicio de invitaciones digitales para eventos sociales del mundo
hispano (XV años, bodas, bautizos, baby showers). El usuario crea su invitación
en minutos y la comparte por WhatsApp con confirmación de asistencia (RSVP).

## Metodología: Spec-Driven Development
- **Nunca implementes una feature sin spec aprobada.** Las specs viven en `specs/`.
- Si el usuario pide algo sin spec, primero redacta la spec con `specs/SPEC-TEMPLATE.md`
  y pide su aprobación.
- Una spec = una rama (`feat/spec-NNN-nombre-corto`) = un Pull Request.
- El PR debe titularse `[SPEC-NNN] Nombre` y copiar los criterios de aceptación
  como checklist en la descripción.
- `main` siempre debe quedar desplegable.

## Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, Storage) — a partir de SPEC-002
- Vercel (deploy automático, previews por PR)
- Mercado Pago / Stripe — a partir de Fase 4

## Convenciones
- Código y comentarios en español; nombres de variables en inglés.
- Componentes pequeños y reutilizables: las plantillas de invitación deben leer
  sus datos de un objeto/BD, nunca hardcodear textos del evento dentro del componente.
- Mobile-first siempre: el 95% de los invitados abrirá esto desde WhatsApp en el teléfono.
- Commits convencionales: `feat:`, `fix:`, `chore:`, `docs:`.

## Seguimiento de sesiones
Al cerrar cada sesión de trabajo, registrar en `CHANGELOG_SESIONES.md` (más
recientes primero): archivos creados/modificados/eliminados con el motivo,
pendientes y decisiones tomadas.

## Documentos clave
- `PROGRAMA.md` — fases, milestones y reglas del proyecto
- `specs/` — todas las especificaciones
- Spec activa actual: **SPEC-001 (invitación demo de XV años)**
