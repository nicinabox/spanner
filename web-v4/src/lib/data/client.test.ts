import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAPIRequest } from './client';

vi.mock('$app/env', () => ({ browser: false }));

const fetcher = createAPIRequest({ baseURI: 'http://api.test', throwOnHTTPErrors: true });

describe('createAPIRequest', () => {
	let fetchMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		fetchMock = vi.fn(async () => new Response('{}'));
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	// Bun's fetch throws "fetch: 'session' must be a Bun.FetchSession" otherwise.
	it('drops SvelteKit locals like session from fetch init', async () => {
		const locals = {
			authToken: 'tok-123',
			webUrl: 'http://web.test',
			session: { authToken: 'tok-123' },
			isMobile: false,
		};

		await fetcher('/vehicles', locals as never);

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(init).not.toHaveProperty('session');
		expect(new Headers(init.headers).get('Authorization')).toBe('Token tok-123');
		expect(new Headers(init.headers).get('X-Web-URL')).toBe('http://web.test');
	});
});
