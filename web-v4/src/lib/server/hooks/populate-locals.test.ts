import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('$lib/utils/device', () => ({
	isMobileUserAgent: vi.fn(),
}));

import { isMobileUserAgent } from '$lib/utils/device';
import { createPopulateLocals } from './populate-locals';

const mockedIsMobile = vi.mocked(isMobileUserAgent);

interface Locals {
	session?: { authToken?: string } | undefined;
	webUrl?: string;
	authToken?: string;
	isMobile?: boolean;
}

const makeEvent = (userAgent: string | null = 'Mozilla/5.0'): RequestEvent => {
	const headers: Record<string, string> = {};
	if (userAgent) headers['user-agent'] = userAgent;
	const locals: Locals = {};
	return {
		request: new Request('http://localhost.example/path', { headers }),
		url: new URL('http://localhost.example/path'),
		locals,
	} as unknown as RequestEvent;
};

beforeEach(() => {
	vi.clearAllMocks();
	mockedIsMobile.mockReturnValue(false);
});

describe('createPopulateLocals', () => {
	it('populates webUrl from event.url.origin', async () => {
		const handle = createPopulateLocals();
		const next = new Response('ok');
		const resolve = vi.fn().mockResolvedValue(next);

		await handle({ event: makeEvent(), resolve: resolve as never } as Parameters<typeof handle>[0]);
		const event = resolve.mock.calls[0]![0] as RequestEvent;
		expect(event.locals.webUrl).toBe('http://localhost.example');
	});

	it('populates authToken from session if set', async () => {
		const handle = createPopulateLocals();
		const next = new Response('ok');
		const resolve = vi.fn().mockResolvedValue(next);
		const event = makeEvent();
		(event.locals as Locals).session = { authToken: 'tok-123' };

		await handle({ event, resolve: resolve as never } as Parameters<typeof handle>[0]);
		expect(event.locals.authToken).toBe('tok-123');
	});

	it('handles missing session', async () => {
		const handle = createPopulateLocals();
		const next = new Response('ok');
		const resolve = vi.fn().mockResolvedValue(next);
		const event = makeEvent();

		await handle({ event, resolve: resolve as never } as Parameters<typeof handle>[0]);
		expect(event.locals.authToken).toBeUndefined();
	});

	it('calls isMobileUserAgent with the user-agent header', async () => {
		const handle = createPopulateLocals();
		const next = new Response('ok');
		const resolve = vi.fn().mockResolvedValue(next);
		mockedIsMobile.mockReturnValue(true);

		await handle({
			event: makeEvent('iPhone'),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		expect(mockedIsMobile).toHaveBeenCalledWith('iPhone');
		const event = resolve.mock.calls[0]![0] as RequestEvent;
		expect(event.locals.isMobile).toBe(true);
	});

	it('returns the next response unchanged', async () => {
		const handle = createPopulateLocals();
		const next = new Response('unchanged');
		const resolve = vi.fn().mockResolvedValue(next);

		const result = await handle({
			event: makeEvent(),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		expect(result).toBe(next);
	});
});
