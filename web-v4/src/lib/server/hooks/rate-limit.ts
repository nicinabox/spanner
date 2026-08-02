import type { Handle } from '@sveltejs/kit';
import { createRateLimiter } from '$lib/server/rate-limit';
import { getClientIp } from '$lib/server/get-client-ip';

export interface RateLimitHandleOptions {
	limit: number;
	windowMs: number;
}

export const createRateLimit = (opts: RateLimitHandleOptions): Handle => {
	const limiter = createRateLimiter(opts);
	return async ({ event, resolve }) => {
		const result = limiter.check(getClientIp(event));
		if (result.limited) {
			return new Response(null, {
				status: 429,
				headers: { 'Retry-After': String(result.retryAfterSec) },
			});
		}
		return resolve(event);
	};
};
