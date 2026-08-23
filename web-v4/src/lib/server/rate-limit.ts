// Per-key token-bucket rate limiter with optional hard limits.
// Singleton across all requests; safe for SvelteKit's single-process Node adapter.

export interface RateLimitOptions {
	/** Max requests per window. */
	limit: number;
	/** Window in ms; tokens refill at `limit / windowMs` per ms. */
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
	expiresAt?: number;
}

const createLimiter = (opts: RateLimitOptions) => {
	const { limit: max, windowMs } = opts;
	const refillPerMs = max / windowMs;
	const buckets = new Map<string, Bucket>();

	if (opts.cleanupIntervalMs !== 0) {
		const interval = setInterval(() => {
			const now = Date.now();
			for (const [key, bucket] of buckets) {
				if (now - (bucket.expiresAt ?? bucket.updatedAt) > windowMs) buckets.delete(key);
			}
		}, opts.cleanupIntervalMs ?? windowMs);
		interval.unref();
	}

	const check = (ip: string): RateLimitResult => {
		const now = Date.now();
		const bucket = buckets.get(ip);

		if (bucket?.expiresAt && now < bucket.expiresAt) {
			const retryAfterSec = Math.max(1, Math.ceil((bucket.expiresAt - now) / 1000));
			return { limited: true, remaining: 0, retryAfterSec };
		}

		if (!bucket) {
			buckets.set(ip, { tokens: max - 1, updatedAt: now });
			return { limited: false, remaining: max - 1, retryAfterSec: 0 };
		}

		const elapsed = now - bucket.updatedAt;
		const refilled = Math.min(max, bucket.tokens + elapsed * refillPerMs);
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

	const limit = (ip: string, durationMs: number) => {
		const existing = buckets.get(ip) ?? { tokens: 0, updatedAt: Date.now() };
		existing.expiresAt = Date.now() + durationMs;
		buckets.set(ip, existing);
	};

	const isLimited = (ip: string): boolean => {
		const bucket = buckets.get(ip);
		return !!bucket?.expiresAt && Date.now() < bucket.expiresAt;
	};

	return { check, limit, isLimited, buckets };
};

/**
 * Create a per-key rate limiter: `check` consumes a token and reports whether
 * the key is over its limit; `limit` locks a key out until `expiresAt`;
 * `isLimited` peeks without consuming. Call once, reuse the result.
 */
export const createRateLimiter = createLimiter;
