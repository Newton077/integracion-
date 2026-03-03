#!/usr/bin/env bun

/**
 * Script para verificar que la configuración está completa
 * antes de iniciar el servidor
 */

console.log("🔍 Verificando configuración de Wavy Node...\n");

// Verificar variables de entorno
const SECRET = process.env.SECRET;
const API_KEY = process.env.WAVYNODE_API_KEY;
const PROJECT_ID = process.env.WAVYNODE_PROJECT_ID;

let errores = 0;
let advertencias = 0;

console.log("📋 Variables de Entorno:");
console.log("─".repeat(70));

// Verificar SECRET
if (!SECRET || SECRET === "place-here-your-secret") {
  console.log("❌ SECRET: No configurado o usando valor por defecto");
  console.log("   → Obtén el SECRET real del dashboard de Wavy Node");
  console.log("   → Dashboard: https://dashboard.wavynode.com");
  errores++;
} else if (SECRET.length < 32) {
  console.log("⚠️  SECRET: Configurado pero parece corto");
  console.log("   → Verifica que sea el SECRET correcto del dashboard");
  advertencias++;
} else {
  console.log("✅ SECRET: Configurado (" + SECRET.substring(0, 10) + "...)");
}

// Verificar API_KEY
if (!API_KEY) {
  console.log("❌ WAVYNODE_API_KEY: No configurado");
  errores++;
} else if (!API_KEY.startsWith("wavy_")) {
  console.log("⚠️  WAVYNODE_API_KEY: No parece válida (debe empezar con 'wavy_')");
  advertencias++;
} else {
  console.log("✅ WAVYNODE_API_KEY: Configurado (" + API_KEY.substring(0, 15) + "...)");
}

// Verificar PROJECT_ID
if (!PROJECT_ID) {
  console.log("❌ WAVYNODE_PROJECT_ID: No configurado");
  errores++;
} else {
  console.log("✅ WAVYNODE_PROJECT_ID: " + PROJECT_ID);
}

console.log("─".repeat(70));

// Verificar que el servidor puede iniciar
console.log("\n🌐 Verificando Servidor:");
console.log("─".repeat(70));

try {
  const response = await fetch("http://localhost:80/users/user-123", {
    method: "GET",
  }).catch(() => null);

  if (response) {
    console.log("⚠️  El puerto 80 ya está en uso");
    console.log("   → Detén el servidor actual antes de reiniciar");
    advertencias++;
  } else {
    console.log("✅ Puerto 80 disponible");
  }
} catch (error) {
  console.log("✅ Puerto 80 disponible");
}

console.log("─".repeat(70));

// Verificar wallet registrada
console.log("\n💼 Verificando Wallet Registrada:");
console.log("─".repeat(70));

if (API_KEY && PROJECT_ID) {
  try {
    const response = await fetch(
      `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses`,
      {
        headers: {
          "x-api-key": `ApiKey ${API_KEY}`,
        },
      }
    );

    if (response.ok) {
      const addresses = await response.json();
      
      if (Array.isArray(addresses) && addresses.length > 0) {
        console.log(`✅ ${addresses.length} wallet(s) registrada(s):`);
        addresses.forEach((addr: any) => {
          console.log(`   • ${addr.address}`);
          if (addr.userId || addr.foreign_user_id) {
            console.log(`     Usuario: ${addr.userId || addr.foreign_user_id}`);
          }
        });
      } else {
        console.log("⚠️  No hay wallets registradas");
        console.log("   → Ejecuta: bun scripts/register-wallet-simple.ts");
        advertencias++;
      }
    } else {
      console.log("⚠️  No se pudo verificar wallets registradas");
      console.log("   → Verifica tu API_KEY y PROJECT_ID");
      advertencias++;
    }
  } catch (error) {
    console.log("⚠️  Error al verificar wallets:", error);
    advertencias++;
  }
} else {
  console.log("⏭️  Saltando verificación (falta API_KEY o PROJECT_ID)");
}

console.log("─".repeat(70));

// Resumen
console.log("\n📊 Resumen:");
console.log("─".repeat(70));

if (errores > 0) {
  console.log(`❌ ${errores} error(es) encontrado(s)`);
  console.log("⚠️  ${advertencias} advertencia(s)");
  console.log("\n🚫 No puedes iniciar el servidor hasta resolver los errores.");
  console.log("\n📝 Pasos para resolver:");
  console.log("   1. Actualiza el archivo .env con los valores correctos");
  console.log("   2. Obtén el SECRET del dashboard: https://dashboard.wavynode.com");
  console.log("   3. Ejecuta este script nuevamente para verificar");
  process.exit(1);
} else if (advertencias > 0) {
  console.log(`⚠️  ${advertencias} advertencia(s) encontrada(s)`);
  console.log("✅ Puedes iniciar el servidor, pero revisa las advertencias.");
  console.log("\n🚀 Para iniciar:");
  console.log("   Terminal 1: sudo bun run dev");
  console.log("   Terminal 2: ngrok http 80");
} else {
  console.log("✅ Todo configurado correctamente!");
  console.log("\n🚀 Próximos pasos:");
  console.log("   1. Terminal 1: sudo bun run dev");
  console.log("   2. Terminal 2: ngrok http 80");
  console.log("   3. Copia la URL de ngrok (ej: https://abc123.ngrok.io)");
  console.log("   4. Configura esa URL en el dashboard de Wavy Node");
  console.log("   5. ¡Listo para recibir notificaciones!");
}

console.log("─".repeat(70));
