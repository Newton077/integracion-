#!/usr/bin/env bun

/**
 * Script para registrar las wallets de prueba
 */

const API_KEY = "wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV";
const PROJECT_ID = "1";
const USER_ID = "user-123"; // Usuario de ejemplo

// Wallets a registrar
const wallets = [
  {
    address: "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6",
    description: "Wallet principal del usuario"
  },
  {
    address: "0x7812D0936a6b2df877506A6101281759e05d0D61",
    description: "Wallet secundaria del usuario"
  },
  {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    description: "Wallet adicional del usuario"
  }
];

console.log("🚀 Registrando wallets de prueba en Wavy Node\n");
console.log("👤 Usuario:", USER_ID);
console.log("💼 Wallets a registrar:", wallets.length);
console.log("═".repeat(70));

async function registerWallet(address: string, description: string) {
  const url = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses`;

  const body = {
    address: address,
    foreign_user_id: USER_ID,
    description: description
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `ApiKey ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return {
        success: false,
        address,
        error: responseText
      };
    }

    return {
      success: true,
      address,
      data: JSON.parse(responseText)
    };
  } catch (error) {
    return {
      success: false,
      address,
      error: String(error)
    };
  }
}

// Registrar todas las wallets
let exitosos = 0;
let fallidos = 0;

for (const wallet of wallets) {
  console.log(`\n📤 Registrando: ${wallet.address}`);
  console.log(`   Descripción: ${wallet.description}`);
  
  const result = await registerWallet(wallet.address, wallet.description);
  
  if (result.success) {
    console.log("   ✅ Registrada exitosamente");
    exitosos++;
  } else {
    console.log("   ❌ Error:", result.error);
    fallidos++;
  }
  
  // Pequeña pausa entre solicitudes
  await new Promise(resolve => setTimeout(resolve, 500));
}

console.log("\n" + "═".repeat(70));
console.log("📊 Resumen:");
console.log(`   ✅ Exitosas: ${exitosos}`);
console.log(`   ❌ Fallidas: ${fallidos}`);
console.log("═".repeat(70));

if (exitosos > 0) {
  console.log("\n🎉 Wallets registradas y vinculadas al usuario:", USER_ID);
  console.log("\n📋 Todas las wallets están ahora monitoreadas por Wavy Node");
  console.log("📨 Recibirás notificaciones de transacciones en cualquiera de ellas");
  console.log("\n🚀 Próximos pasos:");
  console.log("   1. Inicia el servidor: sudo bun run dev");
  console.log("   2. Inicia ngrok: ngrok http 80");
  console.log("   3. Configura la URL de ngrok en el dashboard de Wavy Node");
}
