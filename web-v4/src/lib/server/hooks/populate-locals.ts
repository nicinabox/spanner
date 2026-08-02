import type { Handle } from '@sveltejs/kit';
import { isMobileUserAgent } from '$lib/utils/device';

export const createPopulateLocals =
	(): Handle =>
	async ({ event, resolve }) => {
		const session = event.locals.session;
		event.locals.webUrl = event.url.origin;
		event.locals.authToken = session?.authToken;
		event.locals.isMobile = isMobileUserAgent(event.request.headers.get('user-agent') ?? '');
		return resolve(event);
	};
