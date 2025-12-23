import fs from "node:fs/promises";
import * as prismic from "@prismicio/client";

/**
 * Minimal Prismic Migration API script for `producto`.
 *
 * Requires:
 * - PRISMIC_REPO=dklab
 * - PRISMIC_WRITE_TOKEN=... (Write APIs token)
 * - PRODUCTS_PATH=... (optional, defaults to ./scripts/products-3.json)
 *
 * Docs: https://prismic.io/docs/migration
 */

const repositoryName = process.env.PRISMIC_REPO || "dklab";
const writeToken = process.env.PRISMIC_WRITE_TOKEN;
const productsPath = process.env.PRODUCTS_PATH || new URL("./products-3.json", import.meta.url);

if (!writeToken) {
  throw new Error("Missing PRISMIC_WRITE_TOKEN (create it in Prismic: Settings → API & Security → Write APIs)");
}

if (typeof prismic.createWriteClient !== "function" || typeof prismic.createMigration !== "function") {
  throw new Error(
    [
      "Your @prismicio/client version does not expose Migration helpers.",
      "Update @prismicio/client to a version supporting createWriteClient/createMigration (see Prismic migration docs), then retry.",
      "Docs: https://prismic.io/docs/migration",
    ].join("\n")
  );
}

const writeClient = prismic.createWriteClient(repositoryName, {
  writeToken,
});

const migration = prismic.createMigration();

const raw = await fs.readFile(productsPath, "utf8");
const products = JSON.parse(raw);

if (!Array.isArray(products) || products.length === 0) {
  throw new Error("No products found. Expected an array in products JSON.");
}

// Pre-fetch and validate saco documents (ensures relationship IDs exist)
const uniqueSacoIds = [...new Set(products.map((p) => p?.saco_ref_id).filter(Boolean))];
const sacosById = new Map();
for (const id of uniqueSacoIds) {
  const doc = await writeClient.getByID(id);
  if (!doc) {
    throw new Error(`Could not resolve saco_ref_id="${id}". Ensure the 'saco' documents exist in Prismic.`);
  }
  sacosById.set(id, doc);
}

function toRichTextParagraph(text) {
  if (!text || typeof text !== "string") return undefined;
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  return [{ type: "paragraph", text: trimmed, spans: [] }];
}

function toZonasGroup(zonas) {
  if (!Array.isArray(zonas) || zonas.length === 0) return undefined;
  return zonas
    .map((z) => (typeof z === "string" ? z.trim() : ""))
    .filter(Boolean)
    .map((z) => ({ zona: z }));
}

function toCaracteristicasGroup(caracteristicas) {
  if (!Array.isArray(caracteristicas) || caracteristicas.length === 0) return undefined;
  return caracteristicas
    .map((c) => ({
      clave: c?.clave,
      valor: typeof c?.valor === "number" ? c.valor : Number(c?.valor),
    }))
    .filter((c) => !!c.clave && !Number.isNaN(c.valor));
}

function clean(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === undefined || v === null) return false;
      if (typeof v === "string" && v.trim() === "") return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    })
  );
}

for (const p of products) {
  const saco = p?.saco_ref_id ? sacosById.get(p.saco_ref_id) : undefined;
  if (!saco) {
    throw new Error(`Missing or invalid saco_ref_id for product "${p?.nombre || p?.codigo || "unknown"}"`);
  }

  const data = clean({
    // Field API IDs from our Custom Type `producto`
    nombre: p.nombre,
    codigo: p.codigo,
    claim: p.claim,
    ciclo_rm: p.ciclo_rm,
    descripcion_popup: toRichTextParagraph(p.descripcion_popup ?? p.claim),
    tipo_semilla: p.tipo_semilla,
    uso: p.uso,
    categoria: p.categoria,
    // NOTE: In the current Prismic model, `proteccion` does not accept "todos".
    // We omit it unless it is one of the allowed values.
    proteccion:
      p.proteccion && p.proteccion !== "todos" ? p.proteccion : undefined,
    tipo_grano: p.tipo_grano,
    altura_planta_texto: p.altura_planta_texto,
    floracion_texto: p.floracion_texto,
    madurez_texto: p.madurez_texto,
    insercion_mazorca: p.insercion_mazorca,
    zonas: toZonasGroup(p.zonas),
    caracteristicas: toCaracteristicasGroup(p.caracteristicas),
    saco_ref: saco,
    orden: typeof p.orden === "number" ? p.orden : Number(p.orden),
  });

  migration.createDocument(
    {
      type: "producto",
      lang: "es-es",
      data,
    },
    p.nombre || p.codigo || "Producto"
  );
}

await writeClient.migrate(migration, {
  reporter: (event) => console.log(event),
});

console.log("✅ Done. Check Prismic → Migration release to review drafts.");

