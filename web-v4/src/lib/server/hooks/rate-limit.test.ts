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

describe('createRateLimit', () => {
	it('returns the next handler response when not rate limited', async () => {
		const handle = createRateLimit({ limit: 5, windowMs: 60_000 });
		const next = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
		const response = await handle({
			event: makeEvent({ ip: '1.1.1.1' }),
			resolve: next as never,
		} as Parameters<typeof handle>[0]);
		expect(next).toHaveBeenCalledOnce();
		expect(response.status).toBe(200);
		expect(await response.text()).toBe('ok');
	});

	it('returns 429 with Retry-After when rate limited', async () => {
		const handle = createRateLimit({ limit: 1, windowMs: 60_000 });
		const next = vi.fn().mockResolvedValue(new Response('ok'));
		const pass = await handle({
			event: makeEvent({ ip: '1.1.1.1' }),
			resolve: next as never,
		} as Parameters<typeof handle>[0]);
		expect(pass.status).toBe(200);
		expect(next).toHaveBeenCalledOnce();

		const blocked = await handle({
			event: makeEvent({ ip: '1.1.1.1' }),
			resolve: next as never,
		} as Parameters<typeof handle>[0]);
		expect(blocked.status).toBe(429);
		expect(blocked.headers.get('Retry-After')).toMatch(/^\d+$/);
		expect(next).toHaveBeenCalledOnce(); // not called again
	});

	it('tracks different IPs independently', async () => {
		const handle = createRateLimit({ limit: 1, windowMs: 60_000 });
		const next = vi.fn().mockResolvedValue(new Response());
		await handle({ event: makeEvent({ ip: '1.1.1.1' }), resolve: next as never } as never);
		await handle({ event: makeEvent({ ip: '1.1.1.1' }), resolve: next as never } as never);
		const third = await handle({
			event: makeEvent({ ip: '2.2.2.2' }),
			resolve: next as never,
		} as Parameters<typeof handle>[0]);
		expect(third.status).toBe(200);
	});
});
