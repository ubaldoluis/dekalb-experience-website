# Guía de Configuración de Prismic
## DEKALB Experience Website

## Paso 1: Crear Workspace en Prismic

1. Ve a https://prismic.io/
2. Crea una cuenta o inicia sesión
3. Crea un nuevo **Repository** (workspace)
4. Nombre sugerido: `dekalb-experience` o `dekalb-experience-website`
5. Selecciona **Multi-language** (Español y Portugués)
6. Una vez creado, ve a **Settings** → **API & Security**
7. Copia el **Repository Name** (lo necesitarás para `.env`)

## Paso 2: Obtener Access Token

1. En Prismic, ve a **Settings** → **API & Security**
2. En la sección **Generate an access token**
3. Crea un nuevo token con permisos de **Read** (y **Write** si vas a crear contenido desde el código)
4. Copia el token (lo necesitarás para `.env`)

## Paso 3: Configurar Custom Types

Necesitas crear 3 Custom Types. Aquí están las especificaciones detalladas:

---

### Custom Type 1: `producto`

**Nombre**: `producto`
**Repeatable**: Sí

#### Campos requeridos:

1. **nombre** (UID)
   - Tipo: Text
   - Label: "Nombre del Producto"
   - Placeholder: "Ej: DKC3045"
   - Required: Sí

2. **codigo** (UID)
   - Tipo: Text
   - Label: "Código del Producto"
   - Placeholder: "Ej: DKC3045"
   - Required: Sí

3. **imagen_saco** (UID)
   - Tipo: Image
   - Label: "Imagen del Saco"
   - Required: No

4. **claim** (UID)
   - Tipo: Text
   - Label: "Claim Marketing"
   - Placeholder: "Ej: Alto rendimiento y resistencia"
   - Required: No

5. **tipo_semilla** (UID)
   - Tipo: Select
   - Label: "Tipo de Semilla"
   - Options:
     - `maiz` → "Maíz"
     - `colza` → "Colza"
   - Required: Sí
   - Default: `maiz`

6. **uso** (UID)
   - Tipo: Select
   - Label: "Uso"
   - Options:
     - `grano` → "Grano"
     - `silo` → "Silo"
     - `preceon` → "Preceon"
   - Required: No (solo aplica si tipo_semilla = maiz)

7. **zona** (UID)
   - Tipo: Select
   - Label: "Zona Geográfica"
   - Options:
     - `ebro` → "Ebro"
     - `centro-sur-extremadura-andalucia` → "Centro Sur, Extremadura, Andalucía"
     - `noroeste` → "Noroeste"
     - `portugal` → "Portugal"
   - Required: No (solo aplica si tipo_semilla = maiz)

8. **categoria** (UID)
   - Tipo: Select
   - Label: "Categoría"
   - Options:
     - `maiz-grano` → "Maíz Grano"
     - `silo` → "Silo"
     - `preceon` → "Preceon"
     - `colza` → "Colza"
     - `fitosanitario` → "Fitosanitario"
   - Required: Sí

9. **proteccion** (UID)
   - Tipo: Select
   - Label: "Protección de Cultivo"
   - Options:
     - `herbicida` → "Herbicida"
     - `insecticida` → "Insecticida"
     - `bioestimulante` → "Bioestimulante"
   - Required: Sí

10. **beneficios** (UID)
    - Tipo: Rich Text (con formato de lista)
    - Label: "Beneficios"
    - Required: No
    - Alternativa: Usar un campo de tipo "Group" con múltiples campos Text

11. **recomendaciones_uso** (UID)
    - Tipo: Rich Text
    - Label: "Recomendaciones de Uso"
    - Required: No

12. **orden** (UID)
    - Tipo: Number
    - Label: "Orden en Carrusel"
    - Placeholder: "Ej: 1"
    - Required: No

---

### Custom Type 2: `articulo`

**Nombre**: `articulo`
**Repeatable**: Sí

#### Campos requeridos:

1. **titulo** (UID)
   - Tipo: Title
   - Label: "Título del Artículo"
   - Required: Sí

2. **slug** (UID)
   - Tipo: UID
   - Label: "Slug (URL)"
   - Based on: `titulo`
   - Required: Sí

3. **categoria** (UID)
   - Tipo: Select
   - Label: "Categoría"
   - Options:
     - `noticia` → "Noticia"
     - `evento` → "Evento"
     - `articulo` → "Artículo"
     - `lanzamiento` → "Lanzamiento"
   - Required: Sí

4. **fecha** (UID)
   - Tipo: Date
   - Label: "Fecha de Publicación"
   - Required: Sí

5. **extracto** (UID)
   - Tipo: Text
   - Label: "Extracto (200 caracteres máximo)"
   - Placeholder: "Breve descripción del artículo"
   - Required: Sí
   - Max length: 200

6. **imagen_destacada** (UID)
   - Tipo: Image
   - Label: "Imagen Destacada"
   - Required: No

7. **contenido** (UID)
   - Tipo: Rich Text
   - Label: "Contenido del Artículo"
   - Required: Sí
   - Formatos permitidos: H2, H3, imágenes, citas, enlaces

8. **autor** (UID)
   - Tipo: Text
   - Label: "Autor"
   - Required: No

