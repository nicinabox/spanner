import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$app/env/public';
import { isMobileUserAgent } from '$lib/utils/device';
import { getSession, setSession, clearSession } from '$lib/utils/session';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { HTTPError } from '$lib/data/client';
import { createRateLimiter, getClientIp } from '$lib/server/rate-limit';

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

const rateLimiter = createRateLimiter({ limit: 60, windowMs: 60_000 });

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	const result = rateLimiter.check(getClientIp(event));
	if (result.limited) {
		return new Response(null, {
			status: 429,
			headers: { 'Retry-After': String(result.retryAfterSec) },
		});
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
