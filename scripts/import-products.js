import { chromium, Page, BrowserContext } from "playwright";
import fs from "fs";
import path from "path";

type ProductoImport = {
  nombre: string,
  codigo: string,
  claim: string,
  descripcion_popup: string,
  ciclo_rm: string,
  tipo_semilla: "maiz" | "colza",
  uso: "" | "grano" | "silo" | "preceon",
  categoria: "maiz-grano" | "silo" | "preceon" | "colza",
  zonas: string[],
  proteccion: "todos" | "herbicida" | "insecticida" | "bioestimulante",
  tipo_grano: string,
  floracion_texto: string,
  insercion_mazorca: string,
  caracteristicas: { clave: string, valor: number }[],
  saco_ref_id: string,
  orden: number,
};

const PRISMIC_REPO_URL =
  process.env.PRISMIC_REPO_URL || "https://TU-REPO.prismic.io/";
const PRODUCTS_PATH =
  process.env.PRODUCTS_PATH || path.join(__dirname, "products-import.json");
const USER_DATA_DIR =
  process.env.CHROME_USER_DATA_DIR ||
  path.join(
    process.env.HOME || "",
    "Library/Application Support/Google/Chrome/Default"
  ); // macOS por defecto; cámbialo según tu SO

function normalize(val?: string) {
  return (val || "").trim();
}

async function createProduct(page: Page, p: ProductoImport, index: number) {
  console.log(`Creando producto ${index + 1}: ${p.nombre}`);

  await page.goto(`${PRISMIC_REPO_URL}documents`, { waitUntil: "networkidle" });
  await page.click('button:has-text("Create new")');
  await page.click("text=producto");
  await page.waitForSelector('input[placeholder*="Nombre"]', {
    timeout: 20000,
  });

  await page.fill('input[placeholder*="Nombre"]', normalize(p.nombre));
  await page.fill('input[placeholder*="Código"]', normalize(p.codigo));
  await page.fill('input[placeholder*="Claim"]', normalize(p.claim));
  await page.fill('input[placeholder*="CICLO"]', normalize(p.ciclo_rm));

  await page.selectOption('select[name="tipo_semilla"]', p.tipo_semilla);
  if (p.tipo_semilla === "maiz" && p.uso) {
    await page.selectOption('select[name="uso"]', p.uso);
  }
  await page.selectOption('select[name="categoria"]', p.categoria);
  if (p.proteccion && p.proteccion !== "todos") {
    await page.selectOption('select[name="proteccion"]', p.proteccion);
  }

  for (let i = 0; i < p.zonas.length; i++) {
    await page.click('button:has-text("Add to zonas")');
    const selectName = `zonas[${i}].zona`;
    await page.selectOption(`select[name="${selectName}"]`, p.zonas[i]);
  }

  if (p.tipo_grano)
    await page.fill('input[name="tipo_grano"]', normalize(p.tipo_grano));
  if (p.floracion_texto)
    await page.fill(
      'input[name="floracion_texto"]',
      normalize(p.floracion_texto)
    );
  if (p.insercion_mazorca)
    await page.fill(
      'input[name="insercion_mazorca"]',
      normalize(p.insercion_mazorca)
    );

  if (p.descripcion_popup) {
    const rt = await page.$(
      'div[data-slice-zone] textarea, div[data-slice-zone] [contenteditable="true"]'
    );
    if (rt) {
      await rt.click();
      await rt.fill(p.descripcion_popup);
    }
  }

  for (let i = 0; i < p.caracteristicas.length; i++) {
    await page.click('button:has-text("Add to caracteristicas")');
    const base = `caracteristicas[${i}]`;
    await page.selectOption(
      `select[name="${base}.clave"]`,
      p.caracteristicas[i].clave
    );
    await page.fill(
      `input[name="${base}.valor"]`,
      String(p.caracteristicas[i].valor)
    );
  }

  if (p.saco_ref_id) {
    await page.click('button:has-text("Select document")');
    await page.fill('input[placeholder*="Search"]', p.saco_ref_id);
    await page.press('input[placeholder*="Search"]', "Enter");
    await page.waitForTimeout(1000);
    await page.click(`text=${p.saco_ref_id}`);
    await page.click('button:has-text("Select")');
  }

  await page.fill('input[name="orden"]', String(p.orden || 0));

  // Guardar en borrador
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(1500);
}

async function main() {
  const raw = fs.readFileSync(PRODUCTS_PATH, "utf8");
  const products: ProductoImport[] = JSON.parse(raw);

  const browser = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false, // puedes poner true si quieres headless y cookie ya guardada
  });
  const page = await browser.newPage();

  // Si no estás logueado, Playwright abrirá una página de login; tendrás que hacer SSO una vez y quedará la cookie en el perfil
  await page.goto(`${PRISMIC_REPO_URL}documents`, { waitUntil: "networkidle" });
  // Pausa opcional para login manual si lo necesitas
  // await page.pause();

  for (let i = 0; i < products.length; i++) {
    try {
      await createProduct(page, products[i], i);
      console.log(`✅ Draft creado: ${products[i].nombre}`);
    } catch (err) {
      console.error(`❌ Error en ${products[i].nombre}`, err);
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
