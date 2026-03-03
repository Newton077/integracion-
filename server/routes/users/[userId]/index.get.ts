import { createError, eventHandler, getRouterParam } from "h3";
import { getUserFromDatabase } from "../../../utils/database";

/**
 * Endpoint para que Wavy Node obtenga datos de usuario
 * GET /users/{foreign_user_id}
 * 
 * El foreign_user_id es el ID del usuario en tu sistema que proporcionaste
 * al registrar la dirección de wallet en Wavy Node
 */
export default eventHandler(async (e) => {
  const userId = getRouterParam(e, "userId");

  if (!userId) {
    throw createError({
      status: 400,
      statusMessage: "Bad Request",
      message: "User ID is required"
    });
  }

  try {
    const user = await getUserFromDatabase(userId);
    return user;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw createError({
      status: 404,
      statusMessage: "Not Found",
      message: "User not found"
    });
  }
});
