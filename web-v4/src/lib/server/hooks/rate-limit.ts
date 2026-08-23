import type { Handle } from '@sveltejs/kit';
import { createRateLimiter } from '$lib/server/rate-limit';
import { getClientIp } from '$lib/server/get-client-ip';

export interface RateLimitHandleOptions {
	/** Max requests (or failures) per window. */
	limit: number;
	/** Window in ms; tokens refill at `limit / windowMs` per ms. */
	windowMs: number;
	/** Count failing responses (>=400, excluding 429) instead of every request. */
	mode?: 'error';
	/** Lock duration (ms) when `mode` is `error`. */
	limitMs?: number;
}

const limited = (retryAfterSec: number) =>
	new Response(null, {
		status: 429,
		headers: { 'Retry-After': String(retryAfterSec) },
	});

/**
 * Per-key rate limiter. By default counts every request and returns 429 once
 * exhausted (before routing). With `mode: 'error'`, counts failed responses
 * and locks the key for `limitMs` on a burst — matching scanners (mostly
 * 404s) while leaving legit traffic (mostly 200s) untouched.
 *
 * Keys default to the client IP. Reuse one instance per config.
 */
export const createRateLimit = (opts: RateLimitHandleOptions): Handle => {
	const limiter = createRateLimiter(opts);
	const errorMode = opts.mode === 'error';
	const limitMs = errorMode ? opts.limitMs ?? 0 : 0;

	return async ({ event, resolve }) => {
		const key = getClientIp(event);

		// No real client (e.g. build-time prerendering) — never rate-limit.
		if (!key) {
			return resolve(event);
		}

		if (limiter.isLimited(key)) {
			return limited(limitMs);
		}

		if (!errorMode) {
			const result = limiter.check(key);
			if (result.limited) {
				return limited(result.retryAfterSec);
			}
			return resolve(event);
		}

		const response = await resolve(event);
		if (response.status >= 400 && response.status !== 429) {
			if (limiter.check(key).limited) {
				limiter.limit(key, limitMs);
			}
		}
		return response;
	};
};
