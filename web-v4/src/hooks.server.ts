import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$app/env/public';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { HTTPError } from '$lib/data/client';
import { createRateLimit } from '$lib/server/hooks/rate-limit';
import { createAuthGate } from '$lib/server/hooks/auth-gate';
import { createPopulateLocals } from '$lib/server/hooks/populate-locals';
import { createThemeTransform } from '$lib/server/hooks/theme-transform';
import { getClientIp } from '$lib/server/get-client-ip';

if (PUBLIC_SENTRY_DSN) {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 1.0,
	});
}

const protectedRoutes = ['/vehicles/*?', '/settings/*?'];

const isProtected = (url: string) => {
	return protectedRoutes.some((pattern) => new URLPattern({ pathname: pattern }).test(url));
};

const rateLimit = createRateLimit({ limit: 60, windowMs: 60_000 });
const authGate = createAuthGate(isProtected);
const populateLocals = createPopulateLocals();
const themeTransform = createThemeTransform();

export const handle: Handle = sequence(
	Sentry.sentryHandle(),
	rateLimit,
	authGate,
	populateLocals,
	themeTransform,
);

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	if (error instanceof HTTPError && error.status === 401) {
		throw redirect(307, '/');
	}
	const level = status >= 500 ? 'error' : 'warn';
	const entry = {
		ts: new Date().toISOString(),
		level,
		msg: error instanceof Error ? error.message : String(error),
		ip: getClientIp(event),
		method: event.request.method,
		path: event.url.pathname,
		status,
		error,
	};
	console[level === 'error' ? 'error' : 'warn'](JSON.stringify(entry));
	if (status >= 500) {
		return Sentry.handleErrorWithSentry()({ error, event, status, message });
	}
};
