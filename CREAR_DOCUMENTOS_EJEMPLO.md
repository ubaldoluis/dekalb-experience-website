# Guía: Crear Documentos de Ejemplo en Prismic
## DEKALB Experience Website

## ✅ Custom Types Creados

- ✅ Producto
- ✅ Artículo  
- ✅ Catálogo PDF

---

## 📝 Crear Primeros Documentos

### 1. Crear Productos de Ejemplo

Ve a **Documents** → **Create New** → **Producto**

#### Producto 1: DKC6836SC (Preceon)

1. **nombre**: `DKC6836SC`
2. **codigo**: `DKC6836SC`
3. **imagen_saco**: (sube una imagen del saco si tienes)
4. **claim**: `Alto rendimiento con tecnología Preceon`
5. **tipo_semilla**: `Maíz`
6. **uso**: `Preceon`
7. **zona**: `Ebro` (o la que prefieras)
8. **categoria**: `Preceon`
9. **proteccion**: `Herbicida`
10. **beneficios**: (en Rich Text, agrega algunos beneficios como lista)
    - Alto rendimiento
    - Resistencia a plagas
    - Tecnología avanzada
11. **recomendaciones_uso**: (en Rich Text)
    - Recomendado para zonas con alta presión de malezas
    - Siembra en primavera
12. **orden**: `1`

**Save** y **Publish**

#### Producto 2: DKC6648SC (Preceon)

1. **nombre**: `DKC6648SC`
2. **codigo**: `DKC6648SC`
3. **tipo_semilla**: `Maíz`
4. **uso**: `Preceon`
5. **zona**: `Noroeste`
6. **categoria**: `Preceon`
7. **proteccion**: `Insecticida`
8. **orden**: `2`

**Save** y **Publish**

#### Producto 3: DKC3045 (Grano)

1. **nombre**: `DKC3045`
2. **codigo**: `DKC3045`
3. **tipo_semilla**: `Maíz`
4. **uso**: `Grano`
5. **zona**: `Ebro`
6. **categoria**: `Maíz Grano`
7. **proteccion**: `Herbicida`
8. **orden**: `3`

**Save** y **Publish**

#### Producto 4: Producto Colza

1. **nombre**: `DEKALB Colza Premium`
2. **codigo**: `DCL001`
3. **tipo_semilla**: `Colza`
4. **categoria**: `Colza`
5. **proteccion**: `Herbicida`
6. **orden**: `4`

**Save** y **Publish**

---

### 2. Crear Artículos de Ejemplo

Ve a **Documents** → **Create New** → **Artículo**

#### Artículo 1: Noticia de Lanzamiento

1. **titulo**: `Nuevo lanzamiento DEKALB: Tecnología Preceon`
2. **uid**: (se genera automáticamente desde el título, o puedes editarlo manualmente)
3. **categoria**: `Lanzamiento`
4. **fecha**: (fecha actual)
5. **extracto**: `DEKALB presenta su nueva línea de productos con tecnología Preceon, diseñada para maximizar el rendimiento y la protección de cultivos.`
6. **imagen_destacada**: (sube una imagen si tienes)
7. **contenido**: (en Rich Text, agrega contenido del artículo)
   - Puedes usar H2, H3, párrafos, listas, etc.
8. **autor**: `Equipo DEKALB`
9. **publicado**: ✅ `true` (muy importante!)

**Save** y **Publish**

#### Artículo 2: Artículo Técnico

1. **titulo**: `Guía de siembra para maíz en la zona del Ebro`
2. **categoria**: `Artículo`
3. **fecha**: (fecha actual)
4. **extracto**: `Consejos técnicos para optimizar la siembra de maíz en condiciones específicas del valle del Ebro.`
5. **contenido**: (agrega contenido técnico)
6. **publicado**: ✅ `true`

**Save** y **Publish**

---

### 3. Crear Catálogos de Ejemplo

Ve a **Documents** → **Create New** → **Catálogo PDF**

#### Catálogo 1: Catálogo Ebro

1. **nombre**: `Catálogo Ebro - Genética y Agronomía`
2. **tipo**: `Maíz`
3. **subcategoria**: `Genética y Agronomía`
4. **pais**: `España`
5. **zona**: `Ebro`
6. **url_pdf**: 
   - Click en el campo
   - Selecciona "Upload a file" o "Link to media"
   - Sube un PDF o enlaza a uno existente en Media Library
7. **orden**: `1`

**Save** y **Publish**

#### Catálogo 2: Guía Técnica

1. **nombre**: `Guía Técnica de Grano y Silo`
2. **tipo**: `Maíz`
3. **subcategoria**: `Genética y Agronomía`
4. **pais**: `España`
5. **zona**: (deja vacío o selecciona una)
6. **url_pdf**: (sube o enlaza PDF)
7. **orden**: `2`

**Save** y **Publish**

---

## 🔄 Verificar en el Sitio

Una vez creados los documentos:

1. **Reinicia el servidor** (si está corriendo):
```bash
# Detén el servidor (Ctrl+C) y vuelve a iniciarlo
npm run dev
```

2. **Visita**: http://localhost:4321/es/

3. **Deberías ver**:
   - Productos en el carrusel (si creaste productos)
   - Artículos en el blog preview (si creaste artículos publicados)
   - Catálogos disponibles para descargar

---

## ⚠️ Notas Importantes

### Para Artículos:
- **publicado**: Debe estar en `true` para que aparezcan en el sitio
- **uid**: Se genera automáticamente desde el título, pero puedes editarlo
- El slug de la URL será el valor del campo `uid`

### Para Productos:
- **orden**: Usa números para ordenar los productos en el carrusel
- Los productos aparecerán filtrados según los filtros seleccionados

### Para Catálogos:
- **url_pdf**: Asegúrate de subir el PDF a Prismic Media Library primero
- Luego selecciona el PDF desde Media Library en el campo Link

---

## 🧪 Testing del Filtro

Una vez tengas productos creados:

1. Ve a la home: http://localhost:4321/es/
2. Prueba el filtro:
   - Selecciona "Maíz" → deberías ver campos "Uso" y "Zona"
   - Selecciona "Colza" → "Uso" y "Zona" deberían desaparecer
   - Cambia "Protección" → el carrusel debería actualizarse

---

## 📊 Estado Actual

- ✅ Custom Types creados: 3/3
- ⏳ Documentos creados: 0 (necesitas crear al menos algunos para probar)
- ⏳ Contenido real: Pendiente

**Próximo paso**: Crear al menos 2-3 productos y 1 artículo para probar que todo funciona correctamente.

