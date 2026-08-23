import { describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { createRateLimit } from './rate-limit';

const makeEvent = (
	overrides: { ip?: string; url?: string; cookies?: Record<string, string> } = {},
): RequestEvent => {
	const url = overrides.url ?? 'http://localhost/';
	return {
		request: new Request(url, {
			headers: overrides.ip ? { 'x-forwarded-for': overrides.ip } : {},
		}),
		cookies: {
			get: (name: string) => overrides.cookies?.[name],
		},
		getClientAddress: () => overrides.ip,
	} as unknown as RequestEvent;
};

const run = async (
	handle: ReturnType<typeof createRateLimit>,
	next: ReturnType<typeof vi.fn>,
	ip: string,
) => {
	return handle({
		event: makeEvent({ ip }),
		resolve: next as never,
	} as Parameters<typeof handle>[0]);
};

describe('createRateLimit requests mode', () => {
	it('returns the next handler response when not rate limited', async () => {
		const handle = createRateLimit({
			limit: 5,
			windowMs: 60_000,
		});
		const next = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
		const response = await run(handle, next, '1.1.1.1');
		expect(next).toHaveBeenCalledOnce();
		expect(response.status).toBe(200);
		expect(await response.text()).toBe('ok');
	});

	it('returns 429 with Retry-After when rate limited', async () => {
		const handle = createRateLimit({
			limit: 1,
			windowMs: 60_000,
		});
		const next = vi.fn().mockResolvedValue(new Response('ok'));
		const pass = await run(handle, next, '1.1.1.1');
		expect(pass.status).toBe(200);
		expect(next).toHaveBeenCalledOnce();

		const blocked = await run(handle, next, '1.1.1.1');
		expect(blocked.status).toBe(429);
		expect(blocked.headers.get('Retry-After')).toMatch(/^\d+$/);
		expect(next).toHaveBeenCalledOnce(); // not called again
	});

	it('tracks different IPs independently', async () => {
		const handle = createRateLimit({
			limit: 1,
			windowMs: 60_000,
		});
		const next = vi.fn().mockResolvedValue(new Response());
		await run(handle, next, '1.1.1.1');
		await run(handle, next, '1.1.1.1');
		const third = await run(handle, next, '2.2.2.2');
		expect(third.status).toBe(200);
	});
});

describe('createRateLimit errors mode', () => {
	it('passes through a few failures without banning', async () => {
		const handle = createRateLimit({
			limit: 3,
			windowMs: 60_000,
			mode: 'error', limitMs: 60_000,
		});
		const statuses = [404, 404, 200];
		const next = vi.fn().mockImplementation(() => {
			const s = statuses.shift() ?? 200;
			return Promise.resolve(new Response(null, { status: s }));
		});
		expect((await run(handle, next, '1.2.3.4')).status).toBe(404);
		expect((await run(handle, next, '1.2.3.4')).status).toBe(404);
		// not banned yet
		expect((await run(handle, next, '1.2.3.4')).status).toBe(200);
	});

	it('bans an IP after too many failures, returning 429 on later requests', async () => {
		const handle = createRateLimit({
			limit: 3,
			windowMs: 60_000,
			mode: 'error', limitMs: 60_000,
		});
		const statuses = [404, 404, 404, 404, 200, 200];
		const next = vi.fn().mockImplementation(async () => {
			const s = statuses.shift() ?? 200;
			return Promise.resolve(new Response(null, { status: s }));
		});
		// 3 consume the bucket, the 4th failure detects empty => ban
		expect((await run(handle, next, '5.6.7.8')).status).toBe(404);
		expect((await run(handle, next, '5.6.7.8')).status).toBe(404);
		expect((await run(handle, next, '5.6.7.8')).status).toBe(404);
		expect((await run(handle, next, '5.6.7.8')).status).toBe(404);
		// now banned
		expect((await run(handle, next, '5.6.7.8')).status).toBe(429);
	});

	it('does not count 429 responses as failures', async () => {
		const handle = createRateLimit({
			limit: 3,
			windowMs: 60_000,
			mode: 'error', limitMs: 60_000,
		});
		const statuses = [429, 429, 429, 200];
		const next = vi.fn().mockImplementation(async () => {
			const s = statuses.shift() ?? 200;
			return Promise.resolve(new Response(null, { status: s }));
		});
		expect((await run(handle, next, '9.9.9.9')).status).toBe(429);
		expect((await run(handle, next, '9.9.9.9')).status).toBe(429);
		expect((await run(handle, next, '9.9.9.9')).status).toBe(429);
		// not banned: next request resolves through
		expect((await run(handle, next, '9.9.9.9')).status).toBe(200);
	});
});
