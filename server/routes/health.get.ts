import { eventHandler } from "h3";

/**
 * Health check endpoint - no requiere autenticación
 * Útil para verificar que el servidor está activo
 */
export default eventHandler(() => {
  return {
    status: "ok",
    message: "Wavy Node Integration Server is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      users: "GET /users/{userId}",
      webhook: "POST /webhook"
    }
  };
});
