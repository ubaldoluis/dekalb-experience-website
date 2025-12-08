# Guía Rápida: Crear Custom Types en Prismic
## DEKALB Experience Website

## ✅ Credenciales Configuradas

- **Repository**: DKLab
- **Token**: Configurado en `.env`
- **Conexión**: ✅ Verificada

---

## 📋 Custom Types a Crear

Necesitas crear **3 Custom Types** en Prismic. Sigue estos pasos:

### 1. Ir a Prismic Custom Types

1. Ve a https://prismic.io/dashboard
2. Selecciona el repository **DKLab**
3. En el menú lateral, haz click en **Custom Types**
4. Click en **Create New**

---

## Custom Type 1: `producto`

### Configuración Inicial
- **API ID**: `producto` (debe ser exactamente esto)
- **Display Name**: `Producto`
- **Repeatable**: ✅ Sí (marca esta opción)

### Campos a Agregar (en orden):

1. **nombre** (Text)
   - Label: "Nombre del Producto"
   - Placeholder: "Ej: DKC3045"
   - ✅ Required

2. **codigo** (Text)
   - Label: "Código del Producto"
   - Placeholder: "Ej: DKC3045"
   - ✅ Required

3. **imagen_saco** (Image)
   - Label: "Imagen del Saco"
   - ✅ Required: No

4. **claim** (Text)
   - Label: "Claim Marketing"
   - Placeholder: "Ej: Alto rendimiento y resistencia"
   - ✅ Required: No

5. **tipo_semilla** (Select)
   - Label: "Tipo de Semilla"
   - Options:
     - `maiz` → "Maíz"
     - `colza` → "Colza"
   - Default: `maiz`
   - ✅ Required

6. **uso** (Select)
   - Label: "Uso (solo si Maíz)"
   - Options:
     - `grano` → "Grano"
     - `silo` → "Silo"
     - `preceon` → "Preceon"
   - ✅ Required: No

7. **zona** (Select)
   - Label: "Zona Geográfica (solo si Maíz)"
   - Options:
     - `ebro` → "Ebro"
     - `centro-sur-extremadura-andalucia` → "Centro Sur, Extremadura, Andalucía"
     - `noroeste` → "Noroeste"
     - `portugal` → "Portugal"
   - ✅ Required: No

8. **categoria** (Select)
   - Label: "Categoría"
   - Options:
     - `maiz-grano` → "Maíz Grano"
     - `silo` → "Silo"
     - `preceon` → "Preceon"
     - `colza` → "Colza"
     - `fitosanitario` → "Fitosanitario"
   - Default: `maiz-grano`
   - ✅ Required

9. **proteccion** (Select)
   - Label: "Protección de Cultivo"
   - Options:
     - `herbicida` → "Herbicida"
     - `insecticida` → "Insecticida"
     - `bioestimulante` → "Bioestimulante"
   - ✅ Required

10. **beneficios** (Rich Text)
    - Label: "Beneficios"
    - ✅ Required: No
    - Permite: Listas, negrita, cursiva

11. **recomendaciones_uso** (Rich Text)
    - Label: "Recomendaciones de Uso"
    - ✅ Required: No

12. **orden** (Number)
    - Label: "Orden en Carrusel"
    - Placeholder: "Ej: 1"
    - ✅ Required: No

### Guardar y Publicar
- Click en **Save**
- Click en **Publish to Master**

---

## Custom Type 2: `articulo`

### Configuración Inicial
- **API ID**: `articulo` (debe ser exactamente esto)
- **Display Name**: `Artículo`
- **Repeatable**: ✅ Sí

### Campos a Agregar:

1. **titulo** (Title)
   - Label: "Título del Artículo"
   - ✅ Required

2. **slug** (UID)
   - Label: "Slug (URL)"
   - Based on: `titulo`
   - ✅ Required

3. **categoria** (Select)
   - Label: "Categoría"
   - Options:
     - `noticia` → "Noticia"
     - `evento` → "Evento"
     - `articulo` → "Artículo"
     - `lanzamiento` → "Lanzamiento"
   - Default: `articulo`
   - ✅ Required

4. **fecha** (Date)
   - Label: "Fecha de Publicación"
   - ✅ Required

5. **extracto** (Text)
   - Label: "Extracto (200 caracteres máximo)"
   - Placeholder: "Breve descripción del artículo"
   - ✅ Required

6. **imagen_destacada** (Image)
   - Label: "Imagen Destacada"
   - ✅ Required: No

