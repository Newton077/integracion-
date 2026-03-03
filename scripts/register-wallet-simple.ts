#!/usr/bin/env bun

const API_KEY = "wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV";
const PROJECT_ID = "1";
const WALLET_ADDRESS = "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6";
const USER_ID = "user-123";

console.log("🚀 Registrando wallet en Wavy Node...\n");

const url = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses`;

const body = {
  address: WALLET_ADDRESS,
  foreign_user_id: USER_ID,
  description: "Wallet principal del usuario"
};

console.log("📤 Datos a enviar:");
console.log(JSON.stringify(body, null, 2));
console.log("\n📍 URL:", url);

try {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `ApiKey ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  console.log("\n📥 Respuesta HTTP:", response.status, response.statusText);

  const responseText = await response.text();
  
  if (!response.ok) {
    console.error("\n❌ Error al registrar:");
    console.error(responseText);
  } else {
    console.log("\n✅ ¡Wallet registrada exitosamente!");
    console.log("\n📋 Respuesta:");
    try {
      const data = JSON.parse(responseText);
      console.log(JSON.stringify(data, null, 2));
    } catch {
      console.log(responseText);
    }
    
    console.log("\n🎉 La wallet ahora está siendo monitoreada por Wavy Node");
    console.log("📨 Recibirás notificaciones en tu endpoint /webhook");
  }
} catch (error) {
  console.error("\n❌ Error:", error);
}
