# SPEC-004 — Dashboard del cliente + configurador conversacional con IA

| Campo | Valor |
|---|---|
| **Estado** | Borrador |
| **Fase** | 3 |
| **Rama** | `feat/spec-004-configurador-conversacional` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |
| **Depende de** | SPEC-002 (Supabase configurado, modelo de datos base) |

---

## 1. Problema / Motivación

Un editor de formularios tradicional (20 campos, 5 pestañas) intimida al cliente
promedio que organiza unos XV años. La diferencia competitiva del producto es que
crear la invitación se sienta como **platicar con un organizador de eventos**: la IA
pregunta, el cliente responde en sus palabras, y la invitación se va armando en vivo.

## 2. Solución propuesta

Un dashboard privado (`/app`) con login, lista de eventos del cliente y botón
"Crear invitación". Al crearla se abre el **configurador**: pantalla dividida
(en móvil, alternable con tabs):

- **Chat con la IA** (lado izquierdo / tab "Configurar"): la IA entrevista al
  cliente paso a paso: tipo de evento → festejada/os → fecha y horarios → lugares
  (ceremonia, recepción) → menú → código de vestimenta → mesa de regalos → mensaje
  personal. El cliente puede responder en desorden o pedir cambios en cualquier momento
  ("mejor cámbiale la fecha al 14").
- **Preview en vivo** (lado derecho / tab "Ver invitación"): la invitación real
  (plantilla de SPEC-001) renderizada con los datos capturados hasta el momento.
  Cada respuesta del cliente actualiza la preview en segundos.

Al terminar, botón **"Publicar"** → URL única `dominio.com/i/{slug}`. El cliente
puede volver al chat después para editar; la invitación publicada se actualiza
sin cambiar de link (invitación dinámica).

## 3. Alcance

### Incluye
- Registro/login con Supabase Auth (email + Google).
- Dashboard: lista de eventos, estado (borrador/publicada), accesos al configurador y al panel RSVP.
- API route del configurador usando la API de Claude con *tool use*: la herramienta
  `actualizar_evento(campo, valor)` escribe en el objeto del evento.
- Modelo de datos `events` en Supabase (JSONB para el contenido de la invitación).
- Preview en vivo sincronizada con el estado del evento.
- Publicación con slug único y edición posterior.

### NO incluye (explícitamente fuera de alcance)
- Dictado por voz → SPEC-005.
- Resolución inteligente de ubicaciones con fotos → SPEC-006.
- Personalización de colores/branding → ya cubierto por SPEC-003 (se integra aquí como un paso más del chat).
- Recordatorios, calendario, álbum → SPEC-008/009/010.
- Múltiples plantillas (se lanza solo con la de XV años; bodas y baby shower después).
- Pagos y marca de agua → Fase de monetización.

## 4. Criterios de aceptación

- [ ] Dado un visitante nuevo, cuando se registra con email o Google, entonces ve su dashboard vacío con botón "Crear invitación".
- [ ] Dado el configurador abierto, cuando el cliente escribe "es para los XV de mi hija Sofía el 12 de diciembre", entonces la IA registra tipo, nombre y fecha, y la preview los muestra sin recargar la página.
- [ ] Dado un dato ya capturado, cuando el cliente pide un cambio en lenguaje natural, entonces el dato se actualiza en el evento y en la preview.
- [ ] Dado un evento completo, cuando el cliente pulsa "Publicar", entonces obtiene una URL pública única que muestra la invitación con sus datos.
- [ ] Dada una invitación publicada, cuando el cliente edita un dato desde el chat, entonces el cambio se refleja en la URL pública sin cambiar el link.
- [ ] Dado un usuario, cuando consulta su dashboard, entonces solo ve sus propios eventos (RLS verificado).
- [ ] Dado un teléfono (viewport ≤ 390px), cuando se usa el configurador, entonces chat y preview son usables vía tabs.

## 5. Detalles técnicos

- Tabla `events`: `id, user_id, slug, status (draft|published), template (xv), data JSONB, created_at, updated_at`. RLS por `user_id`.
- `POST /api/configurator`: recibe historial del chat + estado actual del evento;
  llama a Claude con system prompt de "organizador de eventos" y herramienta
  `actualizar_evento`; devuelve respuesta + parche de datos.
- El componente de invitación de SPEC-001 ya lee de un objeto → se reutiliza tal
  cual para la preview y para la página pública `/i/[slug]`.
- Streaming de respuestas del chat para sensación de fluidez.

## 6. Riesgos y preguntas abiertas

- Costo por conversación de configuración (estimar tokens; ¿límite en plan gratuito?).
- ¿La IA debe validar coherencia (ej. recepción antes que la misa) o solo capturar?
- Manejo de abuso/contenido inapropiado en textos generados.
- Definir spec aparte para el panel RSVP dentro del dashboard (hoy vive en SPEC-002).

## 7. Cómo se validará con usuarios

Sesión con 5 personas no técnicas: crear una invitación real de inicio a fin solo
hablando con el chat, sin ayuda. Éxito = 4 de 5 publican en menos de 10 minutos
y califican la experiencia 8+/10.
