# Guía: Crear Contenido FieldView en Prismic

Esta guía te explica cómo crear y gestionar el contenido de la página FieldView en Prismic.

## Paso 1: Importar el Custom Type

1. **Accede a Prismic Dashboard**
   - Ve a tu repositorio de Prismic
   - URL: https://tu-repositorio.prismic.io

2. **Importar el Custom Type**
   - Ve a **Custom Types** en el menú lateral
   - Haz clic en **Create** o **Import**
   - Selecciona **Import JSON**
   - Sube el archivo `prismic-fieldview.json`
   - Confirma la importación

3. **Verificar la configuración**
   - Asegúrate de que el tipo sea **Single** (no repeatable)
   - El API ID debe ser: `fieldview`
   - Estado: **Active**

## Paso 2: Crear el Documento

1. **Crear nuevo documento**
   - Ve a **Documents** en el menú lateral
   - Haz clic en **Create new**
   - Selecciona el tipo **FieldView**
   - Se creará automáticamente como documento singleton

2. **Configurar idiomas** (si aplica)
   - Si tienes múltiples idiomas, crea documentos separados:
     - `fieldview` para español (`es-es`)
     - `fieldview` para portugués (`pt-pt`)

## Paso 3: Llenar los Campos

### Hero Section

**Hero Título:**
```
Siembra datos y cosecha decisiones
```

**Hero Descripción:**
```
Descubre cómo tomar decisiones agronómicas más inteligentes gracias a los datos de tus propias cosechas.
```

### Sección Introducción

**Título Introducción:**
```
Transforma datos en decisiones para una agricultura inteligente y eficiente!
```

**Texto Introducción:**
```
La plataforma digital de Bayer, FieldView™, es la herramienta ideal para la agricultura del futuro: ofrece soluciones innovadoras basadas en ciencia de datos, diseñadas para ayudarle a optimizar cada etapa de su cultivo, desde la siembra hasta la cosecha.
```

### FieldView Drive

**Título FieldView Drive:**
```
FieldView Drive
```

**Descripción FieldView Drive:**
```
FieldView™ Drive es la única herramienta de agricultura digital que puede recopilar y procesar datos agrícolas en tiempo real. También es el dispositivo con mayor compatibilidad en maquinaria agrícola del mundo. Se conecta al puerto CAN de casi todos los modelos y marcas de sembradoras, pulverizadoras y cosechadoras de España.
```

**Imagen FieldView Drive:**
- Sube una imagen de 585x500px
- Formato recomendado: JPG o PNG
- Nombre sugerido: `fieldview-drive.jpg`

### FieldView Yield Kit

**Título FieldView Yield Kit:**
```
FieldView Yield Kit
```

**Descripción FieldView Yield Kit:**
```
(Opcional - se puede dejar vacío ya que se usa el sistema de tabs)
```

**Imagen FieldView Yield Kit:**
- Sube una imagen de 585x500px
- Formato recomendado: JPG o PNG
- Nombre sugerido: `fieldview-yield-kit.jpg`

**Tabs Yield Kit** (Group - IMPORTANTE: Crear exactamente 4 items en este orden):

#### Tab 1: ¿Qué es?
- **Etiqueta del Tab:** `¿Qué es?`
- **Contenido del Tab:**
```
El FieldView Yield Kit es una solución tecnológica 100% compatible con cualquier cosechadora. Te permite recopilar datos precisos durante la recolección y aprovecharlos para mejorar tus decisiones agronómicas futuras.
```

#### Tab 2: Compatibilidad
- **Etiqueta del Tab:** `Compatibilidad`
- **Contenido del Tab:**
```
(Agregar contenido cuando esté disponible)
```

#### Tab 3: Ventajas
- **Etiqueta del Tab:** `Ventajas`
- **Contenido del Tab:**
```
(Agregar contenido cuando esté disponible)
```

