import { describe, it, expect, vi } from 'vitest';
import { mockFetch, mockFetchError, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));
vi.mock('$app/env', () => ({ browser: false }));

const route = { url: 'http://test.com/vehicles' };

describe('actions.updateUserPreferences', () => {
	it('sends a PUT to /user with sort preferences', async () => {
		const fetchSpy = mockFetch({ id: 1 });

		await actions.updateUserPreferences(
			fakeEvent(formDataFrom({ strategy: 'name', order: 'asc' }), route),
		);

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/user$/);
		expect(call[1]?.method).toBe('PUT');
		expect(JSON.parse(call[1]?.body as string)).toEqual({
			preferences: { vehicles_sort_order: ['name', 'asc'] },
		});
	});

	it('returns the updated user', async () => {
		mockFetch({ id: 1, email: 'a@b.com' });

		const result = await actions.updateUserPreferences(
			fakeEvent(formDataFrom({ strategy: 'name', order: 'asc' }), route),
		);

		expect(result).toEqual({ user: { id: 1, email: 'a@b.com' } });
	});
});
