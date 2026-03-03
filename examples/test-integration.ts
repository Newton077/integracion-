/**
 * Script de prueba para verificar la integración con Wavy Node
 * 
 * Este script simula las llamadas que Wavy Node haría a tu servidor
 * para verificar que todo funciona correctamente.
 */

import { createHmac } from "crypto";

const BASE_URL = "http://localhost:3000";
const SECRET = process.env.SECRET || "place-here-your-secret";

/**
 * Genera una firma HMAC-SHA256 para autenticar la solicitud
 */
function generateSignature(
  method: string,
  path: string,
  body: any,
  timestamp: number,
  secret: string
): string {
  const bodyStr = Object.keys(body).length > 0 ? JSON.stringify(body) : "";
  const message = `${method}${path}${bodyStr}${timestamp}`;
  return createHmac("sha256", secret).update(message).digest("hex");
}

/**
 * Prueba el endpoint GET /users/{userId}
 */
async function testGetUser(userId: string) {
  console.log("\n🧪 Probando GET /users/{userId}...");

  const path = `/users/${userId}`;
  const timestamp = Date.now();
  const signature = generateSignature("GET", path, {}, timestamp, SECRET);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "x-wavynode-hmac": signature,
        "x-wavynode-timestamp": timestamp.toString(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log("✅ Usuario obtenido exitosamente:");
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

/**
 * Prueba el endpoint POST /webhook con una notificación
 */
async function testWebhookNotification() {
  console.log("\n🧪 Probando POST /webhook (notificación)...");

  const path = "/webhook";
  const timestamp = Date.now();

  const body = {
    type: "notification",
    data: {
      id: 1,
      projectId: 1,
      chainId: 42161,
      address: {
        id: 543,
        userId: "user-123",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        description: "Wallet de prueba",
      },
      txHash: "0xabc123def456...",
      timestamp: new Date().toISOString(),
      amount: {
        value: 1000000000000000000,
        usd: 3000,
      },
      token: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        address: null,
      },
      inflictedLaws: [
        {
          name: "Límite de transacción excedido",
          description: "La transacción excede el límite permitido sin KYC completo",
          source: "Regulación Fintech México",
          risk: "warn",
          country: "mexico",
          countryCode: "MX",
        },
      ],
    },
  };

  const signature = generateSignature("POST", path, body, timestamp, SECRET);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wavynode-hmac": signature,
        "x-wavynode-timestamp": timestamp.toString(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log("✅ Notificación procesada exitosamente:");
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

/**
 * Prueba el endpoint POST /webhook con un error
 */
async function testWebhookError() {
  console.log("\n🧪 Probando POST /webhook (error)...");

  const path = "/webhook";
  const timestamp = Date.now();

  const body = {
    type: "error",
    data: "Error de prueba: No se pudo procesar la transacción",
  };

  const signature = generateSignature("POST", path, body, timestamp, SECRET);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wavynode-hmac": signature,
        "x-wavynode-timestamp": timestamp.toString(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log("✅ Error procesado exitosamente:");
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

/**
 * Ejecuta todas las pruebas
 */
async function runAllTests() {
  console.log("🚀 Iniciando pruebas de integración con Wavy Node");
  console.log(`📍 URL base: ${BASE_URL}`);
  console.log(`🔑 Secret configurado: ${SECRET.substring(0, 10)}...`);

  try {
    await testGetUser("user-123");
    await testWebhookNotification();
    await testWebhookError();

    console.log("\n✅ Todas las pruebas pasaron exitosamente!");
  } catch (error) {
    console.error("\n❌ Algunas pruebas fallaron");
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (import.meta.main) {
  runAllTests();
}

export { testGetUser, testWebhookNotification, testWebhookError };