9. **tags** (UID)
   - Tipo: Tags
   - Label: "Etiquetas"
   - Required: No

10. **publicado** (UID)
    - Tipo: Boolean
    - Label: "Publicado"
    - Default: false
    - Required: Sí

---

### Custom Type 3: `catalogo_pdf`

**Nombre**: `catalogo_pdf`
**Repeatable**: Sí

#### Campos requeridos:

1. **nombre** (UID)
   - Tipo: Title
   - Label: "Nombre del Catálogo"
   - Placeholder: "Ej: Catálogo Ebro"
   - Required: Sí

2. **tipo** (UID)
   - Tipo: Select
   - Label: "Tipo"
   - Options:
     - `maiz` → "Maíz"
     - `colza` → "Colza"
   - Required: Sí

3. **subcategoria** (UID)
   - Tipo: Select
   - Label: "Subcategoría"
   - Options:
     - `genetica-agronomia` → "Genética y Agronomía"
     - `proteccion-cultivo` → "Protección de Cultivo"
     - `otros` → "Otros"
   - Required: Sí

4. **pais** (UID)
   - Tipo: Select
   - Label: "País"
   - Options:
     - `espana` → "España"
     - `portugal` → "Portugal"
   - Required: Sí

5. **zona** (UID)
   - Tipo: Select
   - Label: "Zona (solo si Maíz)"
   - Options:
     - `ebro` → "Ebro"
     - `centro-sur` → "Centro Sur"
     - `noroeste` → "Noroeste"
     - `portugal` → "Portugal"
     - `centro-sur-extremadura-andalucia` → "Centro Sur, Extremadura, Andalucía"
   - Required: No

6. **url_pdf** (UID)
   - Tipo: Link
   - Label: "URL del PDF"
   - Link type: Media
   - Required: Sí

7. **orden** (UID)
   - Tipo: Number
   - Label: "Orden"
   - Required: No

---

## Paso 4: Configurar Variables de Entorno

Una vez que tengas el Repository Name y el Access Token:

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` con tus valores reales:
```
PRISMIC_REPOSITORY_NAME=tu-repository-name
PRISMIC_ACCESS_TOKEN=tu-access-token
SITE_URL=http://localhost:4321
```

## Paso 5: Crear Documentos de Ejemplo

### Productos (mínimo 5):

1. **DKC6836SC** (Preceon)
   - tipo_semilla: maiz
   - uso: preceon
   - categoria: preceon
   - proteccion: herbicida

2. **DKC6648SC** (Preceon)
   - tipo_semilla: maiz
   - uso: preceon
   - categoria: preceon
   - proteccion: insecticida

3. **DKC3045** (Grano)
   - tipo_semilla: maiz
   - uso: grano
   - zona: ebro
   - categoria: maiz-grano
   - proteccion: herbicida

4. **Producto Colza 1**
   - tipo_semilla: colza
   - categoria: colza
   - proteccion: herbicida

5. **Producto Silo**
   - tipo_semilla: maiz
   - uso: silo
   - zona: noroeste
   - categoria: silo
   - proteccion: bioestimulante

### Artículos (mínimo 3):

1. Noticia sobre lanzamiento de producto
2. Artículo técnico sobre cultivo
3. Evento próximo

### Catálogos (mínimo 10):

- Catálogo Ebro (Maíz, Genética y Agronomía, España)
- Catálogo Noroeste (Maíz, Genética y Agronomía, España)
- Catálogo Centro Sur (Maíz, Genética y Agronomía, España)
- Catálogo Portugal (Maíz, Genética y Agronomía, Portugal)
- Guía Técnica Grano y Silo (Maíz, Genética y Agronomía, España)
- Guía Diagnóstico (Colza, Otros, España)
- Guía Soluciones (Colza, Otros, España)
- Densidad de Siembra (Colza, Otros, España)
- Y más según necesidad...

---

## Paso 6: Verificar Configuración

1. Reinicia el servidor de desarrollo:
```bash
npm run dev
```

2. Visita http://localhost:4321/es/
3. Deberías ver productos cargados desde Prismic
4. Verifica que el filtro funcione correctamente

---

## Notas Importantes

- **Multi-language**: Asegúrate de crear documentos en ambos idiomas (ES y PT)
- **Imágenes**: Sube las imágenes a Prismic Media Library antes de asignarlas
- **PDFs**: Sube los PDFs a Prismic Media Library y luego crea el link en el campo `url_pdf`
- **Slugs**: Los slugs se generan automáticamente desde el título, pero puedes editarlos manualmente

---

## Troubleshooting

### Error: "Repository not found"
- Verifica que el `PRISMIC_REPOSITORY_NAME` en `.env` sea correcto
- Verifica que no haya espacios extra

### Error: "Invalid access token"
- Verifica que el `PRISMIC_ACCESS_TOKEN` sea correcto
- Asegúrate de que el token tenga permisos de lectura

### No se muestran productos
- Verifica que los documentos estén publicados en Prismic
- Verifica que los nombres de los campos coincidan exactamente con los del código
- Revisa la consola del navegador para errores

### Problemas con imágenes
- Asegúrate de que las imágenes estén en Prismic Media Library
- Verifica que el campo de imagen esté configurado correctamente

