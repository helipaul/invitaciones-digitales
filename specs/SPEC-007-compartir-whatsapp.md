# SPEC-007 — Compartir por WhatsApp con preview rico + link permanente

| Campo | Valor |
|---|---|
| **Estado** | Borrador |
| **Fase** | 4 |
| **Rama** | `feat/spec-007-compartir-whatsapp` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |
| **Depende de** | SPEC-004 (invitaciones publicadas con slug) |

---

## 1. Problema / Motivación

El 95% de las invitaciones se compartirán por WhatsApp. Hoy un link pelón se ve
pobre y **se pierde entre los mensajes del grupo**. Necesitamos que al pegarse en
WhatsApp se vea una tarjeta hermosa (foto, nombres, fecha) que invite al clic, y
que el link sea estable y siempre muestre la versión más reciente del evento.

## 2. Solución propuesta

1. **Preview rico (Open Graph)**: cada invitación publicada genera meta tags
   dinámicas — imagen de portada compuesta (foto + nombres + fecha en tipografía
   del evento), título "Te invitamos a los XV de Valentina 💜" y descripción con
   fecha y lugar.
2. **Botón "Compartir" para el anfitrión** en su dashboard: abre el share nativo
   del sistema (Web Share API) con un mensaje sugerido + link; fallback a copiar.
3. **Link permanente y dinámico**: el slug nunca cambia; cualquier edición
   (horario, lugar) se refleja al instante en el mismo link. Si hay un cambio
   importante después de publicar, la invitación muestra un aviso sutil
   "Actualizado: nueva hora de recepción".
4. **Re-pin fácil para invitados**: botón "Guardar invitación" dentro de la
   invitación que sugiere fijarla/agregarla a pantalla de inicio, para que no se
   pierda en la conversación.

## 3. Alcance

### Incluye
- Meta tags OG/Twitter dinámicas por slug (`generateMetadata` en Next.js).
- Generación de imagen OG compuesta (1200×630) por evento, cacheada.
- Botón compartir con Web Share API + fallback copiar link.
- Marca de "última actualización" y aviso de cambios relevantes en la invitación.

### NO incluye (explícitamente fuera de alcance)
- Envío masivo de invitaciones por WhatsApp desde la plataforma → los recordatorios viven en SPEC-008.
- URL corta con dominio propio tipo `inv.ta/xyz` (basta el slug legible).
- Personalización del link por invitado (pases nominales) — spec futura.

## 4. Criterios de aceptación

- [ ] Dado un link de invitación pegado en WhatsApp, cuando se envía, entonces se muestra tarjeta con imagen de portada, título con nombres y descripción con fecha.
- [ ] Dado el dashboard, cuando el anfitrión pulsa "Compartir", entonces se abre el share nativo con mensaje + link (o se copia, en escritorio sin Web Share).
- [ ] Dada una invitación ya compartida, cuando el anfitrión cambia el horario, entonces el mismo link muestra el dato nuevo y un aviso de actualización.
- [ ] Dada la imagen OG, cuando el evento no tiene foto de portada, entonces se genera una versión tipográfica elegante (sin imagen rota).

## 5. Detalles técnicos

- `ImageResponse` de `next/og` para la imagen OG dinámica; ruta `/i/[slug]/opengraph-image`.
- Cachear la imagen OG y revalidarla al editar el evento (revalidateTag por slug).
- WhatsApp cachea previews: incluir versión en la URL de la imagen OG para forzar refresco tras cambios de portada.
- Campo `updated_announcement` en `data` para el aviso de cambios.

## 6. Riesgos y preguntas abiertas

- El cacheo de previews de WhatsApp es agresivo y poco documentado → probar tiempos reales de refresco.
- Emojis en título OG: verificar render correcto en iOS/Android.

## 7. Cómo se validará con usuarios

Enviar la invitación demo a 10 contactos por WhatsApp: éxito = el preview se ve
correcto en 10/10 y el CTR del link supera al de un link sin preview (medible
con analytics básicos de visitas).
