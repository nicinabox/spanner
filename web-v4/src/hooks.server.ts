import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { HTTPError } from '#lib/data/client.ts';
import { createSessionHandler } from '#lib/server/hooks/session-handler.ts';
import { createPopulateLocals } from '#lib/server/hooks/populate-locals.ts';
import { createThemeTransform } from '#lib/server/hooks/theme-transform.ts';
import { getClientIp } from '#lib/server/get-client-ip.ts';
import { logger } from '#lib/server/logger.ts';

export const handle: Handle = sequence(
	createSessionHandler(),
	createPopulateLocals(),
	createThemeTransform(),
);

export const handleError: HandleServerError = ({ error, event }) => {
	const status = error instanceof Error && 'status' in error ? (error.status as number) : 500;
	logger[status >= 500 ? 'error' : 'warn'](error, {
		ip: getClientIp(event),
		method: event.request.method,
		path: event.url.pathname,
		status,
	});

	if (error instanceof HTTPError && error.status === 401) {
		throw redirect(307, '/');
	}
};
