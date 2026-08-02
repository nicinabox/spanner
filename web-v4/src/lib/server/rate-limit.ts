// Per-IP in-memory token-bucket rate limiter.
// Singleton across all requests; safe for SvelteKit's single-process Node adapter.

import type { RequestEvent } from '@sveltejs/kit';

export interface RateLimitOptions {
	/** Max requests per window. */
	limit: number;
	/** Window length in milliseconds. Tokens refill at `limit / windowMs` per ms. */
	windowMs: number;
	/** Prune idle buckets every `windowMs` ms. Pass 0 to disable. */
	cleanupIntervalMs?: number;
}

export interface RateLimitResult {
	limited: boolean;
	remaining: number;
	retryAfterSec: number;
}

interface Bucket {
	tokens: number;
	updatedAt: number;
}

const createLimiter = (opts: RateLimitOptions) => {
	const { limit, windowMs } = opts;
	const refillPerMs = limit / windowMs;
	const buckets = new Map<string, Bucket>();

	if (opts.cleanupIntervalMs !== 0) {
		const interval = setInterval(() => {
			const now = Date.now();
			for (const [key, bucket] of buckets) {
				if (now - bucket.updatedAt > windowMs) buckets.delete(key);
			}
		}, opts.cleanupIntervalMs ?? windowMs);
		interval.unref();
	}

	const check = (ip: string): RateLimitResult => {
		const now = Date.now();
		const bucket = buckets.get(ip);
		if (!bucket) {
			buckets.set(ip, { tokens: limit - 1, updatedAt: now });
			return { limited: false, remaining: limit - 1, retryAfterSec: 0 };
		}
		const elapsed = now - bucket.updatedAt;
		const refilled = Math.min(limit, bucket.tokens + elapsed * refillPerMs);
		if (refilled < 1) {
			bucket.tokens = refilled;
			bucket.updatedAt = now;
			const retryAfterSec = Math.max(1, Math.ceil((1 - refilled) / refillPerMs / 1000));
			return { limited: true, remaining: 0, retryAfterSec };
		}
		bucket.tokens = refilled - 1;
		bucket.updatedAt = now;
		return { limited: false, remaining: Math.floor(refilled - 1), retryAfterSec: 0 };
	};

	return { check, buckets };
};

/**
 * Extract the client IP from a SvelteKit RequestEvent. Trusts
 * `X-Forwarded-For` first (first hop), falls back to `event.getClientAddress()`.
 */
export const getClientIp = (event: RequestEvent): string => {
	const forwarded = event.request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0]!.trim();
	return event.getClientAddress?.() ?? 'unknown';
};

/**
 * Create a per-key rate limiter. Returns `{ check }` which returns whether a
 * key is over its limit. Module-scope factory — call once, reuse the result.
 */
export const createRateLimiter = createLimiter;
