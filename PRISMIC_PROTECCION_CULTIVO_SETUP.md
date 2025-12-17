# Guía de Configuración: Protección de Cultivo en Prismic

Esta guía te ayudará a configurar el Custom Type "Protección de Cultivo" en Prismic y crear el contenido para la página.

## Paso 1: Importar el Custom Type

1. Ve a tu repositorio de Prismic
2. Ve a **Settings** → **Custom Types**
3. Haz clic en **"Create new"**
4. Selecciona **"Import"**
5. Sube el archivo `prismic-proteccion-cultivo.json`
6. Guarda el Custom Type

## Paso 2: Crear el Documento

1. Ve a **Documents**
2. Haz clic en **"Create new"**
3. Selecciona el tipo **"Protección de Cultivo"**
4. Como es un Singleton, solo puedes crear un documento de este tipo

## Paso 3: Configurar el Contenido

### Sección: Soluciones

Esta sección contiene 4 soluciones diferentes. Cada solución tiene:

- **Logo**: Imagen del logo de la solución (máximo 200x100px recomendado)
- **Texto Introductorio**: Texto descriptivo en formato rich text
- **Tabla**: Contenido de la tabla en formato rich text (puedes usar HTML para crear tablas)

**Nota**: Las tablas deben crearse usando HTML dentro del campo rich text. Puedes usar el editor HTML de Prismic o escribir directamente el código HTML de la tabla.

Ejemplo de tabla HTML:
```html
<table>
  <thead>
    <tr>
      <th>Columna 1</th>
      <th>Columna 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dato 1</td>
      <td>Dato 2</td>
    </tr>
  </tbody>
</table>
```

### Sección: Tabla de Tratamientos

Este campo contiene la tabla completa de tratamientos en formato rich text. Puedes usar HTML para estructurar la tabla.

### Sección: Imagen y Texto

Esta sección contiene:

- **Imagen**: Imagen descriptiva (recomendado 585x500px)
- **Texto**: Texto descriptivo en formato rich text

## Paso 4: Publicar

1. Una vez completado el contenido, haz clic en **"Save"**
2. Luego haz clic en **"Publish"** para publicar los cambios

## Estructura del Custom Type

```
Protección de Cultivo (Singleton)
├── Soluciones (Group - repetible hasta 4 veces)
│   ├── Logo (Image)
│   ├── Texto Introductorio (StructuredText)
│   └── Tabla (StructuredText)
├── Tabla de Tratamientos (StructuredText)
└── Sección Imagen y Texto (Group)
    ├── Imagen (Image)
    └── Texto (StructuredText)
```

## Notas Importantes

- Las tablas deben crearse usando HTML dentro de los campos StructuredText
- Las imágenes se optimizan automáticamente por Prismic
- Todos los campos de texto soportan formato rich text (negrita, cursiva, enlaces, listas, etc.)
- El contenido se mostrará en la página `/es/proteccion-cultivo`

