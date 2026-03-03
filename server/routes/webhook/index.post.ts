import { IWebhookBody } from "@wavynode/utils";
import { createError, eventHandler, readBody, setResponseStatus } from "h3";
import { saveNotification, sendUserAlert } from "../../utils/database";

/**
 * Endpoint para recibir notificaciones de Wavy Node
 * POST /webhook
 * 
 * Wavy Node envía notificaciones en tiempo real sobre:
 * - Transacciones sospechosas
 * - Violaciones regulatorias
 * - Interacciones con wallets en lista negra
 * - Errores del sistema
 */
export default eventHandler(async e => {
	const body = await readBody<IWebhookBody>(e)
	if (!body) throw createError({ status: 400, message: 'No body provided' })

	switch (body.type) {
		case 'notification':
			// Manejar notificaciones de transacciones
			const notification = body.data;
			console.log('Nueva notificación recibida:', {
				txHash: notification.txHash,
				userId: notification.address.userId,
				amount: notification.amount.usd,
				violations: notification.inflictedLaws.length
			});

			// Guardar notificación en base de datos
			await saveNotification(notification);

			// Si hay violaciones regulatorias, enviar alerta al usuario
			if (notification.inflictedLaws.length > 0) {
				console.warn(`⚠️ Violaciones detectadas para usuario ${notification.address.userId}:`, 
					notification.inflictedLaws.map(law => `${law.name} (${law.risk})`).join(', ')
				);
				await sendUserAlert(notification.address.userId, notification);
			}
			break;

		case 'error':
			// Manejar errores enviados por Wavy Node
			console.error(`${new Date().toISOString()}: [Wavy Node Error] ${body.data}`);
			// TODO: Implementar sistema de alertas para errores críticos
			break;

		default:
			throw createError({ status: 400, message: 'Invalid body format' })
	}

	setResponseStatus(e, 200)
	return { success: true, message: "Notification processed" }
})
