/**
 * TypeScript types for DEKALB Experience Website
 */

export type Idioma = 'es' | 'pt';

export type TipoSemilla = 'maiz' | 'colza';

export type UsoMaiz = 'grano' | 'silo' | 'preceon';

export type ZonaGeografica = 
  | 'ebro' 
  | 'centro-sur' 
  | 'noroeste' 
  | 'portugal'
  | 'centro-sur-extremadura-andalucia';

export type ProteccionCultivo = 
  | 'herbicida' 
  | 'insecticida' 
  | 'bioestimulante' 
  | 'todos';

export type CategoriaProducto = 
  | 'maiz-grano' 
  | 'silo' 
  | 'preceon' 
  | 'colza' 
  | 'fitosanitario';

export interface FilterState {
  tipoSemilla?: TipoSemilla;
  uso?: UsoMaiz;
  zona?: ZonaGeografica;
  proteccion: ProteccionCultivo;
}

export interface Producto {
  id: string;
  nombre: string;
  codigo: string;
  imagen_saco?: {
    url: string;
    alt?: string;
  };
  claim?: string;
  tipo_semilla: TipoSemilla;
  uso?: UsoMaiz;
  zona?: ZonaGeografica;
  categoria: CategoriaProducto;
  proteccion: ProteccionCultivo;
  beneficios?: string[];
  recomendaciones_uso?: string;
  orden?: number;
}

export interface Articulo {
  id: string;
  titulo: string;
  slug: string;
  categoria: 'noticia' | 'evento' | 'articulo' | 'lanzamiento';
  fecha: string;
  extracto: string;
  imagen_destacada?: {
    url: string;
    alt?: string;
  };
  contenido?: any; // Rich text from Prismic
  autor?: string;
  tags?: string[];
  publicado: boolean;
}

export interface CatalogoPDF {
  id: string;
  nombre: string;
  tipo: 'maiz' | 'colza';
  subcategoria: 'genetica-agronomia' | 'proteccion-cultivo' | 'otros';
  pais: 'espana' | 'portugal';
  zona?: ZonaGeografica;
  url_pdf: string;
  orden?: number;
}

export interface HomeContent {
  hero: {
    title: string;
    claim: string;
  };
  solutions: {
    integralMaiz: string;
    fieldview: string;
    protection: string;
    preceon: string;
    avoidProblems: string;
  };
}

