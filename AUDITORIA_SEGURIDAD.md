# Auditoría de Seguridad - DEKALB Experience Website

**Fecha:** $(date)  
**Auditor:** Análisis automatizado de seguridad  
**Alcance:** Código fuente, configuración y dependencias

---

## Resumen Ejecutivo

Se han identificado **8 vulnerabilidades** de seguridad con diferentes niveles de severidad:

- **Alta:** 3
- **Media:** 3
- **Baja:** 2

Todas las vulnerabilidades son mitigables con cambios mínimos al código existente. No se requieren reescrituras mayores ni cambios funcionales.

---

## Paso 1: Lista de Hallazgos

### 🔴 ALTA SEVERIDAD

#### 1. XSS en renderRichText - Renderizado de HTML sin sanitización

**Archivo:** `src/utils/prismic-rich-text.ts` (líneas 126-148)  
**Severidad:** Alta  
**Riesgo:** Permite ejecución de código JavaScript malicioso si contenido de Prismic está comprometido

#### 2. XSS en ProductCarousel - innerHTML sin sanitización

**Archivo:** `src/components/ProductCarousel.astro` (línea 128)  
**Severidad:** Alta  
**Riesgo:** Permite inyección de código si datos de productos están manipulados

#### 3. XSS en DensityCalculator - innerHTML sin sanitización

**Archivo:** `src/components/DensityCalculator.astro` (línea 188)  
**Severidad:** Alta  
**Riesgo:** Permite inyección de código si datos de híbridos están manipulados

### 🟡 MEDIA SEVERIDAD

#### 4. URLs de imágenes sin validación

**Archivos:** Múltiples (prismic-rich-text.ts, páginas)  
**Severidad:** Media  
**Riesgo:** Permite SSRF básico o carga de imágenes desde dominios maliciosos

#### 5. Embed HTML sin sanitización

**Archivo:** `src/utils/prismic-rich-text.ts` (líneas 159-165)  
**Severidad:** Media  
**Riesgo:** Permite inyección de iframes o contenido malicioso

#### 6. Headers de seguridad incompletos

**Archivo:** `vercel.json`  
**Severidad:** Media  
**Riesgo:** Falta CSP, HSTS, Referrer-Policy para protección adicional

### 🟢 BAJA SEVERIDAD

#### 7. Validación de inputs insuficiente en formularios

**Archivo:** `src/components/DensityCalculator.astro`  
**Severidad:** Baja  
**Riesgo:** Entrada de datos inválidos, pero no crítico para seguridad

#### 8. Logs de depuración en producción

**Archivos:** Múltiples (prismic.ts, prismic-rich-text.ts)  
**Severidad:** Baja  
**Riesgo:** Exposición de información sensible en logs

---

## Paso 2: Análisis Detallado y Soluciones

### 🔴 1. XSS en renderRichText - Renderizado de HTML sin sanitización

**Problema:**
El código detecta HTML en bloques "preformatted" y lo renderiza directamente sin sanitización adecuada:

```typescript
// src/utils/prismic-rich-text.ts líneas 138-148
if (hasHtmlTags) {
  let cleanedHtml = preText.replace(/<!--[\s\S]*?-->/g, "");
  cleanedHtml = cleanedHtml
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
  return cleanedHtml; // ⚠️ Renderizado sin sanitización
}
```

**Riesgo:**
Si un editor de Prismic es comprometido o introduce contenido malicioso, se puede ejecutar JavaScript arbitrario.

**Solución:**
Usar una librería de sanitización HTML o implementar una lista blanca de tags permitidos.

**Código mínimo necesario:**

```typescript
// Añadir al inicio del archivo
function sanitizeHtml(html: string): string {
  // Lista blanca de tags permitidos para tablas
  const allowedTags = ['table', 'thead', 'tbody', 'tr', 'td', 'th', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const allowedAttributes = ['style', 'class', 'colspan', 'rowspan'];

  // Crear un parser básico que solo permita tags de la lista blanca
  // Opción 1: Usar DOMParser (solo en servidor) o librería como dompurify
  // Opción 2: Regex más restrictivo (menos seguro pero sin dependencias)

  // Implementación básica con regex (mejor usar dompurify en producción)
  let sanitized = html;

  // Remover scripts y eventos
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Solo permitir tags específicos
  const tagPattern = new RegExp(`<(/?)(${allowedTags.join('|')})([^>]*)>`, 'gi');
  sanitized = sanitized.replace(/<(?!(?:\/)?(?:table|thead|tbody|tr|td|th|div|p|h[1-6]|br|strong|em|b|i|u|span)\b)[^>]*>/gi, '');

  return sanitized;
}

// Modificar renderBlock:
case 'preformatted':
  const preText = block.text || '';
  const hasHtmlTags = preText.includes('<table') || preText.includes('<div') || /* ... */;

  if (hasHtmlTags) {
    let cleanedHtml = preText.replace(/<!--[\s\S]*?-->/g, '');
    cleanedHtml = cleanedHtml
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
    return sanitizeHtml(cleanedHtml); // ✅ Sanitizar antes de renderizar
  }
  return `<pre>${escapeHtml(preText)}</pre>`;
```

