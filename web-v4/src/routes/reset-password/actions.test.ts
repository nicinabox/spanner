import { describe, it, expect, vi } from 'vitest';
import { mockFetch, mockFetchError, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));
vi.mock('$app/env', () => ({ browser: false }));

const route = { url: 'http://test.com/reset-password' };

describe('actions.requestReset', () => {
	it('returns 422 when email is missing', async () => {
		const result = await actions.requestReset(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({ status: 422 });
	});

	it('returns 422 when email is invalid', async () => {
		const result = await actions.requestReset(
			fakeEvent(formDataFrom({ email: 'not-an-email' }), route),
		);

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a POST to /password/reset', async () => {
		const fetchSpy = mockFetch({});

		await actions.requestReset(fakeEvent(formDataFrom({ email: 'a@b.com' }), route));

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/password\/reset$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ email: 'a@b.com' });
	});

	it('returns pending status on success', async () => {
		mockFetch({});

		const result = await actions.requestReset(fakeEvent(formDataFrom({ email: 'a@b.com' }), route));

		expect(result).toEqual({ status: 'pending' });
	});
});
