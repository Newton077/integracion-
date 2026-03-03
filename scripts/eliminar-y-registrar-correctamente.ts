#!/usr/bin/env bun

const API_KEY = "wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV";
const PROJECT_ID = "1";
const USER_ID = "user-123";

// IDs a eliminar (las que registramos sin foreign_user_id)
const idsToDelete = [978, 979, 980];

// Wallets a registrar correctamente
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

console.log("🗑️  Eliminando direcciones sin foreign_user_id...\n");

// Intentar eliminar las direcciones
for (const id of idsToDelete) {
  console.log(`Eliminando ID ${id}...`);
  
  const url = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses/${id}`;
  
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "x-api-key": `ApiKey ${API_KEY}`,
      },
    });

    if (response.ok) {
      console.log(`   ✅ Eliminada`);
    } else {
      const text = await response.text();
      console.log(`   ⚠️  No se pudo eliminar (${response.status}):`, text);
    }
  } catch (error) {
    console.log(`   ⚠️  Error:`, error);
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
}

console.log("\n" + "═".repeat(70));
console.log("📝 Registrando direcciones CON foreign_user_id...\n");

// Registrar correctamente con foreign_user_id
for (const wallet of wallets) {
  console.log(`📤 Registrando: ${wallet.address}`);
  
  const url = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses`;
  
  const body = {
    address: wallet.address,
    foreign_user_id: USER_ID,  // ← IMPORTANTE: incluir desde el inicio
    description: wallet.description
  };

  console.log(`   Body:`, JSON.stringify(body));

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
    
    if (response.ok) {
      console.log("   ✅ Registrada con foreign_user_id");
      try {
        const data = JSON.parse(responseText);
        if (data.data && data.data.foreign_user_id) {
          console.log(`   👤 foreign_user_id: ${data.data.foreign_user_id}`);
        }
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
console.log("✅ Proceso completado");
console.log("\n🔍 Verifica en el dashboard que ahora aparece el foreign_user_id");
