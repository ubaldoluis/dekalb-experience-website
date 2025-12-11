# Guía: Exportar Tokens desde Figma con Tokens Studio
## Método Automatizado

Esta es la forma más rápida y precisa de extraer todos los tokens de diseño.

---

## 📦 PASO 1: Instalar Tokens Studio Plugin

1. Abre Figma
2. Ve a **Plugins** → **Browse plugins** (o presiona `Cmd/Ctrl + /`)
3. Busca **"Tokens Studio for Figma"**
4. Haz clic en **"Install"**

---

## 🎨 PASO 2: Configurar Tokens en Figma

1. En Figma, ve a **Plugins** → **Tokens Studio for Figma**
2. El plugin se abrirá en un panel lateral

### 2.1 Si ya tienes tokens definidos en Figma:
- El plugin los detectará automáticamente
- Ve directamente al Paso 3

### 2.2 Si NO tienes tokens definidos:
- El plugin puede ayudarte a crearlos desde los estilos existentes
- O puedes definirlos manualmente en el plugin

---

## 📤 PASO 3: Exportar Tokens

1. En el panel de Tokens Studio, busca la opción **"Export"** o **"Sync"**
2. Selecciona el formato de exportación:
   - **JSON** (recomendado para nuestro caso)
   - O **CSS Variables**
3. Haz clic en **"Export"** o **"Download"**
4. Se descargará un archivo JSON con todos los tokens

---

## 📋 PASO 4: Compartir el Archivo

Una vez exportado, puedes:
- **Opción A**: Pegar el contenido del JSON aquí directamente
- **Opción B**: Subir el archivo al proyecto en `/tokens/figma-tokens.json`
- **Opción C**: Compartir el JSON y yo lo procesaré

---

## 🖼️ PASO 5: Exportar Logos

Los logos se exportan manualmente:

### Logo DEKALB:
1. Selecciona el logo DEKALB en Figma
2. En el panel derecho, busca **"Export"**
3. Haz clic en **"+"** para añadir una exportación
4. Selecciona formato **SVG**
5. Haz clic en **"Export"**
6. Guarda como `logo-dekalb.svg`

### Logo Bayer:
1. Repite el proceso para el logo Bayer
2. Guarda como `logo-bayer.svg`

---

## ✅ RESULTADO ESPERADO

Al final deberías tener:
- ✅ Un archivo JSON con todos los tokens (colores, tipografía, espaciado, etc.)
- ✅ `logo-dekalb.svg`
- ✅ `logo-bayer.svg`

---

## 🚀 ALTERNATIVA: Si Tokens Studio no está disponible

Si no puedes usar Tokens Studio, podemos hacerlo manualmente:
1. Te guío paso a paso para extraer cada valor
2. Compartes los valores y los aplico directamente
3. Es más lento pero igual de efectivo

---

**¿Prefieres usar Tokens Studio o hacerlo manualmente paso a paso?**

