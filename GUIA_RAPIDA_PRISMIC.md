# Guía Rápida: Crear Primeros Documentos en Prismic
## DEKALB Experience Website

## 🎯 Objetivo
Crear al menos 3 productos de ejemplo para probar el filtro funcional.

---

## 📝 Paso 1: Crear Primer Producto (Maíz - Grano)

1. Ve a Prismic: https://prismic.io/dashboard
2. Selecciona tu repositorio: **DKLab**
3. Click en **Documents** → **Create New** → **Producto**

### Campos a completar:

| Campo | Valor |
|-------|-------|
| **nombre** | `DKC3045` |
| **codigo** | `DKC3045` |
| **imagen_saco** | (Opcional: sube una imagen si tienes) |
| **claim** | `Alto rendimiento y resistencia` |
| **tipo_semilla** | `maiz` |
| **uso** | `grano` |
| **zona** | `ebro` |
| **categoria** | `maiz-grano` |
| **proteccion** | `herbicida` |
| **beneficios** | (Rich Text) Agrega una lista:<br>- Alto rendimiento<br>- Resistencia a plagas<br>- Adaptado para zona Ebro |
| **recomendaciones_uso** | (Rich Text) Agrega texto:<br>Recomendado para siembra en primavera. Densidad de siembra: 75,000-85,000 plantas/ha. |
| **orden** | `1` |

4. Click en **Save** (arriba derecha)
5. Click en **Publish** (arriba derecha)

---

## 📝 Paso 2: Crear Segundo Producto (Maíz - Preceon)

1. **Create New** → **Producto**

| Campo | Valor |
|-------|-------|
| **nombre** | `DKC6836SC` |
| **codigo** | `DKC6836SC` |
| **claim** | `Tecnología Preceon avanzada` |
| **tipo_semilla** | `maiz` |
| **uso** | `preceon` |
| **zona** | `noroeste` |
| **categoria** | `preceon` |
| **proteccion** | `insecticida` |
| **beneficios** | (Rich Text)<br>- Tecnología Preceon<br>- Control de malezas<br>- Alto rendimiento |
| **recomendaciones_uso** | (Rich Text)<br>Ideal para zonas con alta presión de malezas. |
| **orden** | `2` |

**Save** y **Publish**

---

## 📝 Paso 3: Crear Tercer Producto (Colza)

1. **Create New** → **Producto**

| Campo | Valor |
|-------|-------|
| **nombre** | `DEKALB Colza Premium` |
| **codigo** | `DCL001` |
| **claim** | `Máximo rendimiento en colza` |
| **tipo_semilla** | `colza` |
| **uso** | (dejar vacío - no aplica para Colza) |
| **zona** | (dejar vacío - no aplica para Colza) |
| **categoria** | `colza` |
| **proteccion** | `herbicida` |
| **beneficios** | (Rich Text)<br>- Alto contenido de aceite<br>- Resistencia a enfermedades<br>- Adaptado a clima mediterráneo |
| **recomendaciones_uso** | (Rich Text)<br>Siembra en otoño. Densidad recomendada: 50-60 plantas/m². |
| **orden** | `3` |

**Save** y **Publish**

---

## ✅ Verificar en el Sitio

1. **Reinicia el servidor** (si es necesario):
```bash
# En la terminal donde corre npm run dev, presiona Ctrl+C y luego:
npm run dev
```

2. **Visita**: http://localhost:4321/es/

3. **Prueba el filtro**:
   - Selecciona "Maíz" → deberías ver los productos DKC3045 y DKC6836SC
   - Selecciona "Colza" → deberías ver el producto DEKALB Colza Premium
   - Cambia "Protección" → los productos deberían filtrarse
   - Selecciona "Maíz" + "Grano" + "Ebro" → deberías ver solo DKC3045

---

## 🎨 Sobre Figma

**¿Cuándo importar el diseño desde Figma?**

Te recomiendo hacerlo **después de tener contenido** porque:
1. ✅ Primero necesitamos verificar que la funcionalidad funciona (filtro, carrusel, etc.)
2. ✅ Luego aplicamos el diseño visual real desde Figma
3. ✅ Es más fácil ajustar el diseño cuando ya tienes contenido real

**Próximos pasos sugeridos:**
1. ✅ Crear productos de ejemplo (ahora)
2. ✅ Verificar que el filtro funciona correctamente
3. ✅ Crear algunos artículos de ejemplo
4. 🎨 **Luego**: Importar diseño desde Figma y aplicar estilos reales

¿Quieres que te guíe paso a paso para crear los documentos ahora, o prefieres hacerlo tú y luego probamos juntos?

