# Cómo Insertar HTML en Prismic - Guía Actualizada

Esta guía te explica cómo insertar código HTML (como tablas con estilos) en campos de texto enriquecido de Prismic.

## ⚠️ Importante: Prismic no tiene modo "Source/HTML" nativo

El editor de texto enriquecido de Prismic **no tiene un modo HTML/Source** como otros editores. Sin embargo, hay varias formas de insertar HTML.

## Método 1: Pegar HTML directamente (RECOMENDADO)

### Pasos:

1. **Abre tu documento en Prismic**
   - Ve a **Documents** → Selecciona tu documento "Protección de Cultivo"

2. **Localiza el campo donde quieres insertar la tabla**
   - Por ejemplo: Campo "Tabla" dentro de una solución

3. **Copia el código HTML completo**
   - Abre el archivo `TABLA_PRODUCTO_HTML.html`
   - Selecciona y copia todo el código HTML (sin los comentarios si prefieres)

4. **Pega en el editor de Prismic**
   - Haz clic en el campo de texto enriquecido
   - Usa **Ctrl+Shift+V** (Windows/Linux) o **Cmd+Shift+V** (Mac) para pegar sin formato
   - O haz clic derecho → **"Paste as HTML"** o **"Paste without formatting"**

5. **Verifica que se haya pegado correctamente**
   - Deberías ver la tabla renderizada en el editor
   - Si ves código HTML plano, Prismic lo preservará y se renderizará en la página

6. **Guarda y publica**

### Si el HTML no se pega correctamente:

- Intenta pegar primero en un editor de texto plano (Notepad, TextEdit)
- Luego cópialo de nuevo y pégalo en Prismic
- O usa el método alternativo (Método 2)

## Método 2: Usar campo de tipo Text (ALTERNATIVA)

Si el editor visual no permite pegar HTML fácilmente:

### Cambiar el Custom Type:

1. Ve a **Settings** → **Custom Types**
2. Edita el Custom Type "proteccion-cultivo"
3. Para el campo "tabla" dentro de "soluciones":
   - Cambia de `StructuredText` a `Text`
   - Esto permitirá pegar HTML directamente sin restricciones

### Ventajas:
- ✅ Permite pegar HTML sin problemas
- ✅ Más control sobre el contenido
- ✅ No hay conversión automática de formato

### Desventajas:
- ⚠️ No puedes usar el editor visual para otras partes del texto
- ⚠️ Todo el contenido debe ser HTML

## Método 3: Usar el editor de código fuente del navegador (AVANZADO)

Solo para usuarios técnicos avanzados:

1. Abre tu documento en Prismic
2. Abre las herramientas de desarrollador (F12)
3. En la consola, puedes manipular el DOM directamente
4. **No recomendado** para uso regular

## Verificación en la Página

Una vez insertado el HTML en Prismic:

1. El código se guardará en el campo StructuredText
2. Cuando se recupere con `getProteccionCultivoContent()`, vendrá como array de bloques
3. La función `renderRichText()` convertirá el HTML a string
4. En la página, se renderizará con `set:html={renderRichText(content)}`
5. Los estilos inline se preservarán y la tabla se verá correctamente

## Solución de Problemas

### Problema: El HTML se convierte a texto plano
**Solución**: Usa Ctrl+Shift+V para pegar sin formato, o cambia el campo a tipo Text

### Problema: Los estilos no se aplican
**Solución**: Verifica que los estilos estén inline (dentro de `style=""`), no como CSS externo

### Problema: La tabla no se ve en el editor
**Solución**: Esto es normal. Prismic puede mostrar el HTML como código. Se renderizará correctamente en la página web.

### Problema: Prismic elimina las etiquetas HTML
**Solución**: 
- Verifica que el campo StructuredText tenga habilitado `multi` con todas las opciones
- O cambia el campo a tipo Text

## Estructura del Campo en Prismic

El campo "tabla" debe estar configurado así en el JSON:

```json
"tabla": {
  "type": "StructuredText",
  "config": {
    "label": "Tabla",
    "multi": "paragraph,preformatted,heading1,heading2,heading3,heading4,heading5,heading6,strong,em,hyperlink,image,embed,list-item,o-list-item,rtl"
  }
}
```

O si prefieres usar Text:

```json
"tabla": {
  "type": "Text",
  "config": {
    "label": "Tabla"
  }
}
```

## Referencias

- [Prismic Documentation](https://prismic.io/docs)
- [Prismic Community](https://community.prismic.io)
- [StructuredText Field](https://prismic.io/docs/core-concepts/rich-text-title)

