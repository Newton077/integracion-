#!/usr/bin/env bun

const API_KEY = "wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV";
const PROJECT_ID = "1";
const USER_ID = "user-123";

// IDs de las 3 direcciones que acabamos de registrar
const addressesToUpdate = [
  { id: 978, address: "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6" },
  { id: 979, address: "0x7812D0936a6b2df877506A6101281759e05d0D61" },
  { id: 980, address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" }
];

console.log("🔧 Actualizando foreign_user_id de las wallets...\n");
console.log("👤 Usuario:", USER_ID);
console.log("═".repeat(70));

for (const addr of addressesToUpdate) {
  console.log(`\n📤 Actualizando ID ${addr.id}: ${addr.address}`);
  
  const url = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses/${addr.id}`;
  
  const body = {
    foreign_user_id: USER_ID
  };

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `ApiKey ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    
    if (response.ok) {
      console.log("   ✅ foreign_user_id actualizado correctamente");
      try {
        const data = JSON.parse(responseText);
        console.log("   📋 Respuesta:", JSON.stringify(data, null, 2));
      } catch {
        console.log("   📋 Respuesta:", responseText);
      }
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
console.log("📊 Las 3 wallets ahora están vinculadas al usuario: " + USER_ID);
