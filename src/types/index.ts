/**
 * TypeScript types for DEKALB Experience Website
 */

export type Idioma = "es" | "pt";

export type TipoSemilla = "maiz" | "colza";

export type UsoMaiz = "grano" | "silo" | "preceon";

export type ZonaGeografica =
  | "ebro"
  | "centro-sur"
  | "noroeste"
  | "portugal"
  | "centro-sur-extremadura-andalucia";

export type ProteccionCultivo =
  | "herbicida"
  | "insecticida"
  | "bioestimulante"
  | "todos";

export type CategoriaProducto =
  | "maiz-grano"
  | "silo"
  | "preceon"
  | "colza"
  | "fitosanitario";

export type ClaveCaracteristica =
  | "potencial_produccion"
  | "adaptabilidad"
  | "resistencia_caida"
  | "tolerancia_virus"
  | "stay_green"
  | "respuesta_alta_densidad"
  | "calidad_grano"
  | "contenido_aceite"
  | "tolerancia_dehiscencia"
  | "sanidad"
  | "tolerancia_sequia"
  | "implantacion";

export interface CaracteristicaProducto {
  clave: ClaveCaracteristica;
  valor: number;
  label_custom?: string;
}

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
  zona?: ZonaGeografica | ZonaGeografica[];
  categoria: CategoriaProducto;
  proteccion: ProteccionCultivo;
  beneficios?: string[];
  recomendaciones_uso?: string;
  ciclo_rm?: string;
  descripcion_popup?: string;
  tipo_grano?: string;
  altura_planta_texto?: string;
  floracion_texto?: string;
  madurez_texto?: string;
  insercion_mazorca?: string;
  caracteristicas?: CaracteristicaProducto[];
  orden?: number;
  guia_pdf?: {
    url: string;
  };
}

export interface Articulo {
  id: string;
  titulo: string;
  slug: string;
  categoria: "noticia" | "evento" | "articulo" | "lanzamiento";
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
  imagen?: {
    url: string;
    alt?: string;
  };
  tipo: "maiz" | "colza";
  subcategoria: "genetica-agronomia" | "proteccion-cultivo" | "otros";
  pais: "espana" | "portugal";
  zona?: ZonaGeografica;
  url_pdf: string;
  orden?: number;
}

