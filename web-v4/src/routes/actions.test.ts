import { describe, it, expect, vi } from 'vitest';
import { mockFetch, mockFetchError, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api', PUBLIC_EMAIL_ENABLED: true }));
vi.mock('$app/env', () => ({ browser: false }));
vi.mock('$lib/utils/session', () => ({ setSession: vi.fn() }));

const route = { url: 'http://test.com' };

describe('actions.signinWithPassword', () => {
	it('returns 401 when email is missing', async () => {
		const result = await actions.signinWithPassword(
			fakeEvent(formDataFrom({ password: 'secret' }), route),
		);

		expect(result).toMatchObject({ status: 401 });
	});

	it('returns 401 when email is invalid', async () => {
		const result = await actions.signinWithPassword(
			fakeEvent(formDataFrom({ email: 'not-an-email', password: 'secret' }), route),
		);

		expect(result).toMatchObject({ status: 401 });
	});

	it('sends a POST to /login with email and password', async () => {
		const fetchSpy = mockFetch({ authToken: 'abc' });

		await actions
			.signinWithPassword(fakeEvent(formDataFrom({ email: 'a@b.com', password: 'secret' }), route))
			.catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/login$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ email: 'a@b.com', password: 'secret' });
	});

	it('includes Time-Zone-Offset header when provided', async () => {
		const fetchSpy = mockFetch({ authToken: 'abc' });

		await actions
			.signinWithPassword(
				fakeEvent(
					formDataFrom({ email: 'a@b.com', password: 'secret', timeZoneOffset: '-5' }),
					route,
				),
			)
			.catch(() => {});

		const headers = fetchSpy.mock.calls[0][1]?.headers as Headers;
		expect(headers.get('Time-Zone-Offset')).toBe('-5');
	});

	it('sets the session cookie on success', async () => {
		mockFetch({ authToken: 'abc' });
		const { setSession } = await import('$lib/utils/session');

		await actions
			.signinWithPassword(fakeEvent(formDataFrom({ email: 'a@b.com', password: 'secret' }), route))
			.catch(() => {});

		expect(setSession).toHaveBeenCalledWith(expect.anything(), { authToken: 'abc' });
	});

	it('returns 401 when credentials are invalid', async () => {
		mockFetchError(401, { error: 'Invalid email or password' });

		const result = await actions.signinWithPassword(
			fakeEvent(formDataFrom({ email: 'a@b.com', password: 'wrong' }), route),
		);

		expect(result).toMatchObject({
			status: 401,
			data: { errors: [{ id: 'form', title: 'Invalid email or password' }] },
		});
	});
});

describe('actions.sendMagicLink', () => {
	it('returns 422 when email is missing', async () => {
		const result = await actions.sendMagicLink(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a POST to /login with email only', async () => {
		const fetchSpy = mockFetch({ status: 'pending' });

		await actions.sendMagicLink(fakeEvent(formDataFrom({ email: 'a@b.com' }), route));

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/login$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ email: 'a@b.com' });
	});

	it('returns pending status on success', async () => {
		mockFetch({ status: 'pending' });

		const result = await actions.sendMagicLink(
			fakeEvent(formDataFrom({ email: 'a@b.com' }), route),
		);

		expect(result).toEqual({ status: 'pending' });
	});

	it('returns 422 when the API returns an error', async () => {
		mockFetchError(422, { error: 'Failed' });

		const result = await actions.sendMagicLink(
			fakeEvent(formDataFrom({ email: 'a@b.com' }), route),
		);

		expect(result).toMatchObject({
			status: 422,
			data: { errors: [{ id: 'form', title: 'Could not send magic link. Please try again.' }] },
		});
	});
});

describe('actions.signinWithToken', () => {
	it('returns 422 when token is missing', async () => {
		const result = await actions.signinWithToken(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a GET to /login/:token', async () => {
		const fetchSpy = mockFetch({ authToken: 'abc' });

		await actions
			.signinWithToken(fakeEvent(formDataFrom({ token: 'my-token' }), route))
			.catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/login\/my-token$/);
	});

	it('sets the session cookie on success', async () => {
		mockFetch({ authToken: 'abc' });
		const { setSession } = await import('$lib/utils/session');

		await actions
			.signinWithToken(fakeEvent(formDataFrom({ token: 'my-token' }), route))
			.catch(() => {});

		expect(setSession).toHaveBeenCalledWith(expect.anything(), { authToken: 'abc' });
	});

	it('returns 422 when the token is invalid', async () => {
		mockFetchError(422, { error: 'Invalid token' });

		const result = await actions.signinWithToken(
			fakeEvent(formDataFrom({ token: 'bad-token' }), route),
		);

		expect(result).toMatchObject({ status: 422 });
	});
});
