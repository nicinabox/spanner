import { command, getRequestEvent } from '$app/server';
import { getAuthToken } from '$lib/utils/session';
import { request } from '$lib/data/server';

export const testWebhook = command(async () => {
	const event = getRequestEvent();
	const authToken = await getAuthToken(event.cookies);

	await request('/webhooks/test', {
		method: 'POST',
		authToken: authToken,
	});
});
