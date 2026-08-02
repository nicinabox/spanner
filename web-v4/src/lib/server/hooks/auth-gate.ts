import { redirect, type Handle } from '@sveltejs/kit';
import { getSession, setSession } from '$lib/utils/session';

export const createAuthGate =
	(isProtected: (url: string) => boolean): Handle =>
	async ({ event, resolve }) => {
		const session = await getSession(event.cookies);

		if (!session?.authToken && isProtected(event.request.url)) {
			throw redirect(307, '/');
		}

		if (session?.authToken) {
			await setSession(event.cookies, session);
		}

		event.locals.session = session;

		return resolve(event);
	};