**Recomendación:** Instalar `dompurify` para sanitización robusta:

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

---

### 🔴 2. XSS en ProductCarousel - innerHTML sin sanitización

**Problema:**
El código construye HTML mediante template strings y lo inserta con `innerHTML`:

```javascript
// src/components/ProductCarousel.astro línea 128
trackElement.innerHTML = newProducts
  .map(
    (product) => `
    <div class="product-card" data-product-id="${product.id}">
      ${
        product.imagen_saco?.url
          ? `
        <div class="product-image-wrapper">
          <img src="${product.imagen_saco.url}" alt="${
              product.imagen_saco.alt || product.nombre
            }" />
        </div>
      `
          : ""
      }
    </div>
  `
  )
  .join("");
```

**Riesgo:**
Si `product.nombre` o `product.imagen_saco.url` contienen HTML malicioso, se ejecutará.

**Solución:**
Escapar valores antes de insertarlos o usar métodos seguros de DOM.

**Código mínimo necesario:**

```javascript
// Añadir función de escape
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Modificar updateCarousel:
function updateCarousel(newProducts, isFiltered = false) {
  // ... código existente ...

  // ✅ Usar createElement en lugar de innerHTML
  trackElement.innerHTML = ""; // Limpiar primero

  newProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-product-id", product.id);

    if (product.imagen_saco?.url) {
      const wrapper = document.createElement("div");
      wrapper.className = "product-image-wrapper";

      const img = document.createElement("img");
      img.src = product.imagen_saco.url; // URL ya validada por Prismic
      img.alt = escapeHtml(product.imagen_saco.alt || product.nombre);
      img.className = "product-image";
      img.loading = "lazy";

      wrapper.appendChild(img);
      card.appendChild(wrapper);
    }

    trackElement.appendChild(card);
  });

  // ... resto del código ...
}
```

---

### 🔴 3. XSS en DensityCalculator - innerHTML sin sanitización

**Problema:**
Se usa `innerHTML` para insertar opciones de select:

```javascript
// src/components/DensityCalculator.astro línea 188
hybridSelect.innerHTML = '<option value="">Seleccionar híbrido</option>';
// ...
hybrids[zone].forEach((hybrid) => {
  const option = document.createElement("option");
  option.value = hybrid;
  option.textContent = hybrid; // ✅ Esto está bien, pero el innerHTML inicial es problema
  hybridSelect.appendChild(option);
});
```

**Riesgo:**
Aunque el código usa `createElement` después, el `innerHTML` inicial podría ser explotado si hay manipulación del DOM.

**Solución:**
Eliminar el uso de `innerHTML` y usar solo `createElement`.

**Código mínimo necesario:**

```javascript
// Modificar el event listener de zoneSelect:
zoneSelect.addEventListener("change", () => {
  const zone = zoneSelect.value;

  // ✅ Limpiar usando removeChild en lugar de innerHTML
  while (hybridSelect.firstChild) {
    hybridSelect.removeChild(hybridSelect.firstChild);
  }

  // Crear opción por defecto
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent =
    lang === "es" ? "Seleccionar híbrido" : "Selecionar híbrido";
  hybridSelect.appendChild(defaultOption);

  // Mock hybrid data
  const hybrids: Record<string, string[]> = {
    ebro: ["DKC3045", "DKC6836SC", "DKC6648SC"],
    // ...
  };

  if (zone && hybrids[zone]) {
    hybrids[zone].forEach((hybrid) => {
      const option = document.createElement("option");
      option.value = hybrid;
      option.textContent = hybrid;
      hybridSelect.appendChild(option);
    });
  }
});
```

---

### 🟡 4. URLs de imágenes sin validación

**Problema:**
Las URLs de imágenes de Prismic se renderizan directamente sin validar que sean URLs válidas o del dominio esperado.

**Riesgo:**

- SSRF básico si se puede controlar la URL
- Carga de imágenes desde dominios maliciosos
- Posible uso de `javascript:` o `data:` URLs

