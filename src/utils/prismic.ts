/**
 * Prismic client configuration
 */

import * as prismic from '@prismicio/client';
import type { Producto, Articulo, CatalogoPDF, HomeContent, FieldViewContent } from '../types';

const repositoryName = import.meta.env.PRISMIC_REPOSITORY_NAME || '';
const accessToken = import.meta.env.PRISMIC_ACCESS_TOKEN || '';

if (!repositoryName) {
  console.warn('PRISMIC_REPOSITORY_NAME is not set');
}

// Create client only if repository name is available
export const client = repositoryName 
  ? prismic.createClient(repositoryName, {
      accessToken: accessToken || undefined,
    })
  : null as any;

/**
 * Fetch all products from Prismic
 */
export async function getAllProducts(locale: string = 'es'): Promise<Producto[]> {
  try {
    if (!client) {
      console.warn('Prismic client not initialized');
      return [];
    }
    // Convert locale code: 'es' -> 'es-es', 'pt' -> 'pt-pt'
    const prismicLocale = locale === 'pt' ? 'pt-pt' : 'es-es';
    const documents = await client.getAllByType('producto', {
      lang: prismicLocale,
      orderings: {
        field: 'my.producto.orden',
        direction: 'asc',
      },
    });

    return documents.map((doc) => ({
      id: doc.id,
      nombre: doc.data.nombre || '',
      codigo: doc.data.codigo || '',
      imagen_saco: doc.data.imagen_saco
        ? {
            url: doc.data.imagen_saco.url || '',
            alt: doc.data.imagen_saco.alt || '',
          }
        : undefined,
      claim: doc.data.claim || undefined,
      tipo_semilla: (typeof doc.data.tipo_semilla === 'string' ? doc.data.tipo_semilla.toLowerCase() : doc.data.tipo_semilla) as 'maiz' | 'colza' || 'maiz',
      uso: typeof doc.data.uso === 'string' ? doc.data.uso.toLowerCase() as 'grano' | 'silo' | 'preceon' : doc.data.uso as 'grano' | 'silo' | 'preceon' | undefined,
      zona: typeof doc.data.zona === 'string' ? doc.data.zona.toLowerCase() : doc.data.zona as any,
      categoria: (doc.data.categoria as any) || 'maiz-grano',
      proteccion: (typeof doc.data.proteccion === 'string' ? doc.data.proteccion.toLowerCase() : doc.data.proteccion) as 'herbicida' | 'insecticida' | 'bioestimulante' | 'todos' || 'todos',
      beneficios: doc.data.beneficios 
        ? (Array.isArray(doc.data.beneficios) 
            ? doc.data.beneficios.map((b: any) => {
                if (typeof b === 'string') return b;
                if (b.text) return b.text;
                if (b.type === 'paragraph' && b.text) return b.text;
                return '';
              }).filter(Boolean)
            : [])
        : [],
      recomendaciones_uso: doc.data.recomendaciones_uso 
        ? (typeof doc.data.recomendaciones_uso === 'string' 
            ? doc.data.recomendaciones_uso 
            : prismic.asText(doc.data.recomendaciones_uso) || '')
        : undefined,
      orden: doc.data.orden || undefined,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch product by ID
 */
export async function getProductById(id: string, locale: string = 'es'): Promise<Producto | null> {
  try {
    if (!client) {
      console.warn('Prismic client not initialized');
      return null;
    }
    const prismicLocale = locale === 'pt' ? 'pt-pt' : 'es-es';
    const doc = await client.getByID(id, { lang: prismicLocale });
    
    return {
      id: doc.id,
      nombre: doc.data.nombre || '',
      codigo: doc.data.codigo || '',
      imagen_saco: doc.data.imagen_saco
        ? {
            url: doc.data.imagen_saco.url || '',
            alt: doc.data.imagen_saco.alt || '',
          }
        : undefined,
      claim: doc.data.claim || undefined,
      tipo_semilla: (typeof doc.data.tipo_semilla === 'string' ? doc.data.tipo_semilla.toLowerCase() : doc.data.tipo_semilla) as 'maiz' | 'colza' || 'maiz',
      uso: typeof doc.data.uso === 'string' ? doc.data.uso.toLowerCase() as 'grano' | 'silo' | 'preceon' : doc.data.uso as 'grano' | 'silo' | 'preceon' | undefined,
      zona: typeof doc.data.zona === 'string' ? doc.data.zona.toLowerCase() : doc.data.zona as any,
      categoria: (doc.data.categoria as any) || 'maiz-grano',
      proteccion: (typeof doc.data.proteccion === 'string' ? doc.data.proteccion.toLowerCase() : doc.data.proteccion) as 'herbicida' | 'insecticida' | 'bioestimulante' | 'todos' || 'todos',
      beneficios: doc.data.beneficios 
        ? (Array.isArray(doc.data.beneficios) 
            ? doc.data.beneficios.map((b: any) => {
                if (typeof b === 'string') return b;
                if (b.text) return b.text;
                if (b.type === 'paragraph' && b.text) return b.text;
                return '';
              }).filter(Boolean)
            : [])
        : [],
      recomendaciones_uso: doc.data.recomendaciones_uso 
        ? (typeof doc.data.recomendaciones_uso === 'string' 
            ? doc.data.recomendaciones_uso 
            : prismic.asText(doc.data.recomendaciones_uso) || '')
        : undefined,
      orden: doc.data.orden || undefined,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Fetch all articles from Prismic
 */
export async function getAllArticles(locale: string = 'es'): Promise<Articulo[]> {
  try {
    if (!client) {
      console.warn('Prismic client not initialized');
      return [];
    }
    const prismicLocale = locale === 'pt' ? 'pt-pt' : 'es-es';
    const documents = await client.getAllByType('articulo', {
      lang: prismicLocale,
      filters: [prismic.filter.at('my.articulo.publicado', true)],
      orderings: {
        field: 'document.first_publication_date',
        direction: 'desc',
      },
    });

    return documents.map((doc) => ({
      id: doc.id,
      titulo: doc.data.titulo || '',
      slug: doc.uid || '',
      categoria: (doc.data.categoria as any) || 'articulo',
      fecha: (doc.data.fecha as string) || doc.first_publication_date || '',
      extracto: doc.data.extracto || '',
      imagen_destacada: doc.data.imagen_destacada
        ? {
            url: doc.data.imagen_destacada.url || '',
            alt: doc.data.imagen_destacada.alt || '',
          }
        : undefined,
      contenido: doc.data.contenido,
      autor: doc.data.autor || undefined,
      tags: doc.tags || [],
      publicado: doc.data.publicado || false,
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * Fetch article by slug
 */
export async function getArticleBySlug(slug: string, locale: string = 'es'): Promise<Articulo | null> {
  try {
    if (!client) {
      console.warn('Prismic client not initialized');
      return null;
    }
    const prismicLocale = locale === 'pt' ? 'pt-pt' : 'es-es';
    const doc = await client.getByUID('articulo', slug, { lang: prismicLocale });
    
    return {
      id: doc.id,
      titulo: doc.data.titulo || '',
      slug: doc.uid || '',
      categoria: (doc.data.categoria as any) || 'articulo',
      fecha: (doc.data.fecha as string) || doc.first_publication_date || '',
      extracto: doc.data.extracto || '',
      imagen_destacada: doc.data.imagen_destacada
        ? {
            url: doc.data.imagen_destacada.url || '',
            alt: doc.data.imagen_destacada.alt || '',
          }
        : undefined,
      contenido: doc.data.contenido,
      autor: doc.data.autor || undefined,
      tags: doc.tags || [],
      publicado: doc.data.publicado || false,
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

/**
 * Fetch home content from Prismic
 */
export async function getHomeContent(locale: string = 'es'): Promise<HomeContent | null> {
  try {
    if (!client) {
      console.warn('Prismic client not initialized');
      return null;
    }
    const prismicLocale = locale === 'pt' ? 'pt-pt' : 'es-es';
    const doc = await client.getSingle('home', { lang: prismicLocale });
    
    return {
      hero: {
        title: doc.data.hero_title || 'DEKALB EXPERIENCE',
        claim: doc.data.hero_claim || 'Siempre a tu lado',
      },
      solutions: {
        integralMaiz: doc.data.solutions_integral_maiz || 'Soluciones Integrales para Maíz',
        fieldview: doc.data.solutions_fieldview || 'FieldView',
        protection: doc.data.solutions_protection || 'Protección de Cultivo',
        preceon: doc.data.solutions_preceon || 'Smart Corn System PRECEON',
        avoidProblems: doc.data.solutions_avoid_problems || 'Evita problemas con tu maíz',
      },
    };
  } catch (error) {
    console.error('Error fetching home content:', error);
    return null;
  }
}

/**
 * Fetch FieldView content from Prismic
 */
export async function getFieldViewContent(locale: string = 'es'): Promise<FieldViewContent | null> {
  try {
    if (!client) {
      console.warn('Prismic client not initialized');
      return null;
    }
    const prismicLocale = locale === 'pt' ? 'pt-pt' : 'es-es';
    const doc = await client.getSingle('fieldview', { lang: prismicLocale });
    
    // Mapear tabs de Yield Kit
    const yieldKitTabs = doc.data.yield_kit_tabs?.map((tab: any, index: number) => {
      const tabIds: Array<'que-es' | 'compatibilidad' | 'ventajas' | 'conectividad'> = 
        ['que-es', 'compatibilidad', 'ventajas', 'conectividad'];
      return {
        id: tabIds[index] || 'que-es',
        label: tab.label || '',
        content: tab.content || [],
      };
    }) || [];

    return {
      hero: {
        titulo: doc.data.hero_titulo || 'Siembra datos y cosecha decisiones',
        descripcion: doc.data.hero_descripcion || [],
      },
      introduccion: {
        titulo: doc.data.introduccion_titulo || '',
        texto: doc.data.introduccion_texto || [],
      },
      subsections: [
        {
          id: 'drive',
          titulo: doc.data.drive_titulo || 'FieldView Drive',
          descripcion: doc.data.drive_descripcion || [],
          imagen: doc.data.drive_imagen
            ? {
                url: doc.data.drive_imagen.url || '',
                alt: doc.data.drive_imagen.alt || '',
              }
            : undefined,
        },
        {
          id: 'yield-kit',
          titulo: doc.data.yield_kit_titulo || 'FieldView Yield Kit',
          descripcion: doc.data.yield_kit_descripcion || [],
          imagen: doc.data.yield_kit_imagen
            ? {
                url: doc.data.yield_kit_imagen.url || '',
                alt: doc.data.yield_kit_imagen.alt || '',
              }
            : undefined,
          yieldKitTabs: yieldKitTabs,
        },
        {
          id: 'spraykit',
          titulo: doc.data.spraykit_titulo || 'FieldView SprayKit',
          descripcion: doc.data.spraykit_descripcion || [],
          imagen: doc.data.spraykit_imagen
            ? {
                url: doc.data.spraykit_imagen.url || '',
                alt: doc.data.spraykit_imagen.alt || '',
              }
            : undefined,
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching FieldView content:', error);
    return null;
  }
}

/**
 * Fetch all catalogs from Prismic
 */
export async function getAllCatalogs(locale: string = 'es'): Promise<CatalogoPDF[]> {
  try {
    if (!client) {
      console.warn('Prismic client not initialized');
      return [];
    }
    const prismicLocale = locale === 'pt' ? 'pt-pt' : 'es-es';
    const documents = await client.getAllByType('catalogo_pdf', {
      lang: prismicLocale,
      orderings: {
        field: 'my.catalogo_pdf.orden',
        direction: 'asc',
      },
    });

    return documents.map((doc) => ({
      id: doc.id,
      nombre: doc.data.nombre || '',
      tipo: (doc.data.tipo as 'maiz' | 'colza') || 'maiz',
      subcategoria: (doc.data.subcategoria as any) || 'otros',
      pais: (doc.data.pais as 'espana' | 'portugal') || 'espana',
      zona: doc.data.zona as any,
      url_pdf: prismic.asLink(doc.data.url_pdf) || '',
      orden: doc.data.orden || undefined,
    }));
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    return [];
  }
}

