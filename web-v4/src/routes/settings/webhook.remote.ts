import { command, getRequestEvent } from '$app/server';
import { getSession } from '$lib/utils/session';
import { request } from '$lib/data/server';

export const testWebhook = command(async () => {
	const event = getRequestEvent();
	const session = await getSession(event.cookies);

	await request('/webhooks/test', {
		method: 'POST',
		authToken: session?.authToken,
	});
});
