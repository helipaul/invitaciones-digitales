# SPEC-005 — Dictado por voz en el configurador

| Campo | Valor |
|---|---|
| **Estado** | Borrador |
| **Fase** | 3 |
| **Rama** | `feat/spec-005-dictado-por-voz` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |
| **Depende de** | SPEC-004 (configurador conversacional) |

---

## 1. Problema / Motivación

Gran parte del público objetivo (mamás organizando XV años, 35–55 años) escribe
lento en el teléfono pero habla con naturalidad — la nota de voz es el formato rey
de WhatsApp en el mundo hispano. Dictar "la misa es a las 5 en la parroquia de
Guadalupe y luego nos vamos al salón" debe funcionar igual que escribirlo.

## 2. Solución propuesta

Un botón de micrófono en el campo de texto del chat del configurador. Al mantenerlo
presionado (o tocar para iniciar/detener), el habla se transcribe y aparece como
texto editable antes de enviarse, o se envía directo si el cliente lo prefiere
(ajuste "enviar al soltar"). Indicador visual de grabación activa.

## 3. Alcance

### Incluye
- Botón de micrófono en el chat (móvil y escritorio).
- Transcripción en español (es-MX como locale principal).
- Vista previa editable de lo transcrito antes de enviar.
- Manejo de permisos de micrófono denegados (mensaje claro, el chat sigue funcionando por texto).

### NO incluye (explícitamente fuera de alcance)
- Respuestas de la IA por voz (TTS).
- Comandos de voz para navegar la app.
- Transcripción de notas de voz reenviadas desde WhatsApp (posible spec futura).
- Otros idiomas además de español.

## 4. Criterios de aceptación

- [ ] Dado el chat del configurador en un teléfono, cuando el cliente toca el micrófono y habla, entonces su dictado aparece como texto en el campo de entrada.
- [ ] Dado un dictado transcrito, cuando el cliente lo edita antes de enviar, entonces se envía la versión editada.
- [ ] Dado un navegador sin permiso de micrófono, cuando el cliente toca el botón, entonces ve instrucciones para habilitarlo y puede seguir escribiendo.
- [ ] Dado un dictado con datos del evento ("la recepción es a las 8 en el salón Diamante"), cuando se envía, entonces la IA lo procesa igual que un mensaje escrito.

## 5. Detalles técnicos

- Primera opción: **Web Speech API** (`SpeechRecognition`) — costo cero, soporte
  bueno en Chrome/Android (mayoría del público). 
- Fallback para Safari/iOS si `SpeechRecognition` no está disponible o es inestable:
  grabar audio (MediaRecorder) y transcribir server-side (Whisper API). Decidir en
  implementación según pruebas reales en iPhone.
- Sin cambios de modelo de datos.

## 6. Riesgos y preguntas abiertas

- Soporte desigual de Web Speech API en iOS → puede obligar al fallback de pago desde el día 1.
- Ruido ambiental y nombres propios (salones, iglesias) mal transcritos → la vista previa editable mitiga.

## 7. Cómo se validará con usuarios

En la misma sesión de validación de SPEC-004, pedir a los participantes que
configuren al menos 3 campos dictando. Éxito = transcripción utilizable sin
editar en 80%+ de los intentos.
