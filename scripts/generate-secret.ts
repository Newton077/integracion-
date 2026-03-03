/**
 * Script para generar un SECRET temporal para desarrollo
 * 
 * IMPORTANTE: En producción, DEBES usar el SECRET proporcionado
 * por Wavy Node en tu dashboard.
 */

import { randomBytes } from "crypto";

function generateSecret(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

console.log("🔐 Generando SECRET temporal para desarrollo...\n");
console.log("⚠️  IMPORTANTE: Este es solo para desarrollo local.");
console.log("⚠️  En producción, usa el SECRET de tu dashboard de Wavy Node.\n");

const secret = generateSecret();

console.log("Tu SECRET temporal:");
console.log("─".repeat(70));
console.log(secret);
console.log("─".repeat(70));

console.log("\n📝 Agrega esto a tu archivo .env:");
console.log(`SECRET="${secret}"`);

console.log("\n💡 Para obtener tu SECRET real:");
console.log("   1. Ve a https://dashboard.wavynode.com");
console.log("   2. Navega a Project Settings");
console.log("   3. Busca 'Integration Secret' o 'Webhook Secret'");
console.log("   4. Copia ese valor y reemplázalo en tu .env");
