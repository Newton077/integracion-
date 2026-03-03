#!/usr/bin/env bun

/**
 * Script para actualizar el foreign_user_id de las wallets ya registradas
 */

const API_KEY = "wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV";
const PROJECT_ID = "1";
const USER_ID = "user-123";

// IDs de las direcciones que vimos en la imagen
const addressIds = [285, 142, 181, 172, 213, 254, 244, 170, 235, 246, 212, 139, 164, 185, 265, 151, 253, 325, 135, 134, 273, 297, 169];

// Las 3 direcciones que acabamos de registrar
const targetAddresses = [
  "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6",
  "0x7812D0936a6b2df877506A6101281759e05d0D61",
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
];

console.log("🔍 Buscando las direcciones registradas...\n");

async function getAddresses() {
  const url = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": `ApiKey ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }

  return await response.json();
}

async function updateAddress(addressId: number, userId: string) {
  const url = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses/${addressId}`;
  
  const body = {
    foreign_user_id: userId
  };

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `ApiKey ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const responseText = await response.text();

  return {
    success: response.ok,
    status: response.status,
    data: responseText
  };
}

try {
  const addresses = await getAddresses();
  
  console.log(`📋 Total de direcciones: ${addresses.length}\n`);
  
  // Buscar nuestras 3 direcciones
  const ourAddresses = addresses.filter((addr: any) => 
    targetAddresses.some(target => 
      addr.address.toLowerCase() === target.toLowerCase()
    )
  );

  console.log(`🎯 Direcciones encontradas: ${ourAddresses.length}\n`);

  if (ourAddresses.length === 0) {
    console.log("❌ No se encontraron las direcciones registradas");
    process.exit(1);
  }

  // Actualizar cada dirección
  for (const addr of ourAddresses) {
    console.log(`📤 Actualizando: ${addr.address}`);
    console.log(`   ID: ${addr.id}`);
    
    const result = await updateAddress(addr.id, USER_ID);
    
    if (result.success) {
      console.log(`   ✅ foreign_user_id actualizado a: ${USER_ID}`);
    } else {
      console.log(`   ❌ Error (${result.status}):`, result.data);
    }
    console.log();
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("═".repeat(70));
  console.log("✅ Proceso completado");
  console.log("\n🔍 Verifica en el dashboard que ahora aparece el foreign_user_id");

} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
