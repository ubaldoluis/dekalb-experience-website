# DEKALB Experience Website

Sitio web B2B para DEKALB Experience, empresa agrícola que comercializa semillas de maíz y colza, junto con soluciones digitales.

## Stack Tecnológico

- **Frontend**: Astro
- **CMS**: Prismic
- **Idiomas**: Español (ES) y Portugués (PT)

## Configuración

1. Instalar dependencias:

```bash
pnpm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus credenciales de Prismic
```

3. Ejecutar servidor de desarrollo:

```bash
pnpm run dev
```

4. Construir para producción:

```bash
pnpm run build
```

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── layouts/       # Layouts de página
├── pages/         # Páginas y rutas
├── styles/        # Estilos globales y tokens
├── utils/         # Utilidades y helpers
├── types/         # Tipos TypeScript
└── i18n/          # Archivos de traducción
```

## Desarrollo

El proyecto sigue una arquitectura mobile-first y está optimizado para performance y accesibilidad.

### Características Principales

- Filtro condicional de productos (Maíz/Colza)
- Carrusel de productos interactivo
- Modal de detalles de productos
- Blog con rutas dinámicas
- Calculador de densidades
- Descarga de catálogos PDF
- Internacionalización ES/PT

## Licencia

Propietario - DEKALB/Bayer
