# Guía de Extracción de Diseño desde Figma
## DEKALB Experience Website

Esta guía te ayudará a extraer todos los tokens de diseño y assets necesarios desde Figma.

---

## 📋 CHECKLIST DE EXTRACCIÓN

### 1. Colores (Color Styles)

**Ubicación en Figma**: Design Panel → Color Styles

**Colores a extraer**:
- [ ] **DEKALB Primary** (Verde principal)
  - Nombre: `--color-dekalb-primary`
  - Valor HEX: `#______`
  - Variantes (si existen):
    - Dark: `--color-dekalb-primary-dark`
    - Light: `--color-dekalb-primary-light`

- [ ] **Bayer Secondary** (Azul secundario)
  - Nombre: `--color-bayer-secondary`
  - Valor HEX: `#______`
  - Variantes (si existen):
    - Dark: `--color-bayer-secondary-dark`
    - Light: `--color-bayer-secondary-light`

- [ ] **Colores neutros** (Grises)
  - Gray 50: `#______`
  - Gray 100: `#______`
  - Gray 200: `#______`
  - Gray 300: `#______`
  - Gray 400: `#______`
  - Gray 500: `#______`
  - Gray 600: `#______`
  - Gray 700: `#______`
  - Gray 800: `#______`
  - Gray 900: `#______`

- [ ] **Colores semánticos** (si existen)
  - Success: `#______`
  - Error: `#______`
  - Warning: `#______`
  - Info: `#______`

**Cómo extraer**:
1. Selecciona cualquier elemento que use el color
2. En el panel derecho, haz clic en el color
3. Copia el valor HEX
4. O usa el plugin "Figma Tokens" si está disponible

---

### 2. Tipografía (Text Styles)

**Ubicación en Figma**: Design Panel → Text Styles

**Tipografías a extraer**:

- [ ] **Font Family Principal**
  - Nombre: `--font-family-primary`
  - Familia: `________________`
  - Fallbacks: `________________`

- [ ] **Font Family Heading** (si es diferente)
  - Nombre: `--font-family-heading`
  - Familia: `________________`

- [ ] **Font Weights**
  - Regular (400): `--font-weight-regular`
  - Semibold (600): `--font-weight-semibold`
  - Bold (700): `--font-weight-bold`
  - Otros pesos si existen: `________________`

- [ ] **Font Sizes**
  - Extra Small: `____px` / `____rem`
  - Small: `____px` / `____rem`
  - Base: `____px` / `____rem`
  - Large: `____px` / `____rem`
  - Extra Large: `____px` / `____rem`
  - Heading 1: `____px` / `____rem`
  - Heading 2: `____px` / `____rem`
  - Heading 3: `____px` / `____rem`
  - Heading 4: `____px` / `____rem`

- [ ] **Line Heights**
  - Tight: `____`
  - Normal: `____`
  - Relaxed: `____`

**Cómo extraer**:
1. Selecciona un texto con el estilo aplicado
2. En el panel derecho, revisa:
   - Font Family
   - Font Size
   - Font Weight
   - Line Height
3. Anota todos los valores

---

### 3. Espaciado (Spacing)

**Ubicación en Figma**: Auto Layout → Padding/Gap, o medir distancias manualmente

**Espaciados a extraer**:
- [ ] Spacing 1: `____px` / `____rem`
- [ ] Spacing 2: `____px` / `____rem`
- [ ] Spacing 3: `____px` / `____rem`
- [ ] Spacing 4: `____px` / `____rem`
- [ ] Spacing 5: `____px` / `____rem`
- [ ] Spacing 6: `____px` / `____rem`
- [ ] Spacing 8: `____px` / `____rem`
- [ ] Spacing 10: `____px` / `____rem`
- [ ] Spacing 12: `____px` / `____rem`
- [ ] Spacing 16: `____px` / `____rem`
- [ ] Spacing 20: `____px` / `____rem`
- [ ] Spacing 24: `____px` / `____rem`

**Cómo extraer**:
1. Selecciona un elemento con Auto Layout
2. Revisa los valores de Padding y Gap
3. O mide manualmente las distancias entre elementos

---

### 4. Breakpoints (Responsive)

**Ubicación en Figma**: Frames con diferentes tamaños

**Breakpoints a extraer**:
- [ ] Mobile: `____px` (típicamente 320px, 375px, o 414px)
- [ ] Tablet: `____px` (típicamente 768px)
- [ ] Desktop: `____px` (típicamente 1024px, 1280px, o 1440px)
- [ ] Large Desktop: `____px` (si existe, típicamente 1920px)

**Cómo extraer**:
1. Revisa los diferentes frames/responsive views en Figma
2. Anota el ancho de cada breakpoint

---

### 5. Border Radius

**Ubicación en Figma**: Properties Panel → Corner Radius

**Radios a extraer**:
- [ ] Small: `____px` / `____rem`
- [ ] Medium: `____px` / `____rem`
- [ ] Large: `____px` / `____rem`
- [ ] Extra Large: `____px` / `____rem`
- [ ] Full (para botones circulares): `____px` / `____rem`

---

### 6. Shadows (Sombras)

**Ubicación en Figma**: Properties Panel → Effects → Drop Shadow

**Sombras a extraer**:
- [ ] Small: `________________`
- [ ] Medium: `________________`
- [ ] Large: `________________`

**Formato**: `offsetX offsetY blur spread color opacity`
Ejemplo: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`

---

### 7. Logos

**Ubicación en Figma**: Assets Panel o en el diseño del Header

**Logos a extraer**:
- [ ] **Logo DEKALB**
  - Formato preferido: SVG
  - Alternativa: PNG transparente (alta resolución)
  - Tamaño recomendado: Ancho mínimo 240px
  
- [ ] **Logo Bayer**
  - Formato preferido: SVG
  - Alternativa: PNG transparente (alta resolución)
  - Tamaño recomendado: Ancho mínimo 160px

**Cómo extraer**:
1. Selecciona el logo en Figma
2. Click derecho → "Copy as SVG" (si está disponible)
3. O Export → Selecciona formato SVG o PNG
4. Guarda en `/public/logo-dekalb.svg` y `/public/logo-bayer.svg`

---

## 📝 FORMATO PARA COMPARTIR

Una vez extraídos, puedes compartir los valores en este formato:

```markdown
## Colores
- DEKALB Primary: #00A651
- DEKALB Primary Dark: #008040
- Bayer Secondary: #0098D4
...

## Tipografía
- Font Family: "Inter", sans-serif
- Font Sizes: 12px, 14px, 16px, 18px, 24px, 32px...
...

## Espaciado
- Spacing 1: 4px
- Spacing 2: 8px
...
```

---

## 🚀 PRÓXIMOS PASOS

1. **Abre Figma** y accede al diseño de DEKALB Experience
2. **Extrae los valores** usando esta guía
3. **Comparte los valores** conmigo y actualizaré `src/styles/design-tokens.css`
4. **Exporta los logos** y los agregaré al proyecto

---

## 💡 TIPS

- **Usa plugins de Figma** si están disponibles:
  - "Figma Tokens" para exportar tokens
  - "Design Tokens" para generar CSS
- **Toma screenshots** de los paneles de diseño si es más fácil
- **Anota variaciones** si hay diferentes estados (hover, active, disabled)
- **Verifica responsive** revisando los diferentes breakpoints

---

**¿Listo para empezar?** Comparte los valores extraídos y actualizaré el proyecto inmediatamente.

