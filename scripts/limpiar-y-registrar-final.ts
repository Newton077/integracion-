#!/usr/bin/env bun

const API_KEY = "wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV";
const PROJECT_ID = "1";
const USER_ID = "user-123";

// Las 3 wallets principales
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

console.log("🧹 Paso 1: Obteniendo todas las direcciones registradas...\n");

// Obtener todas las direcciones
const getUrl = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses`;
const getResponse = await fetch(getUrl, {
  headers: {
    "x-api-key": `ApiKey ${API_KEY}`,
  },
});

const allAddresses = await getResponse.json();
const addresses = allAddresses.data || allAddresses;

console.log(`📋 Total de direcciones: ${addresses.length}\n`);

// Encontrar las direcciones que queremos mantener
const targetAddresses = wallets.map(w => w.address.toLowerCase());
const toDelete = addresses.filter((addr: any) => 
  targetAddresses.includes(addr.address.toLowerCase())
);

console.log(`🗑️  Paso 2: Eliminando ${toDelete.length} direcciones existentes...\n`);

// Eliminar las direcciones existentes
for (const addr of toDelete) {
  console.log(`   Eliminando ID ${addr.id}: ${addr.address}`);
  
  const deleteUrl = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses/${addr.id}`;
  
  try {
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "x-api-key": `ApiKey ${API_KEY}`,
      },
    });

    if (response.ok) {
      console.log(`   ✅ Eliminada`);
    } else {
      console.log(`   ⚠️  Error ${response.status}`);
    }
  } catch (error) {
    console.log(`   ⚠️  Error:`, error);
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
}

console.log("\n" + "═".repeat(70));
console.log("📝 Paso 3: Registrando direcciones CON foreign_user_id...\n");

// Registrar las 3 wallets con foreign_user_id
for (const wallet of wallets) {
  console.log(`📤 Registrando: ${wallet.address}`);
  
  const postUrl = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses`;
  
  const body = {
    address: wallet.address,
    foreign_user_id: USER_ID,
    description: wallet.description
  };

  console.log(`   Body:`, JSON.stringify(body));

  try {
    const response = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `ApiKey ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    
    if (response.ok) {
      console.log("   ✅ Registrada");
      try {
        const data = JSON.parse(responseText);
        console.log("   📋 Respuesta:", JSON.stringify(data, null, 2));
      } catch {}
    } else {
      console.log(`   ❌ Error (${response.status}):`, responseText);
    }
  } catch (error) {
    console.log("   ❌ Error:", error);
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
}

console.log("\n" + "═".repeat(70));
console.log("🔍 Paso 4: Verificando que se guardó el foreign_user_id...\n");

// Verificar que se guardaron correctamente
await new Promise(resolve => setTimeout(resolve, 1000));

const verifyResponse = await fetch(getUrl, {
  headers: {
    "x-api-key": `ApiKey ${API_KEY}`,
  },
});

const verifyData = await verifyResponse.json();
const verifyAddresses = verifyData.data || verifyData;

const registered = verifyAddresses.filter((addr: any) => 
  targetAddresses.includes(addr.address.toLowerCase())
);

console.log(`📊 Direcciones registradas: ${registered.length}\n`);

for (const addr of registered) {
  console.log(`✅ ${addr.address}`);
  console.log(`   ID: ${addr.id}`);
  console.log(`   foreign_user_id: ${addr.foreign_user_id || 'NULL ⚠️'}`);
  console.log(`   Descripción: ${addr.description}`);
  console.log();
}

console.log("═".repeat(70));

if (registered.every((addr: any) => addr.foreign_user_id === USER_ID)) {
  console.log("✅ ¡Perfecto! Todas las wallets tienen el foreign_user_id correcto");
} else if (registered.every((addr: any) => !addr.foreign_user_id)) {
  console.log("⚠️  El campo foreign_user_id no se está guardando en la API");
  console.log("   Esto puede ser:");
  console.log("   1. Un bug en la API de Wavy Node");
  console.log("   2. Requiere configuración adicional en el dashboard");
  console.log("   3. El campo se guarda pero no se muestra en GET");
  console.log("\n   Contacta al soporte de Wavy Node para verificar");
} else {
  console.log("⚠️  Algunas wallets tienen foreign_user_id y otras no");
}

console.log("\n🎯 Tu servidor está listo en:");
console.log("   https://prerebellion-joella-unrallying.ngrok-free.dev");
console.log("\n📋 Configura esta URL en el dashboard de Wavy Node");