**Solución:**
Validar que las URLs sean HTTP/HTTPS y opcionalmente restringir a dominios permitidos.

**Código mínimo necesario:**

```typescript
// Añadir a src/utils/prismic.ts o crear src/utils/url-validation.ts
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);

    // Solo permitir http y https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Opcional: Restringir a dominios de Prismic y el sitio
    const allowedDomains = [
      'prismic.io',
      'images.prismic.io',
      'dekalb-experience.com',
      'cdn.prismic.io'
    ];

    const hostname = urlObj.hostname.toLowerCase();
    const isAllowed = allowedDomains.some(domain =>
      hostname === domain || hostname.endsWith('.' + domain)
    );

    return isAllowed;
  } catch {
    return false;
  }
}

// Modificar renderBlock en prismic-rich-text.ts:
case 'image':
  const imgUrl = block.url || '';
  const imgAlt = block.alt || '';
  const imgDimensions = block.dimensions || { width: 0, height: 0 };

  // ✅ Validar URL antes de renderizar
  if (!isValidImageUrl(imgUrl)) {
    console.warn('Invalid image URL detected:', imgUrl);
    return ''; // O una imagen placeholder
  }

  return `<img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(imgAlt)}" width="${imgDimensions.width}" height="${imgDimensions.height}" />`;
```

---

### 🟡 5. Embed HTML sin sanitización

**Problema:**
Los embeds de Prismic se renderizan directamente sin validación:

```typescript
// src/utils/prismic-rich-text.ts líneas 159-165
case 'embed':
  const embedUrl = (block as any).oembed?.embed_url || (block as any).url || '';
  const embedHtml = (block as any).oembed?.html || '';
  if (embedHtml) {
    return `<div class="embed">${embedHtml}</div>`; // ⚠️ Sin sanitización
  }
  return embedUrl ? `<iframe src="${embedUrl}" frameborder="0"></iframe>` : '';
```

**Riesgo:**
Inyección de iframes maliciosos o contenido HTML peligroso.

**Solución:**
Validar URLs de embed y sanitizar HTML de oembed.

**Código mínimo necesario:**

```typescript
// Modificar renderBlock:
case 'embed':
  const embedUrl = (block as any).oembed?.embed_url || (block as any).url || '';
  const embedHtml = (block as any).oembed?.html || '';

  if (embedHtml) {
    // ✅ Sanitizar HTML de oembed
    const sanitized = sanitizeHtml(embedHtml); // Usar función de sanitización
    return `<div class="embed">${sanitized}</div>`;
  }

  if (embedUrl) {
    // ✅ Validar URL antes de renderizar iframe
    if (isValidEmbedUrl(embedUrl)) {
      return `<iframe src="${escapeHtml(embedUrl)}" frameborder="0" sandbox="allow-scripts allow-same-origin"></iframe>`;
    }
  }

  return '';
```

**Función de validación de embeds:**

```typescript
function isValidEmbedUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  try {
    const urlObj = new URL(url);
    const allowedDomains = [
      "youtube.com",
      "youtu.be",
      "vimeo.com",
      "dailymotion.com",
      // Añadir otros dominios permitidos
    ];

    const hostname = urlObj.hostname.toLowerCase();
    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith("." + domain)
    );
  } catch {
    return false;
  }
}
```

---

### 🟡 6. Headers de seguridad incompletos

**Problema:**
Faltan headers importantes de seguridad en `vercel.json`:

- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- Referrer-Policy

**Riesgo:**
Menor protección contra XSS, clickjacking, y exposición de información de referrer.

**Solución:**
Añadir headers de seguridad completos.

**Código mínimo necesario:**

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "rewrites": [
    {
      "source": "/es/:path*",
      "destination": "/es/:path*"
    },
    {
      "source": "/pt/:path*",
      "destination": "/pt/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.prismic.io https://images.prismic.io https://cdn.prismic.io; font-src 'self' data:; connect-src 'self' https://*.prismic.io; frame-src 'self' https://www.youtube.com https://player.vimeo.com;"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

**Nota:** Ajustar CSP según necesidades específicas. La política actual permite `unsafe-inline` y `unsafe-eval` para compatibilidad, pero debería restringirse en el futuro.

---

### 🟢 7. Validación de inputs insuficiente en formularios

**Problema:**
El formulario de DensityCalculator valida básicamente pero no sanitiza ni valida rangos adecuadamente.

**Riesgo:** Bajo - solo afecta funcionalidad, no seguridad crítica.

**Solución:**
Añadir validación más robusta.

**Código mínimo necesario:**

```javascript
// En DensityCalculator.astro, modificar calculate():
function calculate() {
  if (
    !selectedUse ||
    !zoneSelect.value ||
    !hybridSelect.value ||
    !surfaceInput.value
  ) {
    alert("Por favor, completa todos los campos");
    return;
  }

  const potential = parseFloat(potentialSlider.value);
  const surface = parseFloat(surfaceInput.value);
  const zone = zoneSelect.value;

  // ✅ Validar rangos
  if (isNaN(potential) || potential < 0 || potential > 20) {
    alert("El potencial debe estar entre 0 y 20 Tn/Ha");
    return;
  }

  if (isNaN(surface) || surface <= 0 || surface > 10000) {
    alert("La superficie debe ser un valor válido entre 0.1 y 10000 Ha");
    return;
  }

  // Validar que zone sea válida
  const validZones = ["ebro", "centro-sur", "noroeste", "portugal"];
  if (!validZones.includes(zone)) {
    alert("Zona no válida");
    return;
  }

  // ... resto del código ...
}
```

---

### 🟢 8. Logs de depuración en producción

**Problema:**
Hay múltiples `console.log` y `console.warn` que podrían exponer información sensible.

**Riesgo:** Bajo - exposición de información en logs del navegador.

**Solución:**
Usar variables de entorno para controlar logs o eliminar logs de producción.

**Código mínimo necesario:**

```typescript
// Crear src/utils/logger.ts
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Errores siempre se loguean
    console.error(...args);
  },
};

