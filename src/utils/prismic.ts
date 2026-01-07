/**
 * Prismic client configuration
 */

import * as prismic from "@prismicio/client";
import { logger } from "./logger";
import { isValidImageUrl } from "./security";
import type {
  Producto,
  Articulo,
  CatalogoPDF,
  InformaPDF,
  HomeContent,
  FieldViewContent,
  ProteccionCultivoContent,
  AcceleronContent,
  FieldShieldContent,
  PreceonContent,
} from "../types";

const repositoryName = import.meta.env.PRISMIC_REPOSITORY_NAME || "";
const accessToken = import.meta.env.PRISMIC_ACCESS_TOKEN || "";

if (!repositoryName) {
  logger.warn("PRISMIC_REPOSITORY_NAME is not set");
}

/**
 * Helper function to process and validate image URLs from Prismic
 * Removes query parameters and validates the URL
 */
function processImageUrl(url: string | undefined): string {
  if (!url) return "";
  let processedUrl = url.split("?")[0];
  // ✅ SECURITY: Validate image URL before returning
  if (!isValidImageUrl(processedUrl)) {
    logger.warn("Invalid image URL detected, skipping:", processedUrl);
    return "";
  }
  return processedUrl;
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
      fetchLinks: ["saco.imagen", "saco.nombre"],
      orderings: [
        {
          field: "my.producto.orden",
          direction: "asc",
        },
      ],
    });

    // Map documents to products
    const products = documents.map((doc) => ({
      id: doc.id,
      nombre: doc.data.nombre || "",
      codigo: doc.data.codigo || "",
      imagen_saco: (() => {
        const imgUrl = doc.data.saco_ref?.data?.imagen?.url || "";
        if (!imgUrl || !isValidImageUrl(imgUrl)) {
          if (imgUrl)
            logger.warn(
              "Invalid image URL detected in producto, skipping:",
              imgUrl
            );
          return undefined;
        }
        return {
          url: imgUrl,
          alt:
            doc.data.saco_ref.data.imagen.alt ||
            doc.data.saco_ref.data.nombre ||
            doc.data.nombre ||
            "",
        };
      })(),
      claim: doc.data.claim || undefined,
      ciclo_rm: doc.data.ciclo_rm || undefined,
      descripcion_popup:
        prismic.asText(doc.data.descripcion_popup) || undefined,
      tipo_grano:
        doc.data.tipo_grano &&
        typeof doc.data.tipo_grano === "string" &&
        doc.data.tipo_grano.trim()
          ? doc.data.tipo_grano.trim()
          : undefined,
      altura_planta_texto:
        doc.data.altura_planta_texto &&
        typeof doc.data.altura_planta_texto === "string" &&
        doc.data.altura_planta_texto.trim()
          ? doc.data.altura_planta_texto.trim()
          : undefined,
      floracion_texto:
        doc.data.floracion_texto &&
        typeof doc.data.floracion_texto === "string" &&
        doc.data.floracion_texto.trim()
          ? doc.data.floracion_texto.trim()
          : undefined,
      madurez_texto:
        doc.data.madurez_texto &&
        typeof doc.data.madurez_texto === "string" &&
        doc.data.madurez_texto.trim()
          ? doc.data.madurez_texto.trim()
          : undefined,
      insercion_mazorca:
        doc.data.insercion_mazorca &&
        typeof doc.data.insercion_mazorca === "string" &&
        doc.data.insercion_mazorca.trim()
          ? doc.data.insercion_mazorca.trim()
          : undefined,
      caracteristicas: Array.isArray(doc.data.caracteristicas)
        ? doc.data.caracteristicas
            .map((c: any) => ({
              clave: c?.clave,
              valor: typeof c?.valor === "number" ? c.valor : Number(c?.valor),
              label_custom: c?.label_custom || undefined,
            }))
            .filter((c: any) => !!c.clave && !Number.isNaN(c.valor))
        : [],
      tipo_semilla:
        ((typeof doc.data.tipo_semilla === "string"
          ? doc.data.tipo_semilla.toLowerCase()
          : doc.data.tipo_semilla) as "maiz" | "colza") || "maiz",
      uso:
        typeof doc.data.uso === "string"
          ? (doc.data.uso.toLowerCase() as "grano" | "silo" | "preceon")
          : (doc.data.uso as "grano" | "silo" | "preceon" | undefined),
      zona: Array.isArray(doc.data.zonas)
        ? doc.data.zonas
            .map((z: any) => z?.zona)
            .filter(Boolean)
            .map((z: string) => z.toLowerCase())
        : typeof doc.data.zona === "string"
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
      orden: typeof doc.data.orden === "number" ? doc.data.orden : undefined,
    }));

    // Sort by orden field (ascending), products without orden go to the end
    products.sort((a, b) => {
      const ordenA = a.orden ?? 999999;
      const ordenB = b.orden ?? 999999;
      return ordenA - ordenB;
    });

    return products;
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
      logger.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getByID(id, {
      lang: prismicLocale,
      fetchLinks: ["saco.imagen", "saco.nombre"],
    });

    return {
      id: doc.id,
      nombre: doc.data.nombre || "",
      codigo: doc.data.codigo || "",
      imagen_saco: (() => {
        const imgUrl = doc.data.saco_ref?.data?.imagen?.url || "";
        if (!imgUrl || !isValidImageUrl(imgUrl)) {
          if (imgUrl)
            logger.warn(
              "Invalid image URL detected in producto, skipping:",
              imgUrl
            );
          return undefined;
        }
        return {
          url: imgUrl,
          alt:
            doc.data.saco_ref.data.imagen.alt ||
            doc.data.saco_ref.data.nombre ||
            doc.data.nombre ||
            "",
        };
      })(),
      claim: doc.data.claim || undefined,
      ciclo_rm: doc.data.ciclo_rm || undefined,
      descripcion_popup:
        prismic.asText(doc.data.descripcion_popup) || undefined,
      tipo_grano:
        doc.data.tipo_grano &&
        typeof doc.data.tipo_grano === "string" &&
        doc.data.tipo_grano.trim()
          ? doc.data.tipo_grano.trim()
          : undefined,
      altura_planta_texto:
        doc.data.altura_planta_texto &&
        typeof doc.data.altura_planta_texto === "string" &&
        doc.data.altura_planta_texto.trim()
          ? doc.data.altura_planta_texto.trim()
          : undefined,
      floracion_texto:
        doc.data.floracion_texto &&
        typeof doc.data.floracion_texto === "string" &&
        doc.data.floracion_texto.trim()
          ? doc.data.floracion_texto.trim()
          : undefined,
      madurez_texto:
        doc.data.madurez_texto &&
        typeof doc.data.madurez_texto === "string" &&
        doc.data.madurez_texto.trim()
          ? doc.data.madurez_texto.trim()
          : undefined,
      insercion_mazorca:
        doc.data.insercion_mazorca &&
        typeof doc.data.insercion_mazorca === "string" &&
        doc.data.insercion_mazorca.trim()
          ? doc.data.insercion_mazorca.trim()
          : undefined,
      caracteristicas: Array.isArray(doc.data.caracteristicas)
        ? doc.data.caracteristicas
            .map((c: any) => ({
              clave: c?.clave,
              valor: typeof c?.valor === "number" ? c.valor : Number(c?.valor),
              label_custom: c?.label_custom || undefined,
            }))
            .filter((c: any) => !!c.clave && !Number.isNaN(c.valor))
        : [],
      tipo_semilla:
        ((typeof doc.data.tipo_semilla === "string"
          ? doc.data.tipo_semilla.toLowerCase()
          : doc.data.tipo_semilla) as "maiz" | "colza") || "maiz",
      uso:
        typeof doc.data.uso === "string"
          ? (doc.data.uso.toLowerCase() as "grano" | "silo" | "preceon")
          : (doc.data.uso as "grano" | "silo" | "preceon" | undefined),
      zona: Array.isArray(doc.data.zonas)
        ? doc.data.zonas
            .map((z: any) => z?.zona)
            .filter(Boolean)
            .map((z: string) => z.toLowerCase())
        : typeof doc.data.zona === "string"
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
    logger.error("Error fetching articles:", error);
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
      logger.warn("Prismic client not initialized");
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
      logger.warn("Prismic client not initialized");
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
    logger.error("Error fetching home content:", error);
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
      logger.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getSingle("fieldview", { lang: prismicLocale });

    // Procesar hero imagen de fondo (desktop y mobile) siguiendo el patrón de FieldShield
    let heroImagenFondoUrl = doc.data.hero_imagen_fondo?.url || "";
    if (heroImagenFondoUrl) {
      heroImagenFondoUrl = heroImagenFondoUrl.split("?")[0];
      // ✅ SECURITY: Validate image URL
      if (!isValidImageUrl(heroImagenFondoUrl)) {
        logger.warn(
          "Invalid hero image URL detected in fieldview, skipping:",
          heroImagenFondoUrl
        );
        heroImagenFondoUrl = "";
      }
    }
    let heroImagenFondoMobileUrl = doc.data.hero_imagen_fondo_mobile?.url || "";
    if (heroImagenFondoMobileUrl) {
      heroImagenFondoMobileUrl = heroImagenFondoMobileUrl.split("?")[0];
      // ✅ SECURITY: Validate image URL
      if (!isValidImageUrl(heroImagenFondoMobileUrl)) {
        logger.warn(
          "Invalid hero mobile image URL detected in fieldview, skipping:",
          heroImagenFondoMobileUrl
        );
        heroImagenFondoMobileUrl = "";
      }
    }

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
        imagen_fondo: heroImagenFondoUrl
          ? {
              url: heroImagenFondoUrl,
              alt: doc.data.hero_imagen_fondo?.alt || "",
            }
          : undefined,
        imagen_fondo_mobile: heroImagenFondoMobileUrl
          ? {
              url: heroImagenFondoMobileUrl,
              alt: doc.data.hero_imagen_fondo_mobile?.alt || "",
            }
          : undefined,
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
          imagen: (() => {
            const imgUrl = processImageUrl(doc.data.drive_imagen?.url);
            return imgUrl
              ? {
                  url: imgUrl,
                  alt: doc.data.drive_imagen.alt || "",
                }
              : undefined;
          })(),
        },
        {
          id: "yield-kit",
          titulo: doc.data.yield_kit_titulo || "FieldView Yield Kit",
          descripcion: doc.data.yield_kit_descripcion || [],
          imagen: (() => {
            const imgUrl = processImageUrl(doc.data.yield_kit_imagen?.url);
            return imgUrl
              ? {
                  url: imgUrl,
                  alt: doc.data.yield_kit_imagen.alt || "",
                }
              : undefined;
          })(),
          yieldKitTabs: yieldKitTabs,
        },
        {
          id: "spraykit",
          titulo: doc.data.spraykit_titulo || "FieldView SprayKit",
          descripcion: doc.data.spraykit_descripcion || [],
          imagen: (() => {
            const imgUrl = processImageUrl(doc.data.spraykit_imagen?.url);
            return imgUrl
              ? {
                  url: imgUrl,
                  alt: doc.data.spraykit_imagen.alt || "",
                }
              : undefined;
          })(),
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

    // Procesar hero (título, descripción e imágenes de fondo)
    let heroImagenFondoUrl = processImageUrl(doc.data.hero_imagen_fondo?.url);
    let heroImagenFondoMobileUrl = processImageUrl(
      doc.data.hero_imagen_fondo_mobile?.url
    );

    // Mapear soluciones - Prismic Groups se devuelven como arrays
    const solucionesRaw = doc.data.soluciones;

    if (!solucionesRaw) {
      logger.warn("No soluciones field found in document");
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
          const imagenUrl = processImageUrl(seccionData.imagen?.url);
          if (imagenUrl) {
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
          const imagenUrl = processImageUrl(seccionImagenTextoRaw.imagen?.url);
          if (imagenUrl) {
            seccionImagenTexto.imagen = {
              url: imagenUrl,
              alt: seccionImagenTextoRaw.imagen.alt || "",
            };
          }
          seccionImagenTexto.texto = seccionImagenTextoRaw.texto || [];
        }
      }

      return {
        hero: {
          titulo: doc.data.hero_titulo || "Protección de Cultivo",
          descripcion: doc.data.hero_descripcion || [],
          imagen_fondo: heroImagenFondoUrl
            ? {
                url: heroImagenFondoUrl,
                alt: doc.data.hero_imagen_fondo?.alt || "",
              }
            : undefined,
          imagen_fondo_mobile: heroImagenFondoMobileUrl
            ? {
                url: heroImagenFondoMobileUrl,
                alt: doc.data.hero_imagen_fondo_mobile?.alt || "",
              }
            : undefined,
        },
        soluciones: [],
        tabla_tratamientos: doc.data.tabla_tratamientos || [],
        seccion_imagen_texto: seccionImagenTexto,
      };
    }

    const soluciones = Array.isArray(solucionesRaw)
      ? solucionesRaw.map((solucion: any, index: number) => {
          logger.debug(`Processing solucion ${index}:`, solucion);
          return {
            logo: (() => {
              const logoUrl = solucion.logo?.url;
              if (!logoUrl) return undefined;
              // Remover parámetros de tamaño de Prismic para mantener dimensiones originales
              let processedUrl = logoUrl
                .replace(/[?&]w=\d+/g, "")
                .replace(/[?&]h=\d+/g, "")
                .replace(/[?&]rect=[^&]*/g, "");
              // ✅ SECURITY: Validate logo URL
              processedUrl = processImageUrl(processedUrl);
              return processedUrl
                ? {
                    url: processedUrl,
                    alt: solucion.logo.alt || "",
                  }
                : undefined;
            })(),
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
        const imagenUrl = processImageUrl(seccionData.imagen?.url);
        if (imagenUrl) {
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
        const imagenUrl = processImageUrl(seccionImagenTextoRaw.imagen?.url);
        if (imagenUrl) {
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
      hero: {
        titulo: doc.data.hero_titulo || "Protección de Cultivo",
        descripcion: doc.data.hero_descripcion || [],
        imagen_fondo: heroImagenFondoUrl
          ? {
              url: heroImagenFondoUrl,
              alt: doc.data.hero_imagen_fondo?.alt || "",
            }
          : undefined,
        imagen_fondo_mobile: heroImagenFondoMobileUrl
          ? {
              url: heroImagenFondoMobileUrl,
              alt: doc.data.hero_imagen_fondo_mobile?.alt || "",
            }
          : undefined,
      },
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

    return documents.map((doc) => {
      // Obtener URL base sin parámetros de transformación (rect, w, h, etc.)
      let imagenUrl = doc.data.imagen?.url || "";
      if (imagenUrl) {
        imagenUrl = imagenUrl.split("?")[0];
        // ✅ SECURITY: Validate image URL before returning
        if (!isValidImageUrl(imagenUrl)) {
          logger.warn(
            "Invalid image URL detected in catalogo, skipping:",
            imagenUrl
          );
          imagenUrl = "";
        }
      }

      return {
        id: doc.id,
        nombre: doc.data.nombre || "",
        imagen: imagenUrl
          ? {
              url: imagenUrl,
              alt: doc.data.imagen.alt || doc.data.nombre || "",
            }
          : undefined,
        tipo: (doc.data.tipo as "maiz" | "colza") || "maiz",
        subcategoria: (doc.data.subcategoria as any) || "otros",
        pais: (doc.data.pais as "espana" | "portugal") || "espana",
        zona: doc.data.zona as any,
        url_pdf: prismic.asLink(doc.data.url_pdf) || "",
        orden: doc.data.orden || undefined,
      };
    });
  } catch (error) {
    logger.error("Error fetching catalogs:", error);
    return [];
  }
}

/**
 * Fetch all informa documents from Prismic
 */
export async function getAllInforma(
  locale: string = "es"
): Promise<InformaPDF[]> {
  try {
    if (!client) {
      logger.warn("Prismic client not initialized");
      return [];
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const documents = await client.getAllByType("informa_pdf", {
      lang: prismicLocale,
      orderings: {
        field: "my.informa_pdf.orden",
        direction: "asc",
      },
    });

    return documents.map((doc) => {
      // Obtener URL base sin parámetros de transformación (rect, w, h, etc.)
      let imagenUrl = doc.data.imagen?.url || "";
      if (imagenUrl) {
        imagenUrl = imagenUrl.split("?")[0];
        // ✅ SECURITY: Validate image URL before returning
        if (!isValidImageUrl(imagenUrl)) {
          logger.warn(
            "Invalid image URL detected in catalogo, skipping:",
            imagenUrl
          );
          imagenUrl = "";
        }
      }

      return {
        id: doc.id,
        nombre: doc.data.nombre || "",
        imagen: imagenUrl
          ? {
              url: imagenUrl,
              alt: doc.data.imagen.alt || doc.data.nombre || "",
            }
          : undefined,
        tipo: (doc.data.tipo as "maiz" | "colza") || "maiz",
        subcategoria: doc.data.subcategoria || "",
        pais: (doc.data.pais as "espana" | "portugal") || "espana",
        url_pdf: prismic.asLink(doc.data.url_pdf) || "",
        orden: doc.data.orden || undefined,
      };
    });
  } catch (error) {
    logger.error("Error fetching informa:", error);
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
      logger.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getSingle("acceleron", { lang: prismicLocale });

    // Procesar hero logo
    let heroLogoUrl = processImageUrl(doc.data.hero_logo?.url);

    // Procesar hero imagen fondo (desktop y mobile)
    let heroImagenFondoUrl = processImageUrl(doc.data.hero_imagen_fondo?.url);
    let heroImagenFondoMobileUrl = processImageUrl(
      doc.data.hero_imagen_fondo_mobile?.url
    );

    // Mapear bloques
    const bloquesRaw = doc.data.bloques;
    const bloques = Array.isArray(bloquesRaw)
      ? bloquesRaw.map((bloque: any) => {
          const imagenUrl = processImageUrl(bloque.imagen?.url);
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

    let imagenDesktopUrl = processImageUrl(bloqueFinalRaw?.imagen_desktop?.url);
    let imagenMobileUrl = processImageUrl(bloqueFinalRaw?.imagen_mobile?.url);

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
        imagen_fondo_mobile: heroImagenFondoMobileUrl
          ? {
              url: heroImagenFondoMobileUrl,
              alt: doc.data.hero_imagen_fondo_mobile?.alt || "",
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
    logger.error("Error fetching Acceleron content:", error);
    return null;
  }
}

/**
 * Fetch FieldShield content from Prismic
 */
export async function getFieldShieldContent(
  locale: string = "es"
): Promise<FieldShieldContent | null> {
  try {
    if (!client) {
      logger.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getSingle("fieldshield", { lang: prismicLocale });

    // Procesar hero
    let heroLogoUrl = processImageUrl(doc.data.hero_logo?.url);
    let heroImagenFondoUrl = processImageUrl(doc.data.hero_imagen_fondo?.url);
    let heroImagenFondoMobileUrl = processImageUrl(
      doc.data.hero_imagen_fondo_mobile?.url
    );

    // Mapear módulos
    const modulosRaw = doc.data.modulos;
    const modulos = Array.isArray(modulosRaw)
      ? modulosRaw.map((modulo: any) => {
          const imagenUrl = processImageUrl(modulo.imagen?.url);
          return {
            imagen: imagenUrl
              ? { url: imagenUrl, alt: modulo.imagen?.alt || "" }
              : undefined,
            titulo: modulo.titulo || "",
            descripcion: modulo.descripcion || [],
          };
        })
      : [];

    // Procesar soluciones_fieldshield
    const solucionesRaw = Array.isArray(doc.data.soluciones_fieldshield)
      ? doc.data.soluciones_fieldshield[0]
      : doc.data.soluciones_fieldshield;

    // Mapear cards_textos_plus
    const cardsPlusRaw = doc.data.cards_textos_plus;
    const cardsPlus = Array.isArray(cardsPlusRaw)
      ? cardsPlusRaw.map((card: any) => ({
          titulo: card.titulo || "",
          descripcion: card.descripcion || [],
        }))
      : [];

    // Mapear cards_gris
    const cardsGrisRaw = doc.data.cards_gris;
    const cardsGris = Array.isArray(cardsGrisRaw)
      ? cardsGrisRaw.map((card: any) => {
          const imagenUrl = processImageUrl(card.imagen?.url);
          return {
            imagen: imagenUrl
              ? { url: imagenUrl, alt: card.imagen?.alt || "" }
              : undefined,
            texto: card.texto || [],
          };
        })
      : [];

    // Procesar seleccion_hibridos
    const seleccionRaw = Array.isArray(doc.data.seleccion_hibridos)
      ? doc.data.seleccion_hibridos[0]
      : doc.data.seleccion_hibridos;

    // Procesar bloque_degradado
    const bloqueDegradadoRaw = Array.isArray(doc.data.bloque_degradado)
      ? doc.data.bloque_degradado[0]
      : doc.data.bloque_degradado;
    let bloqueImagenUrl = processImageUrl(bloqueDegradadoRaw?.imagen?.url);

    // Mapear cards_finales
    const cardsFinalesRaw = doc.data.cards_finales;
    const cardsFinales = Array.isArray(cardsFinalesRaw)
      ? cardsFinalesRaw.map((card: any) => {
          const imagenUrl = processImageUrl(card.imagen?.url);
          const tabsLabelsStr = card.tabs_labels || "";
          const tabs = tabsLabelsStr
            ? tabsLabelsStr
                .split(",")
                .map((label: string) => ({ label: label.trim() }))
                .filter((tab: { label: string }) => tab.label.length > 0)
            : [];
          return {
            imagen: imagenUrl
              ? { url: imagenUrl, alt: card.imagen?.alt || "" }
              : undefined,
            texto: card.texto || [],
            tabs: tabs.length > 0 ? tabs : undefined,
          };
        })
      : [];

    return {
      hero: {
        logo: heroLogoUrl
          ? { url: heroLogoUrl, alt: doc.data.hero_logo?.alt || "" }
          : undefined,
        titulo: doc.data.hero_titulo || "",
        descripcion: doc.data.hero_descripcion || [],
        imagen_fondo: heroImagenFondoUrl
          ? {
              url: heroImagenFondoUrl,
              alt: doc.data.hero_imagen_fondo?.alt || "",
            }
          : undefined,
        imagen_fondo_mobile: heroImagenFondoMobileUrl
          ? {
              url: heroImagenFondoMobileUrl,
              alt: doc.data.hero_imagen_fondo_mobile?.alt || "",
            }
          : undefined,
      },
      titulo_intro: doc.data.titulo_intro || "",
      texto_intro: doc.data.texto_intro || [],
      modulos: modulos,
      soluciones_fieldshield: {
        titulo: solucionesRaw?.titulo || "",
        texto: solucionesRaw?.texto || [],
      },
      cards_textos_plus: cardsPlus,
      cards_gris: cardsGris,
      seleccion_hibridos: {
        titulo: seleccionRaw?.titulo || "",
        texto: seleccionRaw?.texto || [],
      },
      bloque_degradado: {
        imagen: bloqueImagenUrl
          ? {
              url: bloqueImagenUrl,
              alt: bloqueDegradadoRaw?.imagen?.alt || "",
            }
          : undefined,
      },
      cards_finales: cardsFinales,
    };
  } catch (error) {
    logger.error("Error fetching FieldShield content:", error);
    return null;
  }
}

/**
 * Fetch Siloextra content from Prismic
 */
export async function getSiloextraContent(
  locale: string = "es"
): Promise<any | null> {
  try {
    if (!client) {
      logger.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getSingle("siloextra", { lang: prismicLocale });

    if (!doc?.data) {
      return null;
    }

    // Hero
    const heroImagenFondoUrl = processImageUrl(doc.data.hero_imagen_fondo?.url);
    const heroImagenFondoMobileUrl = processImageUrl(
      doc.data.hero_imagen_fondo_mobile?.url
    );

    // Bloques
    const bloquesRaw = doc.data.bloques;
    const bloques = Array.isArray(bloquesRaw)
      ? bloquesRaw.map((bloque: any) => {
          const imagenUrl = processImageUrl(bloque.imagen?.url);
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

    return {
      hero: {
        titulo: doc.data.hero_titulo || "",
        descripcion: doc.data.hero_descripcion || [],
        imagen_fondo: heroImagenFondoUrl
          ? {
              url: heroImagenFondoUrl,
              alt: doc.data.hero_imagen_fondo?.alt || "",
            }
          : undefined,
        imagen_fondo_mobile: heroImagenFondoMobileUrl
          ? {
              url: heroImagenFondoMobileUrl,
              alt: doc.data.hero_imagen_fondo_mobile?.alt || "",
            }
          : undefined,
      },
      introduccion: {
        titulo: doc.data.introduccion_titulo || "",
        texto: doc.data.introduccion_texto || [],
      },
      bloques,
    };
  } catch (error) {
    logger.error("Error fetching Siloextra content:", error);
    return null;
  }
}

/**
 * Fetch Preceon content from Prismic
 */
export async function getPreceonContent(
  locale: string = "es"
): Promise<PreceonContent | null> {
  try {
    if (!client) {
      logger.warn("Prismic client not initialized");
      return null;
    }
    const prismicLocale = locale === "pt" ? "pt-pt" : "es-es";
    const doc = await client.getSingle("preceon", { lang: prismicLocale });

    if (!doc?.data) {
      return null;
    }

    // Hero
    let heroLogoUrl = processImageUrl(doc.data.hero_logo?.url);
    let heroImagenFondoUrl = processImageUrl(doc.data.hero_imagen_fondo?.url);
    let heroImagenFondoMobileUrl = processImageUrl(
      doc.data.hero_imagen_fondo_mobile?.url
    );

    // Elementos grid
    const elementosGridRaw = doc.data.elementos_grid;
    const elementosGrid = Array.isArray(elementosGridRaw)
      ? elementosGridRaw.map((elemento: any) => {
          const imagenUrl = processImageUrl(elemento.imagen?.url);
          return {
            imagen: imagenUrl
              ? {
                  url: imagenUrl,
                  alt: elemento.imagen?.alt || "",
                }
              : undefined,
            texto: elemento.texto || [],
          };
        })
      : [];

    // Elementos destacados
    const elementosDestacadosRaw = doc.data.elementos_destacados;
    const elementosDestacados = Array.isArray(elementosDestacadosRaw)
      ? elementosDestacadosRaw.map((elemento: any) => ({
          titulo: elemento.titulo || "",
          texto: elemento.texto || [],
        }))
      : [];

    // Imágenes degradado
    const imagenesDegradadoRaw = doc.data.imagenes_degradado;
    const imagenesDegradado = Array.isArray(imagenesDegradadoRaw)
      ? imagenesDegradadoRaw.map((item: any) => {
          const imagenUrl = processImageUrl(item.imagen?.url);
          return {
            imagen: imagenUrl
              ? {
                  url: imagenUrl,
                  alt: item.imagen?.alt || "",
                }
              : undefined,
            texto: item.texto || [],
          };
        })
      : [];

    // Bloque final
    const bloqueFinalRaw = Array.isArray(doc.data.bloque_final)
      ? doc.data.bloque_final[0]
      : doc.data.bloque_final;
    const bloqueFinalImagenUrl = processImageUrl(bloqueFinalRaw?.imagen?.url);

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
        imagen_fondo_mobile: heroImagenFondoMobileUrl
          ? {
              url: heroImagenFondoMobileUrl,
              alt: doc.data.hero_imagen_fondo_mobile?.alt || "",
            }
          : undefined,
      },
      titulo_intro: doc.data.titulo_intro || "",
      texto_intro: doc.data.texto_intro || [],
      elementos_grid: elementosGrid,
      produccion: {
        titulo: doc.data.produccion_titulo || "",
        texto: doc.data.produccion_texto || [],
      },
      elementos_destacados: elementosDestacados,
      imagenes_degradado: imagenesDegradado,
      bloque_final: {
        imagen: bloqueFinalImagenUrl
          ? {
              url: bloqueFinalImagenUrl,
              alt: bloqueFinalRaw?.imagen?.alt || "",
            }
          : undefined,
        titulo: bloqueFinalRaw?.titulo || "",
        descripcion: bloqueFinalRaw?.descripcion || [],
      },
    };
  } catch (error) {
    logger.error("Error fetching Preceon content:", error);
    return null;
  }
}
