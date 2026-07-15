import { describe, it, expect, vi } from 'vitest';
import { mockFetch, mockFetchError, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));
vi.mock('$app/env', () => ({ browser: false }));
vi.mock('$lib/utils/session', () => ({ setSession: vi.fn() }));

const route = { params: { token: 'my-token' }, url: 'http://test.com/reset-password/my-token' };

describe('actions.resetPassword', () => {
	it('returns 422 when password is missing', async () => {
		const result = await actions.resetPassword(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({ status: 422 });
	});

	it('returns 422 when passwords do not match', async () => {
		const result = await actions.resetPassword(
			fakeEvent(formDataFrom({ password: 'NewSecret1!', confirmPassword: 'Different1!' }), route),
		);

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a POST to /password/reset/:token', async () => {
		const fetchSpy = mockFetch({ authToken: 'abc' });

		await actions
			.resetPassword(
				fakeEvent(formDataFrom({ password: 'NewSecret1!', confirmPassword: 'NewSecret1!' }), route),
			)
			.catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/password\/reset\/my-token$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ password: 'NewSecret1!' });
	});

	it('sets the session cookie on success', async () => {
		mockFetch({ authToken: 'abc' });
		const { setSession } = await import('$lib/utils/session');

		await actions
			.resetPassword(
				fakeEvent(formDataFrom({ password: 'NewSecret1!', confirmPassword: 'NewSecret1!' }), route),
			)
			.catch(() => {});

		expect(setSession).toHaveBeenCalledWith(expect.anything(), { authToken: 'abc' });
	});

	it('passes through 422 errors from the API', async () => {
		mockFetchError(422, { errors: [{ id: 'password', title: 'Too weak' }] });

		const result = await actions.resetPassword(
			fakeEvent(
				formDataFrom({ password: 'ValidLength1!', confirmPassword: 'ValidLength1!' }),
				route,
			),
		);

		expect(result).toMatchObject({
			status: 422,
			data: { errors: [{ id: 'password', title: 'Too weak' }] },
		});
	});

	it('returns 401 for non-422 errors', async () => {
		mockFetchError(404, { error: 'Not found' });

		const result = await actions.resetPassword(
			fakeEvent(formDataFrom({ password: 'NewSecret1!', confirmPassword: 'NewSecret1!' }), route),
		);

		expect(result).toMatchObject({
			status: 401,
			data: { errors: [{ id: 'form', title: 'Invalid or expired reset link' }] },
		});
	});
});