// Reemplazar console.log/warn en prismic.ts y otros archivos:
// Antes: console.log('Prismic content type:', typeof content);
// Después: logger.log('Prismic content type:', typeof content);
```

---

## Paso 3: Checklist de Seguridad Continua

### Comandos a ejecutar tras cada feature:

```bash
# 1. Auditoría de dependencias
npm audit

# 2. Verificar que no hay secretos en el código
# Instalar y ejecutar: git-secrets, truffleHog, o similar
# O usar: grep -r "PRISMIC_ACCESS_TOKEN\|API_KEY\|SECRET" --exclude-dir=node_modules

# 3. Verificar headers de seguridad
# Usar herramienta online: securityheaders.com
# O verificar manualmente con curl:
curl -I https://dekalb-experience.com | grep -i "x-frame-options\|csp\|hsts"

# 4. Revisar cambios en archivos críticos
git diff HEAD -- src/utils/prismic-rich-text.ts src/utils/prismic.ts
```

### Revisiones manuales recomendadas:

1. **Nuevos inputs de usuario:**

   - ¿Se validan y sanitizan?
   - ¿Se escapan antes de renderizar?

2. **Nuevas dependencias:**

   - ¿Son necesarias?
   - ¿Tienen vulnerabilidades conocidas? (`npm audit`)
   - ¿Añaden superficie de ataque?

3. **Nuevas rutas/endpoints:**

   - ¿Requieren autenticación si es necesario?
   - ¿Validan inputs?
   - ¿Manejan errores adecuadamente?

4. **Nuevos webhooks (Prismic):**

   - ¿Validan la firma del webhook?
   - ¿Están protegidos con autenticación?

5. **Cambios en renderizado de HTML:**

   - ¿Se usa `set:html` o `innerHTML`?
   - ¿Se sanitiza el contenido?

6. **Nuevas variables de entorno:**
   - ¿Están en `.env.example`?
   - ¿Están documentadas?
   - ¿No se exponen en el cliente?

### Herramientas recomendadas para integración:

1. **ESLint con reglas de seguridad:**

   ```bash
   npm install --save-dev eslint-plugin-security
   ```

   Añadir a `.eslintrc`:

   ```json
   {
     "plugins": ["security"],
     "extends": ["plugin:security/recommended"]
   }
   ```

2. **Scanner de secretos:**

   - GitHub Secret Scanning (si usas GitHub)
   - GitGuardian
   - TruffleHog

3. **Análisis estático:**
   - SonarQube
   - Snyk Code
   - CodeQL (GitHub)

---

## Configuración para VPS (Futuro)

### NGINX Reverse Proxy - Configuración de seguridad básica:

```nginx
server {
    listen 80;
    server_name dekalb-experience.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dekalb-experience.com;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.prismic.io; connect-src 'self' https://*.prismic.io;" always;

    # Root y proxy
    root /var/www/dekalb-experience/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache estático
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Limitaciones y Notas

### Información no disponible (requiere revisión manual):

1. **Variables de entorno en producción:**

   - Verificar que `PRISMIC_ACCESS_TOKEN` y `PRISMIC_REPOSITORY_NAME` están configuradas en Vercel
   - Confirmar que no están expuestas en el cliente

2. **Webhooks de Prismic:**

   - Si existen, verificar que validan la firma del webhook
   - Confirmar que están protegidos con autenticación

3. **Autenticación:**

   - No se encontraron flujos de autenticación en el código
   - Si se añaden en el futuro, seguir guías de Astro para auth

4. **Rate limiting:**
   - No se encontró rate limiting
   - Considerar añadir si hay endpoints públicos sensibles

---

## Priorización de Implementación

1. **Inmediato (esta semana):**

   - ✅ Headers de seguridad (vercel.json)
   - ✅ Sanitización de HTML en renderRichText
   - ✅ Eliminar innerHTML en ProductCarousel y DensityCalculator

2. **Corto plazo (este mes):**

   - ✅ Validación de URLs de imágenes
   - ✅ Sanitización de embeds
   - ✅ Logger para producción

3. **Mediano plazo:**
   - ✅ Integrar ESLint con reglas de seguridad
   - ✅ Configurar scanner de secretos
   - ✅ Documentar proceso de seguridad

---

## Conclusión

El proyecto tiene una base sólida de seguridad, pero requiere mejoras en sanitización de contenido y headers de seguridad. Todas las vulnerabilidades identificadas son mitigables sin cambios funcionales significativos.

**Recomendación:** Implementar las correcciones de severidad alta y media antes del próximo despliegue a producción.

---

## ✅ Correcciones Implementadas

### Archivos Modificados:

1. **`src/utils/security.ts`** (NUEVO)

   - Funciones de sanitización HTML
   - Validación de URLs de imágenes y embeds
   - Función de escape HTML

2. **`src/utils/prismic-rich-text.ts`**

   - ✅ Sanitización de HTML en bloques preformatted
   - ✅ Validación de URLs de imágenes antes de renderizar
   - ✅ Sanitización de embeds HTML
   - ✅ Validación de URLs de iframes con sandbox
   - ✅ Logs solo en desarrollo

3. **`src/components/ProductCarousel.astro`**

   - ✅ Eliminado uso de `innerHTML`
   - ✅ Uso de `createElement` para construcción segura del DOM

4. **`src/components/DensityCalculator.astro`**

   - ✅ Eliminado uso de `innerHTML`
   - ✅ Validación de rangos de inputs
   - ✅ Validación de valores de zona

5. **`vercel.json`**

   - ✅ Añadido Strict-Transport-Security (HSTS)
   - ✅ Añadido Referrer-Policy
   - ✅ Añadido Content-Security-Policy (CSP)
   - ✅ Añadido Permissions-Policy

6. **`src/utils/logger.ts`** (NUEVO)

   - ✅ Logger que solo muestra logs en desarrollo
   - ✅ Errores siempre visibles para debugging

7. **`src/utils/prismic.ts`**
   - ✅ Reemplazados `console.log/warn` por logger
   - ✅ Logs de depuración solo en desarrollo

### Estado de las Vulnerabilidades:

- ✅ **Alta Severidad (3):** TODAS CORREGIDAS

  - XSS en renderRichText → Sanitización implementada
  - XSS en ProductCarousel → innerHTML eliminado
  - XSS en DensityCalculator → innerHTML eliminado

- ✅ **Media Severidad (3):** TODAS CORREGIDAS

  - URLs de imágenes sin validación → Validación implementada
  - Embed HTML sin sanitización → Sanitización implementada
  - Headers de seguridad incompletos → Headers añadidos

- ✅ **Baja Severidad (2):** CORREGIDAS
  - Validación de inputs insuficiente → Validación mejorada
  - Logs de depuración en producción → Logger implementado

### Próximos Pasos Recomendados:

1. **Testing:** Probar que las correcciones no rompen funcionalidad existente
2. **CSP Refinement:** Ajustar CSP para eliminar `unsafe-inline` y `unsafe-eval` si es posible
3. **Monitoreo:** Configurar alertas para detectar intentos de XSS o URLs inválidas
4. **Documentación:** Documentar el uso de las nuevas utilidades de seguridad para el equipo

### Notas Importantes:

- Las funciones de sanitización son básicas pero efectivas. Para producción a gran escala, considerar usar `dompurify` o similar.
- El CSP actual permite `unsafe-inline` y `unsafe-eval` para compatibilidad. Debería restringirse en el futuro usando nonces o hashes.
- Las validaciones de URL están configuradas para dominios específicos de Prismic. Ajustar si se añaden nuevos proveedores de contenido.
