/**
 * Script para verificar la configuración de Prismic
 * Ejecutar con: node scripts/verify-prismic.js
 */

import * as prismic from '@prismicio/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '..', '.env') });

const repositoryName = process.env.PRISMIC_REPOSITORY_NAME;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

console.log('🔍 Verificando configuración de Prismic...\n');

if (!repositoryName || repositoryName === 'your-repository-name' || repositoryName === 'placeholder') {
  console.error('❌ PRISMIC_REPOSITORY_NAME no está configurado');
  console.log('   Por favor, configura el valor en el archivo .env\n');
  process.exit(1);
}

if (!accessToken || accessToken === 'your-access-token' || accessToken === 'placeholder') {
  console.error('❌ PRISMIC_ACCESS_TOKEN no está configurado');
  console.log('   Por favor, configura el valor en el archivo .env\n');
  process.exit(1);
}

console.log('✅ Variables de entorno configuradas');
console.log(`   Repository: ${repositoryName}`);
console.log(`   Token: ${accessToken.substring(0, 10)}...\n`);

try {
  const client = prismic.createClient(repositoryName, {
    accessToken,
  });

  console.log('🔄 Conectando con Prismic...\n');

  // Verificar conexión
  const repository = await client.getRepository();
  console.log('✅ Conexión exitosa con Prismic');
  console.log(`   Workspace: ${repository.name}\n`);

  // Verificar Custom Types
  console.log('🔍 Verificando Custom Types...\n');

  const customTypes = await client.getCustomTypes();
  const requiredTypes = ['producto', 'articulo', 'catalogo_pdf'];
  const foundTypes = customTypes.map((ct) => ct.id);

  requiredTypes.forEach((type) => {
    if (foundTypes.includes(type)) {
      console.log(`   ✅ ${type} encontrado`);
    } else {
      console.log(`   ❌ ${type} NO encontrado - Debes crearlo en Prismic`);
    }
  });

  console.log('\n');

  // Verificar documentos
  console.log('🔍 Verificando documentos...\n');

  try {
    const productos = await client.getAllByType('producto', { lang: 'es' });
    console.log(`   ✅ Productos: ${productos.length} encontrados`);
  } catch (e) {
    console.log(`   ⚠️  Productos: No se pueden obtener (Custom Type puede no existir)`);
  }

  try {
    const articulos = await client.getAllByType('articulo', { lang: 'es' });
    console.log(`   ✅ Artículos: ${articulos.length} encontrados`);
  } catch (e) {
    console.log(`   ⚠️  Artículos: No se pueden obtener (Custom Type puede no existir)`);
  }

  try {
    const catalogos = await client.getAllByType('catalogo_pdf', { lang: 'es' });
    console.log(`   ✅ Catálogos: ${catalogos.length} encontrados`);
  } catch (e) {
    console.log(`   ⚠️  Catálogos: No se pueden obtener (Custom Type puede no existir)`);
  }

  console.log('\n✅ Verificación completada\n');
} catch (error) {
  console.error('❌ Error al conectar con Prismic:');
  console.error(`   ${error.message}\n`);
  
  if (error.message.includes('Repository not found')) {
    console.log('💡 Sugerencia: Verifica que el PRISMIC_REPOSITORY_NAME sea correcto');
  } else if (error.message.includes('Invalid access token')) {
    console.log('💡 Sugerencia: Verifica que el PRISMIC_ACCESS_TOKEN sea correcto');
  }
  
  process.exit(1);
}