7. **contenido** (Rich Text)
   - Label: "Contenido del Artículo"
   - ✅ Required
   - Permite: H2, H3, imágenes, citas, enlaces, listas

8. **autor** (Text)
   - Label: "Autor"
   - ✅ Required: No

9. **tags** (Select - Multiple)
   - Label: "Etiquetas"
   - ✅ Required: No
   - Nota: Puedes dejarlo vacío o agregar opciones comunes

10. **publicado** (Boolean)
    - Label: "Publicado"
    - Default: false
    - ✅ Required

### Guardar y Publicar

---

## Custom Type 3: `catalogo_pdf`

### Configuración Inicial
- **API ID**: `catalogo_pdf` (debe ser exactamente esto)
- **Display Name**: `Catálogo PDF`
- **Repeatable**: ✅ Sí

### Campos a Agregar:

1. **nombre** (Title)
   - Label: "Nombre del Catálogo"
   - Placeholder: "Ej: Catálogo Ebro"
   - ✅ Required

2. **tipo** (Select)
   - Label: "Tipo"
   - Options:
     - `maiz` → "Maíz"
     - `colza` → "Colza"
   - Default: `maiz`
   - ✅ Required

3. **subcategoria** (Select)
   - Label: "Subcategoría"
   - Options:
     - `genetica-agronomia` → "Genética y Agronomía"
     - `proteccion-cultivo` → "Protección de Cultivo"
     - `otros` → "Otros"
   - Default: `genetica-agronomia`
   - ✅ Required

4. **pais** (Select)
   - Label: "País"
   - Options:
     - `espana` → "España"
     - `portugal` → "Portugal"
   - Default: `espana`
   - ✅ Required

5. **zona** (Select)
   - Label: "Zona (solo si Maíz)"
   - Options:
     - `ebro` → "Ebro"
     - `centro-sur` → "Centro Sur"
     - `noroeste` → "Noroeste"
     - `portugal` → "Portugal"
     - `centro-sur-extremadura-andalucia` → "Centro Sur, Extremadura, Andalucía"
   - ✅ Required: No

6. **url_pdf** (Link)
   - Label: "URL del PDF"
   - Link type: **Media** (importante: selecciona Media, no Web)
   - ✅ Required

7. **orden** (Number)
   - Label: "Orden"
   - ✅ Required: No

### Guardar y Publicar

---

## ✅ Verificación

Una vez creados los 3 Custom Types:

1. Ve a **Documents** en Prismic
2. Deberías ver las opciones para crear:
   - Producto
   - Artículo
   - Catálogo PDF

---

## 📝 Crear Primeros Documentos

### Crear un Producto de Ejemplo:

1. Click en **Create New** → **Producto**
2. Completa los campos:
   - **nombre**: DKC6836SC
   - **codigo**: DKC6836SC
   - **tipo_semilla**: Maíz
   - **uso**: Preceon
   - **zona**: Ebro (o la que prefieras)
   - **categoria**: Preceon
   - **proteccion**: Herbicida
   - **beneficios**: (agrega algunos beneficios)
   - **orden**: 1
3. Click en **Save**
4. Click en **Publish**

### Crear un Artículo de Ejemplo:

1. Click en **Create New** → **Artículo**
2. Completa:
   - **titulo**: "Nuevo lanzamiento DEKALB"
   - **slug**: (se genera automáticamente)
   - **categoria**: Lanzamiento
   - **fecha**: (fecha actual)
   - **extracto**: "Descripción breve del artículo"
   - **contenido**: (agrega contenido)
   - **publicado**: ✅ true
3. Save y Publish

---

## 🔄 Probar en el Sitio

Una vez creados los Custom Types y al menos un documento:

1. Reinicia el servidor de desarrollo:
```bash
npm run dev
```

2. Visita http://localhost:4321/es/
3. Deberías ver los productos cargados desde Prismic

---

## ⚠️ Notas Importantes

- **API IDs**: Los nombres de los campos deben coincidir EXACTAMENTE con los del código
- **Select Options**: Los valores (como `maiz`, `colza`) deben ser exactamente como están escritos
- **Link Media**: Para `url_pdf`, asegúrate de seleccionar tipo "Media" para poder subir PDFs
- **Publicar**: Recuerda hacer "Publish to Master" después de crear cada Custom Type

---

## 🆘 Si algo no funciona

1. Verifica que los API IDs sean exactos
2. Verifica que los valores de Select coincidan
3. Revisa la consola del navegador para errores
4. Verifica que los documentos estén publicados

