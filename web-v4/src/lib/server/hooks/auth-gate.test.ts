import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('$lib/utils/session', () => ({
	getSession: vi.fn(),
	setSession: vi.fn(),
}));

import { getSession, setSession } from '$lib/utils/session';
import { createAuthGate } from './auth-gate';

const mockedGetSession = vi.mocked(getSession);
const mockedSetSession = vi.mocked(setSession);

const makeEvent = (url = 'http://localhost/vehicles/1'): RequestEvent => {
	const event: Record<string, unknown> = {
		request: new Request(url),
		cookies: { get: vi.fn(), set: vi.fn() },
		locals: {},
	};
	return event as unknown as RequestEvent;
};

const isProtected = (url: string) => /^\/vehicles/.test(new URL(url).pathname);

beforeEach(() => {
	vi.clearAllMocks();
});

describe('createAuthGate', () => {
	it('redirects unauthenticated requests to protected routes', async () => {
		mockedGetSession.mockResolvedValue(undefined);
		const handle = createAuthGate(isProtected);
		const resolve = vi.fn();

		try {
			await handle({ event: makeEvent(), resolve } as Parameters<typeof handle>[0]);
		} catch (e) {
			const r = e as { status: number; location: string };
			expect(r.status).toBe(307);
			expect(r.location).toBe('/');
			return;
		}
		expect.fail('expected redirect to be thrown');
	});

	it('does not redirect public routes', async () => {
		mockedGetSession.mockResolvedValue(undefined);
		const handle = createAuthGate(isProtected);
		const next = new Response('public');
		const resolve = vi.fn().mockResolvedValue(next);

		const response = await handle({
			event: makeEvent('http://localhost/about'),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		expect(response).toBe(next);
		expect(resolve).toHaveBeenCalledOnce();
	});

	it('refreshes session and continues when authenticated', async () => {
		const session = { authToken: 'abc' } as never;
		mockedGetSession.mockResolvedValue(session);
		const handle = createAuthGate(isProtected);
		const next = new Response('protected');
		const resolve = vi.fn().mockResolvedValue(next);

		const response = await handle({
			event: makeEvent('http://localhost/vehicles/1'),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		expect(response).toBe(next);
		expect(mockedSetSession).toHaveBeenCalledOnce();
		const event = resolve.mock.calls[0]![0] as RequestEvent;
		expect(event.locals.session).toBe(session);
	});

	it('does not refresh session for unauthenticated public route', async () => {
		mockedGetSession.mockResolvedValue(undefined);
		const handle = createAuthGate(isProtected);
		const resolve = vi.fn().mockResolvedValue(new Response());

		await handle({
			event: makeEvent('http://localhost/login'),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		expect(mockedSetSession).not.toHaveBeenCalled();
	});
});

describe('production isProtected matcher', () => {
	const protectedRoutes = ['/vehicles/*?', '/settings/*?'];
	const isProtected = (url: string) =>
		protectedRoutes.some((pattern) => new URLPattern({ pathname: pattern }).test(url));

	it.each(['/vehicles', '/vehicles/', '/vehicles/1', '/vehicles/abc/edit'])(
		'matches %s',
		(path) => {
			expect(isProtected(`http://localhost${path}`)).toBe(true);
		},
	);

	it.each(['/settings', '/settings/', '/settings/profile'])('matches %s', (path) => {
		expect(isProtected(`http://localhost${path}`)).toBe(true);
	});

	it.each(['/', '/about', '/login', '/vehiclesextra', '/settingsx'])(
		'does not match %s',
		(path) => {
			expect(isProtected(`http://localhost${path}`)).toBe(false);
		},
	);
});
