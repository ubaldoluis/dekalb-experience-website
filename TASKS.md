# Tareas del Proyecto - DEKALB Experience
## Descomposición Detallada de Tareas

## ✅ FASE 1: Setup Inicial (COMPLETADO)

### 1.1 Configuración del Proyecto ✅
- [x] Crear repositorio GitHub
- [x] Inicializar proyecto Astro con TypeScript
- [x] Configurar estructura de carpetas
- [x] Configurar `.gitignore` y `README.md`
- [x] Setup de variables de entorno (`.env.example`)

### 1.2 Configuración de Prismic ⏳
- [x] Crear cliente Prismic en `src/utils/prismic.ts`
- [ ] **CREAR WORKSPACE PRISMIC** ⚠️ PENDIENTE
- [ ] **CONFIGURAR CUSTOM TYPES** ⚠️ PENDIENTE
  - [ ] Custom Type: `producto`
  - [ ] Custom Type: `articulo`
  - [ ] Custom Type: `catalogo_pdf`
- [ ] Crear documentos iniciales de ejemplo
- [ ] Configurar variables de entorno reales

### 1.3 Sistema de Diseño ✅
- [x] Crear `src/styles/design-tokens.css`
- [x] Crear `src/styles/global.css`
- [x] Crear `src/styles/components.css`
- [ ] **EXTRAER TOKENS REALES DESDE FIGMA** ⚠️ PENDIENTE
  - [ ] Colores (DEKALB verde, Bayer azul)
  - [ ] Tipografía
  - [ ] Espaciado
  - [ ] Breakpoints

### 1.4 Configuración de Internacionalización ✅
- [x] Setup rutas multiidioma (`/es/`, `/pt/`)
- [x] Crear `src/i18n/es.json` y `src/i18n/pt.json`
- [x] Crear `src/utils/i18n.ts`
- [x] Configurar redirección `/` → `/es/`

---

## ✅ FASE 2: Componentes Base (COMPLETADO)

### 2.1 Layouts Base ✅
- [x] Crear `src/layouts/Base.astro`
- [x] Crear `src/layouts/PageLayout.astro`
- [x] Crear `src/layouts/BlogPost.astro`

### 2.2 Componentes de Navegación ✅
- [x] Crear `src/components/Header.astro`
- [x] Crear `src/components/Footer.astro`

### 2.3 Componentes Reutilizables ✅
- [x] Crear `src/components/SolutionsHero.astro`
- [x] Crear `src/components/BenefitsGrid.astro`
- [x] Crear `src/components/CTASection.astro`

---

## ✅ FASE 3: Componentes Críticos (COMPLETADO)

### 3.1 Lógica de Filtrado ✅
- [x] Crear `src/utils/filterLogic.ts`
- [x] Función `filterProducts()`
- [x] Lógica condicional Maíz/Colza
- [x] Sincronización con URL

### 3.2 Componente ProductFilter ✅
- [x] Nivel 1: Tipo Semilla (siempre visible)
- [x] Nivel 2: Uso (solo si Maíz)
- [x] Nivel 3: Zona (solo si Maíz)
- [x] Nivel 4: Protección (siempre visible)
- [x] Lógica condicional mostrar/ocultar
- [x] Emisión de eventos

### 3.3 Componente ProductCarousel ✅
- [x] Integración con Splide.js
- [x] Visualización de productos
- [x] Navegación prev/next
- [x] Indicadores de posición
- [x] Evento al hacer clic

### 3.4 Componente ProductModal ✅
- [x] HTML5 `<dialog>` element
- [x] Muestra datos del producto
- [x] Cierre con botón, Esc, clic fuera
- [x] Responsive (mobile diferente)

---

## ✅ FASE 4: Página Home (COMPLETADO)

### 4.1 Estructura Home ✅
- [x] Crear `src/pages/es/index.astro`
- [x] Crear `src/pages/pt/index.astro`
- [x] Integrar Header y Footer
- [x] Hero Section

### 4.2 Secciones de Contenido ✅
- [x] Sección Productos (filtro + carrusel)
- [x] Soluciones Integrales para Maíz
- [x] FieldView
- [x] Protección de Cultivo
- [x] Smart Corn System PRECEON
- [x] Evita problemas
- [x] Descarga de Catálogos
- [x] Blog Preview

---

## ✅ FASE 5: Páginas Secundarias (COMPLETADO)

### 5.1 Página FieldView ✅
- [x] Descripción general
- [x] 3 subsecciones (Drive, Yield Kit, SprayKit)
- [x] CTAs

### 5.2 Página Maíz ✅
- [x] Programa de tratamientos
- [x] Crear `src/components/TreatmentTable.astro`
- [x] Tabla interactiva (20+ filas)
- [x] Link a Agrobayer

### 5.3 Páginas Soluciones ✅
- [x] Acceleron
- [x] FieldShield
- [x] Silo Extra
- [x] Preceon (look especial)
- [x] Colza

---

## ✅ FASE 6: Blog y Catálogos (COMPLETADO)

### 6.1 Blog - Listado ✅
- [x] Crear `src/pages/es/blog/index.astro`
- [x] Grid responsive (3 cols desktop, 1 mobile)
- [x] Fetch desde Prismic

