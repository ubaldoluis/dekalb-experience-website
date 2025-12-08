/**
 * Internationalization utilities
 */

import type { Idioma } from '../types';

export const defaultLocale: Idioma = 'es';
export const locales: Idioma[] = ['es', 'pt'];

/**
 * Get locale from pathname
 */
export function getLocaleFromPath(pathname: string): Idioma {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (locales.includes(firstSegment as Idioma)) {
    return firstSegment as Idioma;
  }
  
  return defaultLocale;
}

/**
 * Get path with locale prefix
 */
export function getLocalizedPath(path: string, locale: Idioma): string {
  if (locale === defaultLocale) {
    return path === '/' ? '/' : `/${locale}${path}`;
  }
  return `/${locale}${path}`;
}

/**
 * Remove locale from path
 */
export function removeLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  if (locales.includes(segments[0] as Idioma)) {
    return '/' + segments.slice(1).join('/');
  }
  return path;
}

