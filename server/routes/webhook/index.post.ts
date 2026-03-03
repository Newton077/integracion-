import { IWebhookBody } from "@wavynode/utils";
import { createError, eventHandler, readBody, setResponseStatus } from "h3";

// receive notifications from WavyNode
export default eventHandler(async e => {
	const body = await readBody<IWebhookBody>(e)
	if (!body) throw createError({ status: 400, message: 'No body provided' })

	switch (body.type) {
		case 'notification':
			// handle notifications from WavyNode
			console.log({ payload: body.data })
			break;

		case 'error':
			// handle errors sent from WavyNode
			console.error(`${new Date().toISOString()}: [Error] ${body.data}`)
			break;

		default:
			throw createError({ status: 400, message: 'Invalid body format' })
	}

	setResponseStatus(e, 200)
	return "Ok"
})
