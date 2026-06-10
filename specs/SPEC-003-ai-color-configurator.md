# SPEC-003 — Personalizador de paleta con IA

| Campo | Valor |
|---|---|
| **Estado** | Borrador |
| **Fase** | 1.5 |
| **Rama** | `feat/spec-003-ai-color-configurator` |
| **PR** | #— |
| **Fecha** | 2026-06-09 |
| **Depende de** | SPEC-001 (arquitectura CSS variables ✓ ya implementada) |

---

## 1. Problema / Motivación

La invitación demo es hermosa pero está fija en una paleta rose/burgundy. El valor
real del producto es que **cada persona vea su invitación en los colores de su evento**:
el color del vestido, las flores, el branding de su empresa, la decoración elegida.

La IA resuelve el problema de que el usuario no sepa "traducir" un color o una foto
en una paleta coherente de degradados que se vea elegante. En lugar de que diga
"quiero algo azul marino", sube la foto de su vestido y la IA sabe exactamente
qué azul oscuro usar de fondo y qué azul vibrante usar en los botones.

## 2. Solución propuesta

Un botón "✨ Personalizar con mis colores" al final de la invitación demo que abre
un panel de configuración. El usuario tiene dos caminos:

### Camino A — Sube una imagen
Foto de su vestido, flores, decoración, moodboard, cualquier referencia visual.
La IA analiza la imagen con visión y extrae una paleta de degradados.

### Camino B — Describe la temática
Texto libre: "vestido azul marino con detalles plateados", "jardín con flores
lila y verde esmeralda", "boda minimalista negra y dorada".
La IA genera la paleta basada en la descripción.

### Resultado en ambos casos
La IA devuelve 5 valores hex optimizados para degradados elegantes:
- `primaryDark` — color muy oscuro para el fondo hero (portada + countdown)
- `primaryMid` — punto medio del degradado hero
- `primary` — color vibrante para botones, acentos y texto destacado
- `primaryLight` — versión muy pálida para fondos alternos y chips
- `bg` — blanco cálido o crema para la tarjeta principal

La invitación completa cambia de colores en tiempo real al aplicar.

### Wireframe del panel
```
┌────────────────────────────────────┐
│  ✨ Personaliza tu invitación      │
│                                    │
│  [ 📷 Subir foto ]                 │
│  Vestido, flores, decoración...    │
│                                    │
│  ─────────── o ───────────         │
│                                    │
│  [ Describe tu temática... ]       │
│  "vestido azul marino y plata"     │
│                                    │
│  [ ✨ Generar paleta  ]            │
└────────────────────────────────────┘

Después de generar:

┌────────────────────────────────────┐
│  Tu paleta generada                │
│                                    │
│  ████ ████ ████ ████ ████          │
│  "Elegante azul noche con          │
│   detalles plateados"              │
│                                    │
│  [ ✅ Aplicar a mi invitación ]    │
│  [ 🔄 Generar otra ]               │
│  [ Volver a los colores originales]│
└────────────────────────────────────┘
```

## 3. Alcance

### Incluye
- Botón flotante "✨ Personalizar" en el footer de la invitación
- Panel/modal deslizable con los dos inputs (imagen + texto)
- API route `POST /api/palette` — llama a Claude Vision o texto
- Generación de paleta coherente de 5 colores orientada a degradados
- Aplicación en tiempo real: la invitación cambia de colores sin recargar
- Botón "Restablecer" que vuelve a los colores originales
- Estado de carga con animación ("Analizando tu paleta...")

### NO incluye (por ahora)
- Guardar la paleta en base de datos (→ cuando haya auth)
- Paletas predefinidas para elegir
- Cambiar tipografía o layout (solo colores)
- Procesamiento de imagen en el servidor (se convierte a base64 en el cliente)

## 4. Criterios de aceptación

- [ ] El usuario sube una foto y en ≤ 6 segundos la invitación cambia de colores
- [ ] El usuario escribe una descripción y en ≤ 4 segundos obtiene la paleta
- [ ] Todos los elementos cambian de color: portada, countdown, botones, chips, fondos alternos
- [ ] El color primario generado tiene contraste ≥ 4.5:1 con blanco (si no cumple, la API lo ajusta)
- [ ] "Restablecer" devuelve exactamente los colores originales
- [ ] Si la API falla, se muestra mensaje amigable con opción de reintentar
- [ ] Funciona en móvil: el panel sube desde abajo, no bloquea el scroll

## 5. Detalles técnicos

### Arquitectura (ya implementada en SPEC-001)

```
CSS custom properties en el <main> de la invitación:
  --inv-primary      → botones, acentos
  --inv-hero-start   → fondo portada (muy oscuro)
  --inv-hero-end     → fondo portada (medio)
  --inv-light        → fondos alternos
  --inv-bg           → tarjeta principal
  --inv-text         → texto principal
```

El `ColorConfigurator` solo actualiza estas 6 variables. Todos los componentes
ya las usan → todo cambia automáticamente sin tocar ningún componente.

### API Route: `POST /api/palette`

**Request:**
```ts
{ image?: string }  // base64 de la imagen (opcional)
{ prompt?: string } // descripción de texto (opcional)
// Uno de los dos debe estar presente
```

**Prompt al modelo (imagen):**
```
Eres un diseñador de eventos de lujo especializado en invitaciones con degradados.
Analiza esta imagen y genera una paleta de 5 colores para una invitación elegante.

Reglas de la paleta:
- primaryDark: muy oscuro (luminosidad < 15%), para fondo del hero
- primaryMid: oscuro-medio (luminosidad 20-40%), punto medio del degradado
- primary: color vibrante y reconocible del evento, contraste ≥ 4.5:1 con blanco
- primaryLight: versión muy pálida (luminosidad > 90%), para fondos sutiles
- bg: blanco cálido o crema (#FDFBFC a #FFF9F5)
- mood: descripción del estilo en 5-7 palabras en español

Responde SOLO con JSON válido:
{"primaryDark":"#...","primaryMid":"#...","primary":"#...","primaryLight":"#...","bg":"#...","mood":"..."}
```

**Modelo:** `claude-sonnet-4-6` (vision para imagen, texto plano para descripción)

### Gestión de estado

`ColorConfigurator` es un Client Component que mantiene la paleta activa en
`useState`. Pasa la paleta al `<main>` vía prop que se convierte en `style`
con las CSS custom properties. La página raíz necesita volverse Client Component
o usar un Context para que el estado fluya hacia arriba.

**Patrón elegido:** Context + Provider envuelven la invitación.

```ts
// InvitacionContext.tsx
const InvitacionContext = createContext<{
  paleta: InvitacionPaleta
  setPaleta: (p: InvitacionPaleta) => void
}>()
```

## 6. Riesgos

- **Costo API:** ~$0.002–0.005 por llamada (imagen). Con 500 usos/día ≈ $1–2.50/día en validación.
- **Imágenes de baja calidad:** La IA puede extraer colores incorrectos. Solución: mostrar la paleta antes de aplicar para que el usuario confirme.
- **Tiempo de respuesta:** 2–4s es aceptable con animación de carga.

## 7. Validación con usuarios

Al mostrar la demo, invitar al usuario a subir una foto de su vestido o escribir
su temática. Medir: ¿aplica la paleta? ¿dice "así quería"? ¿paga más por esto?
