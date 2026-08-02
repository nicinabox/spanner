import { describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { createRateLimiter, getClientIp } from './rate-limit';

const makeEvent = (overrides: Partial<RequestEvent> = {}): RequestEvent =>
	({
		request: new Request('http://localhost/'),
		...overrides,
	}) as unknown as RequestEvent;

describe('createRateLimiter', () => {
	it('allows the first request from a new IP', () => {
		const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
		const r = limiter.check('1.1.1.1');
		expect(r.limited).toBe(false);
		expect(r.remaining).toBe(2);
	});

	it('decrements remaining tokens per request', () => {
		const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
		expect(limiter.check('1.1.1.1').remaining).toBe(2);
		expect(limiter.check('1.1.1.1').remaining).toBe(1);
		expect(limiter.check('1.1.1.1').remaining).toBe(0);
	});

	it('returns limited=true once tokens are exhausted', () => {
		const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
		limiter.check('1.1.1.1');
		limiter.check('1.1.1.1');
		const r = limiter.check('1.1.1.1');
		expect(r.limited).toBe(true);
		expect(r.remaining).toBe(0);
		expect(r.retryAfterSec).toBeGreaterThanOrEqual(1);
	});

	it('tracks buckets per IP independently', () => {
		const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
		expect(limiter.check('1.1.1.1').limited).toBe(false);
		expect(limiter.check('1.1.1.1').limited).toBe(true);
		// Different IP gets a fresh bucket
		expect(limiter.check('2.2.2.2').limited).toBe(false);
	});

	it('refills tokens over time', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
		try {
			const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
			limiter.check('1.1.1.1');
			limiter.check('1.1.1.1');
			expect(limiter.check('1.1.1.1').limited).toBe(true);

			// Advance halfway through the window — partial refill
			vi.advanceTimersByTime(500);
			const partial = limiter.check('1.1.1.1');
			expect(partial.limited).toBe(false);
			expect(partial.remaining).toBe(0);

			// Advance past the window — fully refilled
			vi.advanceTimersByTime(1000);
			expect(limiter.check('1.1.1.1').limited).toBe(false);
			expect(limiter.check('1.1.1.1').limited).toBe(false);
			expect(limiter.check('1.1.1.1').limited).toBe(true);
		} finally {
			vi.useRealTimers();
		}
	});

	it('caps refill at the limit when window has fully elapsed', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
		try {
			const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
			limiter.check('1.1.1.1');
			limiter.check('1.1.1.1');
			limiter.check('1.1.1.1');
			expect(limiter.check('1.1.1.1').limited).toBe(true);

			// Advance past the window — bucket is fully refilled to the limit
			vi.advanceTimersByTime(1500);
			// Can serve the full limit again
			expect(limiter.check('1.1.1.1').limited).toBe(false);
			expect(limiter.check('1.1.1.1').limited).toBe(false);
			expect(limiter.check('1.1.1.1').limited).toBe(false);
			expect(limiter.check('1.1.1.1').limited).toBe(true);
		} finally {
			vi.useRealTimers();
		}
	});
});

describe('getClientIp', () => {
	it('uses the first entry from X-Forwarded-For', () => {
		const event = makeEvent({
			request: new Request('http://localhost/', {
				headers: { 'x-forwarded-for': '1.1.1.1, 10.0.0.1' },
			}) as RequestEvent['request'],
		});
		expect(getClientIp(event)).toBe('1.1.1.1');
	});

	it('trims whitespace from X-Forwarded-For', () => {
		const event = makeEvent({
			request: new Request('http://localhost/', {
				headers: { 'x-forwarded-for': '  1.1.1.1  , 10.0.0.1' },
			}) as RequestEvent['request'],
		});
		expect(getClientIp(event)).toBe('1.1.1.1');
	});

	it('falls back to event.getClientAddress', () => {
		const event = makeEvent({ getClientAddress: () => '9.9.9.9' } as never);
		expect(getClientIp(event)).toBe('9.9.9.9');
	});

	it('returns "unknown" when no address is available', () => {
		const event = makeEvent({});
		expect(getClientIp(event)).toBe('unknown');
	});
});
