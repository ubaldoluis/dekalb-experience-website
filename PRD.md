# Product Requirements Document (PRD)
## DEKALB Experience Website

### Información del Proyecto
- **Cliente**: DEKALB/Bayer
- **Tipo**: Sitio Web B2B
- **Stack**: Astro + Prismic CMS
- **Idiomas**: Español (ES) y Portugués (PT)
- **Duración**: 7 días hábiles

### Objetivo
Desarrollar un sitio web B2B para DEKALB Experience que permita a los agricultores explorar productos (semillas de maíz y colza), acceder a soluciones digitales y descargar recursos técnicos.

### Funcionalidades Principales

#### 1. Home Page
- Header con navegación (7 items) + logos DEKALB/Bayer + selector idioma
- Hero: "DEKALB EXPERIENCE" + "Expertos a tu lado"
- **Filtro Condicional de Productos** (CRÍTICO)
  - Nivel 1: Tipo Semilla (Maíz/Colza) - siempre visible
  - Nivel 2: Uso (Grano/Silo/Preceon) - solo si Maíz
  - Nivel 3: Zona Geográfica - solo si Maíz
  - Nivel 4: Protección (Herbicida/Insecticida/Bioestimulante/Todos) - siempre visible
- Carrusel de productos con Splide.js
- Modal de detalles de productos
- Secciones: Soluciones Integrales, FieldView, Protección, Preceon, Guías, Catálogos, Blog preview

#### 2. Páginas Secundarias
- FieldView (con 3 subsecciones)
- Maíz (con tabla de tratamientos)
- Acceleron, FieldShield, Silo Extra, Preceon, Colza

#### 3. Blog
- Listado con grid responsive (3 cols desktop, 1 mobile)
- Artículos individuales con rutas dinámicas [slug]
- Navegación de artículos relacionados

#### 4. Catálogos
- Descarga de PDFs filtrados por tipo/pais/zona
- DEKALB Maíz: Genética y Agronomía (por zona) + Guía Técnica
- DEKALB Colza: Guías varias

#### 5. Calculador de Densidades
- Campos: Uso, Zona, Potencial producción, Híbrido, Superficie
- Resultado: Densidad recomendada + Nº bolsas + Imagen

### Requisitos Técnicos

#### Performance
- Lighthouse Performance > 90
- Lighthouse Accessibility > 95
- Lighthouse Best Practices > 90
- Lighthouse SEO > 90
- Time to Interactive < 3s

#### Accesibilidad
- WCAG 2.1 Level AA compliance
- Keyboard navigation completa
- ARIA labels en componentes interactivos
- Contraste 4.5:1 para texto

#### Responsive
- Mobile: 320px
- Tablet: 768px
- Desktop: 1024px+
- Mobile-first approach

### Integración Prismic

#### Custom Types Requeridos
1. **producto**
   - Campos: nombre, codigo, imagen_saco, claim, tipo_semilla, uso, zona, categoria, proteccion, beneficios, recomendaciones_uso, orden

2. **articulo**
   - Campos: titulo, slug, categoria, fecha, extracto, imagen_destacada, contenido, autor, tags, publicado

3. **catalogo_pdf**
   - Campos: nombre, tipo, subcategoria, pais, zona, url_pdf, orden

### Estado Actual del Proyecto
✅ Estructura base completada
✅ Componentes principales implementados
✅ Páginas creadas
⏳ Prismic pendiente de configuración
⏳ Tokens de diseño pendientes de extracción desde Figma
⏳ Contenido pendiente de carga en Prismic