#### Tab 4: Conectividad
- **Etiqueta del Tab:** `Conectividad`
- **Contenido del Tab:**
```
(Agregar contenido cuando esté disponible)
```

**⚠️ IMPORTANTE:** Los tabs deben crearse en este orden exacto:
1. ¿Qué es?
2. Compatibilidad
3. Ventajas
4. Conectividad

### FieldView SprayKit

**Título FieldView SprayKit:**
```
FieldView SprayKit
```

**Descripción FieldView SprayKit:**
```
El Spray Kit FieldView™ Pulverizador Agrícola de Precisión es la solución ideal para mejorar la eficiencia en la aplicación de pesticidas. Permite monitorear en tiempo real la cantidad exacta de pesticida aplicado, optimizando el rendimiento y reduciendo el desperdicio.

Destaca por su precio competitivo y versatilidad. Es compatible con cultivos extensivos, frutales y hortícolas.

¡Descubre cómo este pulverizador agrícola de precisión puede transformar tu manera de trabajar en el campo!
```

**Imagen FieldView SprayKit:**
- Sube una imagen de 585x500px
- Formato recomendado: JPG o PNG
- Nombre sugerido: `fieldview-spraykit.jpg`

## Paso 4: Publicar el Documento

1. **Guardar como borrador**
   - Haz clic en **Save** para guardar el borrador
   - Puedes trabajar en el documento sin publicarlo

2. **Publicar**
   - Cuando el contenido esté completo, haz clic en **Publish**
   - El documento quedará disponible para la aplicación

3. **Verificar publicación**
   - El documento debe aparecer como **Published** en el listado
   - El contenido estará disponible inmediatamente en la web

## Paso 5: Verificar en la Aplicación

1. **Verificar que el contenido se carga**
   - Visita `/es/fieldview` en tu sitio web
   - El contenido debería aparecer desde Prismic

2. **Si no hay contenido en Prismic**
   - La página mostrará contenido por defecto (fallback)
   - Esto permite que la página funcione mientras se crea el contenido

## Notas Importantes

### Orden de los Tabs
- Los tabs de Yield Kit **DEBEN** estar en el orden especificado
- El código asigna IDs automáticamente según la posición:
  - Posición 0: `que-es`
  - Posición 1: `compatibilidad`
  - Posición 2: `ventajas`
  - Posición 3: `conectividad`

### Imágenes
- Todas las imágenes deben tener las dimensiones recomendadas (585x500px)
- Usa formatos optimizados (JPG para fotos, PNG para gráficos)
- Asegúrate de que las imágenes tengan buena calidad

### Contenido Rich Text
- Los campos de descripción y contenido de tabs soportan formato:
  - Negrita, cursiva
  - Listas (ordenadas y no ordenadas)
  - Enlaces
  - Encabezados
- Usa el editor de Prismic para formatear el contenido

### Múltiples Idiomas
- Si tienes contenido en español y portugués:
  - Crea dos documentos singleton separados
  - Cada uno con su idioma correspondiente (`es-es` y `pt-pt`)
  - El código detectará automáticamente el idioma

## Solución de Problemas

### El contenido no aparece en la web
1. Verifica que el documento esté **Published**
2. Verifica que el Custom Type esté **Active**
3. Revisa la consola del navegador para errores
4. Verifica las variables de entorno de Prismic

### Los tabs no funcionan correctamente
1. Verifica que hay exactamente 4 tabs
2. Verifica el orden de los tabs
3. Verifica que cada tab tenga contenido

### Las imágenes no se muestran
1. Verifica que las imágenes estén subidas correctamente
2. Verifica las dimensiones (585x500px)
3. Verifica que las imágenes estén publicadas

## Próximos Pasos

Una vez que el contenido esté en Prismic:
1. La página `/es/fieldview` cargará automáticamente el contenido
2. Puedes actualizar el contenido en Prismic sin tocar código
3. Los cambios se reflejarán después de publicar en Prismic

