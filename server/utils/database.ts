import { IUserData } from "@wavynode/utils";
import { createError } from "h3";

/**
 * Mapeo de IDs de direcciones de Wavy Node a usuarios en tu sistema
 * Actualiza este mapeo cuando registres nuevas wallets
 */
const ADDRESS_ID_TO_USER: Record<number, string> = {
  988: "user-123", // 0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6
  989: "user-123", // 0x7812D0936a6b2df877506A6101281759e05d0D61
  990: "user-123", // 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
};

/**
 * Ejemplo de función para obtener datos de usuario desde tu base de datos
 * 
 * @param userIdOrAddressId - Puede ser el user ID (ej: "user-123") o el address ID de Wavy Node (ej: 988)
 */
export async function getUserFromDatabase(userIdOrAddressId: string): Promise<IUserData> {
  // Intentar convertir a número para ver si es un address ID
  const addressId = parseInt(userIdOrAddressId);
  let userId = userIdOrAddressId;
  
  // Si es un número, buscar el user ID en el mapeo
  if (!isNaN(addressId) && ADDRESS_ID_TO_USER[addressId]) {
    userId = ADDRESS_ID_TO_USER[addressId];
    console.log(`📍 Mapeando address ID ${addressId} → user ID ${userId}`);
  }

  // TODO: Implementar conexión real a tu base de datos
  // Ejemplo con Prisma:
  // const user = await prisma.user.findUnique({
  //   where: { id: userId },
  //   include: { address: true, mexicanData: true }
  // });

  // Por ahora, retornamos datos mock
  // IMPORTANTE: Elimina esto en producción
  return getMockUser(userId);
}

/**
 * Función mock para desarrollo
 * Eliminar en producción
 */
function getMockUser(_userId: string): IUserData {
  return {
    givenName: "Maria Guadalupe",
    maternalSurname: "Sánchez",
    paternalSurname: "Rodríguez",
    birthdate: "1992-05-15",
    nationality: "MX",
    phoneNumber: {
      countryCode: "+52",
      phoneNumber: 5512345678,
    },
    email: "maria.guadalupe@example.com",
    address: {
      country: "MX",
      region: "CDMX",
      city: "Ciudad de México",
      street: "Avenida Insurgentes Sur",
      colonia: "Condesa",
      exteriorNumber: "123",
      interiorNumber: "4B",
      postalCode: "06100",
    },
    mexico: {
      rfc: "ROSM920515XXX",
      curp: "ROSM920515MDFRXXXX",
      actividadEconomica: 612012,
      cuentaRelacionada: "1234567890",
      clabeInterbancaria: undefined,
      monedaCuentaRelacionada: 1,
      documentoIdentificacion: {
        tipoIdentificacion: 1,
        numeroIdentificacion: "IDMEX12345678",
      },
    },
  };
}

/**
 * Ejemplo de función para guardar notificaciones en tu base de datos
 */
export async function saveNotification(notification: any): Promise<void> {
  // TODO: Implementar guardado en base de datos
  // Ejemplo con Prisma:
  // await prisma.transaction.create({
  //   data: {
  //     userId: notification.address.userId,
  //     txHash: notification.txHash,
  //     amountUsd: notification.amount.usd,
  //     timestamp: new Date(notification.timestamp),
  //     chainId: notification.chainId,
  //     hasViolations: notification.inflictedLaws.length > 0,
  //     violations: JSON.stringify(notification.inflictedLaws)
  //   }
  // });

  console.log("Notificación guardada:", notification.txHash);
}

/**
 * Ejemplo de función para enviar alertas a usuarios
 */
export async function sendUserAlert(userId: string, notification: any): Promise<void> {
  // TODO: Implementar sistema de alertas (email, SMS, push notifications, etc.)
  // Ejemplo:
  // await sendEmail({
  //   to: user.email,
  //   subject: 'Alerta de Cumplimiento Normativo',
  //   body: `Se detectó actividad sospechosa en tu wallet...`
  // });

  console.log(`Alerta enviada al usuario ${userId}`);
}