export interface InformaPDF {
  id: string;
  nombre: string;
  imagen?: {
    url: string;
    alt?: string;
  };
  tipo: "maiz" | "colza";
  subcategoria: string;
  pais: "espana" | "portugal";
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

export interface YieldKitTab {
  id: "que-es" | "compatibilidad" | "ventajas" | "conectividad";
  label: string; // Text simple
  content: any; // Rich text from Prismic
}

export interface FieldViewSubsection {
  id: "drive" | "yield-kit" | "spraykit";
  titulo: string; // Text simple
  descripcion: any; // Rich text from Prismic
  imagen?: {
    url: string;
    alt?: string;
  };
  yieldKitTabs?: YieldKitTab[]; // Solo para Yield Kit
}

export interface FieldViewContent {
  hero: {
    titulo: string; // Text simple
    descripcion: any; // Rich text from Prismic
    imagen_fondo?: {
      url: string;
      alt?: string;
    };
    imagen_fondo_mobile?: {
      url: string;
      alt?: string;
    };
  };
  introduccion: {
    titulo: string; // Text simple
    texto: any; // Rich text from Prismic
  };
  subsections: FieldViewSubsection[];
}

export interface Solucion {
  logo?: {
    url: string;
    alt?: string;
  };
  texto_introductorio: any; // Rich text from Prismic
  tabla: any; // Rich text from Prismic
}

export interface ProteccionCultivoContent {
  hero: {
    titulo: string; // Text simple
    descripcion: any; // Rich text from Prismic
    imagen_fondo?: {
      url: string;
      alt?: string;
    };
    imagen_fondo_mobile?: {
      url: string;
      alt?: string;
    };
  };
  soluciones: Solucion[];
  tabla_tratamientos: any; // Rich text from Prismic
  seccion_imagen_texto: {
    imagen?: {
      url: string;
      alt?: string;
    };
    texto: any; // Rich text from Prismic
  };
}

export interface AcceleronBloque {
  imagen?: {
    url: string;
    alt?: string;
  };
  titulo: string; // Text simple
  descripcion: any; // Rich text from Prismic
}

export interface AcceleronContent {
  hero: {
    logo?: {
      url: string;
      alt?: string;
    };
    titulo: string; // Text simple
    descripcion: any; // Rich text from Prismic
    imagen_fondo?: {
      url: string;
      alt?: string;
    };
    imagen_fondo_mobile?: {
      url: string;
      alt?: string;
    };
  };
  introduccion: {
    titulo: string; // Text simple
    texto: any; // Rich text from Prismic
  };
  bloques: AcceleronBloque[];
  bloque_final: {
    imagen_desktop?: {
      url: string;
      alt?: string;
    };
    imagen_mobile?: {
      url: string;
      alt?: string;
    };
    texto: any; // Rich text from Prismic
  };
}

export interface FieldShieldCardPlus {
  titulo: string;
  descripcion: any; // Rich text from Prismic
}

export interface FieldShieldCardGris {
  imagen?: {
    url: string;
    alt?: string;
  };
  texto: any; // Rich text from Prismic
}

export interface FieldShieldCardFinal {
  imagen?: {
    url: string;
    alt?: string;
  };
  texto: any; // Rich text from Prismic
  tabs?: Array<{
    label: string;
  }>;
}

export interface FieldShieldContent {
  hero: {
    logo?: {
      url: string;
      alt?: string;
    };
    titulo: string;
    descripcion: any;
    imagen_fondo?: {
      url: string;
      alt?: string;
    };
    imagen_fondo_mobile?: {
      url: string;
      alt?: string;
    };
  };
  titulo_intro: string;
  texto_intro: any;
  modulos: AcceleronBloque[];
  soluciones_fieldshield: {
    titulo: string;
    texto: any;
  };
  cards_textos_plus: FieldShieldCardPlus[];
  cards_gris: FieldShieldCardGris[];
  seleccion_hibridos: {
    titulo: string;
    texto: any;
  };
  bloque_degradado: {
    imagen?: {
      url: string;
      alt?: string;
    };
  };
  cards_finales: FieldShieldCardFinal[];
}

export interface SiloextraBloque {
  imagen?: {
    url: string;
    alt?: string;
  };
  titulo: string;
  descripcion: any;
}

export interface SiloextraContent {
  hero: {
    titulo: string;
    descripcion: any;
    imagen_fondo?: {
      url: string;
      alt?: string;
    };
    imagen_fondo_mobile?: {
      url: string;
      alt?: string;
    };
  };
  introduccion: {
    titulo: string;
    texto: any;
  };
  bloques: SiloextraBloque[];
}

export interface PreceonElementoGrid {
  imagen?: {
    url: string;
    alt?: string;
  };
  texto: any;
}

export interface PreceonElementoDestacado {
  titulo: string;
  texto: any;
}

export interface PreceonImagenDegradado {
  imagen?: {
    url: string;
    alt?: string;
  };
  texto: any;
}

export interface PreceonBloqueFinal {
  imagen?: {
    url: string;
    alt?: string;
  };
  titulo: string;
  descripcion: any;
}

export interface PreceonContent {
  hero: {
    logo?: {
      url: string;
      alt?: string;
    };
    titulo: string;
    descripcion: any;
    imagen_fondo?: {
      url: string;
      alt?: string;
    };
    imagen_fondo_mobile?: {
      url: string;
      alt?: string;
    };
  };
  titulo_intro: string;
  texto_intro: any;
  elementos_grid: PreceonElementoGrid[];
  produccion: {
    titulo: string;
    texto: any;
  };
  elementos_destacados: PreceonElementoDestacado[];
  imagenes_degradado: PreceonImagenDegradado[];
  bloque_final: PreceonBloqueFinal;
}