### 6.2 Blog - Artículos Individuales ✅
- [x] Crear `src/pages/es/blog/[slug].astro`
- [x] Ruta dinámica
- [x] Contenido rich text
- [x] Artículos relacionados

### 6.3 Página Descarga de Catálogos ✅
- [x] Crear `src/pages/es/catalogo/index.astro`
- [x] Filtrado por tipo/pais/zona
- [x] Descarga PDF desde Prismic

### 6.4 Página Guías Descargables ✅
- [x] Crear `src/pages/es/evita-problemas.astro`
- [x] Carrusel con 3 guías
- [x] Botones descarga PDF

---

## ✅ FASE 7: Calculador y Optimizaciones (COMPLETADO)

### 7.1 Calculador de Densidades ✅
- [x] Crear `src/components/DensityCalculator.astro`
- [x] Campos: Uso, Zona, Potencial, Híbrido, Superficie
- [x] Lógica de cálculo
- [x] Resultado: Densidad + Bolsas + Imagen

### 7.2 SEO ✅
- [x] Meta tags en cada página
- [x] Open Graph tags
- [x] Schema.org JSON-LD
- [x] Crear `src/pages/sitemap.xml.ts`

### 7.3 Optimización de Performance ✅
- [x] Estructura optimizada
- [x] Lazy loading imágenes
- [ ] Validar Lighthouse scores ⏳

### 7.4 Accesibilidad ✅
- [x] ARIA labels
- [x] Keyboard navigation
- [x] Skip links
- [ ] Testing completo ⏳

---

## ⏳ FASE 8: Configuración y Contenido (PENDIENTE)

### 8.1 Configuración Prismic ⚠️ CRÍTICO
- [ ] Crear workspace Prismic
- [ ] Configurar Custom Types:
  - [ ] `producto` (todos los campos)
  - [ ] `articulo` (todos los campos)
  - [ ] `catalogo_pdf` (todos los campos)
- [ ] Crear documentos iniciales:
  - [ ] 5+ productos (incluir DKC6836SC y DKC6648SC para Preceon)
  - [ ] 3-5 artículos de ejemplo
  - [ ] 10+ catálogos PDF
- [ ] Configurar variables de entorno reales

### 8.2 Extracción de Diseño ⚠️ IMPORTANTE
- [ ] Acceder a Figma
- [ ] Extraer colores:
  - [ ] Color primario DEKALB (verde)
  - [ ] Color secundario Bayer (azul)
  - [ ] Paleta completa
- [ ] Extraer tipografía:
  - [ ] Familia primaria
  - [ ] Pesos (400, 600, 700)
  - [ ] Tamaños base
- [ ] Extraer espaciado (grid 8px)
- [ ] Extraer breakpoints
- [ ] Actualizar `design-tokens.css`

### 8.3 Assets y Contenido
- [ ] Agregar logos reales:
  - [ ] `/public/logo-dekalb.svg`
  - [ ] `/public/logo-bayer.svg`
- [ ] Agregar imágenes de productos en Prismic
- [ ] Crear contenido real para blog
- [ ] Subir PDFs de catálogos
- [ ] Agregar imágenes hero

### 8.4 Testing Final
- [ ] Testing filtro condicional (casos extremos)
- [ ] Testing responsive (3 breakpoints)
- [ ] Testing accesibilidad (WCAG 2.1 AA)
- [ ] Validar Lighthouse scores
- [ ] Testing descarga PDFs
- [ ] Validar i18n completo ES/PT

---

## 📋 Checklist de Entrega

### Funcionalidad
- [x] Filtro condicional funciona
- [x] Carrusel actualiza con filtros
- [x] Modal abre/cierra correctamente
- [x] Blog con rutas dinámicas
- [x] Calculador calcula correctamente
- [ ] Catálogos se descargan (pendiente Prismic)

### Diseño
- [x] Estructura responsive
- [x] Tokens aplicados (placeholders)
- [ ] Fidelidad 100% a Figma (pendiente tokens reales)
- [x] Transiciones suaves

### Performance
- [ ] Lighthouse Performance > 90 ⏳
- [ ] Lighthouse Accessibility > 95 ⏳
- [ ] Lighthouse Best Practices > 90 ⏳
- [ ] Lighthouse SEO > 90 ⏳
- [ ] Time to Interactive < 3s ⏳

### Accesibilidad
- [x] ARIA labels
- [x] Keyboard navigation
- [ ] WCAG 2.1 Level AA compliance ⏳
- [x] Contraste 4.5:1 (estructura lista)

### SEO
- [x] Meta tags
- [x] Open Graph
- [x] Schema.org
- [x] Sitemap.xml

---

## 🎯 Próximas Tareas Prioritarias

1. **Configurar Prismic** (2-3 horas)
   - Crear workspace
   - Configurar Custom Types
   - Crear documentos de ejemplo

2. **Extraer tokens de Figma** (1-2 horas)
   - Colores, tipografía, espaciado
   - Actualizar design-tokens.css

3. **Agregar assets** (1 hora)
   - Logos reales
   - Imágenes placeholder mejoradas

4. **Testing completo** (2-3 horas)
   - Validar todas las funcionalidades
   - Lighthouse scores
   - Accesibilidad

**Tiempo total estimado para completar**: 6-9 horas

