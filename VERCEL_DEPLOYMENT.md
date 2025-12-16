# Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar el proyecto Dekalb Experience Website en Vercel.

## Prerrequisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio en GitHub (ya configurado)
3. Acceso a las credenciales de Prismic

## Pasos para Desplegar

### 1. Conectar el Repositorio

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio de GitHub: `ubaldoluis/dekalb-experience-website`
4. Vercel detectará automáticamente que es un proyecto Astro

### 2. Configurar el Proyecto

Vercel debería detectar automáticamente:
- **Framework Preset**: Astro
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Si no se detecta automáticamente, configura manualmente:
- Framework: **Astro**
- Root Directory: `.` (raíz del proyecto)

### 3. Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega:

```
PRISMIC_REPOSITORY_NAME=tu-repositorio-prismic
PRISMIC_ACCESS_TOKEN=tu-access-token-prismic
```

**Importante:**
- Asegúrate de agregar estas variables tanto para **Production** como para **Preview**
- El Access Token debe tener permisos de lectura

### 4. Configurar Dominio (Opcional)

Si tienes un dominio personalizado:
1. Ve a **Settings** → **Domains**
2. Agrega tu dominio
3. Sigue las instrucciones para configurar los DNS

### 5. Desplegar

1. Haz clic en **"Deploy"**
2. Vercel construirá y desplegará tu proyecto automáticamente
3. Una vez completado, recibirás una URL: `https://tu-proyecto.vercel.app`

## Configuración Automática

El archivo `vercel.json` ya está configurado con:
- Comando de build correcto
- Directorio de salida (`dist`)
- Rewrites para rutas i18n (`/es/*` y `/pt/*`)
- Headers de seguridad

## Previews Automáticos

Vercel creará automáticamente:
- **Preview URLs** para cada Pull Request
- **Deployments** para cada push a `main`

## Integración con Prismic Previews

Para habilitar los previews de Prismic:

1. En Prismic, ve a **Settings** → **Previews**
2. Agrega una nueva preview:
   - **Name**: Vercel Preview
   - **Domain**: `https://tu-proyecto.vercel.app`
   - **Link Resolver**: `/api/preview` (si lo implementas)

## Comandos Útiles

### Ver logs de deployment
```bash
vercel logs
```

### Desplegar manualmente desde CLI
```bash
npm i -g vercel
vercel
```

### Verificar configuración
```bash
vercel inspect
```

## Troubleshooting

### Error: "Build failed"
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de build en Vercel Dashboard
- Asegúrate de que `npm run build` funcione localmente

### Error: "Prismic client not initialized"
- Verifica que `PRISMIC_REPOSITORY_NAME` y `PRISMIC_ACCESS_TOKEN` estén configuradas
- Asegúrate de que el Access Token tenga permisos de lectura

### Rutas no funcionan
- Verifica que `vercel.json` esté en el repositorio
- Revisa la configuración de rewrites en Vercel Dashboard

## URLs del Proyecto

Una vez desplegado, tendrás:
- **Production**: `https://tu-proyecto.vercel.app`
- **Preview**: `https://tu-proyecto-git-branch.vercel.app` (por cada PR/branch)

## Próximos Pasos

1. Configurar dominio personalizado (si aplica)
2. Habilitar Prismic Previews
3. Configurar webhooks de Prismic para rebuilds automáticos (opcional)

