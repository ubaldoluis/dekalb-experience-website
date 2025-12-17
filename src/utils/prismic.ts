/**
 * Prismic client configuration
 */

import * as prismic from "@prismicio/client";
import type {
  Producto,
  Articulo,
  CatalogoPDF,
  HomeContent,
  FieldViewContent,
  ProteccionCultivoContent,
  AcceleronContent,
} from "../types";

import { logger } from "./logger";

const repositoryName = import.meta.env.PRISMIC_REPOSITORY_NAME || "";
const accessToken = import.meta.env.PRISMIC_ACCESS_TOKEN || "";

if (!repositoryName) {
  logger.warn("PRISMIC_REPOSITORY_NAME is not set");
}

// Create client only if repository name is available
export const client = repositoryName
  ? prismic.createClient(repositoryName, {
      accessToken: accessToken || undefined,
    })
  : (null as any);

/**
 * Fetch all products from Prismic
 */
export async function getAllProducts(
  locale: string = "es"
): Promise<Producto[]> {
  try {
    if (!client) {
      logger.warn("Prismic client not initialized");
      return [];
    }
    // Convert locale code: 'es' -> 'es-es', 'pt' -> 'pt-pt'
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const documents = await client.getAllByType("producto", {
      lang: prismicLocale,
      orderings: {
        field: "my.producto.orden",
        direction: "asc",
      },
    });

    return documents.map((doc) => ({
      id: doc.id,
      nombre: doc.data.nombre || "",
      codigo: doc.data.codigo || "",
      imagen_saco: doc.data.imagen_saco
        ? {
            url: doc.data.imagen_saco.url || "",
            alt: doc.data.imagen_saco.alt || "",
          }
        : undefined,
      claim: doc.data.claim || undefined,
      tipo_semilla:
        ((typeof doc.data.tipo_semilla === "string"
          ? doc.data.tipo_semilla.toLowerCase()
          : doc.data.tipo_semilla) as "maiz" | "colza") || "maiz",
      uso:
        typeof doc.data.uso === "string"
          ? (doc.data.uso.toLowerCase() as "grano" | "silo" | "preceon")
          : (doc.data.uso as "grano" | "silo" | "preceon" | undefined),
      zona:
        typeof doc.data.zona === "string"
          ? doc.data.zona.toLowerCase()
          : (doc.data.zona as any),
      categoria: (doc.data.categoria as any) || "maiz-grano",
      proteccion:
        ((typeof doc.data.proteccion === "string"
          ? doc.data.proteccion.toLowerCase()
          : doc.data.proteccion) as
          | "herbicida"
          | "insecticida"
          | "bioestimulante"
          | "todos") || "todos",
      beneficios: doc.data.beneficios
        ? Array.isArray(doc.data.beneficios)
          ? doc.data.beneficios
              .map((b: any) => {
                if (typeof b === "string") return b;
                if (b.text) return b.text;
                if (b.type === "paragraph" && b.text) return b.text;
                return "";
              })
              .filter(Boolean)
          : []
        : [],
      recomendaciones_uso: doc.data.recomendaciones_uso
        ? typeof doc.data.recomendaciones_uso === "string"
          ? doc.data.recomendaciones_uso
          : prismic.asText(doc.data.recomendaciones_uso) || ""
        : undefined,
      orden: doc.data.orden || undefined,
    }));
  } catch (error) {
    logger.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetch product by ID
 */
export async function getProductById(
  id: string,
  locale: string = "es"
): Promise<Producto | null> {
  try {
    if (!client) {
      console.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getByID(id, { lang: prismicLocale });

    return {
      id: doc.id,
      nombre: doc.data.nombre || "",
      codigo: doc.data.codigo || "",
      imagen_saco: doc.data.imagen_saco
        ? {
            url: doc.data.imagen_saco.url || "",
            alt: doc.data.imagen_saco.alt || "",
          }
        : undefined,
      claim: doc.data.claim || undefined,
      tipo_semilla:
        ((typeof doc.data.tipo_semilla === "string"
          ? doc.data.tipo_semilla.toLowerCase()
          : doc.data.tipo_semilla) as "maiz" | "colza") || "maiz",
      uso:
        typeof doc.data.uso === "string"
          ? (doc.data.uso.toLowerCase() as "grano" | "silo" | "preceon")
          : (doc.data.uso as "grano" | "silo" | "preceon" | undefined),
      zona:
        typeof doc.data.zona === "string"
          ? doc.data.zona.toLowerCase()
          : (doc.data.zona as any),
      categoria: (doc.data.categoria as any) || "maiz-grano",
      proteccion:
        ((typeof doc.data.proteccion === "string"
          ? doc.data.proteccion.toLowerCase()
          : doc.data.proteccion) as
          | "herbicida"
          | "insecticida"
          | "bioestimulante"
          | "todos") || "todos",
      beneficios: doc.data.beneficios
        ? Array.isArray(doc.data.beneficios)
          ? doc.data.beneficios
              .map((b: any) => {
                if (typeof b === "string") return b;
                if (b.text) return b.text;
                if (b.type === "paragraph" && b.text) return b.text;
                return "";
              })
              .filter(Boolean)
          : []
        : [],
      recomendaciones_uso: doc.data.recomendaciones_uso
        ? typeof doc.data.recomendaciones_uso === "string"
          ? doc.data.recomendaciones_uso
          : prismic.asText(doc.data.recomendaciones_uso) || ""
        : undefined,
      orden: doc.data.orden || undefined,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Fetch all articles from Prismic
 */
export async function getAllArticles(
  locale: string = "es"
): Promise<Articulo[]> {
  try {
    if (!client) {
      logger.warn("Prismic client not initialized");
      return [];
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const documents = await client.getAllByType("articulo", {
      lang: prismicLocale,
      filters: [prismic.filter.at("my.articulo.publicado", true)],
      orderings: {
        field: "document.first_publication_date",
        direction: "desc",
      },
    });

    return documents.map((doc) => ({
      id: doc.id,
      titulo: doc.data.titulo || "",
      slug: doc.uid || "",
      categoria: (doc.data.categoria as any) || "articulo",
      fecha: (doc.data.fecha as string) || doc.first_publication_date || "",
      extracto: doc.data.extracto || "",
      imagen_destacada: doc.data.imagen_destacada
        ? {
            url: doc.data.imagen_destacada.url || "",
            alt: doc.data.imagen_destacada.alt || "",
          }
        : undefined,
      contenido: doc.data.contenido,
      autor: doc.data.autor || undefined,
      tags: doc.tags || [],
      publicado: doc.data.publicado || false,
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

/**
 * Fetch article by slug
 */
export async function getArticleBySlug(
  slug: string,
  locale: string = "es"
): Promise<Articulo | null> {
  try {
    if (!client) {
      console.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getByUID("articulo", slug, {
      lang: prismicLocale,
    });

    return {
      id: doc.id,
      titulo: doc.data.titulo || "",
      slug: doc.uid || "",
      categoria: (doc.data.categoria as any) || "articulo",
      fecha: (doc.data.fecha as string) || doc.first_publication_date || "",
      extracto: doc.data.extracto || "",
      imagen_destacada: doc.data.imagen_destacada
        ? {
            url: doc.data.imagen_destacada.url || "",
            alt: doc.data.imagen_destacada.alt || "",
          }
        : undefined,
      contenido: doc.data.contenido,
      autor: doc.data.autor || undefined,
      tags: doc.tags || [],
      publicado: doc.data.publicado || false,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

/**
 * Fetch home content from Prismic
 */
export async function getHomeContent(
  locale: string = "es"
): Promise<HomeContent | null> {
  try {
    if (!client) {
      console.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getSingle("home", { lang: prismicLocale });

    return {
      hero: {
        title: doc.data.hero_title || "DEKALB EXPERIENCE",
        claim: doc.data.hero_claim || "Siempre a tu lado",
      },
      solutions: {
        integralMaiz:
          doc.data.solutions_integral_maiz || "Soluciones Integrales para Maíz",
        fieldview: doc.data.solutions_fieldview || "FieldView",
        protection: doc.data.solutions_protection || "Protección de Cultivo",
        preceon: doc.data.solutions_preceon || "Smart Corn System PRECEON",
        avoidProblems:
          doc.data.solutions_avoid_problems || "Evita problemas con tu maíz",
      },
    };
  } catch (error) {
    console.error("Error fetching home content:", error);
    return null;
  }
}

/**
 * Fetch FieldView content from Prismic
 */
export async function getFieldViewContent(
  locale: string = "es"
): Promise<FieldViewContent | null> {
  try {
    if (!client) {
      console.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getSingle("fieldview", { lang: prismicLocale });

    // Mapear tabs de Yield Kit
    const yieldKitTabs =
      doc.data.yield_kit_tabs?.map((tab: any, index: number) => {
        const tabIds: Array<
          "que-es" | "compatibilidad" | "ventajas" | "conectividad"
        > = ["que-es", "compatibilidad", "ventajas", "conectividad"];
        return {
          id: tabIds[index] || "que-es",
          label: tab.label || "",
          content: tab.content || [],
        };
      }) || [];

    return {
      hero: {
        titulo: doc.data.hero_titulo || "Siembra datos y cosecha decisiones",
        descripcion: doc.data.hero_descripcion || [],
      },
      introduccion: {
        titulo: doc.data.introduccion_titulo || "",
        texto: doc.data.introduccion_texto || [],
      },
      subsections: [
        {
          id: "drive",
          titulo: doc.data.drive_titulo || "FieldView Drive",
          descripcion: doc.data.drive_descripcion || [],
          imagen: doc.data.drive_imagen
            ? {
                url: doc.data.drive_imagen.url || "",
                alt: doc.data.drive_imagen.alt || "",
              }
            : undefined,
        },
        {
          id: "yield-kit",
          titulo: doc.data.yield_kit_titulo || "FieldView Yield Kit",
          descripcion: doc.data.yield_kit_descripcion || [],
          imagen: doc.data.yield_kit_imagen
            ? {
                url: doc.data.yield_kit_imagen.url || "",
                alt: doc.data.yield_kit_imagen.alt || "",
              }
            : undefined,
          yieldKitTabs: yieldKitTabs,
        },
        {
          id: "spraykit",
          titulo: doc.data.spraykit_titulo || "FieldView SprayKit",
          descripcion: doc.data.spraykit_descripcion || [],
          imagen: doc.data.spraykit_imagen
            ? {
                url: doc.data.spraykit_imagen.url || "",
                alt: doc.data.spraykit_imagen.alt || "",
              }
            : undefined,
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching FieldView content:", error);
    return null;
  }
}

/**
 * Fetch ProteccionCultivo content from Prismic
 */
export async function getProteccionCultivoContent(
  locale: string = "es"
): Promise<ProteccionCultivoContent | null> {
  try {
    logger.log("=== getProteccionCultivoContent called ===");
    logger.log("Locale:", locale);
    logger.log("Client exists:", !!client);
    logger.log("Repository name:", repositoryName);

    if (!client) {
      logger.error("❌ Prismic client not initialized");
      logger.error("Repository name:", repositoryName);
      logger.error("Access token exists:", !!accessToken);
      return null;
    }

    // Intentar primero con el locale específico, luego sin locale si falla
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    logger.log("Attempting to fetch with locale:", prismicLocale);
    let doc;

    try {
      doc = await client.getSingle("proteccion_cultivo", {
        lang: prismicLocale,
      });
      logger.log("✅ Document fetched successfully with locale");
    } catch (localeError: any) {
      logger.warn(
        `⚠️ Failed to fetch with locale ${prismicLocale}:`,
        localeError?.message || localeError
      );
      logger.warn("Error details:", {
        name: localeError?.name,
        message: localeError?.message,
        status: localeError?.status,
        response: localeError?.response,
      });

      try {
        logger.log("Attempting to fetch without locale...");
        doc = await client.getSingle("proteccion_cultivo");
        logger.log("✅ Document fetched successfully without locale");
      } catch (noLocaleError: any) {
        logger.error(
          "❌ Failed to fetch proteccion_cultivo document:",
          noLocaleError?.message || noLocaleError
        );
        logger.error("Error details:", {
          name: noLocaleError?.name,
          message: noLocaleError?.message,
          status: noLocaleError?.status,
          response: noLocaleError?.response,
        });

        // Verificar si el error es 404 (documento no encontrado)
        if (
          noLocaleError?.status === 404 ||
          noLocaleError?.message?.includes("404")
        ) {
          logger.error("🔍 Document not found. Please check:");
          logger.error(
            '1. The Custom Type "proteccion_cultivo" exists in Prismic'
          );
          logger.error(
            "2. The document is published (not just saved as draft)"
          );
          logger.error(
            '3. The Custom Type ID matches exactly: "proteccion_cultivo"'
          );
        }

        throw noLocaleError;
      }
    }

    if (!doc || !doc.data) {
      logger.warn("Document proteccion_cultivo not found or has no data");
      return null;
    }

    logger.log("Prismic doc fetched successfully");
    logger.log("Document ID:", doc.id);
    logger.log("Document type:", doc.type);
    logger.log("Document lang:", doc.lang);
    logger.debug("Soluciones raw:", doc.data.soluciones);
    logger.debug("Soluciones type:", typeof doc.data.soluciones);
    logger.debug("Soluciones is array:", Array.isArray(doc.data.soluciones));
    logger.debug("seccion_imagen_texto raw:", doc.data.seccion_imagen_texto);
    logger.debug(
      "seccion_imagen_texto type:",
      typeof doc.data.seccion_imagen_texto
    );
    logger.debug(
      "seccion_imagen_texto is array:",
      Array.isArray(doc.data.seccion_imagen_texto)
    );
    if (doc.data.seccion_imagen_texto) {
      logger.debug(
        "seccion_imagen_texto content:",
        JSON.stringify(doc.data.seccion_imagen_texto, null, 2)
      );
    }

    // Mapear soluciones - Prismic Groups se devuelven como arrays
    const solucionesRaw = doc.data.soluciones;

    if (!solucionesRaw) {
      console.warn("No soluciones field found in document");
      // Procesar seccion_imagen_texto incluso si no hay soluciones
      const seccionImagenTextoRaw = doc.data.seccion_imagen_texto;
      let seccionImagenTexto = {
        imagen: undefined as { url: string; alt: string } | undefined,
        texto: [] as any[],
      };

      if (seccionImagenTextoRaw) {
        if (
          Array.isArray(seccionImagenTextoRaw) &&
          seccionImagenTextoRaw.length > 0
        ) {
          const seccionData = seccionImagenTextoRaw[0];
          if (seccionData.imagen?.url) {
            let imagenUrl = seccionData.imagen.url.split("?")[0];
            seccionImagenTexto.imagen = {
              url: imagenUrl,
              alt: seccionData.imagen.alt || "",
            };
          }
          seccionImagenTexto.texto = seccionData.texto || [];
        } else if (
          typeof seccionImagenTextoRaw === "object" &&
          !Array.isArray(seccionImagenTextoRaw)
        ) {
          if (seccionImagenTextoRaw.imagen?.url) {
            let imagenUrl = seccionImagenTextoRaw.imagen.url.split("?")[0];
            seccionImagenTexto.imagen = {
              url: imagenUrl,
              alt: seccionImagenTextoRaw.imagen.alt || "",
            };
          }
          seccionImagenTexto.texto = seccionImagenTextoRaw.texto || [];
        }
      }

      return {
        soluciones: [],
        tabla_tratamientos: doc.data.tabla_tratamientos || [],
        seccion_imagen_texto: seccionImagenTexto,
      };
    }

    const soluciones = Array.isArray(solucionesRaw)
      ? solucionesRaw.map((solucion: any, index: number) => {
          logger.debug(`Processing solucion ${index}:`, solucion);
          return {
            logo:
              solucion.logo && solucion.logo.url
                ? {
                    // Remover parámetros de tamaño de Prismic para mantener dimensiones originales
                    url: (solucion.logo.url || "")
                      .replace(/[?&]w=\d+/g, "")
                      .replace(/[?&]h=\d+/g, "")
                      .replace(/[?&]rect=[^&]*/g, ""),
                    alt: solucion.logo.alt || "",
                  }
                : undefined,
            texto_introductorio: solucion.texto_introductorio || [],
            tabla: solucion.tabla || [],
          };
        })
      : [];

    logger.debug(`Mapped ${soluciones.length} soluciones`);

    // Procesar seccion_imagen_texto - Prismic Groups se devuelven como arrays
    const seccionImagenTextoRaw = doc.data.seccion_imagen_texto;
    let seccionImagenTexto = {
      imagen: undefined as { url: string; alt: string } | undefined,
      texto: [] as any[],
    };

    if (seccionImagenTextoRaw) {
      // Si es un array (Group), tomar el primer elemento
      if (
        Array.isArray(seccionImagenTextoRaw) &&
        seccionImagenTextoRaw.length > 0
      ) {
        const seccionData = seccionImagenTextoRaw[0];
        if (seccionData.imagen?.url) {
          let imagenUrl = seccionData.imagen.url;
          // Eliminar parámetros de tamaño de Prismic para mantener dimensiones originales
          imagenUrl = imagenUrl.split("?")[0];
          seccionImagenTexto.imagen = {
            url: imagenUrl,
            alt: seccionData.imagen.alt || "",
          };
        }
        seccionImagenTexto.texto = seccionData.texto || [];
      } else if (
        typeof seccionImagenTextoRaw === "object" &&
        !Array.isArray(seccionImagenTextoRaw)
      ) {
        // Si es un objeto directo (no array)
        if (seccionImagenTextoRaw.imagen?.url) {
          let imagenUrl = seccionImagenTextoRaw.imagen.url;
          imagenUrl = imagenUrl.split("?")[0];
          seccionImagenTexto.imagen = {
            url: imagenUrl,
            alt: seccionImagenTextoRaw.imagen.alt || "",
          };
        }
        seccionImagenTexto.texto = seccionImagenTextoRaw.texto || [];
      }
    }

    logger.debug(
      "Processed seccion_imagen_texto:",
      JSON.stringify(seccionImagenTexto, null, 2)
    );

    return {
      soluciones: soluciones,
      tabla_tratamientos: doc.data.tabla_tratamientos || [],
      seccion_imagen_texto: seccionImagenTexto,
    };
  } catch (error) {
    logger.error("Error fetching ProteccionCultivo content:", error);
    if (error instanceof Error) {
      logger.error("Error message:", error.message);
      logger.error("Error name:", error.name);
      // Verificar si es un error 404 (documento no encontrado)
      if (
        error.message.includes("404") ||
        error.message.includes("not found")
      ) {
        logger.error(
          'Document "proteccion_cultivo" not found in Prismic. Please check:'
        );
        logger.error("1. The document exists and is published");
        logger.error('2. The Custom Type ID matches "proteccion_cultivo"');
        logger.error("3. The repository name and access token are correct");
      }
    }
    return null;
  }
}

/**
 * Fetch all catalogs from Prismic
 */
export async function getAllCatalogs(
  locale: string = "es"
): Promise<CatalogoPDF[]> {
  try {
    if (!client) {
      logger.warn("Prismic client not initialized");
      return [];
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const documents = await client.getAllByType("catalogo_pdf", {
      lang: prismicLocale,
      orderings: {
        field: "my.catalogo_pdf.orden",
        direction: "asc",
      },
    });

    return documents.map((doc) => ({
      id: doc.id,
      nombre: doc.data.nombre || "",
      tipo: (doc.data.tipo as "maiz" | "colza") || "maiz",
      subcategoria: (doc.data.subcategoria as any) || "otros",
      pais: (doc.data.pais as "espana" | "portugal") || "espana",
      zona: doc.data.zona as any,
      url_pdf: prismic.asLink(doc.data.url_pdf) || "",
      orden: doc.data.orden || undefined,
    }));
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    return [];
  }
}

/**
 * Fetch Acceleron content from Prismic
 */
export async function getAcceleronContent(
  locale: string = "es"
): Promise<AcceleronContent | null> {
  try {
    if (!client) {
      console.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getSingle("acceleron", { lang: prismicLocale });

    // Procesar hero logo
    let heroLogoUrl = doc.data.hero_logo?.url || "";
    if (heroLogoUrl) {
      heroLogoUrl = heroLogoUrl.split("?")[0];
    }

    // Procesar hero imagen fondo
    let heroImagenFondoUrl = doc.data.hero_imagen_fondo?.url || "";
    if (heroImagenFondoUrl) {
      heroImagenFondoUrl = heroImagenFondoUrl.split("?")[0];
    }

    // Mapear bloques
    const bloquesRaw = doc.data.bloques;
    const bloques = Array.isArray(bloquesRaw)
      ? bloquesRaw.map((bloque: any) => {
          let imagenUrl = bloque.imagen?.url || "";
          if (imagenUrl) {
            imagenUrl = imagenUrl.split("?")[0];
          }
          return {
            imagen: imagenUrl
              ? {
                  url: imagenUrl,
                  alt: bloque.imagen?.alt || "",
                }
              : undefined,
            titulo: bloque.titulo || "",
            descripcion: bloque.descripcion || [],
          };
        })
      : [];

    // Procesar bloque final
    const bloqueFinalRaw = Array.isArray(doc.data.bloque_final)
      ? doc.data.bloque_final[0]
      : doc.data.bloque_final;

    let imagenDesktopUrl = bloqueFinalRaw?.imagen_desktop?.url || "";
    if (imagenDesktopUrl) {
      imagenDesktopUrl = imagenDesktopUrl.split("?")[0];
    }

    let imagenMobileUrl = bloqueFinalRaw?.imagen_mobile?.url || "";
    if (imagenMobileUrl) {
      imagenMobileUrl = imagenMobileUrl.split("?")[0];
    }

    return {
      hero: {
        logo: heroLogoUrl
          ? {
              url: heroLogoUrl,
              alt: doc.data.hero_logo?.alt || "",
            }
          : undefined,
        titulo: doc.data.hero_titulo || "",
        descripcion: doc.data.hero_descripcion || [],
        imagen_fondo: heroImagenFondoUrl
          ? {
              url: heroImagenFondoUrl,
              alt: doc.data.hero_imagen_fondo?.alt || "",
            }
          : undefined,
      },
      introduccion: {
        titulo: doc.data.introduccion_titulo || "",
        texto: doc.data.introduccion_texto || [],
      },
      bloques: bloques,
      bloque_final: {
        imagen_desktop: imagenDesktopUrl
          ? {
              url: imagenDesktopUrl,
              alt: bloqueFinalRaw?.imagen_desktop?.alt || "",
            }
          : undefined,
        imagen_mobile: imagenMobileUrl
          ? {
              url: imagenMobileUrl,
              alt: bloqueFinalRaw?.imagen_mobile?.alt || "",
            }
          : undefined,
        texto: bloqueFinalRaw?.texto || [],
      },
    };
  } catch (error) {
    console.error("Error fetching Acceleron content:", error);
    return null;
  }
}
