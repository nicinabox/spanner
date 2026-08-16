import type { Handle } from '@sveltejs/kit';
import { getSession, setSession } from '$lib/utils/session';

export const createSessionHandler =
	(): Handle =>
	async ({ event, resolve }) => {
		const session = await getSession(event.cookies);

		if (session?.authToken) {
			await setSession(event.cookies, session);
		}

		event.locals.session = session;

		return resolve(event);
	};
