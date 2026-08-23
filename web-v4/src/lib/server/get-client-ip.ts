import type { RequestEvent } from '@sveltejs/kit';

/**
 * Best-effort client IP. Returns `undefined` when no real address is
 * available — e.g. build-time prerendering, where there is no HTTP client.
 */
export const getClientIp = (event: RequestEvent): string | undefined => {
	const forwarded = event.request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0]!.trim();
	try {
		return event.getClientAddress?.() || undefined;
	} catch {
		return undefined;
	}
};
