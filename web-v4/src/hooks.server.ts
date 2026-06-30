import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { getSession, setSession, clearSession } from '$lib/utils/session';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { HTTPError } from '$lib/data/client';

const protectedRoutes = ['^/vehicles', '^/settings'];

const isProtected = (url: string) => {
	const { pathname } = new URL(url);
	return protectedRoutes.some((pattern) => {
		return new RegExp(pattern, 'i').test(pathname);
	});
};

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	const session = await getSession(event.cookies);

	if (!session?.authToken && isProtected(event.request.url)) {
		throw redirect(307, '/');
	}

	if (session?.authToken) {
		await setSession(event.cookies, session);
	}

	event.locals.session = session;
	event.locals.authToken = session?.authToken;

	const prefsCookie = event.cookies.get('prefs');
	const prefs = Object.fromEntries(new URLSearchParams(prefsCookie ?? ''));
	const theme = prefs.theme;

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			if (theme && theme !== 'auto') {
				return html.replace('<html', `<html data-theme="${theme}"`);
			}
			return html;
		},
	});
});

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	if (error instanceof HTTPError && error.status === 401) {
		throw redirect(307, '/');
	}
	return Sentry.handleErrorWithSentry()({ error, event, status, message });
};
