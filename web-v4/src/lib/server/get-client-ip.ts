import type { RequestEvent } from '@sveltejs/kit';

export const getClientIp = (event: RequestEvent): string => {
	const forwarded = event.request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0]!.trim();
	return event.getClientAddress?.() ?? 'unknown';
};
