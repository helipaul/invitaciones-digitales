# SPEC-008 — Recordatorios automáticos a invitados (email y WhatsApp)

| Campo | Valor |
|---|---|
| **Estado** | Borrador |
| **Fase** | 4 |
| **Rama** | `feat/spec-008-recordatorios-invitados` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |
| **Depende de** | SPEC-002 (RSVP con datos de invitados), SPEC-007 (links compartibles) |

---

## 1. Problema / Motivación

La gente confirma con un mes de anticipación y luego olvida la hora, el lugar o
el evento entero. El anfitrión termina persiguiendo invitados por WhatsApp. Como
un webinar de Zoom, la invitación debe recordarle a cada confirmado el evento de
forma automática — es valor directo para el anfitrión y candidato natural a
feature de pago.

## 2. Solución propuesta

Al confirmar asistencia (RSVP de SPEC-002), el invitado deja opcionalmente su
email y/o teléfono y acepta recibir recordatorios. La plataforma envía una
secuencia automática:

| Momento | Canal | Contenido |
|---|---|---|
| Al confirmar | Email | Confirmación + botón "Agregar a calendario" (SPEC-009) + link a la invitación |
| 7 días antes | Email / WhatsApp | "Falta una semana" + datos clave + ubicación |
| 1 día antes | Email / WhatsApp | Recordatorio con hora, lugar, código de vestimenta |
| Día del evento (mañana) | WhatsApp | "¡Hoy es el gran día!" + botón Cómo llegar |

El anfitrión, desde su panel, puede activar/desactivar cada recordatorio y editar
el texto. Todo mensaje incluye link de baja (email) o instrucción de "responder
BAJA" (WhatsApp).

## 3. Alcance

### Incluye
- Campos opcionales email/teléfono + checkbox de consentimiento en el RSVP.
- Motor de recordatorios programados (cron) con la secuencia por defecto.
- **Etapa 1: email** (proveedor transaccional, ej. Resend) — se lanza con esto.
- **Etapa 2: WhatsApp** vía WhatsApp Business Platform (plantillas pre-aprobadas), activable cuando haya verificación de Meta.
- Panel del anfitrión: encender/apagar recordatorios, editar textos, ver enviados.
- Gestión de bajas (unsubscribe) por canal.

### NO incluye (explícitamente fuera de alcance)
- SMS.
- Mensajes 1-a-1 manuales del anfitrión a un invitado desde la plataforma.
- Recordatorios a invitados que NO confirmaron (no tenemos su contacto; el anfitrión los persigue con su propio WhatsApp).

## 4. Criterios de aceptación

- [ ] Dado un RSVP con email y consentimiento, cuando se confirma, entonces llega email de confirmación con botón de calendario en menos de 2 minutos.
- [ ] Dado un evento a 7 días, cuando corre el cron diario, entonces todos los confirmados con consentimiento reciben el recordatorio exactamente una vez (idempotencia verificada).
- [ ] Dado un invitado que se da de baja, cuando llega el siguiente ciclo, entonces no recibe más mensajes y el panel lo refleja.
- [ ] Dado el panel del anfitrión, cuando desactiva el recordatorio de 7 días, entonces ese envío no ocurre para su evento.
- [ ] Dado un cambio de hora del evento, cuando se envía cualquier recordatorio posterior, entonces incluye los datos actualizados.

## 5. Detalles técnicos

- Tabla `reminders`: `id, event_id, rsvp_id, type, channel, scheduled_for, sent_at, status`.
- Cron (Vercel Cron o Supabase pg_cron) cada hora: selecciona pendientes vencidos → envía → marca. Reintentos con backoff.
- Email: Resend + plantillas React Email con la paleta del evento.
- WhatsApp: plantillas HSM pre-aprobadas (los recordatorios salen fuera de la ventana de 24h, requieren plantilla sí o sí).
- Consentimiento registrado con timestamp (cumplimiento LFPDPPP/GDPR básico).

## 6. Riesgos y preguntas abiertas

- WhatsApp Business Platform: requiere verificación de negocio en Meta y tiene costo por conversación (~$0.04–0.07 USD en MX) → por eso email primero.
- Entregabilidad de email (dominio propio + SPF/DKIM desde el día 1).
- ¿Recordatorios incluidos en plan gratuito o solo de pago? (propuesta: email gratis, WhatsApp de pago).

## 7. Cómo se validará con usuarios

En el primer evento real: medir % de confirmados que aceptan recordatorios
(meta: >60%) y encuestar al anfitrión post-evento sobre cuánto redujo el
seguimiento manual.
