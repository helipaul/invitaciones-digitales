# SPEC-001 — Invitación demo de XV años

| Campo | Valor |
|---|---|
| **Estado** | Implementada |
| **Fase** | 1 |
| **Rama** | `feat/spec-001-invitacion-demo` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |

---

## 1. Problema / Motivación
Antes de construir la plataforma completa necesitamos validar que el producto
emociona: una invitación digital tan bien lograda que, al verla en el teléfono,
la reacción sea "quiero una para mi evento". Es nuestra herramienta de venta
y de validación de mercado, sin necesidad de backend todavía.

## 2. Solución propuesta
Una página web pública con la invitación ficticia de "Los XV de Valentina",
optimizada 100% para verse en el celular (así llegará por WhatsApp). Secuencia
de secciones al hacer scroll:

1. **Portada:** foto de fondo, nombre de la quinceañera, fecha, animación sutil de entrada.
2. **Cuenta regresiva** en vivo (días, horas, minutos, segundos).
3. **Mensaje personal** de invitación + mención de papás y padrinos.
4. **Itinerario:** misa y recepción, con hora y lugar.
5. **Ubicación:** botón que abre Google Maps con la dirección.
6. **Código de vestimenta.**
7. **Mesa de regalos** (links de ejemplo).
8. **Confirmación de asistencia:** formulario (nombre, nº de pases, mensaje).
   En esta spec es *mock*: muestra "¡Gracias por confirmar!" sin guardar nada.
9. **Footer viral:** "Invitación creada con [NombreDelProducto] — crea la tuya".

## 3. Alcance

### Incluye
- Página Next.js + Tailwind, responsive mobile-first
- Cuenta regresiva funcional en JavaScript
- Animaciones suaves de aparición al hacer scroll
- Metadatos Open Graph (que al compartir por WhatsApp se vea preview con foto y título)
- Deploy en Vercel con URL pública

### NO incluye
- Guardado real de confirmaciones (→ SPEC-002)
- Música de fondo (→ extra de pago, fase 4)
- Editor o personalización por el usuario (→ fase 3)
- Múltiples plantillas (→ fase 3)

## 4. Criterios de aceptación
- [x] Al abrir la URL en un teléfono, la invitación se ve completa y elegante sin zoom ni scroll horizontal
- [x] La cuenta regresiva muestra el tiempo restante real hasta la fecha del evento y se actualiza cada segundo
- [x] El botón de ubicación abre Google Maps con la dirección correcta
- [x] El formulario de confirmación valida nombre no vacío y muestra mensaje de agradecimiento
- [x] Al compartir el link por WhatsApp aparece una tarjeta de preview con imagen y título del evento
- [x] La página carga en menos de 3 segundos en conexión móvil
- [x] Existe el footer con la marca y un link (aunque apunte a "#" por ahora)

## 5. Detalles técnicos
- Next.js App Router, una sola ruta: `/demo/valentina-xv`
- Componentes: `Portada`, `Countdown`, `Itinerario`, `Mapa`, `DressCode`, `MesaRegalos`, `RSVPForm`, `Footer`
- Datos del evento en un objeto TypeScript (`event.ts`) — preparado para que en
  fase 3 ese objeto venga de la base de datos sin reescribir componentes
- Fotos de stock libres de derechos (Unsplash/Pexels)
- Animaciones con CSS / Intersection Observer (sin librerías pesadas)

## 6. Riesgos y preguntas abiertas
- Definir el nombre del producto y comprar el dominio (puede hacerse en paralelo;
  mientras tanto se usa el subdominio de Vercel)
- Elegir paleta/estilo de la plantilla: ¿clásica dorada, floral, moderna minimalista?

## 7. Cómo se validará con usuarios
Enviar el link por WhatsApp a 10 personas (idealmente con eventos próximos en su
familia) con dos preguntas: "¿Pagarías por una así para tu evento?" y "¿Cuánto?".
Meta: 6+ respuestas positivas y disposición a pagar ≥ $150 MXN antes de pasar a Fase 2.
