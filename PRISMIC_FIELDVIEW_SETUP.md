# Configuración de Prismic para FieldView

## Custom Type: `fieldview`

Este documento describe cómo configurar el Custom Type `fieldview` en Prismic para gestionar el contenido de la página FieldView.

### Tipo de Documento
- **Tipo**: Single (no repeatable)
- **API ID**: `fieldview`

### Campos Requeridos

#### Hero Section
- **`hero_titulo`** (Title)
  - Etiqueta: "Título Hero"
  - Valor por defecto: "Siembra datos y cosecha decisiones"
  - Descripción: Título principal del hero

- **`hero_descripcion`** (StructuredText - single paragraph)
  - Etiqueta: "Descripción Hero"
  - Valor por defecto: "Descubre cómo tomar decisiones agronómicas más inteligentes gracias a los datos de tus propias cosechas."
  - Descripción: Descripción del hero

#### Sección Introducción
- **`introduccion_titulo`** (Title)
  - Etiqueta: "Título Introducción"
  - Valor por defecto: "Transforma datos en decisiones para una agricultura inteligente y eficiente!"

- **`introduccion_texto`** (StructuredText - single paragraph)
  - Etiqueta: "Texto Introducción"
  - Descripción: Texto descriptivo sobre FieldView

#### FieldView Drive
- **`drive_titulo`** (Title)
  - Etiqueta: "Título FieldView Drive"
  - Valor por defecto: "FieldView Drive"

- **`drive_descripcion`** (StructuredText - single paragraph)
  - Etiqueta: "Descripción FieldView Drive"
  - Descripción: Descripción del producto Drive

- **`drive_imagen`** (Image)
  - Etiqueta: "Imagen FieldView Drive"
  - Dimensiones recomendadas: 585x500px

#### FieldView Yield Kit
- **`yield_kit_titulo`** (Title)
  - Etiqueta: "Título FieldView Yield Kit"
  - Valor por defecto: "FieldView Yield Kit"

- **`yield_kit_descripcion`** (StructuredText - single paragraph)
  - Etiqueta: "Descripción FieldView Yield Kit"
  - Descripción: Descripción general (opcional, ya que se usa el sistema de tabs)

- **`yield_kit_imagen`** (Image)
  - Etiqueta: "Imagen FieldView Yield Kit"
  - Dimensiones recomendadas: 585x500px

- **`yield_kit_tabs`** (Group - Repeatable)
  - Etiqueta: "Tabs Yield Kit"
  - Campos del grupo:
    - **`label`** (KeyText): Etiqueta del tab (ej: "¿Qué es?", "Compatibilidad", "Ventajas", "Conectividad")
    - **`content`** (StructuredText): Contenido del tab en formato rich text
  - **IMPORTANTE**: Debe tener exactamente 4 items en este orden:
    1. ¿Qué es?
    2. Compatibilidad
    3. Ventajas
    4. Conectividad

#### FieldView SprayKit
- **`spraykit_titulo`** (Title)
  - Etiqueta: "Título FieldView SprayKit"
  - Valor por defecto: "FieldView SprayKit"

- **`spraykit_descripcion`** (StructuredText - single paragraph)
  - Etiqueta: "Descripción FieldView SprayKit"
  - Descripción: Descripción del producto SprayKit

- **`spraykit_imagen`** (Image)
  - Etiqueta: "Imagen FieldView SprayKit"
  - Dimensiones recomendadas: 585x500px

### Configuración del Custom Type

1. **Crear el Custom Type**:
   - Ve a Prismic Dashboard
   - Custom Types > Create New
   - Nombre: `fieldview`
   - Tipo: Single (no repeatable)

2. **Importar desde JSON** (recomendado):
   - Usa el archivo `prismic-fieldview.json` incluido en el proyecto
   - Ve a Custom Types > Import JSON
   - Selecciona el archivo `prismic-fieldview.json`

3. **O agregar campos manualmente**:
   - Sigue el orden y estructura descrita arriba
   - Asegúrate de que los tipos de campo coincidan exactamente

### Notas Importantes

- El sistema de tabs de Yield Kit requiere exactamente 4 tabs en el orden especificado
- Las imágenes deben tener las dimensiones recomendadas para mantener el diseño
- El contenido de los tabs usa Rich Text, por lo que puede incluir formato, listas, etc.
- El Custom Type debe crearse tanto para español (`es-es`) como para portugués (`pt-pt`)

### Uso en el Código

El contenido se obtiene usando:
```typescript
import { getFieldViewContent } from '../../utils/prismic';
const content = await getFieldViewContent('es');
```

Si no hay contenido en Prismic, se usará contenido por defecto hardcodeado.

