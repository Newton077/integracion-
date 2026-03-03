/**
 * Ejemplo de cómo registrar una dirección de wallet en Wavy Node
 * 
 * Este script muestra cómo usar la API de Wavy Node para:
 * 1. Registrar una nueva dirección de wallet para monitoreo
 * 2. Vincular la dirección con un usuario en tu sistema
 */

const WAVYNODE_API_URL = "https://api.wavynode.com";
const PROJECT_ID = "tu-project-id"; // Obtén esto de tu dashboard de Wavy Node
const API_KEY = "tu-api-key"; // Obtén esto de tu dashboard de Wavy Node

interface RegisterAddressRequest {
  address: string;
  foreign_user_id: string;
  description?: string;
}

interface RegisterAddressResponse {
  id: number;
  address: string;
  userId: string;
  description: string;
  projectId: number;
  createdAt: string;
}

/**
 * Registra una dirección de wallet en Wavy Node
 */
async function registerAddress(
  walletAddress: string,
  userId: string,
  description?: string
): Promise<RegisterAddressResponse> {
  const url = `${WAVYNODE_API_URL}/projects/${PROJECT_ID}/addresses`;

  const body: RegisterAddressRequest = {
    address: walletAddress,
    foreign_user_id: userId,
    description: description || `Wallet de usuario ${userId}`,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `ApiKey ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error registrando dirección: ${response.status} - ${error}`);
  }

  return await response.json();
}

/**
 * Ejemplo de uso
 */
async function main() {
  try {
    // Ejemplo: Registrar la wallet de un usuario
    const result = await registerAddress(
      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", // Dirección de wallet
      "user-123", // ID del usuario en tu sistema
      "Wallet principal del usuario" // Descripción opcional
    );

    console.log("✅ Dirección registrada exitosamente:");
    console.log(JSON.stringify(result, null, 2));
    console.log("\nWavy Node ahora monitoreará esta dirección y enviará notificaciones a tu webhook.");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Ejecutar si se llama directamente
if (import.meta.main) {
  main();
}

export { registerAddress };
