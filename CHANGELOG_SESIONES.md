# Changelog de Sesiones

> Más recientes primero. Formato: `## YYYY-MM-DD — [resumen de la sesión]`

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
