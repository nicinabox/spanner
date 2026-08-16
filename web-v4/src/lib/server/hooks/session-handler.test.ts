import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('$lib/utils/session', () => ({
	getSession: vi.fn(),
	setSession: vi.fn(),
}));

import { getSession, setSession } from '$lib/utils/session';
import { createSessionHandler } from './session-handler';

const mockedGetSession = vi.mocked(getSession);
const mockedSetSession = vi.mocked(setSession);

const makeEvent = (): RequestEvent => {
	const event: Record<string, unknown> = {
		request: new Request('http://localhost/vehicles/1'),
		cookies: { get: vi.fn(), set: vi.fn() },
		locals: {},
	};
	return event as unknown as RequestEvent;
};

beforeEach(() => {
	vi.clearAllMocks();
});

describe('createSessionHandler', () => {
	it('sets locals.session from the session cookie', async () => {
		const session = { authToken: 'abc' } as never;
		mockedGetSession.mockResolvedValue(session);
		const handle = createSessionHandler();
		const resolve = vi.fn().mockResolvedValue(new Response());

		await handle({
			event: makeEvent(),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);

		const event = resolve.mock.calls[0]![0] as RequestEvent;
		expect(event.locals.session).toBe(session);
	});

	it('refreshes the session cookie when authenticated', async () => {
		const session = { authToken: 'abc' } as never;
		mockedGetSession.mockResolvedValue(session);
		const handle = createSessionHandler();
		const resolve = vi.fn().mockResolvedValue(new Response());

		await handle({
			event: makeEvent(),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);

		expect(mockedSetSession).toHaveBeenCalledOnce();
	});

	it('does not refresh the session cookie when unauthenticated', async () => {
		mockedGetSession.mockResolvedValue(undefined);
		const handle = createSessionHandler();
		const resolve = vi.fn().mockResolvedValue(new Response());

		await handle({
			event: makeEvent(),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);

		expect(mockedSetSession).not.toHaveBeenCalled();
	});

	it('resolves without redirecting', async () => {
		mockedGetSession.mockResolvedValue(undefined);
		const handle = createSessionHandler();
		const next = new Response('ok');
		const resolve = vi.fn().mockResolvedValue(next);

		const response = await handle({
			event: makeEvent(),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);

		expect(response).toBe(next);
		expect(resolve).toHaveBeenCalledOnce();
	});
});
