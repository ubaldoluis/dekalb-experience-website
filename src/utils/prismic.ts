/**
 * Prismic client configuration
 */

import * as prismic from '@prismicio/client';
import type { Producto, Articulo, CatalogoPDF } from '../types';

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
      tipo_semilla: (doc.data.tipo_semilla as 'maiz' | 'colza') || 'maiz',
      uso: doc.data.uso as 'grano' | 'silo' | 'preceon' | undefined,
      zona: doc.data.zona as any,
      categoria: (doc.data.categoria as any) || 'maiz-grano',
      proteccion: (doc.data.proteccion as any) || 'todos',
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
      tipo_semilla: (doc.data.tipo_semilla as 'maiz' | 'colza') || 'maiz',
      uso: doc.data.uso as 'grano' | 'silo' | 'preceon' | undefined,
      zona: doc.data.zona as any,
      categoria: (doc.data.categoria as any) || 'maiz-grano',
      proteccion: (doc.data.proteccion as any) || 'todos',
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
      fecha: doc.first_publication_date || '',
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
      fecha: doc.first_publication_date || '',
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

