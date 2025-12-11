# Configuración de Prismic para Home Page

## Custom Type: `home`

Este documento describe cómo configurar el Custom Type `home` en Prismic para gestionar el contenido de la página principal.

### Campos Requeridos

#### Hero Section
- **`hero_title`** (UID/Key Text)
  - Tipo: Key Text
  - Etiqueta: "Título Hero"
  - Valor por defecto: "DEKALB EXPERIENCE"
  - Descripción: Título principal del hero

- **`hero_claim`** (UID/Key Text)
  - Tipo: Key Text
  - Etiqueta: "Claim Hero"
  - Valor por defecto: "Siempre a tu lado"
  - Descripción: Subtítulo/claim del hero

#### Solutions Section
- **`solutions_integral_maiz`** (UID/Key Text)
  - Tipo: Key Text
  - Etiqueta: "Título Soluciones Maíz"
  - Valor por defecto: "Soluciones Integrales para Maíz"
  - Descripción: Título de la sección de soluciones para maíz

- **`solutions_fieldview`** (UID/Key Text)
  - Tipo: Key Text
  - Etiqueta: "Título FieldView"
  - Valor por defecto: "FieldView"
  - Descripción: Título de la sección FieldView

- **`solutions_protection`** (UID/Key Text)
  - Tipo: Key Text
  - Etiqueta: "Título Protección"
  - Valor por defecto: "Protección de Cultivo"
  - Descripción: Título de la sección de protección

- **`solutions_preceon`** (UID/Key Text)
  - Tipo: Key Text
  - Etiqueta: "Título Preceon"
  - Valor por defecto: "Smart Corn System PRECEON"
  - Descripción: Título de la sección Preceon

- **`solutions_avoid_problems`** (UID/Key Text)
  - Tipo: Key Text
  - Etiqueta: "Título Evitar Problemas"
  - Valor por defecto: "Evita problemas con tu maíz"
  - Descripción: Título de la sección de evitar problemas

### Configuración del Custom Type

1. **Crear el Custom Type**:
   - Ve a Prismic Dashboard
   - Custom Types > Create New
   - Nombre: `home`
   - Tipo: Single (no repeatable)

2. **Agregar los campos**:
   - Agrega cada campo según la lista anterior
   - Todos los campos deben ser de tipo "Key Text" o "UID"
   - Configura los valores por defecto según se indica

3. **Configurar Localización**:
   - Habilita la localización para español (`es-es`) y portugués (`pt-pt`)
   - Cada idioma tendrá sus propios valores

4. **Crear el documento**:
   - Crea un documento del tipo `home`
   - Completa los campos con los valores deseados
   - Publica el documento

### Estructura JSON del Custom Type

```json
{
  "Main": {
    "hero_title": {
      "type": "UID",
      "config": {
        "label": "Título Hero",
        "placeholder": "DEKALB EXPERIENCE"
      }
    },
    "hero_claim": {
      "type": "UID",
      "config": {
        "label": "Claim Hero",
        "placeholder": "Siempre a tu lado"
      }
    },
    "solutions_integral_maiz": {
      "type": "UID",
      "config": {
        "label": "Título Soluciones Maíz",
        "placeholder": "Soluciones Integrales para Maíz"
      }
    },
    "solutions_fieldview": {
      "type": "UID",
      "config": {
        "label": "Título FieldView",
        "placeholder": "FieldView"
      }
    },
    "solutions_protection": {
      "type": "UID",
      "config": {
        "label": "Título Protección",
        "placeholder": "Protección de Cultivo"
      }
    },
    "solutions_preceon": {
      "type": "UID",
      "config": {
        "label": "Título Preceon",
        "placeholder": "Smart Corn System PRECEON"
      }
    },
    "solutions_avoid_problems": {
      "type": "UID",
      "config": {
        "label": "Título Evitar Problemas",
        "placeholder": "Evita problemas con tu maíz"
      }
    }
  }
}
```

### Uso en el Código

El código ya está preparado para usar Prismic. La función `getHomeContent()` en `src/utils/prismic.ts` intentará obtener el contenido desde Prismic. Si no está disponible o hay un error, usará el contenido mockup por defecto.

### Valores Mockup Actuales

**Español:**
- Hero Title: "DEKALB EXPERIENCE"
- Hero Claim: "Siempre a tu lado"
- Solutions Integral Maíz: "Soluciones Integrales para Maíz"
- Solutions FieldView: "FieldView"
- Solutions Protection: "Protección de Cultivo"
- Solutions Preceon: "Smart Corn System PRECEON"
- Solutions Avoid Problems: "Evita problemas con tu maíz"

**Portugués:**
- Hero Title: "DEKALB EXPERIENCE"
- Hero Claim: "Sempre ao seu lado"
- Solutions Integral Maíz: "Soluções Integrais para Milho"
- Solutions FieldView: "FieldView"
- Solutions Protection: "Proteção de Cultivo"
- Solutions Preceon: "Smart Corn System PRECEON"
- Solutions Avoid Problems: "Evite problemas com seu milho"

### Notas

- El contenido mockup se usa cuando Prismic no está configurado o hay un error al obtener el contenido
- Una vez configurado Prismic, el contenido se obtendrá automáticamente desde allí
- Los cambios en Prismic se reflejarán en la página después de publicar


