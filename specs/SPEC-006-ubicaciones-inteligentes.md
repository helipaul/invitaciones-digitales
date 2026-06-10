# SPEC-006 — Ubicaciones inteligentes (lugares con fotos y mapa sin buscar)

| Campo | Valor |
|---|---|
| **Estado** | Borrador |
| **Fase** | 3 |
| **Rama** | `feat/spec-006-ubicaciones-inteligentes` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |
| **Depende de** | SPEC-004 (configurador conversacional) |

---

## 1. Problema / Motivación

Capturar bien una ubicación es lo más tedioso de crear una invitación: copiar la
dirección exacta, conseguir el link de Google Maps, verificar que sea el lugar
correcto. El cliente debería poder decir "la misa es en la Parroquia del Sagrado
Corazón en Toluca" o pegar un link de Maps, y que la IA resuelva todo lo demás.

## 2. Solución propuesta

Dentro del chat del configurador, cuando el cliente menciona un lugar, la IA lo
resuelve automáticamente y responde con una **tarjeta de confirmación**: nombre
oficial, dirección completa, foto(s) de referencia del lugar (si existen) y
mini-mapa. El cliente confirma con un toque ("Sí, es ese") o pide otra opción.

Entradas aceptadas:
1. **Nombre en lenguaje natural**: "el salón Jardines del Lago en Metepec".
2. **Link de Google Maps** pegado (incluye links cortos `maps.app.goo.gl` compartidos desde WhatsApp).
3. **Coordenadas / ubicación compartida** (texto con lat,lng).

Al confirmar, la ubicación queda en la invitación con: nombre, dirección, foto de
referencia y botón "Cómo llegar" que abre Google Maps / Apple Maps.

## 3. Alcance

### Incluye
- Integración con Google Places API (búsqueda por texto, detalles, fotos).
- Expansión de links cortos de Maps a place_id.
- Tarjeta de confirmación en el chat con foto y dirección; selección entre hasta 3 candidatos si hay ambigüedad.
- Almacenamiento en el evento: `place_id`, nombre, dirección, lat/lng, URL de foto.
- Botón "Cómo llegar" en la invitación pública (deep link a Maps).

### NO incluye (explícitamente fuera de alcance)
- Sugerencias proactivas de salones/proveedores ("encuéntrame un salón") — posible feature premium futura.
- Indicaciones de ruta dentro de la invitación.
- Lugares sin presencia en Google Maps (se captura manual: nombre + dirección escrita).

## 4. Criterios de aceptación

- [ ] Dado el chat, cuando el cliente escribe el nombre de un lugar real, entonces recibe una tarjeta con nombre oficial, dirección y foto (si existe) en menos de 5 segundos.
- [ ] Dado un link de Google Maps pegado (largo o corto), cuando se envía, entonces la IA identifica el lugar correcto sin pedir más datos.
- [ ] Dada una búsqueda ambigua ("parroquia de Guadalupe"), cuando hay varios candidatos, entonces se muestran hasta 3 opciones con foto y el cliente elige.
- [ ] Dado un lugar confirmado, cuando se ve la invitación pública, entonces aparece con foto de referencia y el botón "Cómo llegar" abre la app de mapas con el destino correcto.
- [ ] Dado un lugar inexistente en Maps, cuando la búsqueda no arroja resultados, entonces la IA ofrece captura manual y la invitación lo muestra sin mapa roto.

## 5. Detalles técnicos

- `POST /api/places/resolve`: recibe texto o URL → Places Text Search / detalles → candidatos normalizados. La API key vive solo en el servidor.
- Fotos vía Places Photo API; cachear la referencia/foto en Supabase Storage para no pagar por cada render de la invitación.
- Nueva herramienta del configurador: `resolver_ubicacion(query)`.
- Estructura en `data.locations[]`: `{ role: ceremonia|recepcion, name, address, lat, lng, place_id, photo_url }`.

## 6. Riesgos y preguntas abiertas

- **Costos de Places API**: hay capa gratuita mensual; cachear agresivamente y medir. Definir tope.
- Términos de uso de Google sobre cacheo de fotos (revisar: place_id sí es cacheable indefinidamente).
- ¿Permitir foto propia del cliente en lugar de la de Google? (probablemente sí, barato de agregar).

## 7. Cómo se validará con usuarios

En pruebas de SPEC-004: éxito = el 90% de los lugares mencionados se resuelven
al primer o segundo intento sin que el cliente tenga que abrir Google Maps.
