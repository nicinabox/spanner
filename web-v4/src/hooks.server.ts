import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { HTTPError } from '$lib/data/client';
import { createRateLimit } from '$lib/server/hooks/rate-limit';
import { createSessionHandler } from '$lib/server/hooks/session-handler';
import { createPopulateLocals } from '$lib/server/hooks/populate-locals';
import { createThemeTransform } from '$lib/server/hooks/theme-transform';
import { getClientIp } from '$lib/server/get-client-ip';
import { logger } from '$lib/server/logger';

export const handle: Handle = sequence(
    createRateLimit({ limit: 60, windowMs: 60_000 }),
    createSessionHandler(),
    createPopulateLocals(),
    createThemeTransform()
);

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	logger[status >= 500 ? 'error' : 'warn'](message, {
		ip: getClientIp(event),
		method: event.request.method,
		path: event.url.pathname,
		status,
		error,
    });

	if (error instanceof HTTPError && error.status === 401) {
		throw redirect(307, '/');
	}
};
