import { eventHandler } from "h3";

/**
 * Root endpoint - Información sobre la integración
 */
export default eventHandler(() => {
  return {
    name: "Wavy Node Integration",
    version: "1.0.0",
    status: "active",
    endpoints: {
      health: {
        method: "GET",
        path: "/health",
        description: "Health check endpoint"
      },
      users: {
        method: "GET",
        path: "/users/{userId}",
        description: "Get user data by ID",
        example: "/users/user-123"
      },
      webhook: {
        method: "POST",
        path: "/webhook",
        description: "Receive notifications from Wavy Node"
      }
    },
    documentation: "https://docs.wavynode.com"
  };
});
