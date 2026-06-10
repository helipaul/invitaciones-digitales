# SPEC-009 — Agendar en calendario (Google / Apple / Outlook)

| Campo | Valor |
|---|---|
| **Estado** | Borrador |
| **Fase** | 4 |
| **Rama** | `feat/spec-009-agendar-calendario` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |
| **Depende de** | SPEC-001 (invitación con datos del evento) |

---

## 1. Problema / Motivación

Aunque haya recordatorios, los invitados viven en su calendario. Un botón
"Agendar" — como el de los webinars — mete el evento en Google Calendar o en el
calendario del iPhone con un toque, con lugar, hora y alarma incluidos.

## 2. Solución propuesta

Botón **"Agendar en mi calendario"** en la invitación pública (y en el email de
confirmación de SPEC-008). Al tocarlo:

- **Android / Google**: abre link de Google Calendar pre-llenado.
- **iPhone / Mac**: descarga archivo `.ics` que abre el calendario de Apple.
- Detección automática de plataforma con menú de respaldo ("Google · Apple · Outlook").

El evento agendado incluye: título ("XV de Valentina 💜"), fecha/hora de inicio y
fin, dirección del lugar (con coordenadas para que el calendario muestre mapa),
link a la invitación en las notas y alarma 1 día antes + 2 horas antes. Si el
evento tiene dos momentos (misa y recepción), se agenda como un solo bloque desde
la misa, con el itinerario en las notas.

## 3. Alcance

### Incluye
- Endpoint `.ics` por invitación (`/i/[slug]/evento.ics`) generado al vuelo con datos vigentes.
- Link "template" de Google Calendar.
- Botón con detección de plataforma + menú fallback.
- Zona horaria correcta del evento (configurable, default America/Mexico_City).

### NO incluye (explícitamente fuera de alcance)
- Sincronización viva (si el anfitrión cambia la hora, el calendario del invitado NO se actualiza solo — los recordatorios de SPEC-008 cubren ese caso). Suscripción iCal viva: posible spec futura.
- OAuth con Google para insertar directo en el calendario.

## 4. Criterios de aceptación

- [ ] Dado un iPhone, cuando el invitado toca "Agendar", entonces se abre el calendario de Apple con el evento pre-llenado (título, fechas, lugar, notas, alarmas).
- [ ] Dado un Android, cuando toca "Agendar", entonces se abre Google Calendar pre-llenado.
- [ ] Dado el evento agendado, cuando el invitado lo abre en su calendario, entonces la dirección abre el mapa correcto.
- [ ] Dado un cambio de hora previo a agendar, cuando un invitado nuevo agenda, entonces obtiene los datos actualizados.
- [ ] Dado el `.ics` generado, cuando se valida contra RFC 5545, entonces pasa sin errores (probar en Apple, Google y Outlook).

## 5. Detalles técnicos

- Generar `.ics` a mano o con librería ligera (`ics` en npm): `VEVENT` con `DTSTART;TZID`, `LOCATION`, `GEO`, `URL`, dos `VALARM`.
- Link Google: `https://calendar.google.com/calendar/render?action=TEMPLATE&...`.
- `UID` estable por evento (slug@dominio) para que re-agendar sobrescriba en vez de duplicar.
- Sin cambios de modelo de datos.

## 6. Riesgos y preguntas abiertas

- Comportamiento del `.ics` en WhatsApp in-app browser de iOS (a veces no dispara el calendario) → probar y, si falla, instruir "abrir en Safari".

## 7. Cómo se validará con usuarios

Prueba con 6 dispositivos reales (3 iPhone, 3 Android): éxito = 6/6 agendan en
menos de 15 segundos sin instrucciones.
