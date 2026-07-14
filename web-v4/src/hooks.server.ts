import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$app/env/public';
import { isMobileUserAgent } from '$lib/utils/device';
import { getSession, setSession, clearSession } from '$lib/utils/session';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { HTTPError } from '$lib/data/client';

if (PUBLIC_SENTRY_DSN) {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 1.0,
	});
}

const protectedRoutes = ['^/vehicles', '^/settings'];

const isProtected = (url: string) => {
	const { pathname } = new URL(url);
	return protectedRoutes.some((pattern) => {
		return new RegExp(pattern, 'i').test(pathname);
	});
};

const probePattern = /\.(php|asp|aspx|jsp)$|^\/(wp-|wordpress|administrator|vendor\/|composer|\.env|\.git|shell|cgi-bin)/i;

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	// Silently reject vulnerability scanner probes
	if (probePattern.test(event.url.pathname)) {
		return new Response(null, { status: 404 });
	}

	const session = await getSession(event.cookies);

	if (!session?.authToken && isProtected(event.request.url)) {
		throw redirect(307, '/');
	}

	if (session?.authToken) {
		await setSession(event.cookies, session);
	}

	event.locals.session = session;
	event.locals.webUrl = event.url.origin;
	event.locals.authToken = session?.authToken;
	event.locals.isMobile = isMobileUserAgent(event.request.headers.get('user-agent') ?? '');

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
