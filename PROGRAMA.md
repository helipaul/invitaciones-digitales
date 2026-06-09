# Programa de Desarrollo — Plataforma de Invitaciones Digitales

> Metodología: **Spec-Driven Development**. Nada se programa sin una especificación
> aprobada. Cada feature viaja en su propia rama y se integra por Pull Request.

---

## 1. Visión del producto

Una web donde cualquier persona crea su invitación digital (XV años, boda, bautizo,
baby shower) en menos de 10 minutos, sin diseñador y sin esperar 72 horas:
elige plantilla, sube fotos, configura su evento y obtiene un link para compartir
por WhatsApp, con confirmaciones de asistencia (RSVP) que llegan solas a su panel.

**Modelo de negocio:** freemium. Gratis con marca de agua → $149–249 MXN para
publicar sin marca, con RSVP ilimitado y extras (música, álbum QR, pases).

**Ventaja competitiva:** autoservicio instantáneo vs. servicios manuales de 72 hrs;
precio 3–10x menor que el mercado actual ($399–$4,888 MXN).

---

## 2. Stack técnico

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend + Backend | Next.js 15 (App Router) + TypeScript | Un solo framework, SSR para SEO, API routes incluidas |
| Estilos | Tailwind CSS | Velocidad para plantillas visuales |
| Base de datos + Auth + Storage | Supabase | Postgres + login + almacenamiento de fotos, plan gratuito generoso |
| Hosting | Vercel | Deploy automático por PR (preview deployments) |
| Pagos | Mercado Pago (MX/LatAm) + Stripe (España/resto) | Cobertura de todo el mercado hispano |
| Control de versiones | Git + GitHub | PRs, reviews, CI |
| Asistente de desarrollo | Claude Code | Implementa specs, abre PRs, corre tests |

Costo inicial: **$0 USD/mes** (todos los planes gratuitos) + dominio (~$12 USD/año).

---

## 3. Flujo de trabajo spec-driven

Cada feature sigue este ciclo, sin excepciones:

```
IDEA → SPEC (borrador) → REVISIÓN/APROBACIÓN → RAMA → IMPLEMENTACIÓN → PR → REVIEW → MERGE
```

1. **Spec primero.** Se redacta `specs/SPEC-NNN-nombre.md` usando `SPEC-TEMPLATE.md`.
   La spec define el QUÉ y el POR QUÉ, criterios de aceptación verificables y lo
   que queda explícitamente fuera de alcance.
2. **Aprobación.** Tú apruebas la spec (estado: `Borrador → Aprobada`). Solo
   entonces se programa.
3. **Rama por spec.** Convención: `feat/spec-NNN-nombre-corto`. Una spec = una rama.
4. **Implementación con Claude Code.** Se le da la spec como contexto y se trabaja
   contra los criterios de aceptación.
5. **Pull Request.** Título: `[SPEC-NNN] Nombre de la feature`. La descripción
   enlaza la spec y marca cada criterio de aceptación con checkbox. Vercel genera
   un deploy de preview para probar visualmente antes de aprobar.
6. **Review y merge.** Revisas el preview, apruebas, merge a `main` (squash).
   La spec pasa a estado `Implementada`.
7. **Cierre de sesión.** Al final de cada sesión de trabajo se registra qué se
   creó/modificó/eliminó y por qué en `CHANGELOG_SESIONES.md` (skill project-tracker).

### Estructura del repositorio

```
invitaciones/
├── CLAUDE.md                  # Contexto del proyecto para Claude Code
├── PROGRAMA.md                # Este documento
├── CHANGELOG_SESIONES.md      # Historial de sesiones de trabajo
├── specs/
│   ├── SPEC-TEMPLATE.md
│   ├── SPEC-001-invitacion-demo.md
│   └── ...
├── src/                       # Código Next.js
└── ...
```

---

## 4. Fases y milestones

### Fase 0 — Setup (1 sesión)
- [ ] Instalar: Node.js LTS, Git, Claude Code, VS Code
- [ ] Crear repo en GitHub con la estructura de arriba
- [ ] `npx create-next-app` + Tailwind + TypeScript
- [ ] Conectar Vercel al repo (deploy automático)
- [ ] Crear proyecto en Supabase
- **Entregable:** "Hola mundo" desplegado en una URL pública.

### Fase 1 — Invitación demo (SPEC-001) — *la prueba de concepto*
- [ ] Una invitación de XV años completa, hermosa, responsive
- [ ] Portada con foto, cuenta regresiva, itinerario, ubicación GPS, código de
      vestimenta, botón de confirmación (mock)
- **Entregable:** un link que puedes mandar por WhatsApp a quien sea para validar.
- **Meta de validación:** mostrarla a 10 personas; si 6+ dicen "yo pagaría por
  esto para mi evento", avanzamos.

### Fase 2 — RSVP real (SPEC-002)
- [ ] Confirmación de asistencia guardada en Supabase (nombre, pases, mensaje)
- [ ] Panel simple del anfitrión: lista de confirmados, contador de pases
- **Entregable:** invitación funcional de punta a punta para un evento real.

### Fase 3 — Builder autoservicio (SPEC-003 a 005)
- [ ] Registro/login de usuarios
- [ ] Editor: elegir plantilla → personalizar textos, colores, fotos, fecha, mapa
- [ ] Publicación con URL única (`tudominio.com/i/maria-xv`)
- [ ] 3 plantillas iniciales: XV años, boda, baby shower
- **Entregable:** cualquier persona crea su invitación sola, sin tocarte.

### Fase 4 — Monetización (SPEC-006 a 007)
- [ ] Marca de agua en plan gratuito
- [ ] Checkout con Mercado Pago / Stripe para desbloquear
- [ ] Extras de pago: música, álbum QR, pases personalizados
- **Entregable:** primera venta real. 🎉

### Fase 5 — Crecimiento (SPEC-008+)
- [ ] SEO: páginas por intención ("invitaciones digitales XV años", por país)
- [ ] Footer viral en cada invitación: "Crea la tuya en..."
- [ ] Analytics (visitas por invitación, conversión free→paid)
- [ ] Más plantillas según demanda
- **Meta:** 1,000 invitaciones creadas.

---

## 5. Reglas del proyecto

1. Ninguna línea de código sin spec aprobada (excepto Fase 0 y hotfixes).
2. `main` siempre desplegable. Todo entra por PR.
3. Cada PR referencia su spec y marca sus criterios de aceptación.
4. Specs pequeñas: si una spec tarda más de 2–3 sesiones, se divide.
5. Validar con personas reales antes de cada fase nueva: el mercado decide, no nosotros.
6. Registrar cada sesión en `CHANGELOG_SESIONES.md` antes de cerrar.
