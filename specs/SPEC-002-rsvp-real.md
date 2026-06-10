# SPEC-002 — RSVP real con Supabase + panel del anfitrión

| Campo | Valor |
|---|---|
| **Estado** | Aprobada |
| **Fase** | 2 |
| **Rama** | `feat/spec-002-rsvp-real` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |
| **Depende de** | SPEC-001 implementada y validada |

---

## 1. Problema / Motivación
La invitación demo emociona, pero su valor real para quien paga es **saber quién
va a su evento sin perseguir a nadie por WhatsApp**. El RSVP que se guarda solo y
se consulta en un panel es la funcionalidad que convierte una página bonita en un
producto por el que vale la pena pagar. Con esto, la invitación ya puede usarse
en un **evento real** (idealmente de algún conocido, como primer caso de éxito).

## 2. Solución propuesta
Dos piezas:

**A) Confirmación real (lado invitado).** El formulario de la invitación (hoy mock)
guarda en base de datos: nombre, número de pases, asistencia (sí/no) y mensaje
opcional de buenos deseos. Tras confirmar, muestra agradecimiento personalizado
("¡Gracias, María! Te esperamos con 3 pases"). Si el mismo invitado vuelve a abrir
el link en el mismo dispositivo, ve su confirmación ya registrada con opción de editarla.

**B) Panel del anfitrión (lado cliente).** Una página privada, accesible con un
link secreto (token largo en la URL, sin login todavía), que muestra:
- Contadores: confirmados, pases totales, no asisten, pendiente estimado
- Lista de confirmaciones con nombre, pases, mensaje y fecha/hora
- Botón "Exportar a CSV" (la lista en Excel es oro para organizar mesas)
- Muro de buenos deseos (los mensajes de los invitados)

## 3. Alcance

### Incluye
- Proyecto Supabase: tablas, políticas de seguridad (RLS) y conexión desde Next.js
- Tabla `events` (aunque por ahora solo exista el evento demo) y tabla `rsvps`
- API route / server action para crear y editar confirmaciones
- Panel del anfitrión con link secreto por evento
- Export CSV de confirmaciones
- Validaciones: nombre requerido, pases entre 1 y 10, anti-spam básico
  (rate limit por IP y honeypot en el formulario)

### NO incluye
- Login / cuentas de usuario (→ Fase 3; el link secreto es suficiente por ahora)
- Notificación al anfitrión por correo/WhatsApp cuando alguien confirma (→ spec futura)
- Edición de la invitación desde el panel (→ Fase 3, builder)
- Límite de pases asignados por invitado/familia con links personalizados (→ spec futura)

## 4. Criterios de aceptación
- [ ] Un invitado confirma desde su teléfono y la confirmación aparece en el panel en menos de 5 segundos
- [ ] El formulario rechaza nombre vacío y pases fuera de rango con mensajes claros en español
- [ ] Si el invitado ya confirmó en ese dispositivo, al volver ve su confirmación y puede editarla (no se duplica)
- [ ] El panel muestra contadores correctos: suma de pases solo de quienes dijeron que sí
- [ ] El panel solo es accesible con el token correcto; con token inválido responde 404
- [ ] El botón de exportar descarga un CSV que abre bien en Excel (acentos correctos, UTF-8 con BOM)
- [ ] Las políticas RLS de Supabase impiden leer confirmaciones sin el token del evento (verificado intentando leer la tabla directo con la anon key)
- [ ] Enviar 10 confirmaciones seguidas desde la misma IP activa el límite anti-spam

## 5. Detalles técnicos

### Modelo de datos (Postgres / Supabase)
```sql
events (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,          -- 'valentina-xv'
  title       text not null,
  event_date  timestamptz not null,
  host_token  text unique not null,          -- token del panel (32+ chars aleatorios)
  created_at  timestamptz default now()
)

rsvps (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references events(id) on delete cascade,
  guest_name  text not null,
  attending   boolean not null,
  passes      int not null check (passes between 1 and 10),
  message     text,
  client_id   text,                          -- uuid guardado en localStorage para editar
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
)
```

### Decisiones
- Escrituras vía **server actions** de Next.js con la service key (nunca exponer
  la service key al cliente); RLS bloquea acceso directo con la anon key.
- `client_id`: uuid generado en el navegador y guardado en localStorage para
  permitir edición sin login. Suficiente para esta fase.
- El panel vive en `/panel/[host_token]` con `noindex` para que no lo indexen buscadores.
- CSV generado en el servidor con BOM UTF-8 para compatibilidad con Excel en español.
- Rate limit simple en memoria/Upstash por IP en la server action.

## 6. Riesgos y preguntas abiertas
- ¿El anfitrión querrá recibir aviso inmediato por WhatsApp/correo al confirmar
  alguien? Probable sí → anotar demanda durante el evento real y convertirlo en spec.
- localStorage no funciona entre dispositivos del mismo invitado: aceptable por ahora.
- Definir qué pasa después de la fecha del evento (¿cerrar confirmaciones automáticamente?).

## 7. Cómo se validará con usuarios
Usarla en **un evento real** de un conocido (gratis, a cambio de retroalimentación):
medir cuántos invitados confirman por la página vs. por mensaje directo, y
preguntar al anfitrión qué le faltó al panel. Meta: ≥50% de confirmaciones llegan
por la invitación y el anfitrión dice que pagaría por usarla en su próximo evento.
