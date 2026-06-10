# SPEC-010 — Álbum colaborativo en tiempo real (fotos durante la fiesta)

| Campo | Valor |
|---|---|
| **Estado** | Borrador |
| **Fase** | 5 |
| **Rama** | `feat/spec-010-album-colaborativo` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |
| **Depende de** | SPEC-002 (Supabase Storage/Realtime), SPEC-004 (eventos publicados) |

---

## 1. Problema / Motivación

Las mejores fotos de una fiesta están repartidas en los teléfonos de los invitados
y nunca llegan completas al anfitrión. Un álbum colaborativo donde todos suben
fotos durante el evento — y se proyecta como collage en vivo — convierte la
invitación en parte de la fiesta misma. Es el extra de pago más vendible (hoy se
cobra como "álbum QR" en el mercado).

## 2. Solución propuesta

1. **Subir sin fricción**: QR impreso en las mesas y sección "📸 Álbum" en la
   invitación. Abre la cámara/galería del teléfono sin instalar nada ni crear
   cuenta; solo pide un nombre ("Foto de: Tía Lupita") y opcionalmente un mensaje.
2. **Muro en vivo**: collage que se actualiza en tiempo real conforme llegan
   fotos — pensado para proyectarse en pantalla durante la fiesta (modo
   pantalla completa con transiciones).
3. **Galería post-evento**: el álbum queda en la invitación; el anfitrión puede
   descargarlo completo en ZIP.
4. **Moderación**: el anfitrión puede ocultar fotos desde su panel; opción de
   "aprobar antes de mostrar" para eventos formales.

## 3. Alcance

### Incluye
- Subida anónima (nombre opcional) desde el navegador móvil, multi-foto, con compresión client-side.
- Activación del álbum por evento con ventana de tiempo (desde X horas antes hasta 48h después).
- Muro realtime (Supabase Realtime) + modo proyección.
- Panel de moderación (ocultar/eliminar, modo pre-aprobación).
- Descarga ZIP para el anfitrión.
- Límite de almacenamiento por evento según plan.

### NO incluye (explícitamente fuera de alcance)
- Video (solo fotos en v1).
- Filtros, marcos o stickers en las fotos.
- Reconocimiento facial o álbum por persona.
- Impresión fotográfica.

## 4. Criterios de aceptación

- [ ] Dado el QR escaneado con un teléfono, cuando el invitado elige 3 fotos y las sube, entonces aparecen en el muro en menos de 5 segundos sin crear cuenta.
- [ ] Dado el modo proyección abierto en una laptop, cuando llega una foto nueva, entonces entra al collage automáticamente con transición.
- [ ] Dado el panel del anfitrión, cuando oculta una foto, entonces desaparece del muro y de la galería al instante.
- [ ] Dado el modo pre-aprobación activo, cuando un invitado sube una foto, entonces no se muestra hasta que el anfitrión la apruebe.
- [ ] Dado el evento terminado, cuando el anfitrión pulsa "Descargar álbum", entonces obtiene un ZIP con todas las fotos visibles en resolución original.
- [ ] Dada una foto de 12 MB, cuando se sube desde el teléfono, entonces se comprime client-side y la subida tarda <10 s en 4G.

## 5. Detalles técnicos

- Tabla `photos`: `id, event_id, uploader_name, caption, storage_path, status (visible|hidden|pending), created_at`.
- Supabase Storage (bucket por evento) + Realtime channel por evento para el muro.
- Subida con URL firmada (sin exponer keys); rate limit por IP para abuso.
- Compresión client-side (canvas/`browser-image-compression`) a ~2000px máx.
- ZIP generado server-side bajo demanda (Edge function) o client-side con JSZip si el volumen lo permite.
- QR generado por evento apuntando a `/i/[slug]/album`.

## 6. Riesgos y preguntas abiertas

- Contenido inapropiado subido anónimamente → moderación + opción pre-aprobación; evaluar moderación automática (API de visión) como mejora.
- Costo de storage/egress en eventos grandes (500+ fotos) → límites por plan.
- Conectividad mala en salones → cola de subida con reintentos.

## 7. Cómo se validará con usuarios

Usarlo en un evento real (el mismo de SPEC-002): éxito = 20+ invitados suben
fotos sin ayuda y el anfitrión califica el álbum como "lo volvería a pagar".
